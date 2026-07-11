/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIReadinessReport } from "../types";
import { 
  ImprovementTask, 
  ImprovementPriority, 
  ImprovementCategory, 
  ImprovementStatus, 
  ImprovementProgressStats,
  HistoricalComparisonState,
  CompetitorBenchmarkTaskState,
  ContinuousMonitoringFeed
} from "./types";

/**
 * Service class for managing AI Improvement Center logic.
 * Keeps business logic decoupled from React views.
 */
export class ImprovementService {
  private static STORAGE_PREFIX = "perceptiq-improvement-status-";

  /**
   * Helper to retrieve persisted task statuses for a given website URL.
   */
  private static getStoredStatuses(url: string): Record<string, ImprovementStatus> {
    try {
      const key = `${this.STORAGE_PREFIX}${encodeURIComponent(url)}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (err) {
      console.error("Failed to read from localStorage:", err);
      return {};
    }
  }

  /**
   * Persist a task status in localStorage.
   */
  public static saveTaskStatus(url: string, taskId: string, status: ImprovementStatus): void {
    try {
      const key = `${this.STORAGE_PREFIX}${encodeURIComponent(url)}`;
      const current = this.getStoredStatuses(url);
      current[taskId] = status;
      localStorage.setItem(key, JSON.stringify(current));
    } catch (err) {
      console.error("Failed to write to localStorage:", err);
    }
  }

  /**
   * Clear all stored progress for a given website URL.
   */
  public static clearProgress(url: string): void {
    try {
      const key = `${this.STORAGE_PREFIX}${encodeURIComponent(url)}`;
      localStorage.removeItem(key);
    } catch (err) {
      console.error("Failed to clear localStorage:", err);
    }
  }

  /**
   * Generates and compiles a full set of customized Improvement Tasks based on
   * the active AIReadinessReport. This maps both report-generated recommendations
   * and static industry-standard checks to produce a highly cohesive, action-oriented audit.
   */
  public static compileTasks(report: AIReadinessReport): ImprovementTask[] {
    const url = report.url;
    const company = report.companyName;
    const storedStatuses = this.getStoredStatuses(url);
    const category = report.crawlStats ? (report.crawlStats.productCount > 0 ? "E-commerce" : "Corporate") : "Corporate";

    const tasks: ImprovementTask[] = [];

    // Helper to generate a task and apply local state status
    const createTask = (raw: Partial<ImprovementTask> & { id: string; title: string }): ImprovementTask => {
      const status = (storedStatuses[raw.id] || "Not Started") as ImprovementStatus;
      return {
        id: raw.id,
        title: raw.title,
        priority: raw.priority || "Medium",
        category: raw.category || "Business Information",
        status,
        whatIsWrong: raw.whatIsWrong || "This detail is not explicitly or consistently represented in a format that AI search systems can discover.",
        whyDoesAiCare: raw.whyDoesAiCare || "Conversational search assistants need absolute certainty when answering user questions. If they cannot resolve this detail, they may omit your business.",
        whatShouldIDo: raw.whatShouldIDo || "Add clear plain-text copy on your pages that explicitly answers this parameter.",
        whatBenefitMightISee: raw.whatBenefitMightISee || "Potential increase in recommendation confidence during direct comparison prompts.",
        whyItMatters: raw.whyItMatters || "Ensures conversational systems are fed structured, accurate details to represent your business properly.",
        businessImpact: raw.businessImpact || "Protects against conversational exclusion penalties on low-funnel purchase intent searches.",
        estimatedEffort: raw.estimatedEffort || "1 hour",
        difficulty: raw.difficulty || "Easy",
        expectedAIBenefit: raw.expectedAIBenefit || "May improve AI understanding of your capabilities.",
        relatedEngine: raw.relatedEngine || "AI Brand Perception",
        isQuickWin: raw.isQuickWin || false,
        quickWinReason: raw.quickWinReason || undefined,
        evidence: raw.evidence || "Not crawled on primary landing pages.",
        affectedEngines: raw.affectedEngines || ["ChatGPT", "Gemini", "Claude", "Perplexity"],
        suggestedActions: raw.suggestedActions || ["Identify the appropriate target page", "Write simple explanatory text", "Deploy to live site and verify index accessibility"]
      };
    };

    // 1. Map dynamic recommendations from report
    if (report.recommendations && report.recommendations.length > 0) {
      report.recommendations.forEach((rec, index) => {
        // Map category
        let mappedCat: ImprovementCategory = "Business Information";
        let engine = "AI Brand Perception";
        let win = false;
        let winReason = "";
        let effort = "1-2 hours";

        const recId = rec.id || `rec-dynamic-${index}`;
        const recCat = (rec.category || "").toLowerCase();

        if (recCat.includes("trust") || recCat.includes("policy")) {
          mappedCat = "Trust";
          engine = "Trust & Authority";
        } else if (recCat.includes("product") || recCat.includes("catalog") || recCat.includes("pricing")) {
          mappedCat = "Products";
          engine = "Recommendation Intelligence";
        } else if (recCat.includes("understanding") || recCat.includes("faq")) {
          mappedCat = "Content";
          engine = "AI Perception";
        } else if (recCat.includes("service")) {
          mappedCat = "Services";
          engine = "Knowledge Intelligence";
        }

        if (rec.difficulty === "Easy") {
          win = true;
          winReason = "Can be updated directly via HTML copy editing without complex backend restructuring.";
          effort = "30 mins";
        } else if (rec.difficulty === "Medium") {
          effort = "2-4 hours";
        } else {
          effort = "1-2 days";
        }

        // Generate custom detail mappings to follow Feature 7 and Feature 10
        let wrong = `Your website is missing clear representation for: ${rec.title}.`;
        let whyCare = `Large Language Models (LLMs) like ChatGPT and Claude rely on explicit textual signals. Without this, they score your website's trust or indexing capability lower.`;
        let action = `Publish a plain, accessible HTML block or paragraph on your website answering this need. Use literal, structured naming.`;
        let benefit = `Potential to lift your AI visibility index and protect against recommendation exclusion.`;

        if (recId.includes("policy")) {
          wrong = "There is no explicit refund, exchange, or return policy detectable in standard crawl paths.";
          whyCare = "E-commerce and shopping engines operate under strict safety guidelines. They will filter out store recommendations if there is no verifiable refund guarantee, to protect buyers.";
          action = "Write and publish a dedicated 'Refund & Returns Policy' page. Link to it clearly in your footer.";
          benefit = "May bypass strict shopping safety filters and qualify your catalog for active buyer recommendations.";
        } else if (recId.includes("faq")) {
          wrong = "Your landing pages do not present common user queries in a conversational accordion or Q&A format.";
          whyCare = "Conversational search systems match semantic queries directly to FAQ phrasing. Accordion formats are extremely high-yield sources for conversational answers.";
          action = "Add a standard FAQ section containing 5-8 common pre-purchase questions and concise, literal answers.";
          benefit = "May drastically improve direct matchmaking probability on conversational voice and text searches.";
        } else if (recId.includes("specs")) {
          wrong = "Product attributes like dimension, materials, and capabilities are presented in descriptive prose or images only.";
          whyCare = "Comparative search agents cannot parse image graphics or unstructured text accurately. They need standard specification sheets to verify product compatibility.";
          action = "Re-format your product detail pages to include structured, clean HTML specification tables.";
          benefit = "May improve comparative retrieval confidence and help your items match precise attribute filters.";
        } else if (recId.includes("pricing")) {
          wrong = "Your subscription tiers and pricing values are not clearly structured in text grids.";
          whyCare = "AI bots search for literal pricing numerals (e.g., '$29/mo') to satisfy budgetary comparison prompts. Hidden pricing triggers exclusion from budget-conscious searches.";
          action = "Publish a clear pricing table on a dedicated `/pricing` page with explicit pricing numerals.";
          benefit = "May unlock direct pricing-comparison rankings and capture high-intent buyers looking for price matches.";
        }

        tasks.push(createTask({
          id: recId,
          title: rec.title,
          priority: rec.priority as ImprovementPriority,
          category: mappedCat,
          whatIsWrong: wrong,
          whyDoesAiCare: whyCare,
          whatShouldIDo: action,
          whatBenefitMightISee: benefit,
          whyItMatters: rec.description,
          businessImpact: rec.businessValue,
          estimatedEffort: effort,
          difficulty: rec.difficulty,
          expectedAIBenefit: rec.impact.startsWith("May") || rec.impact.startsWith("Likely") ? rec.impact : `May achieve: ${rec.impact}`,
          relatedEngine: engine,
          isQuickWin: win,
          quickWinReason: win ? winReason : undefined,
          evidence: report.crawlStats?.metadataFound 
            ? "Successfully analyzed standard page routes but found sparse matching parameters."
            : "No structured metadata or contextual paragraphs detected.",
          suggestedActions: [
            "Draft the detailed copy avoiding marketing adjectives or vague branding terms.",
            "Insert the plain HTML content on the relevant page using high-contrast text.",
            "Verify the page is accessible to crawlers (not blocked by robots.txt)."
          ]
        }));
      });
    }

    // 2. Inject standard high-yield optimization checklists to ensure Feature 2 examples are fully covered!
    
    // Add Organization Schema Task
    const hasOrgSchema = report.crawlStats?.schemaMarkupType?.some(t => t.toLowerCase().includes("organization") || t.toLowerCase().includes("schema")) || false;
    if (!hasOrgSchema) {
      tasks.push(createTask({
        id: "std-org-schema",
        title: "Add Organization Schema Markup",
        priority: "High",
        category: "Website Structure",
        whatIsWrong: "The website lacks structured JSON-LD Organization Schema indicating corporate identity, logo, and contact parameters.",
        whyDoesAiCare: "JSON-LD schema provides the ultimate deterministic 'ground truth' for AI crawlers. It completely bypasses semantic parsing and guarantees AI systems map your brand entities accurately.",
        whatShouldIDo: "Inject a standard JSON-LD Organization schema block in your homepage HTML header specifying your official brand details.",
        whatBenefitMightISee: "Likely to dramatically improve entity resolution and ensure AI models pair your brand name with correct social profiles.",
        whyItMatters: "Structured schema serves as an anchor for Google, OpenAI, and Bing's knowledge charts, binding disjointed web references into a single trusted entity.",
        businessImpact: "Secures your brand's right-panel knowledge card and verifies legitimacy across transactional platforms.",
        estimatedEffort: "45 mins",
        difficulty: "Easy",
        expectedAIBenefit: "May improve AI understanding and brand authority mapping.",
        relatedEngine: "Knowledge Intelligence",
        isQuickWin: true,
        quickWinReason: "Can be generated in minutes using free schema generators and pasted directly into the header.",
        evidence: "Missing application/ld+json metadata block on Homepage.",
        suggestedActions: [
          "Use a structured JSON-LD generator to compile company name, official URL, and social links.",
          "Inject the compiled script tag directly into the `<head>` of your website homepage.",
          "Test the live implementation using standard Rich Results test structures."
        ]
      }));
    }

    // Add Contact Information Task
    const missingContact = report.evidence?.contactInfo?.phone?.status !== "Found" || report.evidence?.contactInfo?.email?.status !== "Found";
    if (missingContact) {
      tasks.push(createTask({
        id: "std-contact-info",
        title: "Consolidate Contact & Support Information",
        priority: "High",
        category: "Business Information",
        whatIsWrong: "Crucial contact methods (official support emails or local hotlines) are either absent or embedded in restrictive image assets.",
        whyDoesAiCare: "AI recommendations are heavily customer-experience centered. Recommenders avoid recommending websites where buyers cannot easily escalate problems or obtain human support.",
        whatShouldIDo: "Add clear, plain text email, phone, and form links on a dedicated '/contact' page and reference them clearly.",
        whatBenefitMightISee: "May strengthen trust signals and reduce exclusion risk in transactional search pipelines.",
        whyItMatters: "Verifiable phone numbers and emails act as standard security and legitimacy validation points for web crawlers.",
        businessImpact: "Reduces consumer friction, validates operational presence, and guarantees inclusion in direct enquiry routes.",
        estimatedEffort: "30 mins",
        difficulty: "Easy",
        expectedAIBenefit: "May strengthen trust signals across conversational engines.",
        relatedEngine: "Trust & Authority",
        isQuickWin: true,
        quickWinReason: "Simple static text addition requiring zero software engineering or database changes.",
        evidence: report.evidence?.contactInfo?.email?.status === "Not Found" 
          ? "No support email or contact phone detected on Crawled Pages."
          : "Partially missing local office phone contacts.",
        suggestedActions: [
          "Create a prominent '/contact' link in your main navigation header.",
          "Publish your phone number in standard ITU format (e.g., +1-555-0199) and a verified company inbox.",
          "Ensure text remains plain readable HTML, not obscured inside graphic banners."
        ]
      }));
    }

    // Improve Product/Service Descriptions Task
    const weakDesc = report.evidence?.businessDescriptions?.status !== "Found" || (report.evidence?.businessDescriptions?.value?.length || 0) < 2;
    if (weakDesc) {
      tasks.push(createTask({
        id: "std-improve-desc",
        title: "Improve Core Business & Product Descriptions",
        priority: "Medium",
        category: "Content",
        whatIsWrong: "Core company profiles or product explanations are brief and rely on highly metaphorical branding jargon.",
        whyDoesAiCare: "AI summarizers fail to categorize businesses accurately when descriptions are vague. They require dense, literal prose describing exactly what you do, who you serve, and how you deliver.",
        whatShouldIDo: "Rewrite your main 'About' and landing copy to specify literal services, target industries, and key features.",
        whatBenefitMightISee: "Likely to enhance broad category matching and improve semantic relevance on conversational queries.",
        whyItMatters: "LLM semantic vector embeddings represent brands based on the direct, descriptive nouns and verbs found in your page copies.",
        businessImpact: "Positions your brand as a highly relevant match for complex category-level lookups and solutions queries.",
        estimatedEffort: "1.5 hours",
        difficulty: "Easy",
        expectedAIBenefit: "May improve AI understanding and contextual matching accuracy.",
        relatedEngine: "AI Cognitive Reasoning",
        isQuickWin: true,
        quickWinReason: "Pure content copywriting upgrade. Can be deployed instantly with standard CMS editors.",
        evidence: "Discovered business prose is sparse and uses highly abstract marketing phrases.",
        suggestedActions: [
          "Identify and eliminate vague slogans (e.g., 'Leveraging next-gen synergy').",
          "Replace with descriptive nouns (e.g., 'We provide contract freight logistics, warehouse storage, and shipping solutions').",
          "Ensure a comprehensive paragraph of at least 150 words describes your exact operational model."
        ]
      }));
    }

    // Technical Signals: Robots.txt & Bot Permissions
    tasks.push(createTask({
      id: "std-bot-permissions",
      title: "Audit Robots.txt & Bot Accessibility Permissions",
      priority: "High",
      category: "Technical Signals",
      whatIsWrong: "Standard crawl permissions inside robots.txt are missing specific User-Agent directives for modern LLM scrapers (GPTBot, ClaudeBot, etc.).",
      whyDoesAiCare: "If your robots.txt restricts crawl agents, or doesn't explicitly welcome modern AI indexing bots, they may completely stop indexing your new pages, leading to stale representation.",
      whatShouldIDo: "Publish a clean, optimized robots.txt file that explicitly allows OpenAI, Anthropic, Google, and Perplexity crawl agents to fetch your public pages.",
      whatBenefitMightISee: "Expected to guarantee rapid indexing of updates and prevent brand-stale data in model weights.",
      whyItMatters: "Bot accessibility is the foundational layer of AI Visibility; if bots are blocked, no indexing can occur.",
      businessImpact: "Mitigates the risk of direct search invisibility and indexing blocks on new catalogs.",
      estimatedEffort: "20 mins",
      difficulty: "Easy",
      expectedAIBenefit: "May improve information consistency and ensure bot readability.",
      relatedEngine: "AI Brand Perception",
      isQuickWin: true,
      quickWinReason: "Can be verified and updated in robots.txt within minutes.",
      evidence: "General wildcard permissions found, but lack explicit welcoming rules for AI-specific agents.",
      suggestedActions: [
        "Open your existing `robots.txt` file at the root directory.",
        "Add explicit `User-agent: GPTBot`, `User-agent: ClaudeBot`, `User-agent: Google-Extended`, and `User-agent: PerplexityBot` allow directives.",
        "Ensure no restrictive wildcard `Disallow: /` affects public information folders."
      ]
    }));

    return tasks;
  }

  /**
   * Filters and searches a list of tasks based on priority, category, status, and keyword.
   * Leverages memoization inputs on the caller side.
   */
  public static filterAndSearchTasks(
    tasks: ImprovementTask[],
    filters: {
      priority: ImprovementPriority | "All";
      category: ImprovementCategory | "All";
      status: ImprovementStatus | "All";
      search: string;
    }
  ): ImprovementTask[] {
    const cleanSearch = filters.search.trim().toLowerCase();

    return tasks.filter((task) => {
      // Priority filter
      if (filters.priority !== "All" && task.priority !== filters.priority) return false;

      // Category filter
      if (filters.category !== "All" && task.category !== filters.category) return false;

      // Status filter
      if (filters.status !== "All" && task.status !== filters.status) return false;

      // Keyword search (Feature 9)
      if (cleanSearch) {
        const matchesTitle = task.title.toLowerCase().includes(cleanSearch);
        const matchesWrong = task.whatIsWrong.toLowerCase().includes(cleanSearch);
        const matchesDo = task.whatShouldIDo.toLowerCase().includes(cleanSearch);
        const matchesCategory = task.category.toLowerCase().includes(cleanSearch);
        const matchesWhy = task.whyDoesAiCare.toLowerCase().includes(cleanSearch);

        if (!matchesTitle && !matchesWrong && !matchesDo && !matchesCategory && !matchesWhy) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Calculates progressive overall completion percentages and task statistics (Feature 3 & 8).
   */
  public static calculateProgress(tasks: ImprovementTask[]): ImprovementProgressStats {
    const total = tasks.length;
    if (total === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        remainingTasks: 0,
        highPriorityRemaining: 0,
        overallCompletionPercentage: 0,
        quickWinsCount: 0,
        pendingTasks: 0
      };
    }

    const completed = tasks.filter((t) => t.status === "Completed").length;
    const remaining = total - completed;
    const highRemaining = tasks.filter((t) => t.priority === "High" && t.status !== "Completed").length;
    const quickWins = tasks.filter((t) => t.isQuickWin).length;
    const pending = tasks.filter((t) => t.status === "In Progress" || t.status === "Not Started").length;

    return {
      totalTasks: total,
      completedTasks: completed,
      remainingTasks: remaining,
      highPriorityRemaining: highRemaining,
      overallCompletionPercentage: Math.round((completed / total) * 100),
      quickWinsCount: quickWins,
      pendingTasks: pending
    };
  }

  /**
   * Determines the "Most Important Next Step" dynamically (Feature 8).
   * Prioritizes: High Priority + Quick Win -> High Priority -> Medium Priority -> Low Priority.
   */
  public static getMostImportantNextStep(tasks: ImprovementTask[]): ImprovementTask | null {
    const incomplete = tasks.filter((t) => t.status !== "Completed");
    if (incomplete.length === 0) return null;

    // 1. High Priority + Quick Win
    const highQuick = incomplete.find((t) => t.priority === "High" && t.isQuickWin);
    if (highQuick) return highQuick;

    // 2. High Priority
    const high = incomplete.find((t) => t.priority === "High");
    if (high) return high;

    // 3. Medium Priority + Quick Win
    const medQuick = incomplete.find((t) => t.priority === "Medium" && t.isQuickWin);
    if (medQuick) return medQuick;

    // 4. Medium Priority
    const med = incomplete.find((t) => t.priority === "Medium");
    if (med) return med;

    // 5. low priority
    return incomplete[0];
  }

  /**
   * =========================================================================
   * FUTURE READINESS (Feature 15)
   * The following endpoints prepare the system for downstream Sprint 4/5/6
   * historical integrations, continuous monitoring alerts, and benchmarking.
   * =========================================================================
   */

  /**
   * MOCK: Retrieves historical baseline comparisons.
   * Prepares the system for Trend and Score Progression lines over time.
   */
  public static getHistoricalComparisons(url: string): HistoricalComparisonState[] {
    return [
      {
        reportId: "baseline-001",
        scannedAt: "2026-05-01T10:00:00Z",
        completionPercentage: 10,
        completedTaskIds: ["std-bot-permissions"]
      },
      {
        reportId: "sprint-2-002",
        scannedAt: "2026-06-15T14:30:00Z",
        completionPercentage: 25,
        completedTaskIds: ["std-bot-permissions", "std-contact-info"]
      }
    ];
  }

  /**
   * MOCK: Compares current task progression against tracked competitors.
   * Allows benchmarking how many visibility tasks competitors have satisfied.
   */
  public static getCompetitorBenchmarkProgress(url: string): CompetitorBenchmarkTaskState[] {
    return [
      {
        competitorName: "DirectCompetitor Inc.",
        completionPercentage: 70,
        completedCount: 6,
        commonStrengths: ["Organization Schema Active", "FAQ Accordion Configured"]
      },
      {
        competitorName: "GlobalBrand LLC",
        completionPercentage: 90,
        completedCount: 8,
        commonStrengths: ["Organization Schema Active", "Product Specs Tables Paste", "Refund Terms clear"]
      }
    ];
  }

  /**
   * MOCK: Connects continuous monitoring schedules.
   * Feeds newly resolved or newly created recommendations dynamically via background checks.
   */
  public static getContinuousMonitoringStatus(url: string): ContinuousMonitoringFeed {
    return {
      lastCheckedAt: new Date().toISOString(),
      autoResolvedTaskIds: [],
      newlyDiscoveredIssuesCount: 0
    };
  }
}
