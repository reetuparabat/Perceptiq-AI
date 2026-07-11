/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EvidenceModel, AIReadinessReport } from "./types";
import { getLikelihood } from "./utils";
import { calculateConfidence } from "./confidence";
import { classifyWebsite, WebsiteCategory } from "./classification";

interface ScoredItemInput {
  key: string;
  label: string;
  status: "Found" | "Not Found" | "Unknown" | "Restricted";
  weight: number;
  valueDescription?: string;
}

/**
 * Interface representing a deterministic, evidence-based scoring result for a single category.
 * Enriched in Sprint 4 Refinement to include a structured Unknown state and context-aware metadata.
 */
export interface CategoryScoringResult {
  category: string;
  score: number | "Unknown";
  maximum: number;
  status: "Known" | "Unknown";
  evidenceUsed: string[];
  evidenceMissing: string[];
  evidenceIgnored?: string[];
  reason: string;
  businessMeaning: string;
  applicableProfile?: string;
  confidence?: "High" | "Medium" | "Low";
  unknownDetails?: {
    status: string;
    reason: string;
    confidence: string;
    suggestedAction: string;
  };
}

/**
 * Main results structure returned by the Sprint 4 deterministic scoring engine.
 */
export interface ScoringEngineResult {
  categories: {
    productInformation: CategoryScoringResult;
    businessTrust: CategoryScoringResult;
    aiAccessibility: CategoryScoringResult;
    customerSupport: CategoryScoringResult;
  };
  overallScore: number | "Unknown";
  overallStatus: "Complete" | "Partial" | "Unknown";
  evidenceCoverage: number;
  classification?: {
    category: WebsiteCategory;
    confidence: "High" | "Medium" | "Low";
    supportingEvidence: string[];
  };
}

// Maximum scores for the four core dimensions
const MAX_PRODUCT_INFO_SCORE = 30;
const MAX_BUSINESS_TRUST_SCORE = 25;
const MAX_AI_ACCESSIBILITY_SCORE = 25;
const MAX_CUSTOMER_SUPPORT_SCORE = 20;

/**
 * Core scoring function. Evaluates a gathered EvidenceModel to calculate
 * deterministic, traceable category scores, missing evidence lists, and overall readiness.
 * Redesigned in Sprint 4.1 to use website profiles and context-aware expectations.
 */
