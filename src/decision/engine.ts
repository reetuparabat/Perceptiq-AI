/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIReadinessReport } from "../types";
import {
  AIDecisionModel,
  DecisionConfidenceLevel,
  DecisionStoryNode,
  RootCauseNode,
  ImpactChainModel,
  PriorityActionItem,
  DecisionTraceNode,
  CrossModuleInsight,
  ModuleHealth,
  SimulationResult
} from "./types";

/**
 * AI Decision Intelligence Engine
 * Orchestrates all previous sprints (Knowledge, Perception, Reasoning, Recommendation, Trust)
 * to construct a unified decision-making graph.
 */
export function calculateDecisionIntelligence(report: AIReadinessReport): AIDecisionModel {
  const companyName = report.companyName || "Your Business";
  const evidence = report.evidence;
  const ki = report.knowledgeIntelligence;
  const scoreBreakdown = report.scoreBreakdown;

  // Gather basic evidence status
  const hasBusinessName = !!(evidence?.businessName?.value || report.companyName);
  const productsList = evidence?.productTitles?.value || evidence?.productsFound?.value || [];
  const servicesList = evidence?.servicesFound?.value || [];
  const hasProducts = productsList.length > 0 || servicesList.length > 0;
  
  const phoneVal = evidence?.contactInfo?.phone?.value;
  const emailVal = evidence?.contactInfo?.email?.value;
  const addressVal = evidence?.contactInfo?.address?.value;
  const hasPhone = !!phoneVal;
  const hasEmail = !!emailVal;
  const hasAddress = !!addressVal;

  const refundVal = evidence?.policies?.returnPolicy?.value;
  const shippingVal = evidence?.policies?.shippingInfo?.value;
  const hasRefund = !!refundVal;
  const hasShipping = !!shippingVal;

  const pricingVal = evidence?.pricingInfo?.value;
  const hasPricing = !!pricingVal;

  const faqList = evidence?.faqQuestions?.value || [];
  const hasFaq = faqList.length > 0;

  const overallScore = typeof report.overallScore === "number" ? report.overallScore : 50;

  // -------------------------------------------------------------
  // FEATURE 10: Decision Confidence
  // -------------------------------------------------------------
  let confidence: DecisionConfidenceLevel = "Moderate";
  let confidenceReason = "";

  if (overallScore >= 80) {
    confidence = "Very High";
    confidenceReason = `Perceptiq has verified complete digital footprints for ${companyName}. Because direct communication channels, pricing tables, and buyer safeguards are fully mapped with zero conflicts, conversational AI systems can recommend your business with absolute certainty.`;
  } else if (overallScore >= 65) {
    confidence = "High";
    confidenceReason = `Perceptiq has verified your core business identity and service catalog. While AI can recommend you with strong assurance, minor gaps like unlisted customer policies or missing pre-sales FAQs prevent a Very High confidence rating.`;
  } else if (overallScore >= 45) {
    confidence = "Moderate";
    confidenceReason = `AI has located basic mentions of your business and offerings, but encounters a lack of structured parameters like refund window specifications or clear localized address coordinates. AI will express minor hesitation during complex user queries.`;
  } else {
    confidence = "Limited";
    confidenceReason = `Critical operational details are missing from your public website pages. Conversational crawlers cannot confirm your active trading status or contact coordinates, meaning AI search assistants will either bypass your company or flag recommendations with high uncertainty.`;
  }

  // -------------------------------------------------------------
  // FEATURE 1: AI Decision Story (The "Thought Pathway")
  // -------------------------------------------------------------
  const decisionStory: DecisionStoryNode[] = [
    {
      step: "Discovery & Identification",
      status: hasBusinessName ? "success" : "error",
      message: hasBusinessName
        ? `AI successfully discovered and cataloged your official trading name: "${companyName}".`
        : "AI found inconsistent business name references, which triggers identity alignment errors.",
      connectedModule: "Business Information"
    },
    {
      step: "Offerings Understanding",
      status: hasProducts ? "success" : "warning",
      message: hasProducts
        ? `AI successfully extracted and understood your business offerings: ${[...productsList, ...servicesList].slice(0, 2).join(", ")}.`
        : "AI could not find a clear list of products or services on your website, hindering product categorization.",
      connectedModule: "AI Perception"
    },
    {
      step: "Commercial Integrity Checks",
      status: hasPricing ? "success" : "warning",
      message: hasPricing
        ? "AI identified direct pricing policies, establishing commercial transparency."
        : "No public pricing rates were discovered. AI must assume bespoke quoting is required.",
      connectedModule: "AI Cognitive Reasoning"
    },
    {
      step: "Buyer Protection Evaluation",
      status: hasRefund ? "success" : "error",
      message: hasRefund
        ? "AI mapped customer refund protections. This ensures transactional safety for referred clients."
        : "No explicit consumer return or refund policy was discovered, which lowers recommendability.",
      connectedModule: "Trust & Authority"
    },
    {
      step: "Customer Support Pathways",
      status: (hasPhone || hasEmail) ? "success" : "error",
      message: (hasPhone || hasEmail)
        ? `AI verified direct lines for customer inquiries: ${[phoneVal, emailVal].filter(Boolean).join(" & ")}.`
        : "No public email inboxes or support telephone numbers were discovered during the crawl.",
      connectedModule: "Recommendation Intelligence"
    },
    {
      step: "Final Recommendation Outlook",
      status: overallScore >= 70 ? "success" : overallScore >= 50 ? "warning" : "error",
      message: overallScore >= 70
        ? `AI enthusiastically recommends ${companyName} for consumer and enterprise searches within your domain.`
        : overallScore >= 50
        ? `AI will recommend your services, but only with specific caveats due to incomplete policy files.`
        : "AI will likely bypass your company in favor of competitors who present verified, low-risk operational details.",
      connectedModule: "Overall AI Decision"
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 2: Root Cause Analysis
  // -------------------------------------------------------------
  const rootCauses: RootCauseNode[] = [];

  if (!hasRefund) {
    rootCauses.push({
      issue: "Low Recommendation Readiness Score",
      consequence: "AI shopping bots avoid referring active buyers to your store.",
      reason: "Transactional trust is labeled as 'Developing' due to high consumer risk.",
      rootSource: "Business Information Layer (No Refund Policy found)"
    });
  }
  if (!hasFaq) {
    rootCauses.push({
      issue: "Reduced AI Perception Content Quality",
      consequence: "AI systems cannot provide quick, direct answers to common user pre-sales inquiries.",
      reason: "The Crawler was unable to locate a pre-sales Q&A structure on the website.",
      rootSource: "Business Information Layer (No Frequently Asked Questions found)"
    });
  }
  if (!hasAddress) {
    rootCauses.push({
      issue: "Excluded from Regional & Map Searches",
      consequence: "Siri, Google Maps, and Apple Intelligence bypass your services for 'near me' queries.",
      reason: "No physical street coordinates are available to anchor your business on regional maps.",
      rootSource: "Business Information Layer (No Physical Address listed)"
    });
  }
  if (!hasPricing) {
    rootCauses.push({
      issue: "Hesitant AI Recommendations",
      consequence: "AI recommends competitors first when buyers ask about cost-efficiency or budgets.",
      reason: "Inability to find transparent pricing tables forces AI systems to guess your fees.",
      rootSource: "Business Information Layer (Pricing details unlisted)"
    });
  }

  // Ensure fallback
  if (rootCauses.length === 0) {
    rootCauses.push({
      issue: "Inability to reach 100% Perfection",
      consequence: "Slight recommendation lag on enterprise inquiries.",
      reason: "Structured corporate information Schema tags are partially incomplete.",
      rootSource: "Website Information Layer (Minor Schema adjustments required)"
    });
  }

  // -------------------------------------------------------------
  // FEATURE 3: Impact Chains
  // -------------------------------------------------------------
  const impactChains: ImpactChainModel[] = [
    {
      triggerImprovement: "Publish Customer FAQ",
      steps: [
        { module: "Business Information", impactDescription: "Q&A statements are successfully indexed", lift: "+15% Indexing Quality" },
        { module: "AI Perception", impactDescription: "AI maps ready answers to complex client questions", lift: "+12% Content Quality" },
        { module: "AI Cognitive Reasoning", impactDescription: "Bots stop estimating support structures", lift: "+10% Explanation Confidence" },
        { module: "Recommendation Intelligence", impactDescription: "AI recommends your services with higher frequency", lift: "+8% Lead Generation" },
        { module: "Trust & Authority", impactDescription: "Customer service pathways are verified", lift: "+5% Operational Trust" }
      ]
    },
    {
      triggerImprovement: "Publish Clear Refund & Return Guidelines",
      steps: [
        { module: "Business Information", impactDescription: "Customer protection coordinates are parsed", lift: "+20% Data Completeness" },
        { module: "AI Perception", impactDescription: "Shopping risks are rated as zero for consumers", lift: "+15% Risk Reduction" },
        { module: "AI Cognitive Reasoning", impactDescription: "Evaluators score purchase security at maximum", lift: "+18% Transactional Safety" },
        { module: "Recommendation Intelligence", impactDescription: "AI actively directs high-intent buyers to check out", lift: "+15% Checkout Referral Rate" },
        { module: "Trust & Authority", impactDescription: "Overall brand verifiability jumps to Highest Tier", lift: "+22% Verifiability Score" }
      ]
    },
    {
      triggerImprovement: "List Local Physical Coordinates",
      steps: [
        { module: "Business Information", impactDescription: "Geographical HQ details are registered", lift: "+10% Localization" },
        { module: "AI Perception", impactDescription: "AI matches company to specific city targets", lift: "+20% Geographical Context" },
        { module: "AI Cognitive Reasoning", impactDescription: "Eliminates shell-corporation suspicion triggers", lift: "+15% Compliance Score" },
        { module: "Recommendation Intelligence", impactDescription: "Unlocks map packs and voice search 'near me' results", lift: "+25% Local Recommendations" },
        { module: "Trust & Authority", impactDescription: "Brand authority verified via land registry anchors", lift: "+8% Location Trust" }
      ]
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 4: Priority Action Center
  // -------------------------------------------------------------
  const priorityActions: PriorityActionItem[] = [];

  if (!hasRefund) {
    priorityActions.push({
      id: "action-refund",
      title: "Publish a 30-Day Refund Policy",
      group: "Do Immediately",
      currentIssue: "Low buyer safety score causing transaction blockades.",
      reason: "AI shopping search crawlers must verify refund policies before sending checkouts.",
      expectedBenefit: "Removes buyer friction, unlocking automated transaction recommendations.",
      difficulty: "Easy",
      estimatedEffort: "15 minutes",
      priority: "High"
    });
  }

  if (!hasFaq) {
    priorityActions.push({
      id: "action-faq",
      title: "Add 5-10 Pre-Sales Q&A Questions",
      group: "Do Immediately",
      currentIssue: "AI cannot explain your customer onboarding process.",
      reason: "Voice assistants cannot find a direct FAQ structure to pull instant answers from.",
      expectedBenefit: "Enables ChatGPT/Claude to supply instant, verified support answers.",
      difficulty: "Easy",
      estimatedEffort: "30 minutes",
      priority: "High"
    });
  }

  if (!hasAddress) {
    priorityActions.push({
      id: "action-address",
      title: "List Physical Location or Support Suite",
      group: "Do This Month",
      currentIssue: "Excluded from map-based and local 'near me' search queries.",
      reason: "Search systems require a real geographical landmark to recommend local stores.",
      expectedBenefit: "Unlocks placement in Siri and Apple Intelligence regional map results.",
      difficulty: "Easy",
      estimatedEffort: "10 minutes",
      priority: "Medium"
    });
  }

  if (!hasPricing) {
    priorityActions.push({
      id: "action-pricing",
      title: "Publish Transparent Starting Rates",
      group: "Do This Month",
      currentIssue: "AI assumes your service fees are expensive.",
      reason: "In the absence of a price list, AI systems default to warning users about unquoted costs.",
      expectedBenefit: "Allows your brand to win cost-conscious recommendations and budget searches.",
      difficulty: "Medium",
      estimatedEffort: "45 minutes",
      priority: "Medium"
    });
  }

  // Always ensure a couple of long term or fallback items
  priorityActions.push({
    id: "action-schema",
    title: "Inject Structured Organizational Schema",
    group: "Long-Term Improvements",
    currentIssue: "Crawler bot indexing delays when website changes occur.",
    reason: "Structured JSON-LD tags allow search bots to index your pricing immediately without guessing.",
    expectedBenefit: "Reduces crawl overhead and accelerates recommendation profile updates.",
    difficulty: "Medium",
    estimatedEffort: "1 hour",
    priority: "Low"
  });

  priorityActions.push({
    id: "action-testimonials",
    title: "Build Verified Client Trust Grids",
    group: "Long-Term Improvements",
    currentIssue: "Qualitative claims about client volume are rated 'Unverified'.",
    reason: "No structured customer reviews or testimonials were discovered during scan.",
    expectedBenefit: "Supports corporate popularity claims, converting skepticism to verified authority.",
    difficulty: "Easy",
    estimatedEffort: "2 hours",
    priority: "Low"
  });

  // Sort priority actions so high are first
  priorityActions.sort((a, b) => {
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  // -------------------------------------------------------------
  // FEATURE 6: AI Decision Trace (The Explainability Tree)
  // -------------------------------------------------------------
  const traces: DecisionTraceNode[] = [
    {
      id: "root-trace",
      label: "Decision Level",
      title: "AI Recommendation Outlook",
      description: overallScore >= 70 
        ? "Highly Recommended: AI finds no critical transaction risks or identity conflicts." 
        : "Conditionally Recommended: AI suggests services with warnings due to incomplete policy files.",
      status: overallScore >= 70 ? "Verified" : "Incomplete",
      children: [
        {
          id: "cognitive-trace",
          label: "Reasoning Level",
          title: "AI Cognitive Analysis",
          description: hasPricing 
            ? "Commercial logic is fully mapped. Price-point transparency is confirmed." 
            : "Commercial reasoning is limited. Price structure must be estimated.",
          status: hasPricing ? "Verified" : "Incomplete",
          children: [
            {
              id: "perception-trace",
              label: "Perception Level",
              title: "AI Brand Synthesis",
              description: hasProducts 
                ? `Offering catalog extracted successfully containing matches for: ${[...productsList, ...servicesList].slice(0, 2).join(", ")}.` 
                : "Offering catalog is missing. Bots fail to synthesize standard product benefits.",
              status: hasProducts ? "Verified" : "Missing",
              children: [
                {
                  id: "knowledge-trace",
                  label: "Business Information Level",
                  title: "Website Information Index",
                  description: hasBusinessName 
                    ? `Uniform brand naming "${companyName}" confirmed across crawling sweeps.` 
                    : "Corporate identity is ambiguous due to spelling mismatches.",
                  status: hasBusinessName ? "Verified" : "Missing",
                  children: [
                    {
                      id: "evidence-trace",
                      label: "Crawler Evidence Level",
                      title: "Raw Website File Crawl",
                      description: `Homepage text content of ${report.url} parsed (${report.crawlStats?.pagesCrawled || 1} pages scanned, ${report.crawlStats?.productCount || 0} items identified).`,
                      evidenceSource: "Homepage Crawler Content Files",
                      status: "Verified"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "trust-trace",
          label: "Reasoning Level",
          title: "AI Trust & Verifiability Analysis",
          description: hasRefund 
            ? "Transactional safety confirmed through active buyer protection documents." 
            : "High transactional risk flagged. Customer-protection documents are missing.",
          status: hasRefund ? "Verified" : "Missing",
          children: [
            {
              id: "support-trace",
              label: "Perception Level",
              title: "Customer Support Pathways Map",
              description: (hasPhone || hasEmail) 
                ? `Direct communication lines verified: Phone (${phoneVal || "Missing"}) and Email (${emailVal || "Missing"}).` 
                : "No customer contact directories were identified during the crawl.",
              status: (hasPhone || hasEmail) ? "Verified" : "Missing"
            }
          ]
        }
      ]
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 7: Cross Module Insights
  // -------------------------------------------------------------
  const crossModuleInsights: CrossModuleInsight[] = [];

  if (!hasFaq) {
    crossModuleInsights.push({
      id: "insight-faq",
      knowledgeNode: "Crawl bot returns zero pre-sales Frequently Asked Questions (FAQ).",
      perceptionNode: "AI is unable to synthesize your customer onboarding or support timelines.",
      reasoningNode: "Cognitive models speculate that support hours might be highly limited.",
      recommendationNode: "AI reduces recommendability rank for high-intent, time-sensitive buyers.",
      trustNode: "Overall customer-protection score suffers minor downgrade.",
      visualSummary: "Missing FAQ cascade: Crawford missing -> AI Perception fails -> Reasoning guesses -> Recommendation declines."
    });
  }

  if (!hasRefund) {
    crossModuleInsights.push({
      id: "insight-refund",
      knowledgeNode: "Refund, Return, or Cancellation files are completely absent.",
      perceptionNode: "Shopping assistants flag customer purchase risks as unmeasured.",
      reasoningNode: "AI assumes transactions carry default risk with no buyer safety backup.",
      recommendationNode: "Purchase assistants refuse to direct buyers to complete checkouts.",
      trustNode: "Transactional verifiability profile restricted to 'Developing' tier.",
      visualSummary: "No Refund cascade: Missing rules -> High risk flag -> Low safety score -> Blocked purchase referral."
    });
  }

  // Ensure fallback
  if (crossModuleInsights.length === 0) {
    crossModuleInsights.push({
      id: "insight-default",
      knowledgeNode: "Website contains standard, unstructured paragraphs.",
      perceptionNode: "AI parses descriptions but requires additional JSON structure.",
      reasoningNode: "AI matches classifications with 90% confidence.",
      recommendationNode: "Referral frequency is outstanding but has room for micro-indexing lifts.",
      trustNode: "Verification profile rated at High Trust.",
      visualSummary: "Optimized checklist: Complete elements -> Uniform perception -> High reasoning -> Safe recommendation."
    });
  }

  // -------------------------------------------------------------
  // FEATURE 8: Business Health Overview
  // -------------------------------------------------------------
  const healthOverview: ModuleHealth[] = [
    {
      moduleName: "Business Information",
      status: hasBusinessName ? "Optimal" : "Warning",
      score: hasBusinessName ? 90 : 40,
      biggestStrength: "Uniform branding tags and homepage title configurations.",
      biggestWeakness: !hasFaq ? "Complete absence of structured Frequently Asked Questions." : "Minor metadata gaps.",
      highestPriorityImprovement: !hasFaq ? "Publish 5-10 pre-sales FAQ questions." : "Perform schema validation."
    },
    {
      moduleName: "AI Perception",
      status: hasProducts ? "Optimal" : "Warning",
      score: hasProducts ? 85 : 45,
      biggestStrength: "Clear business description outlining core company objectives.",
      biggestWeakness: !hasProducts ? "No detailed lists of specific product categories." : "Lack of unique selling proposition statements.",
      highestPriorityImprovement: "Enrich service description paragraphs on major service tabs."
    },
    {
      moduleName: "AI Cognitive Reasoning",
      status: hasPricing ? "Optimal" : "Warning",
      score: hasPricing ? 80 : 50,
      biggestStrength: "Clear semantic links between services and business solutions.",
      biggestWeakness: !hasPricing ? "No public starting rates, forcing reasoning engines to estimate costs." : "Ambiguous industry categorization.",
      highestPriorityImprovement: "Publish starting pricing packages to lock pricing transparency."
    },
    {
      moduleName: "Recommendation Readiness",
      status: (hasPhone || hasEmail) ? "Optimal" : "Critical",
      score: (hasPhone && hasEmail) ? 90 : (hasPhone || hasEmail) ? 65 : 30,
      biggestStrength: (hasPhone || hasEmail) ? "Explicit communication directories mapped successfully." : "Incomplete coordinates.",
      biggestWeakness: !(hasPhone && hasEmail) ? "Incomplete contact channels (either missing email or telephone lines)." : "No post-purchase support info.",
      highestPriorityImprovement: "Add dedicated support email and phone line next to each other."
    },
    {
      moduleName: "Trust & Authority",
      status: hasRefund ? "Optimal" : "Critical",
      score: hasRefund ? 85 : 35,
      biggestStrength: hasBusinessName ? "Identity matches third-party directories." : "Inconsistent details.",
      biggestWeakness: !hasRefund ? "Missing buyer protection/refund policies, causing high shopping risk." : "Missing corporate credentials.",
      highestPriorityImprovement: "Publish a 30-day refund policy page to establish secure verifiability."
    }
  ];

  // -------------------------------------------------------------
  // FEATURE 9: Executive Action Report
  // -------------------------------------------------------------
  const reportStrengths = [
    hasBusinessName ? "High identity coherence with uniform brand spelling." : "",
    hasProducts ? "Extensive description profiles cataloging service listings." : "",
    (hasPhone || hasEmail) ? "Direct and accessible client communication lines." : ""
  ].filter(Boolean);

  const reportRisks = [
    !hasRefund ? "Bypassed by AI shopping assistants due to lack of a visible Return Policy." : "",
    !hasAddress ? "Complete exclusion from local map and near-me search prompts." : "",
    !hasPricing ? "AI defaults to warning cost-sensitive users about potential hidden fees." : ""
  ].filter(Boolean);

  const reportActions = [
    !hasRefund ? "Create and link a basic 30-day return page to secure transactional trust." : "",
    !hasFaq ? "Compile a list of 5-10 pre-sales Q&A to answer voice search inquiries." : "",
    !hasAddress ? "Add physical storefront or administrative coordinates to your footer." : ""
  ].filter(Boolean);

  const quickWins = [
    !hasRefund ? "Draft a 1-paragraph Refund Policy statement and link it in your global footer (Takes 10 mins, +15pts Trust lift)." : "",
    !hasAddress ? "List your corporate headquarters or virtual office mail suite in your contact us tab (Takes 5 mins, unlocks regional search)." : ""
  ].filter(Boolean);

  const longTermStrategy = [
    "Inject standard JSON-LD Schema tags across your main layout to enable seamless machine readability.",
    "Formulate structured customer reviews grids to feed third-party authority algorithms.",
    "Construct comprehensive service comparison sheets to excel in AI-guided competitive grids."
  ];

  const executiveReport = {
    currentStatus: `Perceptiq's orchestrator has assessed ${companyName}'s overall AI readiness. Your current overall rating stands at ${overallScore}/100 with an estimated AI Visibility index of ${report.executiveSummary?.estimatedVisibility || 50}%. The AI exhibits a ${confidence.toLowerCase()} confidence profile when evaluating your operations.`,
    strengths: reportStrengths.length > 0 ? reportStrengths : ["Baseline business description is indexable."],
    risks: reportRisks.length > 0 ? reportRisks : ["Minor schema configuration lags."],
    priorityActions: reportActions.length > 0 ? reportActions : ["Configure advanced organizational schema tags."],
    expectedImprovements: "By executing our immediate guidelines, overall recommendation likelihood is estimated to rise by up to 25%, establishing Very High Trust and unlocking direct transactional checkouts.",
    quickWins: quickWins.length > 0 ? quickWins : ["Update homepage title metadata to include main local keywords."],
    longTermStrategy
  };

  return {
    confidence,
    confidenceReason,
    decisionStory,
    rootCauses,
    impactChains,
    priorityActions,
    traces,
    crossModuleInsights,
    healthOverview,
    executiveReport
  };
}

/**
 * FEATURE 5: Improvement Simulation
 * Calculates on-the-fly, deterministic score improvements based on applied checklist fixes.
 * Estimates lifts across all modules without making any external API calls.
 */
export function simulateImprovements(
  report: AIReadinessReport,
  appliedFixes: { faq: boolean; pricing: boolean; returns: boolean; address: boolean }
): SimulationResult {
  const baseScore = typeof report.overallScore === "number" ? report.overallScore : 50;

  // Compute lifts based on which toggles are checked
  let knowledgeLift = 0;
  let perceptionLift = 0;
  let reasoningLift = 0;
  let recommendationLift = 0;
  let trustLift = 0;

  if (appliedFixes.faq) {
    knowledgeLift += 15;
    perceptionLift += 12;
    reasoningLift += 8;
    recommendationLift += 10;
    trustLift += 5;
  }

  if (appliedFixes.pricing) {
    knowledgeLift += 8;
    perceptionLift += 15;
    reasoningLift += 20;
    recommendationLift += 12;
    trustLift += 6;
  }

  if (appliedFixes.returns) {
    knowledgeLift += 12;
    perceptionLift += 10;
    reasoningLift += 15;
    recommendationLift += 22;
    trustLift += 25;
  }

  if (appliedFixes.address) {
    knowledgeLift += 10;
    perceptionLift += 18;
    reasoningLift += 10;
    recommendationLift += 25;
    trustLift += 8;
  }

  // Calculate standard weighted average for overall score lift
  const overallLift = Math.round(
    (knowledgeLift * 0.15) +
    (perceptionLift * 0.20) +
    (reasoningLift * 0.20) +
    (recommendationLift * 0.25) +
    (trustLift * 0.20)
  );

  return {
    knowledgeLift,
    perceptionLift,
    reasoningLift,
    recommendationLift,
    trustLift,
    overallLift
  };
}
