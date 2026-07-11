/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ValidationStatus = "Verified" | "Partially Verified" | "Not Yet Verified" | "Unable to Verify";

export type EffectivenessCategory = "Highly Effective" | "Moderately Effective" | "Limited Evidence" | "Not Yet Effective";

export interface EvidenceComparisonState {
  before: string;
  after: string;
  whatChanged: string;
  potentialAiImpact: string;
}

export interface EvidenceExplorerDetail {
  whereFound: string;
  sourcePage: string;
  matchedInformation: string;
  confidence: number; // 0 - 100
  lastDetected: string;
  missingExplanation?: string;
}

export interface ValidationItem {
  taskId: string;
  taskTitle: string;
  category: string;
  status: ValidationStatus;
  whatAiFound: string;
  whyAssigned: string;
  supportingEvidence: string;
  comparison: EvidenceComparisonState;
  explorer: EvidenceExplorerDetail;
  effectiveness: {
    rating: EffectivenessCategory;
    why: string;
    businessImpact: string;
    suggestedNextStep: string;
  };
}

export interface ValidationTimelineEvent {
  id: string;
  month: string;
  title: string;
  description: string;
  impactSummary: string;
}

export interface ValidationDashboardMetrics {
  totalRecommendations: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  notYetVerifiedCount: number;
  unableToVerifyCount: number;
  overallValidationPercentage: number;
}
