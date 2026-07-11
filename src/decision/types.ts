/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DecisionConfidenceLevel = "Very High" | "High" | "Moderate" | "Limited";

export interface DecisionStoryNode {
  step: string;
  status: "success" | "warning" | "error" | "neutral";
  message: string;
  connectedModule: string;
}

export interface RootCauseNode {
  issue: string;
  consequence: string;
  reason: string;
  rootSource: string; // e.g., "Business Information Layer"
}

export interface ImpactChainStep {
  module: string;
  impactDescription: string;
  lift: string; // e.g., "+15% Trust"
}

export interface ImpactChainModel {
  triggerImprovement: string;
  steps: ImpactChainStep[];
}

export interface PriorityActionItem {
  id: string;
  title: string;
  group: "Do Immediately" | "Do This Month" | "Long-Term Improvements";
  currentIssue: string;
  reason: string;
  expectedBenefit: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedEffort: string; // e.g., "1-2 hours", "1 day"
  priority: "High" | "Medium" | "Low";
}

export interface SimulationResult {
  knowledgeLift: number;
  perceptionLift: number;
  reasoningLift: number;
  recommendationLift: number;
  trustLift: number;
  overallLift: number;
}

export interface DecisionTraceNode {
  id: string;
  label: string; // e.g., "Recommendation Level", "Reasoning Level", etc.
  title: string;
  description: string;
  evidenceSource?: string;
  status: "Verified" | "Incomplete" | "Missing";
  children?: DecisionTraceNode[];
}

export interface CrossModuleInsight {
  id: string;
  knowledgeNode: string;
  perceptionNode: string;
  reasoningNode: string;
  recommendationNode: string;
  trustNode: string;
  visualSummary: string;
}

export interface ModuleHealth {
  moduleName: string;
  status: "Optimal" | "Warning" | "Critical";
  score: number;
  biggestStrength: string;
  biggestWeakness: string;
  highestPriorityImprovement: string;
}

export interface AIDecisionModel {
  confidence: DecisionConfidenceLevel;
  confidenceReason: string;
  decisionStory: DecisionStoryNode[];
  rootCauses: RootCauseNode[];
  impactChains: ImpactChainModel[];
  priorityActions: PriorityActionItem[];
  traces: DecisionTraceNode[];
  crossModuleInsights: CrossModuleInsight[];
  healthOverview: ModuleHealth[];
  executiveReport: {
    currentStatus: string;
    strengths: string[];
    risks: string[];
    priorityActions: string[];
    expectedImprovements: string;
    quickWins: string[];
    longTermStrategy: string[];
  };
}
