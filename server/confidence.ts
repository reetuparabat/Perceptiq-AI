/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EvidenceModel, CategoryConfidence, ConfidenceResponse } from "./types";

// ============================================================================
// SPRINT 5 DETERMINISTIC CONFIDENCE ENGINE
// Why this exists:
// Confidence is not a rating of how "good" a website is. It is a measurement
// of "how reliable and complete is our calculated score?"
// High quality, diverse evidence results in High Confidence. Low coverage or
// crawler blocks result in Low Confidence.
// ============================================================================

/**
 * Constant weight mappings for overall confidence calculation.
 * Decided to keep these values structured and transparently documented.
 */
const WEIGHT_EVIDENCE_COVERAGE = 0.35; // How many evidence items are verified
const WEIGHT_EVIDENCE_DIVERSITY = 0.30; // Number of unique successful strategic page roles
const WEIGHT_COMPLETENESS = 0.20;       // Category completeness (Known vs Unknown status)
const WEIGHT_VALIDATION_QUALITY = 0.15;   // Successful page loading stability

/**
 * Maps a numeric confidence score (0-100) to a user-facing Confidence Level.
 * 85-100: High
 * 60-84: Medium
 * 0-59: Low
 */
export function mapScoreToLevel(score: number): "High" | "Medium" | "Low" {
  if (score >= 85) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

/**
 * Deterministic Evidence Confidence Engine.
 * Analyzes the compiled evidence model to produce the Sprint 5 confidence report.
 */
export function calculateConfidence(evidence: EvidenceModel): ConfidenceResponse {
  // --------------------------------------------------------------------------
  // 1. EVIDENCE COVERAGE CALCULATION
  // Counts how many of the 19 core attributes in the Evidence Model are verified
  // (either "Found" or "Not Found") vs "Unknown" (unverified).
  // --------------------------------------------------------------------------
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
  const unknownRatio = 100 - evidenceCoverage;

  // --------------------------------------------------------------------------
  // 2. EVIDENCE DIVERSITY CALCULATION
  // Measures strategic page roles successfully crawled ("Homepage", "About", "Products", "FAQ", "Contact").
  // --------------------------------------------------------------------------
  const strategicRoles = ["Homepage", "About", "Products", "FAQ", "Contact"];
  const successfulRoles = new Set(
    evidence.pagesCrawled
      .filter((p) => p.status === "Success")
      .map((p) => p.role)
  );

  const activeSuccessfulRoles = strategicRoles.filter((role) => successfulRoles.has(role as any));
  const evidenceDiversity = Math.round((activeSuccessfulRoles.length / strategicRoles.length) * 100);

  // --------------------------------------------------------------------------
  // 3. EVIDENCE COMPLETENESS CALCULATION
  // Evaluates how many of the 4 key categories contain verified ("Known") info.
  // --------------------------------------------------------------------------
  let knownCategoriesCount = 0;
  
  const isProductsKnown = !(evidence.productsFound.status === "Unknown" && evidence.productTitles.status === "Unknown");
  if (isProductsKnown) knownCategoriesCount++;

  const isTrustKnown = !(evidence.policies.returnPolicy.status === "Unknown" && evidence.policies.warranty.status === "Unknown");
  if (isTrustKnown) knownCategoriesCount++;

  const isAccessibilityKnown = !(evidence.faqQuestions.status === "Unknown" && evidence.businessDescriptions.status === "Unknown");
  if (isAccessibilityKnown) knownCategoriesCount++;

  const isSupportKnown = !(evidence.contactInfo.email.status === "Unknown" && evidence.contactInfo.phone.status === "Unknown");
  if (isSupportKnown) knownCategoriesCount++;

  const completenessScore = Math.round((knownCategoriesCount / 4) * 100);

  // --------------------------------------------------------------------------
  // 4. VALIDATION QUALITY CALCULATION
  // Analyzes structural crawling results. Deducts confidence for crawl failures
  // or network warnings to signal lower evidence authenticity.
  // --------------------------------------------------------------------------
  let validationQualityScore = 100;
  const failedCrawls = evidence.pagesCrawled.filter((p) => p.status === "Failed");
  
  // Deduct 15 points per failed page crawl
  validationQualityScore -= failedCrawls.length * 15;
  if (validationQualityScore < 0) validationQualityScore = 0;

  let validationStatus: "Optimal" | "Warning" | "Critical" = "Optimal";
  let validationReason = "All strategic pages were parsed successfully with zero network warnings.";

  if (failedCrawls.length > 0) {
    validationStatus = "Warning";
    validationReason = `Crawl incomplete. ${failedCrawls.length} of ${evidence.pagesCrawled.length} requested pages failed to parse.`;
  }
  if (evidence.pagesCrawled.filter((p) => p.status === "Success").length <= 1) {
    validationStatus = "Critical";
    validationReason = "Critical crawl failure. Only the homepage or a single directory was successfully scanned.";
  }

  // --------------------------------------------------------------------------
  // 5. COMBINE TO COMPUTE OVERALL CONFIDENCE SCORE
  // --------------------------------------------------------------------------
  const overallScoreRaw =
    evidenceCoverage * WEIGHT_EVIDENCE_COVERAGE +
    evidenceDiversity * WEIGHT_EVIDENCE_DIVERSITY +
    completenessScore * WEIGHT_COMPLETENESS +
    validationQualityScore * WEIGHT_VALIDATION_QUALITY;

  const confidenceScore = Math.min(100, Math.max(0, Math.round(overallScoreRaw)));
  const confidenceLevel = mapScoreToLevel(confidenceScore);

  // Compile overall explanatory reason based on mathematical findings (No AI)
  let confidenceReason = "";
  if (confidenceLevel === "High") {
    confidenceReason = `High Confidence (${confidenceScore}%): Robust data collection spanning ${activeSuccessfulRoles.length} strategic pages. Zero or minimal failed crawl operations. Most business dimensions are fully verified.`;
  } else if (confidenceLevel === "Medium") {
    confidenceReason = `Medium Confidence (${confidenceScore}%): Partial information verified. Only ${activeSuccessfulRoles.length} of ${strategicRoles.length} strategic pages were accessible. Some business sections returned unverified (Unknown) status.`;
  } else {
    confidenceReason = `Low Confidence (${confidenceScore}%): Restricted information scope. Strategic page categories were unverified or failed to load. The crawler found only ${activeSuccessfulRoles.length} valid page directories.`;
  }

  // --------------------------------------------------------------------------
  // 6. CATEGORY CONFIDENCE COMPUTATION
  // --------------------------------------------------------------------------
  
  // A. Product Details Ingestion Confidence
  let prodScore = 0;
  let prodReason = "";
  if (isProductsKnown) {
    let prodFields = 0;
    if (evidence.productTitles.status !== "Unknown") prodFields++;
    if (evidence.productSpecifications.status !== "Unknown") prodFields++;
    if (evidence.productsFound.status !== "Unknown") prodFields++;
    if (evidence.imagesCount.status !== "Unknown") prodFields++;

    const baseProd = (prodFields / 4) * 70;
    const prodPageSuccess = evidence.pagesCrawled.some((p) => p.role === "Products" && p.status === "Success");
    prodScore = Math.round(baseProd + (prodPageSuccess ? 30 : 10));
    prodReason = prodPageSuccess
      ? "Reliable product evidence collected directly from active product/catalog directories."
      : "Product attributes inferred from global page content; direct products index was unreachable.";
  } else {
    prodScore = 0;
    prodReason = "No product details could be parsed or verified.";
  }
  const productInformation: CategoryConfidence = {
    category: "Product Details Ingestion",
    score: prodScore,
    level: mapScoreToLevel(prodScore),
    reason: prodReason,
  };

  // B. Business Trustworthiness Confidence
  let trustScore = 0;
  let trustReason = "";
  if (isTrustKnown) {
    let trustFields = 0;
    if (evidence.contactInfo.address.status !== "Unknown") trustFields++;
    if (evidence.businessName.status !== "Unknown") trustFields++;
    if (evidence.policies.returnPolicy.status !== "Unknown") trustFields++;
    if (evidence.policies.warranty.status !== "Unknown") trustFields++;
    if (evidence.trustSignals.certificates.status !== "Unknown") trustFields++;

    const baseTrust = (trustFields / 5) * 70;
    const aboutPageSuccess = evidence.pagesCrawled.some((p) => p.role === "About" && p.status === "Success");
    trustScore = Math.round(baseTrust + (aboutPageSuccess ? 30 : 15));
    trustReason = aboutPageSuccess
      ? "Robust organization details compiled from verifiable business background and policy directories."
      : "Operational trust factors gathered from homepage templates without separate legal background files.";
  } else {
    trustScore = 0;
    trustReason = "No standard legal directories or return terms were discoverable.";
  }
  const businessTrust: CategoryConfidence = {
    category: "Business Trustworthiness",
    score: trustScore,
    level: mapScoreToLevel(trustScore),
    reason: trustReason,
  };

  // C. AI Understanding Confidence
  let accessScore = 0;
  let accessReason = "";
  if (isAccessibilityKnown) {
    let accessFields = 0;
    if (evidence.faqQuestions.status !== "Unknown") accessFields++;
    if (evidence.businessDescriptions.status !== "Unknown") accessFields++;
    if (evidence.productSpecifications.status !== "Unknown") accessFields++;
    if (evidence.pageTitles.status !== "Unknown") accessFields++;

    const baseAccess = (accessFields / 4) * 70;
    const faqPageSuccess = evidence.pagesCrawled.some((p) => p.role === "FAQ" && p.status === "Success");
    accessScore = Math.round(baseAccess + (faqPageSuccess ? 30 : 15));
    accessReason = faqPageSuccess
      ? "Comprehensive conversational FAQ databases verified in a dedicated, high-readability layout."
      : "Content readability analyzed from general body paragraphs without a dedicated FAQ section.";
  } else {
    accessScore = 0;
    accessReason = "Accessibility parameters and layout indicators are completely unverified.";
  }
  const aiAccessibility: CategoryConfidence = {
    category: "AI Understanding",
    score: accessScore,
    level: mapScoreToLevel(accessScore),
    reason: accessReason,
  };

  // D. Direct Inquiries Route Confidence
  let supportScore = 0;
  let supportReason = "";
  if (isSupportKnown) {
    let supportFields = 0;
    if (evidence.contactInfo.email.status !== "Unknown") supportFields++;
    if (evidence.contactInfo.phone.status !== "Unknown") supportFields++;

    const baseSupport = (supportFields / 2) * 70;
    const contactPageSuccess = evidence.pagesCrawled.some((p) => p.role === "Contact" && p.status === "Success");
    supportScore = Math.round(baseSupport + (contactPageSuccess ? 30 : 10));
    supportReason = contactPageSuccess
      ? "Verified customer contact routes extracted from a dedicated, active help directory."
      : "Support methods parsed from generic headers/footers without finding a standalone contact page.";
  } else {
    supportScore = 0;
    supportReason = "No active support emails or corporate contact lines were identified.";
  }
  const customerSupport: CategoryConfidence = {
    category: "Direct Inquiries Route",
    score: supportScore,
    level: mapScoreToLevel(supportScore),
    reason: supportReason,
  };

  return {
    overallConfidence: confidenceLevel,
    confidenceScore,
    confidenceLevel,
    confidenceReason,
    evidenceCoverage,
    evidenceDiversity,
    unknownRatio,
    validationStatus,
    validationReason,
    categories: {
      productInformation,
      businessTrust,
      aiAccessibility,
      customerSupport,
    },
  };
}
