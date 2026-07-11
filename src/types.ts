/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EvidenceItem<T> {
  value: T | null;
  sourcePage: string; // e.g., "Homepage", "About", "Products", "FAQ", "Contact", "Multiple Pages", or "Not Applicable"
  status: "Found" | "Not Found" | "Unknown" | "Restricted";
}

export interface EvidenceModel {
  businessName: EvidenceItem<string>;
  contactInfo: {
    phone: EvidenceItem<string>;
    email: EvidenceItem<string>;
    address: EvidenceItem<string>;
  };
  productsFound: EvidenceItem<string[]>;
  servicesFound: EvidenceItem<string[]>;
  productTitles: EvidenceItem<string[]>;
  productSpecifications: EvidenceItem<string[]>;
  faqQuestions: EvidenceItem<string[]>;
  policies: {
    shippingInfo: EvidenceItem<string>;
    returnPolicy: EvidenceItem<string>;
    warranty: EvidenceItem<string>;
  };
  trustSignals: {
    certificates: EvidenceItem<string[]>;
  };
  businessDescriptions: EvidenceItem<string[]>;
  pricingInfo: EvidenceItem<string>;
  imagesCount: EvidenceItem<number>;
  pageTitles: EvidenceItem<Record<string, string>>;
  metaDescriptions: EvidenceItem<Record<string, string>>;
  detectedLanguages: EvidenceItem<string[]>;
  pagesCrawled: {
    url: string;
    role: "Homepage" | "About" | "Products" | "FAQ" | "Contact";
    status: "Success" | "Failed" | "Unknown";
    error?: string;
  }[];
}

export interface ScoreBreakdown {
  contentQuality: number | string; // Quality of Conversational Context
  productCompleteness: number | string; // Completeness of Attribute Sheets
  structuredData: number | string; // Product Information Structure (Can AI Understand Your Products?)
  trustSignals: number | string; // Brand Verifiability & Trust Badges
  aiReadability: number | string; // AI Bot Readability
  authority: number | string; // Brand Authority & Mentions Volume
  technicalHealth: number | string; // Website Reliability & Accessibility
}

export interface PlatformMetrics {
  score: number | string;
  likelihood: string; // "High", "Medium", "Low", "Critical"
  strengths: string[]; // Business strengths
  weaknesses: string[]; // Business gaps
}

export interface VisibilityMetrics {
  chatgpt: PlatformMetrics;
  gemini: PlatformMetrics;
  claude: PlatformMetrics;
  perplexity: PlatformMetrics;
}

export interface ExplainabilityItem {
  hasGap: boolean;
  description: string;
  reasoning: string;
  businessImpact: string; // Why the business should care
  expectedImprovement: string; // Unlocked outcome
}

export interface Explainability {
  missingFaq: ExplainabilityItem;
  weakProductDescriptions: ExplainabilityItem;
  missingStructuredData: ExplainabilityItem;
  noTrustBadges: ExplainabilityItem;
  noCertifications: ExplainabilityItem;
  poorComparisonInfo: ExplainabilityItem;
  weakAuthority: ExplainabilityItem;
}

export interface Competitor {
  name: string;
  aiReadiness: number | string;
  trust: number | string;
  content: number | string;
  visibility: number | string;
  productInfo: number | string;
  recommendationProbability: number | string; // 0 to 100
  strategicGap: string; // Explains what opportunities exist
}

