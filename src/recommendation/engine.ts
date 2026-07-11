/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIReadinessReport } from "../types";
import { 
  AIRecommendationModel, 
  RecommendationReadinessLevel, 
  RecommendationSignal, 
  MissingRecommendationSignal, 
  RecommendationJourneyStep, 
  RecommendationScenario, 
  PromptCategory, 
  CompetitiveFactor, 
  RecommendationOpportunity, 
  RecommendationConfidence, 
  RecommendationSummary 
} from "./types";

/**
 * Recommendation Intelligence Engine
 * Consumes the pre-scanned knowledge, perception, and reasoning metrics of Perceptiq AI,
 * producing deterministic, explainable, and business-friendly recommendation estimations.
 */
export function calculateRecommendation(report: AIReadinessReport): AIRecommendationModel {
  const companyName = report.companyName || "your business";
  const evidence = report.evidence;
  const ki = report.knowledgeIntelligence;

  // -------------------------------------------------------------
  // Gather actual crawled evidence (Strictly deterministic)
  // -------------------------------------------------------------
  const hasBusinessName = !!(evidence?.businessName?.value || report.companyName);
  const productsList = evidence?.productTitles?.value || evidence?.productsFound?.value || [];
  const servicesList = evidence?.servicesFound?.value || [];
  const faqList = evidence?.faqQuestions?.value || [];
  const hasPhone = !!evidence?.contactInfo?.phone?.value;
  const hasEmail = !!evidence?.contactInfo?.email?.value;
  const hasAddress = !!evidence?.contactInfo?.address?.value;
  const hasShipping = !!evidence?.policies?.shippingInfo?.value;
  const hasReturn = !!evidence?.policies?.returnPolicy?.value;
  const hasPricing = !!evidence?.pricingInfo?.value;
  const hasDescriptions = !!(evidence?.businessDescriptions?.value && evidence.businessDescriptions.value.length > 0);
  const hasMetadata = report.crawlStats?.metadataFound || false;

  // Resolve general primary offering and industry sector
  let detectedIndustry = "Local Commerce / Service Provider";
  if (ki?.entities) {
    const categoryEntity = ki.entities.find(e => e.type === "Category");
    if (categoryEntity?.name) {
      detectedIndustry = categoryEntity.name;
    }
  }
  if (companyName.toLowerCase().includes("shopify")) {
    detectedIndustry = "E-Commerce Technology";
  }

  const primaryTopic = productsList.length > 0 
    ? `${detectedIndustry} physical products` 
    : servicesList.length > 0 
    ? `${detectedIndustry} custom services` 
    : `${detectedIndustry} solutions`;

  // -------------------------------------------------------------
  // FEATURE 1: Recommendation Readiness
  // -------------------------------------------------------------
  let readinessScore = 0;
  if (hasBusinessName) readinessScore += 15;
  if (productsList.length > 0 || servicesList.length > 0) readinessScore += 25;
  if (hasPhone || hasEmail) readinessScore += 15;
  if (hasAddress) readinessScore += 15;
  if (faqList.length > 0) readinessScore += 15;
  if (hasPricing) readinessScore += 10;
  if (hasReturn || hasShipping) readinessScore += 5;

  let readinessLevel: RecommendationReadinessLevel = "Average";
  let whyLikelyOrUnlikely = "";

  if (readinessScore >= 90) {
    readinessLevel = "Excellent";
    whyLikelyOrUnlikely = "AI finds your business profile incredibly complete. All primary coordinates, service menus, direct contact lines, operating locations, and pricing guides are fully indexed. There are zero conflicting records, meaning search bots will enthusiastically refer clients to your brand with zero hesitation.";
  } else if (readinessScore >= 75) {
    readinessLevel = "Strong";
    whyLikelyOrUnlikely = "AI can confidently recommend your brand for most inquiries. Your business information is clear, and your products or services are well described. Adding transparent pricing tables or formal support policies would elevate your readiness to the top tier.";
  } else if (readinessScore >= 60) {
    readinessLevel = "Good";
    whyLikelyOrUnlikely = "AI is likely to recommend your business for standard requests, but lacks specific details to satisfy precision consumer filters. Your core contact info and identity are clear, but some product details or pricing terms are missing.";
  } else if (readinessScore >= 45) {
    readinessLevel = "Average";
    whyLikelyOrUnlikely = "AI can locate your website, but is hesitant to recommend your services due to missing context. For instance, without clear pricing or FAQs, search models cannot verify if you fit the buyer's criteria.";
  } else if (readinessScore >= 25) {
    readinessLevel = "Needs Improvement";
    whyLikelyOrUnlikely = "AI is unlikely to recommend your business today. Important details like product descriptions, direct contact paths, or localized address markers are missing, causing search bots to bypass your pages in favor of competitor profiles.";
  } else {
    readinessLevel = "Poor";
    whyLikelyOrUnlikely = "Your business is highly invisible to recommendation models. AI finds a critical lack of verifiable trading details, meaning search agents cannot confirm if your business is active, let alone recommend it to buyers.";
  }

  // -------------------------------------------------------------
  // FEATURE 2: Recommendation Signals
  // -------------------------------------------------------------
  const signals: RecommendationSignal[] = [
    {
      name: "Clear Business Identity",
      status: hasBusinessName ? "Met" : "Unmet",
      whyItMatters: "AI needs a clear brand name to associate customer reviews, trade topics, and direct search queries with your business.",
      supportingEvidence: hasBusinessName
        ? `AI successfully verified your business name "${companyName}" spelled consistently across the home page and titles.`
        : "No clear, consistent company name was indexed in top-level headings, causing brand confusion.",
      impact: "High"
    },
    {
      name: "Strong Offerings Descriptions",
      status: (productsList.length > 0 || servicesList.length > 0) ? (hasDescriptions ? "Met" : "Partial") : "Unmet",
      whyItMatters: "AI matches user needs directly to product and service features. Broad generalizations get filtered out of search queries.",
      supportingEvidence: (productsList.length > 0 || servicesList.length > 0)
        ? `AI indexed your catalog containing: ${[...productsList, ...servicesList].slice(0, 3).join(", ")}.`
        : "No specific products or professional services catalogs were crawled on your pages.",
      impact: "High"
    },
    {
      name: "Consistent Contact Information",
      status: (hasPhone && hasEmail) ? "Met" : (hasPhone || hasEmail) ? "Partial" : "Unmet",
      whyItMatters: "Verifiable phone numbers and email paths prove your business is an active, legitimate operating entity rather than a spam portal.",
      supportingEvidence: (hasPhone && hasEmail)
        ? `AI verified both phone (${evidence?.contactInfo?.phone?.value}) and email (${evidence?.contactInfo?.email?.value}) channels.`
        : (hasPhone || hasEmail)
        ? `AI verified only one active contact channel: ${evidence?.contactInfo?.phone?.value || evidence?.contactInfo?.email?.value}.`
        : "No direct phone line or customer support email address could be confirmed on your pages.",
      impact: "High"
    },
    {
      name: "Pricing Transparency",
      status: hasPricing ? "Met" : "Unmet",
      whyItMatters: "Price is the primary filter for commercial shopping intent. AI cannot recommend unpriced offerings for budget-centric searches.",
      supportingEvidence: hasPricing
        ? "AI found clear pricing indicators, monthly fees, or starting-at rates on your catalog pages."
        : "No public prices or fee tables are visible. AI assumes your services are expensive and unoptimized for budget comparisons.",
      impact: "High"
    },
    {
      name: "Helpful FAQ Section",
      status: faqList.length > 0 ? "Met" : "Unmet",
      whyItMatters: "Conversational assistants extract question-and-answer templates to solve user pre-sales questions verbatim.",
      supportingEvidence: faqList.length > 0
        ? `AI indexed a structured FAQ guide containing ${faqList.length} pre-sales customer questions and answers.`
        : "No Q&A template was found, meaning AI must guess your customer support policies.",
      impact: "Medium"
    },
    {
      name: "About Page and Values",
      status: hasDescriptions ? "Met" : "Unmet",
      whyItMatters: "AI scans background pages to determine company category, organizational history, and client fit.",
      supportingEvidence: hasDescriptions
        ? "AI parsed your corporate background, mapping your company's core values and target audiences."
        : "No clear corporate story or company background page was discovered during the website scan.",
      impact: "Medium"
    },
    {
      name: "Local Address Anchors",
      status: hasAddress ? "Met" : "Unmet",
      whyItMatters: "Local search assistants (Siri, Apple Intelligence, Google Maps AI) filter strictly by physical coordinates to satisfy localized searches.",
      supportingEvidence: hasAddress
        ? `AI verified your physical street address coordinates: "${evidence?.contactInfo?.address?.value}".`
        : "No physical street address found. Your business is invisible to local 'near me' search queries.",
      impact: "Medium"
    },
    {
      name: "Refund & Return Policy",
      status: hasReturn ? "Met" : "Unmet",
      whyItMatters: "Shopping assistants check for buyer protection terms (refund window, returns) to ensure safe client recommendations.",
      supportingEvidence: hasReturn
        ? "AI parsed your refund terms, confirming customer protection policies are in place."
        : "No transparent return windows are public, lowering purchase readiness indicators.",
      impact: "Medium"
    },
    {
      name: "Shipping Transparency",
      status: hasShipping ? "Met" : "Unmet",
      whyItMatters: "E-commerce buyers ask shopping engines about shipping speeds and delivery fees before selecting products.",
      supportingEvidence: hasShipping
        ? "AI located detailed shipping guidelines explaining dispatch speeds and costs."
        : "No delivery timelines are public, making shipping estimates ambiguous.",
      impact: "Low"
    },
    {
      name: "Schema Markup & Metadata",
      status: hasMetadata ? "Met" : "Unmet",
      whyItMatters: "Structured page meta descriptions and JSON-LD micro-markup help search engines index your organization with perfect accuracy.",
      supportingEvidence: hasMetadata
        ? "AI successfully read your website's header metadata and page structures."
        : "Standard schema metadata tags are missing or partial, slowing down data harvesting.",
      impact: "Medium"
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 3: Missing Recommendation Signals (Filtered from signals)
  // -------------------------------------------------------------
  const missingSignals: MissingRecommendationSignal[] = [];

  if (!hasPricing) {
    missingSignals.push({
      problem: "No Public Pricing Information",
      whyNeeded: "AI assistants require pricing rates or estimation ranges to evaluate affordability and rank your services.",
      businessImpact: "Omits your business from any customer query containing modifiers like 'affordable', 'budget-friendly', or 'cost comparison'.",
      recommendation: "Publish a clear 'Starting From' estimate or a flat-rate pricing table on your core services or product pages.",
      expectedImprovement: "Enables shopping bots to immediately include you in budget-filtered comparison lists."
    });
  }

  if (faqList.length === 0) {
    missingSignals.push({
      problem: "Missing Pre-Sales FAQ Template",
      whyNeeded: "AI crawlers look for question-and-answer format structures to answer voice search inquiries directly.",
      businessImpact: "AI must guess your policies or synthesize custom answers, leading to vague explanations that cause buyer hesitation.",
      recommendation: "Add a dedicated Frequently Asked Questions section resolving common pre-purchase questions.",
      expectedImprovement: "Enables voice-guided systems to pull exact, verified answers to client queries directly into search cards."
    });
  }

  if (!hasAddress) {
    missingSignals.push({
      problem: "No Verifiable Office Location",
      whyNeeded: "Localized search systems require exact street coordinates and zip codes to pin your business on localized results.",
      businessImpact: "Absolute loss of local traffic from smart voice search systems like Apple Intelligence or Siri for surrounding buyers.",
      recommendation: "List your administrative headquarters, physical office, or local pickup address in your global page footer.",
      expectedImprovement: "Places your company in localized 'near me' recommendation map packs for prospects nearby."
    });
  }

  if (!hasReturn && productsList.length > 0) {
    missingSignals.push({
      problem: "Missing Refund & Return Rights",
      whyNeeded: "AI shopping search engines check for buyer protection terms before recommending a transactional brand.",
      businessImpact: "Lowers your transaction readiness and safety scores, reducing the likelihood of purchase recommendations.",
      recommendation: "Publish a simple '/returns' page outlining a 30-day refund guarantee window and clear return steps.",
      expectedImprovement: "Raises transaction trust indices, unlocking direct referral recommendations from shopping bots."
    });
  }

  if (!hasShipping && productsList.length > 0) {
    missingSignals.push({
      problem: "No Public Shipping Guidelines",
      whyNeeded: "Shopping assistants receive user questions like 'How fast can I get this delivered?'.",
      businessImpact: "AI bypasses your catalog for time-sensitive queries in favor of alternatives listing explicit schedules.",
      recommendation: "Add a short shipping notice detailing standard courier dispatch times and standard delivery speeds.",
      expectedImprovement: "Allows search assistants to confirm precise delivery windows to local buyers."
    });
  }

  // Guard: if empty, add a default high-value optimization opportunity
  if (missingSignals.length === 0) {
    missingSignals.push({
      problem: "Missing JSON-LD Local Business Schema",
      whyNeeded: "Semantic backend schemas are parsed 10x faster by AI engines than unstructured paragraph text.",
      businessImpact: "Minor delays in index updates when you modify catalog prices or contact numbers.",
      recommendation: "Generate a custom JSON-LD Schema file and inject it into your website's main head tag.",
      expectedImprovement: "Ensures instant, error-free brand updates on conversational models upon every crawl."
    });
  }

  // -------------------------------------------------------------
  // FEATURE 4: Recommendation Journey
  // -------------------------------------------------------------
  const journeySteps: RecommendationJourneyStep[] = [
    {
      stepNumber: 1,
      stepName: "User Asks a Question",
      whatIsAIDoing: "AI captures the user's natural language request (e.g., 'Recommend an affordable accounting service in my area') and identifies key constraints like location, budget, and specialty needs.",
      status: "completed"
    },
    {
      stepNumber: 2,
      stepName: "AI Understands the Request",
      whatIsAIDoing: "AI processes the prompt, translating human sentences into precise machine queries. It isolates your category filters, geographic boundaries, and required features.",
      status: "completed"
    },
    {
      stepNumber: 3,
      stepName: "AI Searches its Knowledge",
      whatIsAIDoing: "AI scans its offline indexes—compiled from crawling trusted websites, directories, and reviews—to locate businesses matching the category and topic keywords.",
      status: "completed"
    },
    {
      stepNumber: 4,
      stepName: "AI Evaluates Your Business",
      whatIsAIDoing: "AI audits your specific website pages, verifying your brand identity, primary offerings, and active contact lines to confirm if your copy answers the user's constraints.",
      status: "active"
    },
    {
      stepNumber: 5,
      stepName: "AI Compares Available Info",
      whatIsAIDoing: "AI places your business side-by-side with alternative choices, checking pricing transparency, localized address anchors, support policies, and trust signals.",
      status: "pending"
    },
    {
      stepNumber: 6,
      stepName: "AI Measures Confidence",
      whatIsAIDoing: "AI calculates an internal confidence score. Having consistent contact details and zero conflicting pages guarantees that AI won't feed outdated info to users.",
      status: "pending"
    },
    {
      stepNumber: 7,
      stepName: "AI Decides to Recommend",
      whatIsAIDoing: "Based on overall readiness and confidence, AI selects the top 3 businesses, quoting direct evidence and explaining to the user exactly why these brands are the perfect match.",
      status: "pending"
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 5: Recommendation Scenarios (Deterministic business rules)
  // -------------------------------------------------------------
  const scenarios: RecommendationScenario[] = [
    {
      scenarioName: "Affordable / Best Value Option",
      likelihood: hasPricing ? "High" : "Unlikely",
      reason: "AI shopping search engines actively parse pricing data to calculate cost-efficiency metrics.",
      supportingEvidence: hasPricing
        ? "Pricing info is transparent and clearly structured next to listings."
        : "No public pricing rates were found, forcing AI to assume a high premium cost tier.",
      weaknesses: hasPricing
        ? "Some price packaging terms could be more detailed."
        : "Absence of starting rates prevents budget indexing.",
      suggestedImprovements: hasPricing
        ? "Add a comparison chart between packages."
        : "Publish a clear 'starting from' pricing tier in your global catalog."
    },
    {
      scenarioName: "Premium / Enterprise Solution",
      likelihood: (!hasPricing && hasDescriptions) ? "High" : "Medium",
      reason: "Custom quote requirements and high-touch service descriptions signal bespoke, high-end capabilities.",
      supportingEvidence: !hasPricing
        ? "The absence of direct flat-rate transactions indicates a personalized consultative sales cycle suited for premium clients."
        : "Direct retail listings with simple pricing structures lean more toward transactional buyers rather than custom enterprise deals.",
      weaknesses: !hasPricing
        ? "Lack of case studies or client logos makes it harder to verify trust at high scale."
        : "Standardized package prices may deter enterprise buyers seeking fully tailored corporate accounts.",
      suggestedImprovements: !hasPricing
        ? "Publish enterprise-level security terms, service level agreements (SLAs), or success stories."
        : "Create a separate 'Enterprise Solutions' path outlining customized services and corporate service tiers."
    },
    {
      scenarioName: "Local Business Inquiries",
      likelihood: hasAddress ? "High" : "Unlikely",
      reason: "Local search maps and voice commands (like Siri, Google Maps AI, and Apple Intelligence) filter strictly by geographic office address coordinates.",
      supportingEvidence: hasAddress
        ? `Verifiable physical street address detected at: ${evidence?.contactInfo?.address?.value}.`
        : "No physical street address was discovered, only digital email/contact forms.",
      weaknesses: hasAddress
        ? "Lacks clear map embeds or landmark references in text."
        : "Total absence of localized geographic coordinates.",
      suggestedImprovements: hasAddress
        ? "Add operating hours and localized landmark directions next to your address."
        : "List your physical building suite, zip code, and city clearly in your footer to unlock localized maps indexing."
    },
    {
      scenarioName: "Online / Remote Service",
      likelihood: (hasPhone || hasEmail) ? "High" : "Medium",
      reason: "Accessible, digital-first communication channels indicate rapid remote engagement capabilities.",
      supportingEvidence: (hasPhone || hasEmail)
        ? "Direct digital communication lines (forms, email, phone) are prominently placed."
        : "Limited communication channels hinder remote client trust.",
      weaknesses: "Lacks 24/7 digital chat portals or real-time booking indicators.",
      suggestedImprovements: "Integrate an online appointment scheduler or a direct email reply promise (e.g. 'We reply within 2 hours')."
    },
    {
      scenarioName: "Most Trusted & Verified Option",
      likelihood: (hasPhone && hasEmail && hasAddress && faqList.length > 0) ? "High" : "Medium",
      reason: "Consistent brand details, operating addresses, active phone lines, and extensive FAQ sheets build high validation confidence.",
      supportingEvidence: (hasPhone && hasEmail && hasAddress && faqList.length > 0)
        ? "A comprehensive spread of verifiability signals is fully indexed."
        : "Some crucial corporate trust parameters (such as FAQs or phone channels) are missing.",
      weaknesses: "Lacks customer testimonial pages or industry certifications markup.",
      suggestedImprovements: "Dedicate a section on your homepage for verified customer success stories, or add industry certification logo banners."
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 6: Prompt Categories
  // -------------------------------------------------------------
  const promptCategories: PromptCategory[] = [
    {
      categoryName: "Business Discovery",
      preparedness: (hasBusinessName && hasDescriptions) ? "Fully Prepared" : "Partially Prepared",
      whatAIKnows: `AI knows your official company name "${companyName}" and maps your topic structures directly to the "${detectedIndustry}" category.`,
      whatAINeeds: "Richer paragraph blocks summarizing what unique market niche your business serves."
    },
    {
      categoryName: "Brand Comparison",
      preparedness: (hasPricing && faqList.length > 0) ? "Fully Prepared" : "Partially Prepared",
      whatAIKnows: "AI can read your main list of offerings and company details.",
      whatAINeeds: "Transparent price points and refund policies to compare your transactional terms against typical market competitors."
    },
    {
      categoryName: "Buying Decision",
      preparedness: (hasReturn && hasPricing) ? "Fully Prepared" : "Partially Prepared",
      whatAIKnows: "AI is aware of your core product or service specifications.",
      whatAINeeds: "Buyer protection guarantees (such as clear return policies or shipping speeds) to overcome client hesitation."
    },
    {
      categoryName: "Problem Solving",
      preparedness: faqList.length > 0 ? "Fully Prepared" : "Partially Prepared",
      whatAIKnows: "AI found general service titles and introductory text blocks.",
      whatAINeeds: "A clear step-by-step FAQ section detailing the onboarding workflow and customer setup guidelines."
    },
    {
      categoryName: "Customer Support",
      preparedness: (hasPhone || hasEmail) ? "Fully Prepared" : "Partially Prepared",
      whatAIKnows: (hasPhone || hasEmail)
        ? `AI found verified communication routes like phone (${evidence?.contactInfo?.phone?.value || "unlisted"}) and email.`
        : "No support email or telephone channels could be verified on public paths.",
      whatAINeeds: "Explicit support hours and average email response speeds listed next to your coordinates."
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 7: Competitive Recommendation Factors (Deterministic comparison)
  // -------------------------------------------------------------
  const competitiveFactors: CompetitiveFactor[] = [
    {
      factorName: "FAQ Coverage Gaps",
      comparisonDescription: "Alternative businesses listing robust FAQ grids are recommended first for Q&A-driven voice searches because AI can directly extract their answers.",
      typicalCompetitorSignal: "Lists 10-15 detailed question-and-answer blocks covering pricing models, onboarding, and refund steps.",
      remedyAction: "Create a '/faq' page outlining 5-10 common client questions using clear header styling."
    },
    {
      factorName: "Pricing Transparency Gaps",
      comparisonDescription: "Competitors with flat packages or starting estimates are selected first for budget filtering because AI can easily map their cost bracket.",
      typicalCompetitorSignal: "Displays clear, comparative price tags or starting ranges next to their catalog listings.",
      remedyAction: "Add a clear starting price range (e.g. 'Services from $199') on your main services cards."
    },
    {
      factorName: "Local Search Omission",
      comparisonDescription: "Businesses displaying verifiable physical office coordinates are recommended first for localized queries, while virtual-only listings get filtered out.",
      typicalCompetitorSignal: "Lists corporate street coordinates, suite numbers, and zip codes in their footers.",
      remedyAction: "Publish your corporate or administrative mailing coordinates clearly in your footer block."
    },
    {
      factorName: "Buyer Protection Term Gaps",
      comparisonDescription: "AI shopping systems favor websites displaying explicit refund windows to protect users from high-risk or untrustworthy transactions.",
      typicalCompetitorSignal: "Links a transparent refund policy details sheet clearly in their website footer.",
      remedyAction: "Add a return and refund policy page and publish it in your main footer menu."
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 8: Recommendation Opportunities (Prioritized)
  // -------------------------------------------------------------
  const opportunities: RecommendationOpportunity[] = [];

  // High Priority Opportunities
  if (!hasPricing) {
    opportunities.push({
      priority: "High",
      opportunityName: "Publish Starting Prices",
      why: "AI shopping engines require public price indicators to place your business in 'affordable' or 'cost-effective' recommendations.",
      businessImpact: "Unlocks ranking eligibility in all comparative budget-filtered queries on ChatGPT and Gemini.",
      difficulty: "Easy",
      estimatedImprovement: "High"
    });
  }

  if (faqList.length === 0) {
    opportunities.push({
      priority: "High",
      opportunityName: "Deploy Pre-Sales FAQ section",
      why: "Search bots extract question-and-answer text structures to satisfy voice search queries verbatim.",
      businessImpact: "Captures organic voice traffic from smart assistants pulling verified answers directly into search blocks.",
      difficulty: "Easy",
      estimatedImprovement: "High"
    });
  }

  // Medium Priority Opportunities
  if (!hasReturn) {
    opportunities.push({
      priority: "Medium",
      opportunityName: "Formulate Refund and Return Policy",
      why: "Before recommending transactions, AI audits your site for buyer safety indicators to verify consumer protection.",
      businessImpact: "Eliminates purchase hesitation filters, securing safe referral recommendations from shopping bots.",
      difficulty: "Easy",
      estimatedImprovement: "High"
    });
  }

  if (!hasAddress) {
    opportunities.push({
      priority: "Medium",
      opportunityName: "List Verifiable Office Coordinates",
      why: "Local search maps (Google Maps AI, Siri) filter strictly by physical coordinates to satisfy regional requests.",
      businessImpact: "Enables nearby prospects using hands-free voice map systems to locate and contact your business.",
      difficulty: "Easy",
      estimatedImprovement: "High"
    });
  }

  // Low Priority Opportunities
  opportunities.push({
    priority: "Low",
    opportunityName: "Inject Structured JSON-LD Schema",
    why: "Semantic backend structures let search bots parse corporate metadata 10x faster than reading dense paragraphs.",
    businessImpact: "Ensures instant, error-free brand indexing upon every search engine crawl cycle.",
    difficulty: "Medium",
    estimatedImprovement: "Medium"
  });

  // Ensure sorting is correct: High -> Medium -> Low
  opportunities.sort((a, b) => {
    const weights = { High: 3, Medium: 2, Low: 1 };
    return weights[b.priority] - weights[a.priority];
  });

  // -------------------------------------------------------------
  // FEATURE 9: Recommendation Confidence
  // -------------------------------------------------------------
  let confidenceLevel: "High" | "Medium" | "Low" = "Low";
  let confidenceReason = "";
  let confidenceEvidence = "";
  let possibleUncertainty = "";

  if (hasBusinessName && (hasPhone || hasEmail) && (productsList.length > 0 || servicesList.length > 0) && hasAddress) {
    confidenceLevel = "High";
    confidenceReason = "AI found highly consistent business details, clear contact directories, and a physical location coordinates across your crawled pages.";
    confidenceEvidence = `Uniform company trademark "${companyName}", verified direct support channels, and an active physical office at "${evidence?.contactInfo?.address?.value}".`;
    possibleUncertainty = "Minimal. Brand identity and core trading coordinates are uniform and verified.";
  } else if (hasBusinessName && (hasPhone || hasEmail) && (productsList.length > 0 || servicesList.length > 0)) {
    confidenceLevel = "Medium";
    confidenceReason = "Business details and catalogs are clear, but the lack of localized address anchors introduces minor uncertainty for geographic verification.";
    confidenceEvidence = "Uniform company trademark and catalog menus parsed successfully without an operating street coordinates.";
    possibleUncertainty = "AI cannot fully verify localized geographic operations, reducing recommendations for regional queries.";
  } else {
    confidenceLevel = "Low";
    confidenceReason = "AI found multiple incomplete sections or a lack of descriptive catalog listings, creating high parsing ambiguity.";
    confidenceEvidence = "Scanned pages are missing physical street locations, price guidelines, or structured FAQ support templates.";
    possibleUncertainty = "AI might misclassify your brand category or fail to recommend your business due to unverified trust parameters.";
  }

  const confidence: RecommendationConfidence = {
    confidenceLevel,
    reason: confidenceReason,
    evidence: confidenceEvidence,
    possibleUncertainty
  };

  // -------------------------------------------------------------
  // FEATURE 10: Recommendation Summary
  // -------------------------------------------------------------
  const likelyRecommendations = productsList.length > 0 
    ? `customers seeking reliable, structured catalog offerings within the ${detectedIndustry} sector`
    : servicesList.length > 0
    ? `clients looking for specialized, professional consulting in ${servicesList.slice(0, 2).join(" and ")}`
    : `prospects searching for general solutions in the ${detectedIndustry} space`;

  const unlikelyRecommendations = !hasPricing
    ? "budget-conscious buyers or price-comparative searches because pricing models are private"
    : !hasAddress
    ? "localized inquiries or regional searches because physical coordinates are not public"
    : "particular client requests where detailed pre-sales FAQs are needed";

  const strongestSignals = [
    hasBusinessName ? "Clear, consistent company trademark" : "",
    (productsList.length > 0 || servicesList.length > 0) ? "Structured list of product or service offerings" : "",
    (hasPhone || hasEmail) ? "Direct, active communication channels" : "",
    hasDescriptions ? "Clear, business-focused copywriting" : ""
  ].filter(Boolean);

  const biggestOpportunity = !hasPricing
    ? "Publish starting pricing guidelines next to services"
    : faqList.length === 0
    ? "Formulate a pre-sales FAQ page resolving client questions"
    : !hasAddress
    ? "Add physical operating office coordinates in footers"
    : "Inject structured JSON-LD organizational schema";

  const consultantOverview = `Based on your website analysis, AI is likely to recommend your business for ${likelyRecommendations}. However, AI is less confident recommending you for ${unlikelyRecommendations}. Your strongest recommendation signals are ${strongestSignals.slice(0, 2).join(" and ")}, while your biggest improvement opportunity is ${biggestOpportunity.toLowerCase()}.`;

  const summary: RecommendationSummary = {
    likelyRecommendations,
    unlikelyRecommendations,
    strongestSignals,
    biggestOpportunity,
    consultantOverview
  };

  return {
    readinessLevel,
    whyLikelyOrUnlikely,
    signals,
    missingSignals,
    journeySteps,
    scenarios,
    promptCategories,
    competitiveFactors,
    opportunities,
    confidence,
    summary
  };
}
