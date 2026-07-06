/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ScrapedMetadata, AIReadinessReport } from "./types";

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
    console.log("Successfully initialized Gemini API Client in modular service.");
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }
} else {
  console.log("No custom GEMINI_API_KEY set. Operating in high-fidelity fallback mode.");
}

/**
 * Returns the active Gemini instance, if available.
 */
export function getGeminiClient(): GoogleGenAI | null {
  return ai;
}

/**
 * Generates an AI readiness report using Gemini.
 */
export async function generateAiReport(url: string, scrapedMeta: ScrapedMetadata): Promise<AIReadinessReport | null> {
  if (!ai) return null;

  const prompt = `
  You are the ultimate expert AI Brand Perception Strategist and Principal Consultant.
  Analyze the following metadata for a business website and generate a complete, high-fidelity "AI Readiness Report" in strict JSON format matching our enterprise business-first schema.
  Your feedback must be narrative-driven, corporate-grade, highly critical, and completely free of developer/SEO-specific jargon (like raw code ratios, canonical links, robots txt directories).
  Translate all findings into executive business terms (e.g. "Product Information Structure (Can AI Understand Your Products?)", "Website Reliability & Accessibility", "Important customer questions are currently unanswered").

  Website URL: ${url}
  Company Hostname: ${scrapedMeta.domain}
  Title tag: ${scrapedMeta.title}
  Description meta tag: ${scrapedMeta.description}
  Has JSON-LD Structured Data: ${scrapedMeta.hasLdJson}
  Has Microdata: ${scrapedMeta.hasMicrodata}
  Has OpenGraph tags: ${scrapedMeta.hasOpenGraph}
  Detected Image Count: ${scrapedMeta.imagesCount}
  Detected Link Count: ${scrapedMeta.linksCount}
  Detected H1 Headers: ${scrapedMeta.h1Count}
  Detected H2 Headers: ${scrapedMeta.h2Count}
  Mentions FAQs in source: ${scrapedMeta.mentionsFaq}
  Mentions Reviews in source: ${scrapedMeta.mentionsReviews}

  Each score and recommendation must be highly structured. Return a strict JSON format. Include exactly 3 real direct competitors with custom strategicGap fields analyzing competitor advantages.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING, description: "Clear, clean name of the scanned brand (e.g. Stripe, Nike, HubSpot)" },
            overallScore: { type: Type.INTEGER, description: "A realistic index score from 0 to 100 based on modern LLM friendliness." },
            crawlStats: {
              type: Type.OBJECT,
              properties: {
                pagesCrawled: { type: Type.INTEGER },
                productCount: { type: Type.INTEGER },
                faqCount: { type: Type.INTEGER },
                blogsCount: { type: Type.INTEGER },
                reviewCount: { type: Type.INTEGER },
                metadataFound: { type: Type.BOOLEAN },
                schemaMarkupType: { type: Type.ARRAY, items: { type: Type.STRING } },
                imageCount: { type: Type.INTEGER }
              },
              required: ["pagesCrawled", "productCount", "faqCount", "blogsCount", "reviewCount", "metadataFound", "schemaMarkupType", "imageCount"]
            },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                contentQuality: { type: Type.INTEGER, description: "0-100 rating of conversational content relevance" },
                productCompleteness: { type: Type.INTEGER, description: "0-100 rating of descriptive specifications sheets" },
                structuredData: { type: Type.INTEGER, description: "0-100 rating of microdata and JSON-LD implementations" },
                trustSignals: { type: Type.INTEGER, description: "0-100 rating of certified badges, return policy, and reviews presence" },
                aiReadability: { type: Type.INTEGER, description: "0-100 rating of clear structure, plain-text density, heading hierarchy" },
                authority: { type: Type.INTEGER, description: "0-100 rating of external brand citations and mentions volume" },
                technicalHealth: { type: Type.INTEGER, description: "0-100 rating of robots.txt, speed, and crawler accessibility" }
              },
              required: ["contentQuality", "productCompleteness", "structuredData", "trustSignals", "aiReadability", "authority", "technicalHealth"]
            },
            visibility: {
              type: Type.OBJECT,
              properties: {
                chatgpt: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    likelihood: { type: Type.STRING, description: "Likelihood string: 'High', 'Medium', 'Low', 'Critical'" },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["score", "likelihood", "strengths", "weaknesses"]
                },
                gemini: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    likelihood: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["score", "likelihood", "strengths", "weaknesses"]
                },
                claude: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    likelihood: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["score", "likelihood", "strengths", "weaknesses"]
                },
                perplexity: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    likelihood: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["score", "likelihood", "strengths", "weaknesses"]
                }
              },
              required: ["chatgpt", "gemini", "claude", "perplexity"]
            },
            explainability: {
              type: Type.OBJECT,
              properties: {
                missingFaq: {
                  type: Type.OBJECT,
                  properties: {
                    hasGap: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    businessImpact: { type: Type.STRING },
                    expectedImprovement: { type: Type.STRING }
                  },
                  required: ["hasGap", "description", "reasoning", "businessImpact", "expectedImprovement"]
                },
                weakProductDescriptions: {
                  type: Type.OBJECT,
                  properties: {
                    hasGap: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    businessImpact: { type: Type.STRING },
                    expectedImprovement: { type: Type.STRING }
                  },
                  required: ["hasGap", "description", "reasoning", "businessImpact", "expectedImprovement"]
                },
                missingStructuredData: {
                  type: Type.OBJECT,
                  properties: {
                    hasGap: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    businessImpact: { type: Type.STRING },
                    expectedImprovement: { type: Type.STRING }
                  },
                  required: ["hasGap", "description", "reasoning", "businessImpact", "expectedImprovement"]
                },
                noTrustBadges: {
                  type: Type.OBJECT,
                  properties: {
                    hasGap: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    businessImpact: { type: Type.STRING },
                    expectedImprovement: { type: Type.STRING }
                  },
                  required: ["hasGap", "description", "reasoning", "businessImpact", "expectedImprovement"]
                },
                noCertifications: {
                  type: Type.OBJECT,
                  properties: {
                    hasGap: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    businessImpact: { type: Type.STRING },
                    expectedImprovement: { type: Type.STRING }
                  },
                  required: ["hasGap", "description", "reasoning", "businessImpact", "expectedImprovement"]
                },
                poorComparisonInfo: {
                  type: Type.OBJECT,
                  properties: {
                    hasGap: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    businessImpact: { type: Type.STRING },
                    expectedImprovement: { type: Type.STRING }
                  },
                  required: ["hasGap", "description", "reasoning", "businessImpact", "expectedImprovement"]
                },
                weakAuthority: {
                  type: Type.OBJECT,
                  properties: {
                    hasGap: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    businessImpact: { type: Type.STRING },
                    expectedImprovement: { type: Type.STRING }
                  },
                  required: ["hasGap", "description", "reasoning", "businessImpact", "expectedImprovement"]
                }
              },
              required: ["missingFaq", "weakProductDescriptions", "missingStructuredData", "noTrustBadges", "noCertifications", "poorComparisonInfo", "weakAuthority"]
            },
            competitors: {
              type: Type.ARRAY,
              description: "Exactly 3 real direct competitors with unique values for accurate benchmarking.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  aiReadiness: { type: Type.INTEGER },
                  trust: { type: Type.INTEGER },
                  content: { type: Type.INTEGER },
                  visibility: { type: Type.INTEGER },
                  productInfo: { type: Type.INTEGER },
                  recommendationProbability: { type: Type.INTEGER },
                  strategicGap: { type: Type.STRING, description: "Explains precisely where the competitor is stronger/weaker and what return opportunities exist." }
                },
                required: ["name", "aiReadiness", "trust", "content", "visibility", "productInfo", "recommendationProbability", "strategicGap"]
              }
            },
            recommendations: {
              type: Type.ARRAY,
              description: "List of 4-5 highly custom priority recommendations sorted from highest impact to lowest.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  priority: { type: Type.STRING, description: "'High' | 'Medium' | 'Low'" },
                  title: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  businessValue: { type: Type.STRING, description: "Strategic return or commercial value unlocked by this action." },
                  difficulty: { type: Type.STRING, description: "'Easy' | 'Medium' | 'Hard'" }
                },
                required: ["id", "priority", "title", "impact", "description", "category", "businessValue", "difficulty"]
              }
            },
            executiveSummary: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.INTEGER },
                topProblems: { type: Type.ARRAY, items: { type: Type.STRING } },
                quickWins: { type: Type.ARRAY, items: { type: Type.STRING } },
                estimatedVisibility: { type: Type.INTEGER },
                recommendationProbability: { type: Type.INTEGER },
                nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                textSummary: { type: Type.STRING },
                strategicVerdict: { type: Type.STRING, description: "McKinsey/BCG-style strategic overview verdict." }
              },
              required: ["overallScore", "topProblems", "quickWins", "estimatedVisibility", "recommendationProbability", "nextSteps", "textSummary", "strategicVerdict"]
            }
          },
          required: ["companyName", "overallScore", "crawlStats", "scoreBreakdown", "visibility", "explainability", "competitors", "recommendations", "executiveSummary"]
        }
      }
    });

    const rawText = response.text?.trim() || "";
    const reportData: AIReadinessReport = JSON.parse(rawText);
    
    reportData.url = url;
    reportData.scannedAt = new Date().toISOString();

    return reportData;
  } catch (error: any) {
    console.error("Gemini invocation failed inside module. Error detail:", error.message);
    return null;
  }
}
