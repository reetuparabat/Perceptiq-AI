/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrustProfileLevel = 
  | "Very High Trust" 
  | "High Trust" 
  | "Moderate Trust" 
  | "Developing Trust" 
  | "Low Public Trust";

export interface VerifiedFact {
  factName: string;
  isVerified: boolean;
  status: "Verified" | "Not Yet Verified" | "Not enough public evidence";
  evidenceSource: string;
  confidence: "High" | "Medium" | "Low";
  reason: string;
}

export interface AuthoritySignal {
  signalName: string;
  status: "Strong" | "Moderate" | "Weak" | "Missing";
  whyItMatters: string;
  evidence: string;
}

export interface TrustGap {
  gapName: string;
  whyExpected: string;
  businessImpact: string;
  howToImprove: string;
  expectedImprovement: string;
}

export interface ClaimVerificationItem {
  claimText: string;
  classification: "Verified" | "Partially Supported" | "Not Supported" | "Not Enough Public Evidence";
  evidenceFound: string;
  explanation: string;
}

export interface TrustJourneyStep {
  stepNumber: number;
  stepName: string;
  status: "completed" | "active" | "pending";
  whatHappened: string;
}

export interface TrustConfidenceArea {
  areaName: string;
  confidenceLevel: "High" | "Medium" | "Low";
  reason: string;
  evidence: string;
  uncertainty: string;
}

export interface EvidenceCoverageCategory {
  categoryName: string;
  coverageLabel: "Excellent" | "Good" | "Average" | "Needs Improvement";
  reason: string;
}

export interface TrustRisk {
  riskName: string;
  reason: string;
  businessImpact: string;
  suggestedImprovement: string;
  priority: "High" | "Medium" | "Low";
}

export interface TrustConsultantAdvisory {
  observation: string;
  reason: string;
  businessImpact: string;
  suggestedImprovement: string;
  expectedBenefit: string;
}

export interface TrustSummary {
  executiveSummaryText: string;
  coreStrengths: string[];
  biggestOpportunity: string;
}

export interface AITrustModel {
  trustProfile: TrustProfileLevel;
  profileReason: string;
  verifiedFacts: VerifiedFact[];
  authoritySignals: AuthoritySignal[];
  trustGaps: TrustGap[];
  claims: ClaimVerificationItem[];
  journeySteps: TrustJourneyStep[];
  confidenceAreas: TrustConfidenceArea[];
  evidenceCoverage: EvidenceCoverageCategory[];
  risks: TrustRisk[];
  advisory: TrustConsultantAdvisory[];
  summary: TrustSummary;
}