export interface Recommendation {
  id: string;
  priority: "High" | "Medium" | "Low";
  title: string;
  impact: string;
  description: string;
  category: string;
  businessValue: string; // Strategic dollar/market value
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface ExecutiveSummary {
  overallScore: number | string;
  topProblems: string[]; // Expressed as high-level risks
  quickWins: string[]; // Expressed as quick growth wins
  estimatedVisibility: number | string; // overall percentage
  recommendationProbability: number | string; // overall percentage
  nextSteps: string[];
  textSummary: string; // Fully written consulting overview
  strategicVerdict: string; // BCG/McKinsey-style summary
}

export interface CrawlStats {
  pagesCrawled: number;
  productCount: number;
  faqCount: number;
  blogsCount: number;
  reviewCount: number;
  metadataFound: boolean;
  schemaMarkupType: string[];
  imageCount: number;
}

export interface ExplanationPriorityImprovement {
  problem: string;
  supportingEvidence: string;
  businessImpact: string;
  suggestedAction: string;
  priority: "High" | "Medium" | "Low";
  expectedImprovement: string;
}

export interface ExplanationResponse {
  version: string;
  executiveSummary: string;
  keyStrengths: string[];
  priorityImprovements: ExplanationPriorityImprovement[];
  businessImpact: string;
  limitations: string;
  nextActions: string[];
  analysisBoundaries: string;
}

export interface AIReadinessReport {
  url: string;
  companyName: string;
  scannedAt: string;
  scanStatus?: "SUCCESS" | "LIMITED_PUBLIC_ACCESS" | "INVALID_DOMAIN" | "INSUFFICIENT_PUBLIC_EVIDENCE" | "SCAN_FAILED";
  overallScore: number | string | null;
  crawlStats: CrawlStats | null;
  scoreBreakdown: ScoreBreakdown | null;
  visibility: VisibilityMetrics | null;
  explainability: Explainability | null;
  competitors: Competitor[];
  recommendations: Recommendation[];
  executiveSummary: ExecutiveSummary | null;
  evidence?: EvidenceModel | null; // Sprint 3 Evidence
  evidenceCoverage?: number | null; // Sprint 4 Refinement Evidence Coverage metric
  confidence?: ConfidenceResponse | null; // Sprint 5 Confidence Engine output
  explanation?: ExplanationResponse | null; // Sprint 6 AI Business Explanation
  knowledgeIntelligence?: KnowledgeIntelligence | null; // Version 2 Sprint 1 Knowledge Intelligence
}

export interface KnowledgeSource {
  id: string;
  type: "page" | "structured_data" | "metadata" | "open_graph" | "twitter_card" | "canonical_url" | "sitemap" | "robots_txt" | "internal_links" | "external_references";
  name: string;
  url?: string;
  status: "available" | "missing" | "unverified";
  details: string;
}

export interface NormalizedEntity {
  id: string;
  type: "Organization" | "Product" | "Service" | "Location" | "Person" | "FAQ" | "Category" | "ContactInfo" | "SocialProfile";
  name: string;
  aliases: string[];
  properties: Record<string, any>;
  relationships: string[];
  source: string;
  confidence: number;
  evidence: string;
  lastFound: string;
  consistency: "Consistent" | "Inconsistent" | "Contradictory" | "High" | "Medium";
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: "Organization" | "Product" | "Service" | "Location" | "Person" | "FAQ" | "Category" | "ContactInfo" | "SocialProfile" | "Source";
  valency?: number;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface MissingKnowledgeItem {
  id: string;
  title: string;
  description: string;
  importance: "High" | "Medium" | "Low";
  impact: string;
}

export interface KnowledgeIntelligence {
  sources: KnowledgeSource[];
  entities: NormalizedEntity[];
  graph: KnowledgeGraph;
  missingKnowledge: MissingKnowledgeItem[];
}

export interface CategoryConfidence {
  category: string;
  score: number;
  level: "High" | "Medium" | "Low";
  reason: string;
}

export interface ConfidenceResponse {
  overallConfidence: "High" | "Medium" | "Low"; // Matches requested Overall Confidence
  confidenceScore: number;                      // Matches requested Confidence Score
  confidenceLevel: "High" | "Medium" | "Low";    // Matches requested Confidence Level
  confidenceReason: string;                     // Matches requested Confidence Reason
  evidenceCoverage: number;                     // Matches requested Evidence Coverage
  evidenceDiversity: number;                    // Matches requested Evidence Diversity
  unknownRatio: number;                         // Matches requested Unknown Ratio
  validationStatus: "Optimal" | "Warning" | "Critical"; // Matches requested Validation Status
  validationReason: string;
  categories: {
    productInformation: CategoryConfidence;
    businessTrust: CategoryConfidence;
    aiAccessibility: CategoryConfidence;
    customerSupport: CategoryConfidence;
  };
}

export interface HistoryItem {

  id: string;
  url: string;
  companyName: string;
  scannedAt: string;
  overallScore: number | string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  avatarUrl: string;
  createdAt: string;
  lastLogin: string;
  isVerified: boolean;
}

export interface AuthWorkspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}


