/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CompetitivePosition = "Better" | "Similar" | "Needs Improvement";
export type PerformanceClassification = "Leading" | "Strong" | "Average" | "Developing";

export interface EvidenceDetail {
  found: boolean;
  evidenceText: string;
  sourcePage: string;
  matchedInfo: string;
  confidence: number; // 0 to 100
}

export interface MetricComparison {
  metricKey: string;
  metricName: string;
  description: string;
  userScore: number;
  userStatus: CompetitivePosition; // General status of the user's business
  competitorComparisons: Record<string, {
    score: number;
    status: CompetitivePosition; // How user compares to this competitor: "Better" | "Similar" | "Needs Improvement"
    evidence: EvidenceDetail;
  }>;
}

export interface CompetitiveStrength {
  id: string;
  title: string;
  whyItMatters: string;
  evidence: EvidenceDetail;
}

export interface CompetitiveOpportunity {
  id: string;
  title: string;
  whyItMatters: string;
  competitorEvidence: Record<string, EvidenceDetail>;
  userEvidence: EvidenceDetail;
}

export interface CompetitiveGapItem {
  area: string;
  competitorLeadReason: string;
  userLeadReason: string;
  remediationStep: string;
}

export interface BenchmarkClassification {
  classification: PerformanceClassification;
  label: string;
  minScore: number;
  description: string;
  reasoning: string;
}

export interface CompetitiveAnalysis {
  companyName: string;
  overallSummary: string;
  competitivePosition: PerformanceClassification;
  strongestArea: string;
  weakestArea: string;
  biggestOpportunity: string;
  executiveSummaryText: string;
  comparisons: MetricComparison[];
  strengths: CompetitiveStrength[];
  opportunities: CompetitiveOpportunity[];
  gaps: CompetitiveGapItem[];
  benchmarks: BenchmarkClassification[];
}
