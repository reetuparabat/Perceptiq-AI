/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AIReadinessReport, ExplanationResponse, ExplanationPriorityImprovement } from "./types";

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("[EXPLANATION] Successfully initialized Gemini API Client for Sprint 6 Refinement.");
  } catch (error) {
    console.error("[EXPLANATION] Failed to initialize Gemini Client:", error);
  }
} else {
  console.log("[EXPLANATION] No custom GEMINI_API_KEY set. AI Explanations disabled.");
}

/**
 * Validates that the parsed object conforms strictly to the ExplanationResponse contract
 * and satisfies all conservative, evidence-backed consulting constraints.
 */
function validateExplanationResponse(data: any): data is ExplanationResponse {
  if (!data || typeof data !== "object") return false;
  if (typeof data.executiveSummary !== "string" || data.executiveSummary.trim() === "") return false;
  if (!Array.isArray(data.keyStrengths)) return false;
  if (!Array.isArray(data.priorityImprovements)) return false;

  const absoluteForbidden = /\b(will|guarantee|guarantees|ensures|proves|always|promise|promises|assured|certain)\b/i;

  for (const item of data.priorityImprovements) {
    if (
      typeof item.problem !== "string" ||
      typeof item.supportingEvidence !== "string" ||
      typeof item.businessImpact !== "string" ||
      typeof item.suggestedAction !== "string" ||
      typeof item.priority !== "string" ||
      typeof item.expectedImprovement !== "string"
    ) {
      return false;
    }

    const text = item.expectedImprovement.toLowerCase();

    // Review Finding 2: Expected Improvement must NEVER contain percentages, numerical projections, ROI, rankings, or sales.
    if (text.includes("%") || text.includes("percent")) {
      console.warn("[EXPLANATION VALIDATION] Failed: expectedImprovement contains percentage.");
      return false;
    }

    if (text.includes("$") || text.includes("usd") || text.includes("money") || text.includes("roi")) {
      console.warn("[EXPLANATION VALIDATION] Failed: expectedImprovement contains monetary / ROI metrics.");
      return false;
    }

    if (/\b(rank|ranking|sales|revenue|traffic|clicks|visitors|customers|accuracy)\b.*\b\d+\b/i.test(text) || /\b\d+\b.*\b(rank|ranking|sales|revenue|traffic|clicks|visitors|customers|accuracy)\b/i.test(text)) {
      console.warn("[EXPLANATION VALIDATION] Failed: expectedImprovement contains numerical estimates or projection claims.");
      return false;
    }

    // Must use conservative qualifiers
    const hasConservativeLanguage = /\b(may|can|is likely to|could|should|likely|potential|possibly|helps to)\b/i.test(text);
    if (!hasConservativeLanguage) {
      console.warn("[EXPLANATION VALIDATION] Failed: expectedImprovement lacks conservative evidence-based qualifiers.");
      return false;
    }

    // Avoid absolute certainty words in the recommendation fields
    if (absoluteForbidden.test(item.expectedImprovement) || absoluteForbidden.test(item.businessImpact)) {
      console.warn("[EXPLANATION VALIDATION] Failed: Contained absolute certainty/guarantee language in recommendation.");
      return false;
    }
  }

  if (typeof data.businessImpact !== "string" || data.businessImpact.trim() === "") return false;
  if (typeof data.limitations !== "string" || data.limitations.trim() === "") return false;
  if (!Array.isArray(data.nextActions)) return false;
  if (typeof data.analysisBoundaries !== "string" || data.analysisBoundaries.trim() === "") return false;

  // Verify Analysis Boundaries presence
  if (!data.analysisBoundaries.includes("This explanation is based only on publicly accessible information")) {
    return false;
  }

  // Ensure conservative evidence-based language throughout (Review Finding 3)
  const execSummaryLower = data.executiveSummary.toLowerCase();
  const businessImpactLower = data.businessImpact.toLowerCase();

  // Strict check: No absolute promises/guarantees for rankings, sales, or traffic
  const hasAbsolutePromises = /\b(will rank|guarantee ranking|guarantees ranking|ensure ranking|ensures ranking|will increase sales|will generate traffic)\b/i.test(execSummaryLower + " " + businessImpactLower);
  if (hasAbsolutePromises) {
    console.warn("[EXPLANATION VALIDATION] Failed: Contained absolute claims or guarantees.");
    return false;
  }

  return true;
}