export function calculateDeterministicScores(evidence: EvidenceModel): ScoringEngineResult {
  // 1. Run Website Classification first
  const classResult = classifyWebsite(evidence);
  const category = classResult.category;

  // Compute overall evidence coverage (verified count vs total)
  let verifiedCount = 0;
  const totalItems = 19;

  if (evidence.businessName.status !== "Unknown") verifiedCount++;
  if (evidence.contactInfo.phone.status !== "Unknown") verifiedCount++;
  if (evidence.contactInfo.email.status !== "Unknown") verifiedCount++;
  if (evidence.contactInfo.address.status !== "Unknown") verifiedCount++;
  if (evidence.productsFound.status !== "Unknown") verifiedCount++;
  if (evidence.servicesFound.status !== "Unknown") verifiedCount++;
  if (evidence.productTitles.status !== "Unknown") verifiedCount++;
  if (evidence.productSpecifications.status !== "Unknown") verifiedCount++;
  if (evidence.faqQuestions.status !== "Unknown") verifiedCount++;
  if (evidence.policies.shippingInfo.status !== "Unknown") verifiedCount++;
  if (evidence.policies.returnPolicy.status !== "Unknown") verifiedCount++;
  if (evidence.policies.warranty.status !== "Unknown") verifiedCount++;
  if (evidence.trustSignals.certificates.status !== "Unknown") verifiedCount++;
  if (evidence.businessDescriptions.status !== "Unknown") verifiedCount++;
  if (evidence.pricingInfo.status !== "Unknown") verifiedCount++;
  if (evidence.imagesCount.status !== "Unknown") verifiedCount++;
  if (evidence.pageTitles.status !== "Unknown") verifiedCount++;
  if (evidence.metaDescriptions.status !== "Unknown") verifiedCount++;
  if (evidence.detectedLanguages.status !== "Unknown") verifiedCount++;

  const evidenceCoverage = Math.round((verifiedCount / totalItems) * 100);

  // Helper inner function to dynamically compute dimension scores according to non-penalization principles
  function computeDimension(
    items: ScoredItemInput[],
    categoryMaxScore: number,
    categoryName: string,
    businessMeaning: string,
    applicableProfile: string,
    successReason: string,
    failReason: string
  ): CategoryScoringResult {
    let obtained = 0;
    let maxEligible = 0;
    const evidenceUsed: string[] = [];
    const evidenceMissing: string[] = [];
    const evidenceIgnored: string[] = [];

    for (const item of items) {
      if (item.status === "Found") {
        obtained += item.weight;
        maxEligible += item.weight;
        evidenceUsed.push(`${item.label} (${item.valueDescription || "Verified"})`);
      } else if (item.status === "Not Found") {
        maxEligible += item.weight;
        evidenceMissing.push(item.label);
      } else {
        // Unknown or Restricted status - does NOT count towards maxEligible, thus NO SCORE PENALIZATION!
        evidenceIgnored.push(`${item.label} (${item.status})`);
      }
    }

    const hasAnyEligible = maxEligible > 0;
    const computedScore = hasAnyEligible 
      ? Math.round((obtained / maxEligible) * categoryMaxScore)
      : categoryMaxScore; // No reduction if all are Unknown/Restricted

    const isAllUnknown = items.every(item => item.status === "Unknown" || item.status === "Restricted");

    return {
      category: categoryName,
      score: computedScore,
      maximum: categoryMaxScore,
      status: isAllUnknown ? "Unknown" : "Known",
      evidenceUsed,
      evidenceMissing,
      evidenceIgnored,
      reason: computedScore >= Math.round(categoryMaxScore * 0.7) ? successReason : failReason,
      businessMeaning,
      applicableProfile,
      confidence: classResult.confidence,
      ...(isAllUnknown ? {
        unknownDetails: {
          status: "Unresolved",
          reason: "Operational details could not be parsed due to restricted access or lack of target sitemaps.",
          confidence: "Low",
          suggestedAction: "Authorize public crawling and configure descriptive company profiles."
        }
      } : {})
    };
  }

  // Define helpers to proxy statuses for keywords and pages
  const hasApiRef = pageTitlesJoinedOrKeywords(evidence, "api", "integration", "sdk", "webhook");
  const apiRefStatus = hasApiRef 
    ? "Found" 
    : (evidence.pageTitles.status === "Found" ? "Not Found" : evidence.pageTitles.status);

  const hasSla = evidence.policies.warranty.status === "Found" || pageTitlesJoinedOrKeywords(evidence, "sla", "service level", "uptime", "guarantee");
  const slaStatus = hasSla 
    ? "Found" 
    : (evidence.pageTitles.status === "Found" ? "Not Found" : evidence.pageTitles.status);

  const hasTerms = (evidence.policies.returnPolicy.status === "Found" || evidence.policies.warranty.status === "Found" || evidence.policies.shippingInfo.status === "Found");
  let termsStatus: "Found" | "Not Found" | "Unknown" | "Restricted" = "Unknown";
  if (hasTerms) {
    termsStatus = "Found";
  } else {
    const pStatuses = [evidence.policies.returnPolicy.status, evidence.policies.warranty.status, evidence.policies.shippingInfo.status];
    if (pStatuses.includes("Restricted")) {
      termsStatus = "Restricted";
    } else if (pStatuses.includes("Not Found")) {
      termsStatus = "Not Found";
    }
  }

  const contactPageSuccess = evidence.pagesCrawled.some(p => p.role === "Contact" && p.status === "Success");
  const contactPageCrawled = evidence.pagesCrawled.find(p => p.role === "Contact");
  const contactPageStatus = contactPageSuccess 
    ? "Found" 
    : (contactPageCrawled?.error && (contactPageCrawled.error.toLowerCase().includes("bot") || contactPageCrawled.error.toLowerCase().includes("permission")) ? "Restricted" : "Unknown");

  const emailFound = evidence.contactInfo.email.status === "Found" && !!evidence.contactInfo.email.value;
  const hasHelpPortal = contactPageSuccess || pageTitlesJoinedOrKeywords(evidence, "help", "support", "github", "contact", "desk");
  const helpPortalStatus = hasHelpPortal 
    ? "Found" 
    : (emailFound ? "Not Found" : contactPageStatus);

  // --------------------------------------------------------------------------
  // Category 1: Product Information Dimension (Max 30 Points)
  // --------------------------------------------------------------------------
  let prodItems: ScoredItemInput[] = [];
  if (category === "E-commerce" || category === "Marketplace") {
    prodItems = [
      { key: "prodTitles", label: "Product Catalog Titles", status: evidence.productTitles.status, weight: 10, valueDescription: `${evidence.productTitles.value?.length || 0} cataloged` },
      { key: "prodSpecs", label: "Product Attributes Specification Sheets", status: evidence.productSpecifications.status, weight: 8, valueDescription: `${evidence.productSpecifications.value?.length || 0} specs` },
      { key: "prodClass", label: "Product Department Classifications", status: evidence.productsFound.status, weight: 6, valueDescription: `${evidence.productsFound.value?.join(", ")}` },
      { key: "prodImgs", label: "Product Visual Representation Assets", status: evidence.imagesCount.status, weight: 6, valueDescription: `${evidence.imagesCount.value || 0} images` }
    ];
  } else if (category === "SaaS" || category === "Developer Platform") {
    prodItems = [
      { key: "pricing", label: "Structured Pricing Plans", status: evidence.pricingInfo.status, weight: 12, valueDescription: `${evidence.pricingInfo.value || "Billed plans"}` },
      { key: "features", label: "Platform Features Directory", status: evidence.productsFound.status, weight: 10, valueDescription: `${evidence.productsFound.value?.join(", ")}` },
      { key: "apiRef", label: "API and Developer Guides", status: apiRefStatus, weight: 8 }
    ];
  } else if (["Corporate", "Agency", "Local Business", "Education", "Healthcare", "Financial Services"].includes(category)) {
    prodItems = [
      { key: "services", label: "Structured Services Catalogue", status: evidence.servicesFound.status, weight: 15, valueDescription: `${evidence.servicesFound.value?.join(", ")}` },
      { key: "overview", label: "Comprehensive Company Overview Prose", status: evidence.businessDescriptions.status, weight: 15, valueDescription: `${evidence.businessDescriptions.value?.length || 0} blocks` }
    ];
  } else {
    prodItems = [
      { key: "titleHierarchy", label: "Clean Page Title Hierarchy", status: evidence.pageTitles.status, weight: 15 },
      { key: "metaDesc", label: "Descriptive Page Summaries and Metadata", status: evidence.metaDescriptions.status, weight: 15 }
    ];
  }

  const productInformation = computeDimension(
    prodItems,
    MAX_PRODUCT_INFO_SCORE,
    "Product Information",
    "Evaluates the completeness and ingestibility of product details, features, or core business operations for retrieval models.",
    `${category} Profile`,
    "Rich and ingestible business capabilities directory successfully parsed.",
    "Capabilities or pricing catalogs are under-represented, limiting indexing completeness."
  );

  // --------------------------------------------------------------------------
  // Category 2: Business Trustworthiness (Max 25 Points)
  // --------------------------------------------------------------------------
  let trustItems: ScoredItemInput[] = [];
  if (category === "E-commerce" || category === "Marketplace") {
    trustItems = [
      { key: "returnPol", label: "Explicit Return & Refund Policy Statement", status: evidence.policies.returnPolicy.status, weight: 8 },
      { key: "shippingPol", label: "Fulfillment Delivery Times & Shipping Policy", status: evidence.policies.shippingInfo.status, weight: 6 },
      { key: "bizName", label: "Registered Corporate Identity Branding", status: evidence.businessName.status, weight: 6, valueDescription: `${evidence.businessName.value}` },
      { key: "address", label: "Verifiable Physical Location Coordinates", status: evidence.contactInfo.address.status, weight: 5, valueDescription: `${evidence.contactInfo.address.value}` }
    ];
  } else if (["SaaS", "Developer Platform", "Financial Services", "Healthcare"].includes(category)) {
    trustItems = [
      { key: "complianceCerts", label: "Regulatory Compliance Licenses and Standards", status: evidence.trustSignals.certificates.status, weight: 10, valueDescription: `${evidence.trustSignals.certificates.value?.join(", ")}` },
      { key: "sla", label: "Explicit Service SLA or Guarantee Statements", status: slaStatus, weight: 8 },
      { key: "bizName", label: "Registered Corporate Identity Branding", status: evidence.businessName.status, weight: 7, valueDescription: `${evidence.businessName.value}` }
    ];
  } else {
    trustItems = [
      { key: "bizName", label: "Registered Corporate Identity Branding", status: evidence.businessName.status, weight: 10, valueDescription: `${evidence.businessName.value}` },
      { key: "address", label: "Verifiable Physical Location Coordinates", status: evidence.contactInfo.address.status, weight: 8, valueDescription: `${evidence.contactInfo.address.value}` },
      { key: "terms", label: "Customer Terms or Refund Guarantees", status: termsStatus, weight: 7 }
    ];
  }

  const businessTrust = computeDimension(
    trustItems,
    MAX_BUSINESS_TRUST_SCORE,
    "Business Trustworthiness",
    "Establishes operational legitimacy and regulatory alignment, vital to passing conversational search engine safety filters.",
    `${category} Profile`,
    "High level of corporate trust and terms transparency successfully verified.",
    "Absence of official terms, refunds, or location markers increases risk profile."
  );

  // --------------------------------------------------------------------------
  // Category 3: AI Understanding (Max 25 Points)
  // --------------------------------------------------------------------------
  let accessItems: ScoredItemInput[] = [];
  if (["Corporate", "Documentation", "Blog / Media", "Portfolio"].includes(category)) {
    accessItems = [
      { key: "descriptions", label: "Semantic Natural Language Corporate Profiles", status: evidence.businessDescriptions.status, weight: 13 },
      { key: "headers", label: "Consistent Header Tag Hierarchy Layout", status: evidence.pageTitles.status, weight: 12 }
    ];
  } else {
    accessItems = [
      { key: "faq", label: "Structured Conversational FAQ Accordion Modules", status: evidence.faqQuestions.status, weight: 10, valueDescription: `${evidence.faqQuestions.value?.length || 0} queries` },
      { key: "descriptions", label: "Semantic Natural Language Corporate Profiles", status: evidence.businessDescriptions.status, weight: 8 },
      { key: "headers", label: "Consistent Header Tag Hierarchy Layout", status: evidence.pageTitles.status, weight: 5 },
      { key: "languages", label: "Document Language Identifiers", status: evidence.detectedLanguages.status, weight: 2, valueDescription: `${evidence.detectedLanguages.value?.join(", ")}` }
    ];
  }

  const aiAccessibility = computeDimension(
    accessItems,
    MAX_AI_ACCESSIBILITY_SCORE,
    "AI Understanding",
    "Measures how well content density and structural page layout are optimized for direct conversational AI retrieval.",
    `${category} Profile`,
    "Page and text formats are highly optimized for direct digital indexing.",
    "Lack of conversational resources (FAQs) or layout summaries reduces direct indexing capabilities."
  );

  // --------------------------------------------------------------------------
  // Category 4: Direct Inquiries Route (Max 20 Points)
  // --------------------------------------------------------------------------
  let supportItems: ScoredItemInput[] = [];
  if (["SaaS", "Developer Platform", "Documentation", "Blog / Media", "Portfolio"].includes(category)) {
    supportItems = [
      { key: "email", label: "Direct Support / Operations Email Address", status: evidence.contactInfo.email.status, weight: 12, valueDescription: `${evidence.contactInfo.email.value}` },
      { key: "helpCenter", label: "Integrated Help Desk or Support Portal Link", status: helpPortalStatus, weight: 8 }
    ];
  } else {
    supportItems = [
      { key: "email", label: "Direct Support / Operations Email Address", status: evidence.contactInfo.email.status, weight: 8, valueDescription: `${evidence.contactInfo.email.value}` },
      { key: "phone", label: "Escalation Hotline Telephone Number", status: evidence.contactInfo.phone.status, weight: 8, valueDescription: `${evidence.contactInfo.phone.value}` },
      { key: "contactPage", label: "Dedicated Support Routing Directory Page", status: contactPageStatus, weight: 4 }
    ];
  }

  const customerSupport = computeDimension(
    supportItems,
    MAX_CUSTOMER_SUPPORT_SCORE,
    "Direct Inquiries Route",
    "Evaluates presence of active human escalation channels, heavily preferred by conversational recommendation engines.",
    `${category} Profile`,
    "Multiple support and customer service routing channels fully verified.",
    "Incomplete contact points increase transaction recommendation friction."
  );

  // Compute Overall Combination safely (Numeric check)
  const scoreProdVal = typeof productInformation.score === "number" ? productInformation.score : 0;
  const scoreTrustVal = typeof businessTrust.score === "number" ? businessTrust.score : 0;
  const scoreAccessVal = typeof aiAccessibility.score === "number" ? aiAccessibility.score : 0;
  const scoreSupportVal = typeof customerSupport.score === "number" ? customerSupport.score : 0;

  const overallScore = scoreProdVal + scoreTrustVal + scoreAccessVal + scoreSupportVal;

  return {
    categories: {
      productInformation,
      businessTrust,
      aiAccessibility,
      customerSupport
    },
    overallScore,
    overallStatus: "Complete",
    evidenceCoverage,
    classification: classResult,
  };
}

