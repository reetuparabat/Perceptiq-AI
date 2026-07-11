/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IdentityCompletenessStatus =
  | "Complete"
  | "Mostly Complete"
  | "Partially Understood"
  | "Needs More Information"
  | "Missing";

export interface IdentityCompletenessItem {
  category: string;
  status: IdentityCompletenessStatus;
  explanation: string;
}

export interface UnderstandingConfidenceItem {
  area: string;
  confidence: number; // percentage (0 - 100)
  explanation: string;
}

export interface BusinessStory {
  whoIs: string;
  whatOffers: string;
  whoHelps: string;
  howWorks: string;
  whyChooses: string;
}

export interface UnderstandingGapItem {
  gap: string;
  isMissing: boolean;
  explanation: string;
  whyThisMatters: string;
  howToImprove: string;
  expectedImprovement: string;
}

export type AmbiguityLevel =
  | "No Ambiguity"
  | "Low Ambiguity"
  | "Medium Ambiguity"
  | "High Ambiguity";

export interface AmbiguityDetection {
  level: AmbiguityLevel;
  score: number; // 0 to 100 where higher means more ambiguity
  explanations: string[];
}

export interface PerceptionStrength {
  area: string;
  description: string;
  why: string;
}

export interface PerceptionWeakness {
  area: string;
  description: string;
  why: string;
  recommendation: string;
}

export interface TimelineStep {
  step: string;
  label: string;
  status: "Understood" | "Partial" | "Missing";
  desc: string;
}

export type RecommendationReadinessRating =
  | "Excellent"
  | "Good"
  | "Average"
  | "Needs Improvement";

export interface RecommendationReadiness {
  rating: RecommendationReadinessRating;
  score: number; // 0 to 100
  explanation: string;
}

export interface PerceptionModel {
  aiSummary: string;
  identityCompleteness: IdentityCompletenessItem[];
  understandingConfidence: UnderstandingConfidenceItem[];
  businessStory: BusinessStory;
  understandingGaps: UnderstandingGapItem[];
  ambiguityDetection: AmbiguityDetection;
  strengths: PerceptionStrength[];
  weaknesses: PerceptionWeakness[];
  timeline: TimelineStep[];
  recommendationReadiness: RecommendationReadiness;
}