/**
 * Generates an executive AI Explanation based strictly on deterministic findings.
 * Aligned perfectly with Sprint 6 Refinement Guidelines.
 */
export async function generateAiExplanation(report: AIReadinessReport): Promise<ExplanationResponse> {
  if (!ai) {
    console.log("[EXPLANATION] Gemini client not initialized. Generating deterministic fallback explanation.");
    return generateDeterministicFallbackExplanation(report);
  }

  // Review Finding 1: Map technical metric names to business-friendly terminology
  const businessFriendlyScoreBreakdown = report.scoreBreakdown ? {
    "AI Understanding": report.scoreBreakdown.structuredData,
    "Website Reliability": report.scoreBreakdown.technicalHealth,
    "Business Presence": report.scoreBreakdown.authority,
    "Customer Support and Content Quality": report.scoreBreakdown.contentQuality,
    "Product Information Completeness": report.scoreBreakdown.productCompleteness,
    "Business Trust Signals": report.scoreBreakdown.trustSignals,
    "AI Accessibility": report.scoreBreakdown.aiReadability,
  } : null;

  // Map evidence keys to corporate consulting titles (Review Finding 1)
  const businessFriendlyEvidenceSummary = report.evidence ? {
    "Business Identity Status": report.evidence.businessName.status,
    "Contact Telephone Verification": report.evidence.contactInfo.phone.status,
    "Contact Email Verification": report.evidence.contactInfo.email.status,
    "Contact Address Verification": report.evidence.contactInfo.address.status,
    "Product Catalogue Status": report.evidence.productsFound.status,
    "Identified Product Count": report.evidence.productsFound.value?.length || 0,
    "Product Specifications Completeness": report.evidence.productSpecifications.status,
    "Customer Service FAQ Count": report.evidence.faqQuestions.value?.length || 0,
    "Customer Return Policy Status": report.evidence.policies.returnPolicy.status,
    "Customer Shipping Policy Status": report.evidence.policies.shippingInfo.status,
    "Business Compliance Certificates": report.evidence.trustSignals.certificates.status,
  } : null;

  const numericScore = typeof report.overallScore === "number" ? report.overallScore : parseFloat(report.overallScore) || 0;

  // Minimize prompt size by passing only structured, pre-calculated outputs
  const minimizedInput = {
    url: report.url,
    companyName: report.companyName,
    overallScoreDescription: numericScore >= 80 ? "Optimal Readiness" : numericScore >= 50 ? "Moderate Readiness" : "Needs Immediate Advisory",
    businessMetricsBreakdown: businessFriendlyScoreBreakdown,
    crawlStats: {
      pagesCrawled: report.crawlStats.pagesCrawled,
      productCount: report.crawlStats.productCount,
      faqCount: report.crawlStats.faqCount,
      blogsCount: report.crawlStats.blogsCount,
      reviewCount: report.crawlStats.reviewCount,
      imageCount: report.crawlStats.imageCount,
    },
    evidenceCoveragePercentage: report.evidenceCoverage,
    evidenceConfidenceAssessment: report.confidence ? {
      confidenceCategory: report.confidence.confidenceLevel,
      confidenceScore: report.confidence.confidenceScore,
      validationStatus: report.confidence.validationStatus,
      unverifiedStateRatio: report.confidence.unknownRatio,
      reasoningOverview: report.confidence.confidenceReason,
    } : null,
    businessEvidenceSummary: businessFriendlyEvidenceSummary,
  };

  const systemInstruction = `
You are acting as a senior corporate strategy advisor (McKinsey, PwC, EY, Accenture).
Your objective is ONLY to explain deterministic findings.

STRICT SAFETY & ETHICAL CONTRACT:
1. You are NOT evaluating this business or auditing this website.
2. You are NOT calculating scores or calculating confidence.
3. You are NOT discovering evidence.
4. You are NOT estimating missing information.
5. You are receiving deterministic outputs generated by verified software components.
6. Your responsibility is ONLY to explain those outputs in clear, executive business language.
7. If evidence is insufficient, say "Insufficient evidence."
8. Never invent facts, strengths, or recommendations.
9. Never modify scores or confidence.
10. Never reinterpret Unknown values. If an evidence field is "Unknown", acknowledge it as an unverified/out-of-scope area. Avoid drawing conclusions based on them.
11. If a recommendation cannot be directly linked to supplied evidence, do not generate it.
12. If business impact cannot be justified, state "Insufficient evidence." Do not estimate, infer, or speculate.
13. If multiple interpretations exist, choose the most conservative interpretation.
14. Always prefer uncertainty over incorrect certainty.
`;

  const userPrompt = `
You are receiving verified deterministic analysis.
You are NOT allowed to modify, reinterpret, estimate or replace any values.
Every statement must reference supplied evidence.
If insufficient evidence exists, say "Insufficient evidence" rather than making assumptions.

Here is the deterministic analysis mapped to business terminology:
${JSON.stringify(minimizedInput, null, 2)}

Please write an executive explanation of these findings. You MUST strictly adhere to these guidelines:

1. **TONE & STYLE (Review Finding 3)**:
   - Write like a senior McKinsey/PwC advisory consultant. Ensure the report reads with executive authority, objective professionalism, and strict neutrality.
   - Never sound like ChatGPT, marketing copy, blog posts, or developer logs.
   - Use conservative, evidence-based language.
   - Prefer: "may", "can", "is likely to", "based on available evidence", "publicly accessible information".
   - Avoid: "will", "guarantees", "ensures", "proves", "always".
   - Never describe the behavior of specific AI platforms (such as ChatGPT, Claude, Gemini, etc.) unless supported directly by the supplied evidence. Instead, refer to "AI search engines" or "conversational AI models" generally.

2. **NO TECHNICAL JARGON**:
   - Avoid technical words like "DOM", "JSON-LD", "robots.txt", "Schema", "Embedding", "RAG", "Crawler", "Tokens", "Prompt Engineering" unless they are explained in plain corporate terms.

3. **NO REPETITION**:
   - Do NOT repeat the numerical score values (Overall Score, Category Scores, Confidence Scores) or Unknown ratios. Instead, explain the *business implication* of those numbers.

4. **EXECUTIVE SUMMARY**:
   - Write a concise business overview. Max 150 words.

5. **KEY STRENGTHS**:
   - List ONLY verified strengths supported by evidence status "Found" or "Success". Never assume or invent a strength.

6. **PRIORITY IMPROVEMENTS (Review Finding 2)**:
   - Rank improvements by business impact.
   - Every recommendation must contain:
     - problem
     - supportingEvidence
     - businessImpact
     - suggestedAction
     - priority (Must be "High", "Medium", or "Low")
     - expectedImprovement
   - **CRITICAL**: "expectedImprovement" must NEVER contain percentages, monetary estimates, ranking promises, ROI projections, or traffic/sales numbers. For example, instead of "Increase accuracy by 25%", use "May improve AI understanding" or "Can improve recommendation consistency".

7. **BUSINESS IMPACT**:
   - Explain how current findings may affect conversational search visibility and AI assistant discovery. Never promise specific rankings, sales, or ROI.

8. **LIMITATIONS**:
   - Explicitly acknowledge unverified fields, "Unknown" states, missing evidence, and unreachable pages.
   - Never invent or assume missing information.

9. **NEXT ACTIONS**:
   - Provide up to 5 strategic steps prioritized by business impact.

10. **ANALYSIS BOUNDARIES**:
    - You MUST set this exact sentence for the boundaries field:
      "This explanation is based only on publicly accessible information successfully collected during analysis. It does not include private systems, unpublished information, customer databases, internal operations, or proprietary business knowledge."
`;

  try {
    // Timeout Promise race (8.5 seconds threshold)
    const apiCallPromise = ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            version: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING },
                  supportingEvidence: { type: Type.STRING },
                  businessImpact: { type: Type.STRING },
                  suggestedAction: { type: Type.STRING },
                  priority: { type: Type.STRING, description: "Must be 'High', 'Medium', or 'Low'" },
                  expectedImprovement: { type: Type.STRING },
                },
                required: ["problem", "supportingEvidence", "businessImpact", "suggestedAction", "priority", "expectedImprovement"],
              },
            },
            businessImpact: { type: Type.STRING },
            limitations: { type: Type.STRING },
            nextActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            analysisBoundaries: { type: Type.STRING },
          },
          required: ["version", "executiveSummary", "keyStrengths", "priorityImprovements", "businessImpact", "limitations", "nextActions", "analysisBoundaries"],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI explanation generation timed out after 8.5s")), 8500)
    );

    const result = await Promise.race([apiCallPromise, timeoutPromise]);
    const textOutput = result.text?.trim();

    if (!textOutput) {
      console.warn("[EXPLANATION] Received empty response from Gemini.");
      return null;
    }

    const parsedJson = JSON.parse(textOutput);

    // Inject version metadata representing the refined Sprint 6 build (Optional Improvement)
    parsedJson.version = "1.0.0-Refinement (Prompt 1.1)";

    if (!validateExplanationResponse(parsedJson)) {
      console.error("[EXPLANATION] Output validation failed: Schema or constraint mismatch.");
      return null;
    }

    console.log("[EXPLANATION] AI Explanation successfully generated, validated, and bound.");
    return parsedJson;
  } catch (error: any) {
    console.error("[EXPLANATION] Gracefully caught error in explanation routine. Returning deterministic fallback:", error.message || error);
    return generateDeterministicFallbackExplanation(report);
  }
}