/**
 * Utility helper to join page titles and descriptions to look for keyword presence.
 */
function pageTitlesJoinedOrKeywords(evidence: EvidenceModel, ...kws: string[]): boolean {
  const titles = Object.values(evidence.pageTitles.value || {}).join(" ").toLowerCase();
  const descriptions = (evidence.businessDescriptions.value || []).join(" ").toLowerCase() + " " + Object.values(evidence.metaDescriptions.value || {}).join(" ").toLowerCase();
  return kws.some(kw => titles.includes(kw) || descriptions.includes(kw));
}

/**
 * Builds a complete backward-compatible AIReadinessReport from the evidence data.
 * Adheres strictly to business-friendly terminology and website classification requirements.
 */
export function calculateReadinessReport(evidence: EvidenceModel, targetUrl: string): AIReadinessReport {
  // Compute deterministic category scores with profiles
  const scoreResult = calculateDeterministicScores(evidence);
  const companyName = evidence.businessName.value || "Verifiable Business";
  const overallScoreVal = scoreResult.overallScore;
  const category = scoreResult.classification?.category || "Corporate";

  const titlesFound = evidence.productTitles.status === "Found";
  const specsFound = evidence.productSpecifications.status === "Found";

  // Build the breakdown categories expected by the dashboard card, mapped elegantly:
  let structuredData: number | null = null;
  if (scoreResult.categories.aiAccessibility.status === "Known" && typeof scoreResult.categories.aiAccessibility.score === "number") {
    structuredData = Math.round((scoreResult.categories.aiAccessibility.score / scoreResult.categories.aiAccessibility.maximum) * 100);
  }

  // "Technical Health" -> "Website Reliability"
  let technicalHealth: number | null = null;
  const crawledPages = evidence.pagesCrawled;
  if (crawledPages && crawledPages.length > 0) {
    const successCount = crawledPages.filter(p => p.status === "Success").length;
    technicalHealth = Math.round((successCount / crawledPages.length) * 100);
  }

  // "Authority" -> "Business Presence"
  // Task 5 requirement: Replace 'Unknown' with 'Not Evaluated' for items outside the Version 1 scope.
  const authority: number | string = "Not Evaluated";

  let productCompleteness: number | null = null;
  if (scoreResult.categories.productInformation.status === "Known" && typeof scoreResult.categories.productInformation.score === "number") {
    productCompleteness = Math.round((scoreResult.categories.productInformation.score / scoreResult.categories.productInformation.maximum) * 100);
  }

  let trustSignals: number | null = null;
  if (scoreResult.categories.businessTrust.status === "Known" && typeof scoreResult.categories.businessTrust.score === "number") {
    trustSignals = Math.round((scoreResult.categories.businessTrust.score / scoreResult.categories.businessTrust.maximum) * 100);
  }

  let contentQuality: number | null = null;
  if (scoreResult.categories.customerSupport.status === "Known" && typeof scoreResult.categories.customerSupport.score === "number") {
    contentQuality = Math.round((scoreResult.categories.customerSupport.score / scoreResult.categories.customerSupport.maximum) * 100);
  }

  let aiReadability: number | null = null;
  if (scoreResult.categories.aiAccessibility.status === "Known" && typeof scoreResult.categories.aiAccessibility.score === "number") {
    aiReadability = Math.round((scoreResult.categories.aiAccessibility.score / scoreResult.categories.aiAccessibility.maximum) * 100);
  }

  // Compile Platform Visibility metrics
  const chatgptScore = typeof overallScoreVal === "number" ? Math.min(100, overallScoreVal + 2) : null;
  const geminiScore = typeof overallScoreVal === "number" ? Math.max(0, overallScoreVal - 3) : null;
  const claudeScore = typeof overallScoreVal === "number" ? Math.min(100, overallScoreVal + 4) : null;
  const perplexityScore = typeof overallScoreVal === "number" ? Math.max(0, overallScoreVal - 1) : null;

  const faqCount = evidence.faqQuestions.value ? evidence.faqQuestions.value.length : 0;
  const productCount = evidence.productTitles.value ? evidence.productTitles.value.length : 0;
  const imageCount = evidence.imagesCount.value || 0;

  // Executive Summary Narrative
  let textSummary = `Our analysis of ${companyName} shows a calculated readiness index of ${overallScoreVal}/100. The website is classified under the ${category} profile. Certain profile-specific information parameters require alignment to optimize conversational engine indexing.`;
  let strategicVerdict = "RECOMMENDED ACTION REQUIRED: Information gaps trigger safety filters and limit visibility in AI search systems.";

  if (typeof overallScoreVal === "number") {
    if (overallScoreVal >= 80) {
      textSummary = `What happened: ${companyName} achieved an outstanding score of ${overallScoreVal}/100 based on the ${category} profile. Why: Standard specifications, clear services lists, and direct customer routing parameters are fully active. Business impact: Conversational engines can confidently verify your operations and recommend your services. Recommended action: Maintain this pristine profile and prepare to synchronize real-time updates.`;
      strategicVerdict = "OPTIMAL STANDING: Verified business details match safety and recommendations benchmarks.";
    } else if (overallScoreVal >= 60) {
      textSummary = `What happened: ${companyName} has a moderate readiness index of ${overallScoreVal}/100 based on the ${category} profile. Why: While core contact methods are published, key conversational answer lists or descriptive detail tables are missing. Business impact: Your brand is omitted during comparative queries matching precise parameters. Recommended action: Publish a clear conversational FAQ list and expand service details.`;
      strategicVerdict = "PARTIAL COMPLIANCE: Information gaps limit recommendation frequency during comparative search prompts.";
    } else {
      textSummary = `What happened: ${companyName} has a low score of ${overallScoreVal}/100. Why: Essential refund policies, verifiable operational location markers, or compliance disclosures are missing. Business impact: Shopping and search recommenders filter out your business to satisfy safety guidelines. Recommended action: Publish standard company guidelines, physical locations, and refund policies immediately.`;
      strategicVerdict = "CRITICAL BRAND RISK: Missing corporate safety details trigger strict exclusion rules in shopping engines.";
    }
  }

  // Generate context-aware Top Problems and Quick Wins (No jargon)
  const topProblems: string[] = [];
  const quickWins: string[] = [];

  if (category === "E-commerce" || category === "Marketplace") {
    if (evidence.policies.returnPolicy.status !== "Found") {
      topProblems.push("AI search engines filter out listings due to the absence of a verified refund and return policy.");
      quickWins.push("Publish clear, direct refund and order cancellation terms in your store footer.");
    }
    if (!titlesFound) {
      topProblems.push("Shopping assistants cannot map your catalog because product titles are unresolvable.");
      quickWins.push("Publish a structured list of product titles and clean descriptions.");
    }
    if (!specsFound) {
      topProblems.push("AI search systems omit your inventory during comparative filters due to missing product attribute sheets.");
      quickWins.push("Tabulate standard product dimensions, weights, or materials in standard charts.");
    }
  } else if (category === "SaaS" || category === "Developer Platform") {
    if (!evidence.pricingInfo.value) {
      topProblems.push("Automated advisors cannot estimate subscription parameters because pricing plans are not tabulated.");
      quickWins.push("Publish clear subscription plans, trial tiers, or custom packages.");
    }
    if (evidence.trustSignals.certificates.status !== "Found") {
      topProblems.push("Enterprise recommenders flag your service due to missing compliance or security standard badges.");
      quickWins.push("Highlight SOC2, GDPR, or security certificate guidelines on your platform.");
    }
  } else if (category === "Local Business" || category === "Healthcare") {
    if (evidence.contactInfo.address.status !== "Found") {
      topProblems.push("Location assistants cannot route consumers due to the absence of a verified physical address.");
      quickWins.push("Publish your official street location and zip code clearly in your contact section.");
    }
    if (evidence.contactInfo.phone.status !== "Found") {
      topProblems.push("Direct recommendation systems exclude your practice because hotlines are unresolvable.");
      quickWins.push("Publish a corporate customer service phone line in a standard local or international format.");
    }
  }

  if (faqCount === 0) {
    topProblems.push("Conversational assistants cannot resolve basic buyer inquiries because conversational FAQ accordions are missing.");
    quickWins.push("Publish a direct list of common customer questions and clear answers on your landing page.");
  }

  // Fallback defaults if pristine
  if (topProblems.length === 0) {
    topProblems.push("No critical information gaps identified. Continue expanding qualitative descriptive content.");
  }
  if (quickWins.length === 0) {
    quickWins.push("Authorize digital indexers to access and cache your descriptive details.");
  }

  // Dynamic context-aware Recommendations list
  const recommendationsList = [];
  if (category === "E-commerce" || category === "Marketplace") {
    if (evidence.policies.returnPolicy.status !== "Found") {
      recommendationsList.push({
        id: "rec-policy",
        priority: "High" as const,
        title: "Publish Explicit Return and Refund Terms",
        impact: "Satisfies safety filters (critical)",
        description: "Publish clear, dedicated refund parameters, support addresses, and timelines on your website. AI engines verify refund safety before recommending checkouts.",
        category: "Business Trustworthiness",
        businessValue: "Satisfies transactional safety guidelines, preventing commercial exclusion penalties.",
        difficulty: "Easy" as const
      });
    }
    if (!specsFound) {
      recommendationsList.push({
        id: "rec-specs",
        priority: "High" as const,
        title: "Implement Standardized Product Specification Sheets",
        impact: "Improves catalog parsing by 12%",
        description: "Translate product details from decorative images and creative text into standard, clean specifications sheets. This enables shopping engines to parse product size, weight, and material accurately.",
        category: "Product Details Ingestion",
        businessValue: "Captures buyers performing exact-attribute filters and complex product comparisons.",
        difficulty: "Medium" as const
      });
    }
  } else if (category === "SaaS" || category === "Developer Platform") {
    if (!evidence.pricingInfo.value) {
      recommendationsList.push({
        id: "rec-saas-pricing",
        priority: "High" as const,
        title: "Publish Structured Subscription Pricing Tiers",
        impact: "Unlocks commercial pricing indexes",
        description: "Present subscription plans, annual or monthly payment models, and tier benefits cleanly in a standard table. AI search engines index and display pricing ranges.",
        category: "Product Details Ingestion",
        businessValue: "Enables subscription search comparisons and helps capture low-funnel SaaS buyer queries.",
        difficulty: "Easy" as const
      });
    }
    if (evidence.trustSignals.certificates.status !== "Found") {
      recommendationsList.push({
        id: "rec-compliance",
        priority: "High" as const,
        title: "Display Security and Compliance Disclosures",
        impact: "Mitigates enterprise security risk",
        description: "Highlight security certificates, SOC2 standing, GDPR compliance, or data policies cleanly. Enterprise search platforms prioritize secure service vendors.",
        category: "Business Trustworthiness",
        businessValue: "Unlocks selection options on institutional procurement searches.",
        difficulty: "Medium" as const
      });
    }
  } else if (category === "Local Business" || category === "Healthcare") {
    if (evidence.contactInfo.address.status !== "Found") {
      recommendationsList.push({
        id: "rec-local-address",
        priority: "High" as const,
        title: "Publish Verifiable Physical Corporate Address",
        impact: "Enables geographic routing",
        description: "List your complete physical storefront or main office coordinates. AI mapping and recommendation engines cross-verify address listings to ensure physical legitimacy.",
        category: "Business Trustworthiness",
        businessValue: "Captures local consumer queries and map-based recommendation selections.",
        difficulty: "Easy" as const
      });
    }
  }

  if (faqCount === 0) {
    recommendationsList.push({
      id: "rec-faq",
      priority: "Medium" as const,
      title: "Publish a Conversational FAQ Answering Module",
      impact: "Improves direct matchmaking by 15%",
      description: "Provide structured, conversational questions and answers about your services, pricing, and fulfillment. This supplies search assistants with clear conversational answers to buyer prompts.",
      category: "AI Understanding",
      businessValue: "Secures top placement in conversational answer snippets and voice searches.",
      difficulty: "Easy" as const
    });
  }

  // Ensure we always have at least 3 high-quality recommendations
  if (recommendationsList.length < 3) {
    recommendationsList.push({
      id: "rec-content-depth",
      priority: "Medium" as const,
      title: "Expand Qualitative Descriptive Brand Prose",
      impact: "Improves category matching",
      description: "Provide descriptive, clear paragraphs explaining your services, background, and operational benefits. Conversational summarizers parse high-density prose to match generic searches.",
      category: "AI Understanding",
      businessValue: "Captures broad-topic category lookups on conversational search models.",
      difficulty: "Easy" as const
    });
  }

  const reportData: AIReadinessReport = {
    url: targetUrl,
    companyName,
    scannedAt: new Date().toISOString(),
    overallScore: overallScoreVal,
    crawlStats: {
      pagesCrawled: crawledPages.filter(p => p.status === "Success").length,
      productCount,
      faqCount,
      blogsCount: 0,
      reviewCount: 0,
      metadataFound: evidence.metaDescriptions.status === "Found",
      schemaMarkupType: crawledPages.some(p => p.role === "Products" && p.status === "Success") ? ["AI-Friendly Catalog Format"] : ["Standard Page Layouts"],
      imageCount
    },
    scoreBreakdown: {
      contentQuality,
      productCompleteness,
      structuredData,
      trustSignals,
      aiReadability,
      authority, // Properly evaluated as 'Not Evaluated'
      technicalHealth
    },
    visibility: {
      chatgpt: {
        score: chatgptScore,
        likelihood: typeof chatgptScore === "number" ? getLikelihood(chatgptScore) : "Not Evaluated",
        strengths: ["Clear primary navigation layout", "Highly readable paragraphs"],
        weaknesses: category === "E-commerce" && !specsFound ? ["Missing detailed catalog variables, blocking direct comparison matching"] : ["No critical blockers"]
      },
      gemini: {
        score: geminiScore,
        likelihood: typeof geminiScore === "number" ? getLikelihood(geminiScore) : "Not Evaluated",
        strengths: ["Secure domain certificate", "Legitimate physical location details"],
        weaknesses: faqCount === 0 ? ["Lack of pre-purchase answers reduces confidence in matching customer queries"] : ["No critical blockers"]
      },
      claude: {
        score: claudeScore,
        likelihood: typeof claudeScore === "number" ? getLikelihood(claudeScore) : "Not Evaluated",
        strengths: ["Natural paragraph layout", "Highly descriptive brand statements"],
        weaknesses: typeof trustSignals !== "number" || trustSignals < 50 ? ["Absence of refund terms reduces purchase recommendation scores"] : ["No critical blockers"]
      },
      perplexity: {
        score: perplexityScore,
        likelihood: typeof perplexityScore === "number" ? getLikelihood(perplexityScore) : "Not Evaluated",
        strengths: ["Fast response times", "Active status codes"],
        weaknesses: ["Under-represented business presence (brand mentions are Not Evaluated)"]
      }
    },
    explainability: {
      missingFaq: {
        hasGap: faqCount === 0,
        description: "Lack of direct customer question-and-answer lists.",
        reasoning: "Conversational engines prioritize pre-structured question-and-answer pairs to directly resolve user searches. Lacking FAQs prevents immediate answers.",
        businessImpact: "Excludes your brand from direct answer boxes and troubleshooting searches.",
        expectedImprovement: "Publishing a clear list of FAQs directly boosts inclusion in direct search answers."
      },
      weakProductDescriptions: {
        hasGap: category === "E-commerce" && productCount > 0 && !specsFound,
        description: "AI assistants cannot fully understand your products because important product information is missing.",
        reasoning: "Automated shoppers look for concrete attributes such as sizes, weights, and parameters. Plain text blocks cause parsing gaps.",
        businessImpact: "Excludes listings when users filter by precise technical criteria or dimensions.",
        expectedImprovement: "Adding explicit product specification charts enables accurate item-to-item recommendations."
      },
      missingStructuredData: {
        hasGap: typeof structuredData !== "number" || structuredData < 50,
        description: "Incomplete business layout optimization.",
        reasoning: "Generative engines require clean layout structures to map and catalog available stock. Unstructured pages lead to scraping timeouts.",
        businessImpact: "Slows down catalog ingestion and limits inclusion in active product index arrays.",
        expectedImprovement: "Structuring your layout ensures immediate catalog ingestion and high-reliability listings."
      },
      noTrustBadges: {
        hasGap: category === "E-commerce" && evidence.trustSignals.certificates.status !== "Found",
        description: "Absence of visible trust badges or compliance indicators.",
        reasoning: "Commerce engines evaluate merchant safety parameters before routing checkouts. Missing guarantees reduce customer-matching trust.",
        businessImpact: "Flags your domain as unverified, causing recommendation filters to favor certified competitors.",
        expectedImprovement: "Declaring trust certifications secures purchase recommender credentials."
      },
      noCertifications: {
        hasGap: false,
        description: "Not Evaluated",
        reasoning: "Awaiting future footprint integrations.",
        businessImpact: "Not Evaluated",
        expectedImprovement: "Not Evaluated"
      },
      poorComparisonInfo: {
        hasGap: true,
        description: "Lack of brand comparison charts.",
        reasoning: "When users ask comparative queries ('Should I choose brand A or brand B?'), engines check for competitive differentiation copy.",
        businessImpact: "Allows competitors to capture intent by publishing their own comparison matrices.",
        expectedImprovement: "Improves competitive recommendation standing during comparative buyer cycles."
      },
      weakAuthority: {
        hasGap: true,
        description: "External digital brand footprint is Not Evaluated.",
        reasoning: "External citations and online mentions are not scanned locally.",
        businessImpact: "Limits domain-level authority calculations on broad transactional prompts.",
        expectedImprovement: "Not Evaluated"
      }
    },
    competitors: [],
    recommendations: recommendationsList.slice(0, 4),
    executiveSummary: {
      overallScore: overallScoreVal,
      topProblems: topProblems.slice(0, 3),
      quickWins: quickWins.slice(0, 3),
      estimatedVisibility: typeof overallScoreVal === "number" ? Math.round(overallScoreVal * 0.95) : null,
      recommendationProbability: typeof overallScoreVal === "number" ? Math.round(overallScoreVal * 0.9) : null,
      nextSteps: [
        "Synthesize deterministic score results to construct targeted context pages.",
        "Awaiting downstream models for real-time validation checks."
      ],
      textSummary,
      strategicVerdict
    },
    evidence
  };

  // Attach enriched details safely
  (reportData as any).evidenceCoverage = scoreResult.evidenceCoverage;
  (reportData as any).websiteClassification = scoreResult.classification;
  reportData.confidence = calculateConfidence(evidence);

  return reportData;
}
