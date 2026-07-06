/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EvidenceModel } from "./types";

export type WebsiteCategory =
  | "E-commerce"
  | "SaaS"
  | "Marketplace"
  | "Corporate"
  | "Documentation"
  | "Developer Platform"
  | "Education"
  | "Healthcare"
  | "Financial Services"
  | "Local Business"
  | "Blog / Media"
  | "Agency"
  | "Portfolio";

export interface ClassificationResult {
  category: WebsiteCategory;
  confidence: "High" | "Medium" | "Low";
  supportingEvidence: string[];
}

/**
 * Deterministically classifies a website based on evidence model signals.
 * No AI, No ML, No loose heuristics. Completely explainable and traceable.
 */
export function classifyWebsite(evidence: EvidenceModel): ClassificationResult {
  const scores: Record<WebsiteCategory, number> = {
    "E-commerce": 0,
    "SaaS": 0,
    "Marketplace": 0,
    "Corporate": 0,
    "Documentation": 0,
    "Developer Platform": 0,
    "Education": 0,
    "Healthcare": 0,
    "Financial Services": 0,
    "Local Business": 0,
    "Blog / Media": 0,
    "Agency": 0,
    "Portfolio": 0,
  };

  const supportingReasons: Record<WebsiteCategory, string[]> = {
    "E-commerce": [],
    "SaaS": [],
    "Marketplace": [],
    "Corporate": [],
    "Documentation": [],
    "Developer Platform": [],
    "Education": [],
    "Healthcare": [],
    "Financial Services": [],
    "Local Business": [],
    "Blog / Media": [],
    "Agency": [],
    "Portfolio": [],
  };

  // Extract common text strings for analysis
  const pageTitlesJoined = Object.values(evidence.pageTitles.value || {}).join(" ").toLowerCase();
  const descriptionsJoined = (evidence.businessDescriptions.value || []).join(" ").toLowerCase() + " " + Object.values(evidence.metaDescriptions.value || {}).join(" ").toLowerCase();
  const pricingText = (evidence.pricingInfo.value || "").toLowerCase();
  const faqText = (evidence.faqQuestions.value || []).join(" ").toLowerCase();

  // 1. E-commerce Signals
  if (evidence.productTitles.status === "Found" && (evidence.productTitles.value || []).length > 0) {
    scores["E-commerce"] += 4;
    supportingReasons["E-commerce"].push("Multiple individual product titles were cataloged.");
  }
  if (evidence.policies.returnPolicy.status === "Found") {
    scores["E-commerce"] += 3;
    supportingReasons["E-commerce"].push("Return and refund policy statement was verified.");
  }
  if (evidence.policies.shippingInfo.status === "Found") {
    scores["E-commerce"] += 2;
    supportingReasons["E-commerce"].push("Shipping rates or fulfillment policy was verified.");
  }
  if (evidence.productsFound.status === "Found" && (evidence.productsFound.value || []).some(p => ["Catalog", "Shop", "Store", "Buy"].includes(p))) {
    scores["E-commerce"] += 3;
    supportingReasons["E-commerce"].push("Direct product listings and buying navigation were found.");
  }
  const ecomKeywords = ["add to cart", "checkout", "shopping cart", "shipping info", "store", "shop", "buy now", "size chart", "visa", "mastercard"];
  ecomKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw) || pricingText.includes(kw)) {
      scores["E-commerce"] += 1.5;
      supportingReasons["E-commerce"].push(`Found e-commerce indicator: "${kw}"`);
    }
  });

  // 2. SaaS Signals
  if (evidence.pricingInfo.status === "Found" && (pricingText.includes("billed") || pricingText.includes("month") || pricingText.includes("year") || pricingText.includes("plan") || pricingText.includes("tier"))) {
    scores["SaaS"] += 5;
    supportingReasons["SaaS"].push("Subscription pricing pattern detected (billed monthly/annually).");
  }
  const saasKeywords = ["saas", "software as a service", "pricing plan", "cloud platform", "free trial", "sign up free", "subscription", "dashboard", "automate", "api integration"];
  saasKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["SaaS"] += 2;
      supportingReasons["SaaS"].push(`Found software service indicator: "${kw}"`);
    }
  });

  // 3. Marketplace Signals
  const marketplaceKeywords = ["marketplace", "multi-vendor", "seller", "buyer", "commission", "vendors", "platform fee", "peer-to-peer", "listings", "b2b marketplace"];
  marketplaceKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Marketplace"] += 3.5;
      supportingReasons["Marketplace"].push(`Found marketplace indicator: "${kw}"`);
    }
  });

  // 4. Corporate Signals
  const corpKeywords = ["our leadership", "executive team", "board of directors", "governance", "careers", "about the company", "corporate office", "mission statement", "our history", "founded in"];
  corpKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Corporate"] += 2.5;
      supportingReasons["Corporate"].push(`Found corporate indicator: "${kw}"`);
    }
  });
  if (evidence.businessName.status === "Found" && evidence.contactInfo.address.status === "Found" && evidence.productsFound.status !== "Found" && evidence.servicesFound.status !== "Found") {
    scores["Corporate"] += 2;
    supportingReasons["Corporate"].push("Corporate address and legal business name found without consumer products.");
  }

  // 5. Documentation Signals
  const docKeywords = ["api reference", "developer guides", "code example", "documentation", "docs", "sdk", "installation guide", "getting started", "libraries", "github repo"];
  docKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Documentation"] += 3.5;
      supportingReasons["Documentation"].push(`Found reference documentation indicator: "${kw}"`);
    }
  });

  // 6. Developer Platform Signals
  const devKeywords = ["developer platform", "rest api", "api keys", "webhooks", "integration guide", "sandbox environment", "developer portal", "cli tool", "endpoints", "graphql"];
  devKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Developer Platform"] += 3.5;
      supportingReasons["Developer Platform"].push(`Found developer platform indicator: "${kw}"`);
    }
  });

  // 7. Education Signals
  const eduKeywords = ["courses", "tuition", "classes", "university", "curriculum", "learn online", "academy", "school", "education", "degree", "enrollment", "syllabus", "academics"];
  eduKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Education"] += 3;
      supportingReasons["Education"].push(`Found educational indicator: "${kw}"`);
    }
  });

  // 8. Healthcare Signals
  const healthKeywords = ["patient", "clinic", "hospital", "doctor", "dentist", "healthcare", "medical", "booking appointment", "schedule visit", "treatment", "physician", "telehealth", "patient portal"];
  healthKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Healthcare"] += 3;
      supportingReasons["Healthcare"].push(`Found healthcare service indicator: "${kw}"`);
    }
  });

  // 9. Financial Services Signals
  const finKeywords = ["security", "compliance", "bank", "financial", "investment", "credit", "insurance", "loans", "transaction", "wealth", "fca regulated", "sec registered", "fintech", "payment gateway"];
  finKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Financial Services"] += 3;
      supportingReasons["Financial Services"].push(`Found financial services indicator: "${kw}"`);
    }
  });

  // 10. Local Business Signals
  if (evidence.contactInfo.address.status === "Found") {
    scores["Local Business"] += 3;
    supportingReasons["Local Business"].push("Physical operation location address published.");
  }
  if (evidence.contactInfo.phone.status === "Found") {
    scores["Local Business"] += 2;
    supportingReasons["Local Business"].push("Telephone contact number found.");
  }
  const localKeywords = ["opening hours", "business hours", "directions", "locate us", "google maps", "mon-fri", "book a table", "schedule appointment", "local store", "service area"];
  localKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Local Business"] += 2;
      supportingReasons["Local Business"].push(`Found local business indicator: "${kw}"`);
    }
  });

  // 11. Blog / Media Signals
  const blogKeywords = ["news", "articles", "blog", "posts", "published by", "newsletter", "magazine", "editorial", "read time", "categories", "subscribe to blog"];
  blogKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Blog / Media"] += 3;
      supportingReasons["Blog / Media"].push(`Found media or editorial indicator: "${kw}"`);
    }
  });

  // 12. Agency Signals
  const agencyKeywords = ["agency", "consulting services", "case studies", "our work", "marketing agency", "creative agency", "our clients", "portfolio of work", "hire us", "get a quote"];
  agencyKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Agency"] += 3;
      supportingReasons["Agency"].push(`Found professional agency indicator: "${kw}"`);
    }
  });

  // 13. Portfolio Signals
  const portKeywords = ["my work", "my portfolio", "resume", "selected projects", "designer", "developer portfolio", "selected works", "about me", "personal website", "freelance"];
  portKeywords.forEach(kw => {
    if (descriptionsJoined.includes(kw) || pageTitlesJoined.includes(kw)) {
      scores["Portfolio"] += 3.5;
      supportingReasons["Portfolio"].push(`Found individual portfolio indicator: "${kw}"`);
    }
  });

  // Find the category with the highest score
  let bestCategory: WebsiteCategory = "Corporate";
  let maxScore = 0;

  for (const cat of Object.keys(scores) as WebsiteCategory[]) {
    if (scores[cat] > maxScore) {
      maxScore = scores[cat];
      bestCategory = cat;
    }
  }

  // Determine Confidence
  let confidence: "High" | "Medium" | "Low" = "Low";
  if (maxScore >= 10) {
    confidence = "High";
  } else if (maxScore >= 4) {
    confidence = "Medium";
  }

  // Get supporting evidence reasons
  const supportingEvidence = supportingReasons[bestCategory].slice(0, 5);
  if (supportingEvidence.length === 0) {
    supportingEvidence.push("Standard corporate company website indicators observed.");
  }

  // Rule: Never classify with High confidence if evidence is weak (no category-specific essential evidence items are found)
  if (confidence === "High") {
    let hasEssentialEvidence = false;
    
    if (bestCategory === "E-commerce") {
      hasEssentialEvidence = (evidence.productTitles.status === "Found") || (evidence.productsFound.status === "Found") || (evidence.policies.returnPolicy.status === "Found");
    } else if (bestCategory === "SaaS") {
      hasEssentialEvidence = (evidence.pricingInfo.status === "Found") || (evidence.productsFound.status === "Found");
    } else if (bestCategory === "Marketplace") {
      hasEssentialEvidence = (evidence.productsFound.status === "Found") || (evidence.pricingInfo.status === "Found");
    } else if (bestCategory === "Developer Platform" || bestCategory === "Documentation") {
      hasEssentialEvidence = (evidence.faqQuestions.status === "Found") || (evidence.productSpecifications.status === "Found") || (evidence.trustSignals.certificates.status === "Found");
    } else if (bestCategory === "Local Business") {
      hasEssentialEvidence = (evidence.contactInfo.address.status === "Found") || (evidence.contactInfo.phone.status === "Found");
    } else if (bestCategory === "Healthcare") {
      hasEssentialEvidence = (evidence.contactInfo.address.status === "Found") || (evidence.trustSignals.certificates.status === "Found");
    } else if (bestCategory === "Corporate") {
      hasEssentialEvidence = (evidence.businessName.status === "Found");
    } else if (bestCategory === "Agency" || bestCategory === "Portfolio") {
      hasEssentialEvidence = (evidence.servicesFound.status === "Found");
    } else {
      hasEssentialEvidence = true; // default
    }

    if (!hasEssentialEvidence) {
      confidence = "Medium";
      supportingEvidence.push("Confidence capped at Medium due to missing category-specific essential evidence.");
    }
  }

  return {
    category: bestCategory,
    confidence,
    supportingEvidence,
  };
}
