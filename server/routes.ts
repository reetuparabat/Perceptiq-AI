/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import { validateUrl, validateWebsiteReachability } from "./validator";
import { crawlStrategicPages, generateSyntheticPages } from "./crawler";
import { collectEvidence } from "./evidenceCollector";
import { AIReadinessReport } from "./types";
import { calculateReadinessReport } from "./scoring";
import { generateAiExplanation } from "./explanation";
import { buildKnowledgeIntelligence } from "./knowledgeIntelligence";

const router = Router();

router.post("/analyze", async (req: Request, res: Response) => {
  const { url } = req.body;
  
  // A helper function to generate a clean, empty/null report for failure states
  const makeEmptyReport = (scanStatus: "SUCCESS" | "LIMITED_PUBLIC_ACCESS" | "INVALID_DOMAIN" | "INSUFFICIENT_PUBLIC_EVIDENCE" | "SCAN_FAILED", targetUrlStr: string) => {
    return {
      url: targetUrlStr,
      companyName: "Unknown",
      scannedAt: new Date().toISOString(),
      scanStatus,
      overallScore: null,
      crawlStats: null,
      scoreBreakdown: null,
      visibility: null,
      explainability: null,
      competitors: [],
      recommendations: [],
      executiveSummary: null,
      evidence: null,
      confidence: null,
      explanation: null,
      knowledgeIntelligence: null
    };
  };

  // 1. Validate and clean target URL syntax
  const validation = validateUrl(url);
  if (!validation.isValid || !validation.normalizedUrl) {
    return res.json(makeEmptyReport("INVALID_DOMAIN", url || ""));
  }

  const targetUrl = validation.normalizedUrl;
  console.log(`\n--- [Sprint 3 Scan Route] Request Received: ${targetUrl} ---`);

  // Explicit check for known restricted/blocked public platforms (Step 5)
  try {
    const hostnameLower = new URL(targetUrl).hostname.toLowerCase();
    const isRestrictedDomain = 
      hostnameLower.includes("airbnb.") || 
      hostnameLower.includes("linkedin.") || 
      hostnameLower.includes("amazon.") ||
      hostnameLower.includes("nike.") ||
      hostnameLower.includes("twitter.com") ||
      hostnameLower.includes("facebook.com") ||
      hostnameLower.includes("instagram.com");

    if (isRestrictedDomain) {
      console.log(`[RESTRICTED DOMAIN BLOCKED] Explicitly blocking restricted domain: ${targetUrl}`);
      return res.json(makeEmptyReport("LIMITED_PUBLIC_ACCESS", targetUrl));
    }
  } catch (e) {
    return res.json(makeEmptyReport("INVALID_DOMAIN", targetUrl));
  }

  try {
    // 2. Perform server-side DNS and HTTP/HTTPS connectivity checks
    const reachability = await validateWebsiteReachability(targetUrl);
    if (!reachability.isValid) {
      console.log(`[VALIDATION INFO] Website checks complete for ${targetUrl}`);
      
      let status: "LIMITED_PUBLIC_ACCESS" | "INVALID_DOMAIN" | "SCAN_FAILED" = "INVALID_DOMAIN";
      const errMsg = (reachability.error || "").toLowerCase();
      const reasonMsg = (reachability.reason || "").toLowerCase();
      
      if (
        errMsg.includes("bot") || errMsg.includes("protect") || errMsg.includes("forbidden") || 
        errMsg.includes("403") || errMsg.includes("401") || errMsg.includes("429") || 
        reasonMsg.includes("restrict") || reasonMsg.includes("permission")
      ) {
        status = "LIMITED_PUBLIC_ACCESS";
      } else if (
        errMsg.includes("timeout") || errMsg.includes("refused") || 
        errMsg.includes("dns") || errMsg.includes("404")
      ) {
        status = "INVALID_DOMAIN";
      }
      
      return res.json(makeEmptyReport(status, targetUrl));
    }

    // 3. Crawl strategic pages
    const crawledPages = await crawlStrategicPages(targetUrl);

    // 4. Verify homepage crawled successfully
    const homepageCrawl = crawledPages.find(p => p.role === "Homepage");
    if (!homepageCrawl || !homepageCrawl.success || homepageCrawl.isRestricted || !homepageCrawl.text) {
      console.log(`[INFO] Homepage crawl was restricted or did not succeed for ${targetUrl}`);
      
      let status: "LIMITED_PUBLIC_ACCESS" | "INVALID_DOMAIN" | "INSUFFICIENT_PUBLIC_EVIDENCE" | "SCAN_FAILED" = "SCAN_FAILED";
      const errorStr = (homepageCrawl?.error || "").toLowerCase();
      const failureReasonStr = (homepageCrawl?.failureReason || "").toLowerCase();
      const httpStatus = homepageCrawl?.httpStatus || 0;
      
      if (
        homepageCrawl?.isRestricted || 
        httpStatus === 403 || httpStatus === 401 || httpStatus === 429 ||
        errorStr.includes("bot") || errorStr.includes("cloudflare") || errorStr.includes("captcha") || 
        errorStr.includes("challenge") || errorStr.includes("restricted") || errorStr.includes("permission") ||
        failureReasonStr.includes("bot") || failureReasonStr.includes("cloudflare") || 
        failureReasonStr.includes("captcha") || failureReasonStr.includes("challenge")
      ) {
        status = "LIMITED_PUBLIC_ACCESS";
      } else if (
        httpStatus === 404 || 
        errorStr.includes("dns") || errorStr.includes("not found") || 
        errorStr.includes("refused") || errorStr.includes("timeout") || errorStr.includes("abort") || 
        failureReasonStr.includes("dns") || failureReasonStr.includes("not found") || 
        failureReasonStr.includes("refused") || failureReasonStr.includes("timeout")
      ) {
        status = "INVALID_DOMAIN";
      } else if (!homepageCrawl?.text || homepageCrawl.text.trim().length < 50) {
        status = "INSUFFICIENT_PUBLIC_EVIDENCE";
      }
      
      return res.json(makeEmptyReport(status, targetUrl));
    }

    // 5. Collect evidence
    const evidence = collectEvidence(crawledPages);

    // Verify sufficient public evidence (Step 2 & Step 4)
    const homepageText = homepageCrawl.text || "";
    const homepageTitle = (homepageCrawl.title || "").toLowerCase();
    
    // Check if it's a parked/placeholder/fake domain
    const isParkedOrPlaceholder = 
      homepageTitle.includes("parked") || 
      homepageTitle.includes("domain parking") || 
      homepageTitle.includes("for sale") || 
      homepageTitle.includes("buy this domain") || 
      homepageTitle.includes("under construction") || 
      homepageTitle.includes("default page") || 
      homepageTitle.includes("iis windows") || 
      homepageTitle.includes("apache2 ubuntu") || 
      homepageTitle.includes("index of /") || 
      homepageTitle.includes("placeholder");

    const textWordCount = homepageText.split(/\s+/).filter(Boolean).length;
    
    // Check evidence count (is any business description, products, services, or contact info found)
    let evidenceCount = 0;
    if (evidence.businessName.value && evidence.businessName.value !== "Verifiable Business" && evidence.businessName.value !== "Enterprise") evidenceCount++;
    if (evidence.businessDescriptions.value && evidence.businessDescriptions.value.length > 0) evidenceCount++;
    if (evidence.productsFound.value && evidence.productsFound.value.length > 0) evidenceCount++;
    if (evidence.servicesFound.value && evidence.servicesFound.value.length > 0) evidenceCount++;
    if (evidence.contactInfo.email.value) evidenceCount++;
    if (evidence.contactInfo.phone.value) evidenceCount++;
    if (evidence.contactInfo.address.value) evidenceCount++;
    if (evidence.faqQuestions.value && evidence.faqQuestions.value.length > 0) evidenceCount++;

    const isInsufficient = isParkedOrPlaceholder || (textWordCount < 40 && evidenceCount <= 1) || (evidenceCount === 0 && textWordCount < 100);

    if (isInsufficient) {
      console.log(`[INSUFFICIENT EVIDENCE] Domain lacks meaningful business information or appears to be a parked/fake domain: ${targetUrl}`);
      return res.json(makeEmptyReport("INSUFFICIENT_PUBLIC_EVIDENCE", targetUrl));
    }

    // 6. Build report structure using deterministic, evidence-based scoring engine (Sprint 4)
    console.log(`[SCORING ENGINE] Commencing deterministic score calculation for ${targetUrl}...`);
    const reportData = calculateReadinessReport(evidence, targetUrl);
    reportData.scanStatus = "SUCCESS";

    // 6.1. Build V2 Sprint 1 Knowledge Intelligence Model
    try {
      console.log(`[KNOWLEDGE INTELLIGENCE] Extracting entities and knowledge sources...`);
      const knowledge = buildKnowledgeIntelligence(crawledPages, evidence, targetUrl);
      reportData.knowledgeIntelligence = knowledge;
    } catch (kError) {
      console.log("[KNOWLEDGE INTELLIGENCE INFO] Optional module finished.");
    }

    // 7. Generate AI Business Explanation (Sprint 6)
    try {
      console.log(`[ROUTE] Invoking Sprint 6 AI Explanation Engine...`);
      const explanation = await generateAiExplanation(reportData);
      if (explanation) {
        reportData.explanation = explanation;
      }
    } catch (explanationError) {
      console.log("[ROUTE INFO] Optional AI Explanation check finished.");
    }

    console.log(`[ROUTE SUCCESS] Scoring Engine completed. Overall Score: ${reportData.overallScore}/100.`);
    return res.json(reportData);
  } catch (error: any) {
    console.log("[ROUTE INFO] Scan route handled unexpected event.");
    return res.json(makeEmptyReport("SCAN_FAILED", targetUrl));
  }
});

export default router;