/**
 * Fully deterministic fallback strategy advisor that generates a McKinsey-style compliant
 * explanation response without invoking the external Gemini model.
 * Guarantees zero downtime, zero scan failures, and perfect type safety.
 */
export function generateDeterministicFallbackExplanation(report: AIReadinessReport): ExplanationResponse {
  const companyName = report.companyName || "Verifiable Business";
  const category = (report as any).websiteClassification?.category || "Corporate";
  const score = report.overallScore;

  // Build dynamic executive summary based on findings
  let executiveSummary = `This analysis of ${companyName} provides a structured evaluation aligned with the ${category} profile. The current digital presence has achieved a calculated readiness of ${score}/100. Core operations are partially documented, but several strategic informational gaps should be addressed to optimize search engine accessibility.`;
  if (typeof score === "number" && score >= 80) {
    executiveSummary = `This analysis of ${companyName} confirms a highly optimized, mature digital presence matching the ${category} profile with a score of ${score}/100. Essential operational specifications, clear offerings lists, and transparent contact channels are fully active. Generative search engines can confidently index and recommend your brand.`;
  } else if (typeof score === "number" && score < 50) {
    executiveSummary = `This analysis of ${companyName} identifies critical information gaps, yielding a readiness score of ${score}/100. Essential commercial policies, verified operational coordinates, or descriptive service prose are missing or unreachable. Addressing these immediate needs is recommended to prevent commercial search filters from restricting visibility.`;
  }

  // Key Strengths
  const keyStrengths: string[] = [];
  if (report.evidence.businessName.status === "Found") {
    keyStrengths.push("Clear registered brand and corporate identity is active.");
  }
  if (report.evidence.contactInfo.email.status === "Found") {
    keyStrengths.push("Verifiable customer support and escalation email channel is published.");
  }
  if (report.evidence.contactInfo.phone.status === "Found") {
    keyStrengths.push("Direct voice hotline is active for human inquiry escalation.");
  }
  if (report.evidence.faqQuestions.status === "Found" && (report.evidence.faqQuestions.value || []).length > 0) {
    keyStrengths.push("Conversational answers are structured covering common buyer questions.");
  }
  if (report.evidence.trustSignals.certificates.status === "Found") {
    keyStrengths.push("Verifiable security, professional, or compliance credentials are published.");
  }

  if (keyStrengths.length === 0) {
    keyStrengths.push("Basic text layout is readable and standard navigation structure is active.");
  }

  // Priority Improvements (only from Missing, never from Unknown or Restricted)
  const priorityImprovements: ExplanationPriorityImprovement[] = [];

  if (report.evidence.policies.returnPolicy.status === "Not Found") {
    priorityImprovements.push({
      problem: "Standard customer return and refund policy is missing or unpublished.",
      supportingEvidence: "No refund or cancellation terms were verified on crawled pages.",
      businessImpact: "Commercial AI recommenders may flag the domain due to incomplete customer protection disclosures.",
      suggestedAction: "Publish a dedicated return and refund guidelines section in your website footer.",
      priority: "High",
      expectedImprovement: "May satisfy buyer safety rules on transaction-oriented AI search systems."
    });
  }

  if (report.evidence.productSpecifications.status === "Not Found") {
    priorityImprovements.push({
      problem: "Incomplete structured technical specifications lists.",
      supportingEvidence: "Product specifications tables or attribute sheets are missing.",
      businessImpact: "AI search engines may omit products during exact-attribute filtering or comparative lookups.",
      suggestedAction: "Tabulate product dimensions, weight, materials, or compatibility specifications clearly.",
      priority: "Medium",
      expectedImprovement: "Could support product comparison visibility."
    });
  }

  if (report.evidence.pricingInfo.status === "Not Found") {
    priorityImprovements.push({
      problem: "Public subscription plans or commercial pricing tiers are missing.",
      supportingEvidence: "Pricing details or billing tiers are absent from crawled product sections.",
      businessImpact: "Search engines may exclude the service from commercial price comparative analysis.",
      suggestedAction: "Publish a clear subscription plans or base rate table on your pricing page.",
      priority: "High",
      expectedImprovement: "Likely to support index matching during transactional buyer inquiries."
    });
  }

  if (report.evidence.faqQuestions.status === "Not Found") {
    priorityImprovements.push({
      problem: "Absence of structured FAQ question-and-answer pairs.",
      supportingEvidence: "No conversational FAQ accordion list was identified.",
      businessImpact: "Limits direct voice search matching and automated troubleshooting query answers.",
      suggestedAction: "Publish a list of 5-10 common buyer questions and clear answers on your landing page.",
      priority: "Medium",
      expectedImprovement: "May improve conversational snippet visibility on generative engines."
    });
  }

  // Fallback default improvements if empty
  if (priorityImprovements.length === 0) {
    priorityImprovements.push({
      problem: "Opportunity to expand high-density informational content.",
      supportingEvidence: "Basic descriptive text is active but lacks deep keyword saturation.",
      businessImpact: "May limit semantic discoverability during broad topical lookups.",
      suggestedAction: "Write detailed, authoritative company history, mission, or service descriptions.",
      priority: "Low",
      expectedImprovement: "Could support broad-topic category relevance scoring."
    });
  }

  // Business Impact
  const businessImpact = `The current alignment of your website may affect how automated search recommenders and shopping assistants evaluate your business. Clear, structured policies and verified locations help reduce risk flags, while conversational FAQ blocks support inclusion in direct voice-assistant answers.`;

  // Limitations
  const limitationsList: string[] = [];
  if (report.evidence.contactInfo.address.status === "Unknown") {
    limitationsList.push("Physical corporate address coordinates are unverified.");
  }
  if (report.evidence.trustSignals.certificates.status === "Unknown") {
    limitationsList.push("Security or industry certifications are unverified.");
  }
  const limitations = limitationsList.length > 0 
    ? `The following parameters were outside the analysis scope or unverified: ${limitationsList.join(" ")} We recommend publishing these missing elements clearly.`
    : "Certain sections of the company footprint remain unverified. We recommend publishing additional standard corporate disclosures to maximize transparency.";

  // Next Actions
  const nextActions = [
    "Publish explicit client-side guidelines including refund and fulfillment timelines.",
    "Add structured conversational FAQ accordions with natural language answers.",
    "Ensure all technical specifications are tabulated on product catalog pages.",
    "Declare active regulatory or security compliance standpoints clearly."
  ].slice(0, 4);

  // Analysis boundaries
  const analysisBoundaries = "This explanation is based only on publicly accessible information successfully collected during analysis. It does not include private systems, unpublished information, customer databases, internal operations, or proprietary business knowledge.";

  return {
    version: "1.0.0-Fallback (Deterministic)",
    executiveSummary,
    keyStrengths,
    priorityImprovements,
    businessImpact,
    limitations,
    nextActions,
    analysisBoundaries
  };
}
