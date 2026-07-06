/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import { validateUrl, validateWebsiteReachability } from "./validator";
import { crawlStrategicPages } from "./crawler";
import { collectEvidence } from "./evidenceCollector";
import { AIReadinessReport } from "./types";
import { calculateReadinessReport } from "./scoring";
import { generateAiExplanation } from "./explanation";

const router = Router();

router.post("/analyze", async (req: Request, res: Response) => {
  const { url } = req.body;
  
  // 1. Validate and clean target URL syntax
  const validation = validateUrl(url);
  if (!validation.isValid || !validation.normalizedUrl) {
    return res.status(400).json({ error: validation.error || "URL query parameter is required." });
  }

  const targetUrl = validation.normalizedUrl;
  console.log(`\n--- [Sprint 3 Scan Route] Request Received: ${targetUrl} ---`);

  try {
    // 2. Perform server-side DNS and HTTP/HTTPS connectivity checks
    const reachability = await validateWebsiteReachability(targetUrl);
    if (!reachability.isValid) {
      console.log(`[ROUTE BLOCKED] Scanner aborted due to validation failure. Reason: ${reachability.error}`);
      return res.status(422).json({
        error: `${reachability.error}: ${reachability.reason}`,
        reason: reachability.reason,
        suggestion: reachability.suggestion,
        status: reachability.status,
        confidence: reachability.confidence,
      });
    }

    // 3. Crawl up to 5 strategic pages
    const crawledPages = await crawlStrategicPages(targetUrl);

    // 4. Verify we collected usable evidence. If homepage crawl failed, we have insufficient evidence.
    const homepageCrawl = crawledPages.find(p => p.role === "Homepage");
    if (!homepageCrawl || !homepageCrawl.success || !homepageCrawl.text) {
      console.log(`[ROUTE BLOCKED] Insufficient evidence found for ${targetUrl}`);
      return res.status(422).json({
        error: "Insufficient Evidence. Could not extract usable content or establish server connection with the target website.",
        reason: "The target website did not return any readable content during crawl attempt.",
        suggestion: "Verify the website is online, allows web scrapers, and has readable plain text content.",
      });
    }

    // 5. Build clean, deterministic, traceable Evidence Model
    const evidence = collectEvidence(crawledPages);

    // 6. Build report structure using deterministic, evidence-based scoring engine (Sprint 4)
    console.log(`[SCORING ENGINE] Commencing deterministic score calculation for ${targetUrl}...`);
    const reportData = calculateReadinessReport(evidence, targetUrl);

    // 7. Generate optional AI Business Explanation (Sprint 6)
    try {
      console.log(`[ROUTE] Invoking Sprint 6 AI Explanation Engine...`);
      const explanation = await generateAiExplanation(reportData);
      if (explanation) {
        reportData.explanation = explanation;
      }
    } catch (explanationError) {
      console.error("[ROUTE] Optional AI Explanation failed gracefully:", explanationError);
    }

    console.log(`[ROUTE SUCCESS] Scoring Engine completed. Overall Score: ${reportData.overallScore}/100.`);
    return res.json(reportData);
  } catch (error: any) {
    console.error("General API Error in scan route:", error);
    return res.status(500).json({ error: "Failed to scan website. Please verify the URL and try again." });
  }
});

export default router;

