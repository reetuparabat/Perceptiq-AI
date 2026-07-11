/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ImprovementPriority = "High" | "Medium" | "Low";

export type ImprovementCategory =
  | "Business Information"
  | "Website Structure"
  | "Products"
  | "Services"
  | "Trust"
  | "Recommendation"
  | "Content"
  | "Technical Signals";

export type ImprovementStatus = "Not Started" | "In Progress" | "Completed";

export interface ImprovementTask {
  id: string;
  title: string;
  priority: ImprovementPriority;
  category: ImprovementCategory;
  status: ImprovementStatus;
  
  // Business-Friendly Explanations (Feature 7)
  whatIsWrong: string;
  whyDoesAiCare: string;
  whatShouldIDo: string;
  whatBenefitMightISee: string;

  // Additional Metadata (Feature 1, 4, 5)
  whyItMatters: string;
  businessImpact: string;
  estimatedEffort: string; // e.g., "30 mins", "2 hours", "1 day"
  difficulty: "Easy" | "Medium" | "Hard";
  expectedAIBenefit: string; // "May improve AI...", "Likely to..."
  relatedEngine: string; // "Knowledge Map", "AI Brand Perception", "Trust & Authority", "Recommendation Intelligence"
  
  // Quick Win indicators (Feature 5)
  isQuickWin: boolean;
  quickWinReason?: string;

  // Detail Panel Fields (Feature 10)
  evidence: string;
  affectedEngines: string[]; // e.g., ["ChatGPT", "Gemini", "Claude", "Perplexity"]
  suggestedActions: string[]; // Specific step-by-step checklist items
}

export interface ImprovementProgressStats {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  highPriorityRemaining: number;
  overallCompletionPercentage: number;
  quickWinsCount: number;
  pendingTasks: number; // In Progress or Not Started
}

/**
 * Future Readiness Schemas (Feature 15)
 * Prepared structures for historical state tracking, benchmarking, and ongoing crawler integrations.
 */
export interface HistoricalComparisonState {
  reportId: string;
  scannedAt: string;
  completionPercentage: number;
  completedTaskIds: string[];
}

export interface CompetitorBenchmarkTaskState {
  competitorName: string;
  completionPercentage: number;
  completedCount: number;
  commonStrengths: string[];
}

export interface ContinuousMonitoringFeed {
  lastCheckedAt: string;
  autoResolvedTaskIds: string[];
  newlyDiscoveredIssuesCount: number;
}

export interface TimelineMilestone {
  date: string;
  completedImprovementsCount: number;
  completedImprovementsList: string[];
  aiReadiness: number;
  recommendationReadiness: number;
  trustProfile: number;
  summary: string;
  isCurrent?: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ProgressDashboardMetrics {
  currentReadiness: number;
  previousReadiness: number;
  overallImprovement: number;
  trustImprovement: number;
  recommendationImprovement: number;
  mostImprovedArea: string;
  needsAttention: string;
}
