/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AIAssumptionItem {
  assumption: string;
  whyAIThinksThis: string;
  confidence: "High" | "Medium" | "Low";
  supportingEvidence: string;
  isStrong: boolean;
}

export interface AIQuestionItem {
  question: string;
  whyAsking: string;
  improvementOutcome: string;
  priority: "High" | "Medium" | "Low";
}

export interface AIMemoryItem {
  item: string;
  whyAIRemembersIt: string;
  evidenceSource: string;
  confidence: "High" | "Medium" | "Low";
}

export interface BIPersonalityTrait {
  trait: string;
  reason: string;
  evidence: string;
  confidence: "High" | "Medium" | "Low";
}

export interface AIMisunderstandingRisk {
  misunderstanding: string;
  reason: string;
  evidence: string;
  businessImpact: string;
  recommendation: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}

export interface AIReasoningTimelineStep {
  stepId: string;
  title: string;
  explanation: string;
  isCompleted: boolean;
}

export interface AIReasoningAreaConfidence {
  area: "Business Identity" | "Products" | "Services" | "Audience" | "Pricing" | "Support" | "Locations" | "Policies";
  confidence: number; // 0 to 100
  level: "High" | "Medium" | "Low";
  reason: string;
  evidence: string;
  uncertainty: string;
}

export interface AIBusinessAdviceCard {
  observation: string;
  reason: string;
  businessImpact: string;
  suggestedImprovement: string;
  expectedBenefit: string;
}

export interface AIReasoningModel {
  assumptions: AIAssumptionItem[];
  questions: AIQuestionItem[];
  memorySnapshot: AIMemoryItem[];
  personalityTraits: BIPersonalityTrait[];
  personalityStatus: {
    hasEnoughInfo: boolean;
    explanation: string;
  };
  misunderstandingRisks: AIMisunderstandingRisk[];
  timelineSteps: AIReasoningTimelineStep[];
  areaConfidences: AIReasoningAreaConfidence[];
  adviceCards: AIBusinessAdviceCard[];
}
