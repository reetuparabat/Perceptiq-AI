/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RecommendationReadinessLevel = "Excellent" | "Strong" | "Good" | "Average" | "Needs Improvement" | "Poor";

export interface RecommendationSignal {
  name: string;
  status: "Met" | "Partial" | "Unmet";
  whyItMatters: string;
  supportingEvidence: string;
  impact: "High" | "Medium" | "Low";
}

export interface MissingRecommendationSignal {
  problem: string;
  whyNeeded: string;
  businessImpact: string;
  recommendation: string;
  expectedImprovement: string;
}

export interface RecommendationJourneyStep {
  stepNumber: number;
  stepName: string;
  whatIsAIDoing: string;
  status: "completed" | "active" | "pending";
}

export interface RecommendationScenario {
  scenarioName: string;
  likelihood: "High" | "Medium" | "Low" | "Unlikely";
  reason: string;
  supportingEvidence: string;
  weaknesses: string;
  suggestedImprovements: string;
}

export interface PromptCategory {
  categoryName: string;
  preparedness: "Fully Prepared" | "Partially Prepared" | "Unprepared";
  whatAIKnows: string;
  whatAINeeds: string;
}

export interface CompetitiveFactor {
  factorName: string;
  comparisonDescription: string; // why another business might be recommended first
  typicalCompetitorSignal: string; // description of the "Typical business with stronger signal"
  remedyAction: string; // how to resolve this factor gap
}

export interface RecommendationOpportunity {
  priority: "High" | "Medium" | "Low";
  opportunityName: string;
  why: string;
  businessImpact: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedImprovement: "High" | "Medium" | "Low";
}

export interface RecommendationConfidence {
  confidenceLevel: "High" | "Medium" | "Low";
  reason: string;
  evidence: string;
  possibleUncertainty: string;
}

export interface RecommendationSummary {
  likelyRecommendations: string;
  unlikelyRecommendations: string;
  strongestSignals: string[];
  biggestOpportunity: string;
  consultantOverview: string;
}

export interface AIRecommendationModel {
  readinessLevel: RecommendationReadinessLevel;
  whyLikelyOrUnlikely: string;
  signals: RecommendationSignal[];
  missingSignals: MissingRecommendationSignal[];
  journeySteps: RecommendationJourneyStep[];
  scenarios: RecommendationScenario[];
  promptCategories: PromptCategory[];
  competitiveFactors: CompetitiveFactor[];
  opportunities: RecommendationOpportunity[];
  confidence: RecommendationConfidence;
  summary: RecommendationSummary;
}
