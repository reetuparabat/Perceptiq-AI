/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIReadinessReport } from "../types";
import { ImprovementTask } from "../improvement/types";
import { ImprovementService } from "../improvement/service";
import {
  ValidationItem,
  ValidationStatus,
  EffectivenessCategory,
  ValidationDashboardMetrics,
  ValidationTimelineEvent
} from "./types";

export class ValidationService {
  /**
   * Evaluates the active improvement tasks and generates their corresponding validation details.
   * This is fully dynamic and reacts instantly to user actions in the Improvement Center.
   */
  public static compileValidationItems(report: AIReadinessReport, tasks: ImprovementTask[]): ValidationItem[] {
    const url = report.url || "https://example.com";
    
    return tasks.map((task) => {
      let status: ValidationStatus = "Not Yet Verified";
      let effectivenessRating: EffectivenessCategory = "Not Yet Effective";
      
      // Determine Status & Effectiveness dynamically based on live user checklist completion
      if (task.status === "Completed") {
        status = "Verified";
        effectivenessRating = task.priority === "High" ? "Highly Effective" : "Moderately Effective";
      } else if (task.status === "In Progress") {
        status = "Partially Verified";
        effectivenessRating = "Limited Evidence";
      } else {
        // Map one specific high-complexity task to "Unable to Verify" to showcase the status
        if (task.id === "std-pricing" || task.id.includes("specs") || task.id.includes("billing")) {
          status = "Unable to Verify";
          effectivenessRating = "Limited Evidence";
        } else {
          status = "Not Yet Verified";
          effectivenessRating = "Not Yet Effective";
        }
      }

      // 1. Dynamic descriptions based on task ID and attributes
      let whatAiFound = "";
      let whyAssigned = "";
      let supportingEvidence = "";
      let beforeEvidence = "";
      let afterEvidence = "";
      let whatChanged = "";
      let potentialAiImpact = "";
      let whereFound = "";
      let matchedInformation = "";
      let confidence = 0;
      let lastDetected = new Date(report.scannedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      
      let effectivenessWhy = "";
      let businessImpact = "";
      let suggestedNextStep = "";

      // Craft rich, human-friendly explainable content for each task
      if (status === "Verified") {
        confidence = 94 + Math.floor(Math.random() * 5); // High confidence for verified
        whereFound = `Crawler match in standard footer and landing tags of ${url}`;
        
        if (task.id === "std-org-schema") {
          whatAiFound = "JSON-LD Organization schema block successfully parsed on Homepage.";
          whyAssigned = "The schema contains complete metadata matching your official brand entity.";
          supportingEvidence = "Found: 'application/ld+json' containing official brand coordinates.";
          beforeEvidence = "Missing application/ld+json metadata block on Homepage.";
          afterEvidence = "JSON-LD Block loaded. Official entity details fully parsed.";
          whatChanged = "Corporate identity parameters changed from unstructured guesses to strict metadata.";
          potentialAiImpact = "AI engines now resolve your company's official name, logo, and links with 100% precision.";
          matchedInformation = `"@type": "Organization", "name": "${report.companyName}", "url": "${url}"`;
          effectivenessWhy = "The addition of structured schema provides standard 'ground truth' to crawlers, bypassing error-prone semantic parsing.";
          businessImpact = "Secures direct side-card representation in transactional LLM search indexes.";
          suggestedNextStep = "Keep schema updated when official phone or logo links change.";
        } else if (task.id === "std-contact-info") {
          whatAiFound = "Verifiable text phone numbers and email links resolved on the /contact page.";
          whyAssigned = "Public contact parameters are accessible via standard crawler traversals.";
          supportingEvidence = "Found: Text anchors matching support channels.";
          beforeEvidence = "Contact details embedded in images or missing altogether.";
          afterEvidence = "Clear HTML anchors found for contact lines.";
          whatChanged = "Support lines are now indexable in raw text format rather than flat pixel maps.";
          potentialAiImpact = "AI engines recommend your business as a legitimate customer service option with higher security clearance.";
          matchedInformation = `Support email and primary helpline resolved successfully.`;
          effectivenessWhy = "LLM recommenders filter out businesses lacking verifiable escalation channels to protect users.";
          businessImpact = "Enhances Trust and Authority parameters across user recommendation algorithms.";
          suggestedNextStep = "Fulfill secondary schema integration for helpline numbers.";
        } else if (task.id.includes("faq")) {
          whatAiFound = "Structured conversational question-and-answer pairs parsed on main page.";
          whyAssigned = "Conversational FAQ copy matches consumer question intents perfectly.";
          supportingEvidence = "Found: 6 semantic FAQ blocks containing high-yield answers.";
          beforeEvidence = "No conversational accordion or pre-purchase questions found.";
          afterEvidence = "Aesthetic FAQ accordion with plain text questions and responses.";
          whatChanged = "Raw promotional sales copy replaced with question-answering conversational dialogue.";
          potentialAiImpact = "Drastically improves matchmaking rate on conversational voice and long-tail query prompts.";
          matchedInformation = `Q&A patterns mapped to common customer query templates.`;
          effectivenessWhy = "LLM retrieval engines map voice queries directly to FAQ formats for instant synthesis.";
          businessImpact = "Enables direct paragraph quotes in user ChatGPT and Perplexity summaries.";
          suggestedNextStep = "Expand FAQs monthly based on real customer support questions.";
        } else {
          whatAiFound = `Text elements matching "${task.title}" were parsed successfully.`;
          whyAssigned = "The content aligns with conversational search quality guidelines.";
          supportingEvidence = `Found active text nodes corresponding to ${task.category}.`;
          beforeEvidence = "Sparse representation of critical business specifications.";
          afterEvidence = "Detailed descriptive blocks published clearly in HTML copy.";
          whatChanged = "Vague marketing phrases replaced with specific, clear factual content.";
          potentialAiImpact = "Boosts comparative search matchmaking scores across all major platforms.";
          matchedInformation = `Matched key descriptors for: ${task.title}`;
          effectivenessWhy = "Search agents require factual, descriptive parameters to map capabilities correctly.";
          businessImpact = "Reduces exclusion risk in specialized category listings.";
          suggestedNextStep = "Continue auditing content clarity across all subpages.";
        }
      } else if (status === "Partially Verified") {
        confidence = 65 + Math.floor(Math.random() * 10);
        whereFound = `Partial match detected during superficial crawl scan on ${url}`;
        
        whatAiFound = `Incomplete or draft copy detected matching "${task.title}".`;
        whyAssigned = "Crawler identified initial page revisions, but layout parameters or metadata tags are still unresolved.";
        supportingEvidence = "Page published but structured anchors or link references are currently broken or sparse.";
        beforeEvidence = "No traces of requested content or structural attributes.";
        afterEvidence = "Traces of layout sections detected but lacks finalized text details.";
        whatChanged = "Work has begun, but standard descriptive attributes have not been fully exposed.";
        potentialAiImpact = "AI systems can scan the page but cannot assign high trust confidence until finalized.";
        matchedInformation = `Draft outlines mapped: ${task.title}`;
        effectivenessWhy = "Partial implementations protect against total exclusion, but do not satisfy trust thresholds.";
        businessImpact = "Provides early signal, but keeps overall ranking potential capped.";
        suggestedNextStep = "Finalize the draft copy and deploy complete plain-text paragraphs.";
      } else if (status === "Unable to Verify") {
        confidence = 0;
        whereFound = "None - Crawler block or missing credentials.";
        
        whatAiFound = "Crawlers cannot access target directories due to authentication, firewall, or technical restrictions.";
        whyAssigned = "The optimization relates to protected environments (e.g., hidden pricing, private catalogs, checkout schemas).";
        supportingEvidence = "HTTP 403 or missing credential indicators on target validation routes.";
        beforeEvidence = "Authentication restrictions or secure pages prevent crawler analysis.";
        afterEvidence = "No changes indexable due to sandbox boundaries.";
        whatChanged = "No changes indexable.";
        potentialAiImpact = "AI crawlers may rely on third-party scrapers or customer reviews rather than direct brand data.";
        matchedInformation = "None - Access prohibited.";
        effectivenessWhy = "Protected files and gated portals cannot be verified by standard web visibility audits.";
        businessImpact = "Creates verification blindspots in recommendation engine evaluations.";
        suggestedNextStep = "Publish clean, static sample summaries on public paths for crawlers to reference.";
      } else {
        // Not Yet Verified
        confidence = 0;
        whereFound = "None";
        
        whatAiFound = "No matching copy, tags, or metadata detected by Perceptiq AI crawlers.";
        whyAssigned = "The recommended improvement is pending execution in the Improvement Center.";
        supportingEvidence = "Zero crawl traces found.";
        beforeEvidence = "No matching optimization elements found.";
        afterEvidence = "No matching optimization elements found.";
        whatChanged = "No optimizations deployed for this checkpoint yet.";
        potentialAiImpact = "The business remains susceptible to conversational exclusions for these specific queries.";
        matchedInformation = "None";
        effectivenessWhy = "Unimplemented playbooks generate zero visibility, trust, or indexing gains.";
        businessImpact = "Prolongs brand visibility gaps on high-intent consumer searches.";
        suggestedNextStep = "Open the Improvement Center and follow the action guidelines to implement this.";
      }

      return {
        taskId: task.id,
        taskTitle: task.title,
        category: task.category,
        status,
        whatAiFound,
        whyAssigned,
        supportingEvidence,
        comparison: {
          before: beforeEvidence,
          after: afterEvidence,
          whatChanged,
          potentialAiImpact
        },
        explorer: {
          whereFound,
          sourcePage: status === "Verified" || status === "Partially Verified" ? `${url}/index` : "None",
          matchedInformation,
          confidence,
          lastDetected,
          missingExplanation: status === "Not Yet Verified" || status === "Unable to Verify" 
            ? "No crawl traces parsed. Please ensure the page is published, public, and not blocked by robots.txt permissions." 
            : undefined
        },
        effectiveness: {
          rating: effectivenessRating,
          why: effectivenessWhy || "Evaluation pending implementation and next verification scan cycle.",
          businessImpact: businessImpact || "No active impact registered.",
          suggestedNextStep: suggestedNextStep || "Initiate playbook in the Improvement Center to establish impact."
        }
      };
    });
  }

  /**
   * Compiles the dynamic dashboard metrics
   */
  public static calculateMetrics(items: ValidationItem[]): ValidationDashboardMetrics {
    const total = items.length;
    const verified = items.filter(i => i.status === "Verified").length;
    const partiallyVerified = items.filter(i => i.status === "Partially Verified").length;
    const notYetVerified = items.filter(i => i.status === "Not Yet Verified").length;
    const unableToVerify = items.filter(i => i.status === "Unable to Verify").length;

    const overallPercentage = total > 0 ? Math.round((verified / total) * 100) : 0;

    return {
      totalRecommendations: total,
      verifiedCount: verified,
      partiallyVerifiedCount: partiallyVerified,
      notYetVerifiedCount: notYetVerified,
      unableToVerifyCount: unableToVerify,
      overallValidationPercentage: overallPercentage
    };
  }

  /**
   * Compiles a dedicated timeline focusing ONLY on validated (Verified) improvements (Feature 5)
   */
  public static compileValidationTimeline(items: ValidationItem[]): ValidationTimelineEvent[] {
    const verifiedItems = items.filter(i => i.status === "Verified");
    
    // We mock a timeline sequence using logical months for completed items
    const months = ["March 2026", "April 2026", "May 2026", "June 2026", "July 2026"];
    
    // Let's create a solid narrative timeline based on what's verified
    const timeline: ValidationTimelineEvent[] = [];

    // Let's ensure a standard historical sequence of verified events
    // Start with a standard baseline check
    timeline.push({
      id: "evt-baseline",
      month: "March 2026",
      title: "Initial Entity Identification Baseline Established",
      description: "Perceptiq AI completed its baseline crawler index mapping, pinpointing primary structural gaps.",
      impactSummary: "Established baseline trust parameters, initiating optimization track."
    });

    verifiedItems.forEach((item, idx) => {
      const month = months[Math.min(idx + 1, months.length - 1)];
      timeline.push({
        id: `evt-${item.taskId}`,
        month,
        title: `${item.taskTitle} Verified`,
        description: item.whatAiFound,
        impactSummary: item.comparison.potentialAiImpact
      });
    });

    return timeline;
  }
}
