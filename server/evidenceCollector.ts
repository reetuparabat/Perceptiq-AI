/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScrapedPage } from "./crawler";
import { EvidenceModel, EvidenceItem } from "./types";

/**
 * Helper to determine the status of an evidence item based on Sprint 3.1.1 validation requirements (Task 9).
 * Never marks evidence "Not Found" if its strategic page failed, was blocked, or was never discovered.
 */
function determineStatus<T>(
  value: T | null,
  expectedRoles: ("Homepage" | "About" | "Products" | "FAQ" | "Contact")[],
  pages: ScrapedPage[]
): { value: T | null; status: "Found" | "Not Found" | "Unknown" | "Restricted"; sourcePage: string } {
  // If the value is found and is valid (not an empty array)
  if (value !== null && (!Array.isArray(value) || value.length > 0)) {
    // Find where we found it
    for (const role of expectedRoles) {
      const page = pages.find(p => p.role === role && p.success);
      if (page) {
        return { value, status: "Found", sourcePage: role };
      }
    }
    // Fallback to whichever page succeeded
    const anySucceededPage = pages.find(p => p.success);
    return { value, status: "Found", sourcePage: anySucceededPage ? anySucceededPage.role : "Homepage" };
  }

  // Value is not found. Check the status of the expected pages.
  let anyRestricted = false;
  let anyFailed = false;
  let anySucceeded = false;

  for (const role of expectedRoles) {
    const page = pages.find(p => p.role === role);
    if (page) {
      if (page.success) {
        anySucceeded = true;
      } else {
        if (page.isRestricted || (page.error && (
          page.error.toLowerCase().includes("bot") || 
          page.error.toLowerCase().includes("cloudflare") || 
          page.error.toLowerCase().includes("javascript") || 
          page.error.toLowerCase().includes("permission")
        ))) {
          anyRestricted = true;
        } else {
          anyFailed = true;
        }
      }
    } else {
      // Not discovered / never attempted
      anyFailed = true;
    }
  }

  if (anyRestricted) {
    return { value: null, status: "Restricted", sourcePage: "Not Applicable" };
  }

  if (!anySucceeded) {
    return { value: null, status: "Unknown", sourcePage: "Not Applicable" };
  }

  // At least one expected page succeeded, but we found no content matching this evidence.
  return { value: null, status: "Not Found", sourcePage: "Not Applicable" };
}

/**
 * Deterministically compiles factual observations from crawled pages into an EvidenceModel.
 * Implements Sprint 3.1.1 validation layers and safety checks.
 */
export function collectEvidence(pages: ScrapedPage[]): EvidenceModel {
  console.log(`[EVIDENCE COLLECTION] Compiling facts from ${pages.length} crawled pages...`);

  const homepage = pages.find(p => p.role === "Homepage");
  const about = pages.find(p => p.role === "About" || p.semanticRole === "About");
  const products = pages.find(p => p.role === "Products" || p.semanticRole === "Products" || p.semanticRole === "Pricing");
  const faq = pages.find(p => p.role === "FAQ" || p.semanticRole === "FAQ" || p.semanticRole === "Support" || p.semanticRole === "Documentation");
  const contact = pages.find(p => p.role === "Contact" || p.semanticRole === "Contact");

  // Helper to search text across multiple pages with a preferred order (expanded regex patterns)
  function searchPagesForPattern(
    preferredPages: (ScrapedPage | undefined)[],
    regex: RegExp,
    cleaningFn?: (match: string) => string
  ): { value: string | null; source: string } {
    for (const page of preferredPages) {
      if (page && page.success && page.text) {
        const match = page.text.match(regex);
        if (match && match[0]) {
          const val = cleaningFn ? cleaningFn(match[0]) : match[0].trim();
          if (val) {
            return { value: val, source: page.role };
          }
        }
      }
    }
    return { value: null, source: "Not Applicable" };
  }

  // 1. Business Name (Homepage Title or clean site branding)
  let businessNameVal: string | null = null;
  if (homepage && homepage.success && homepage.title) {
    let name = homepage.title.split(/[|\-–•]/)[0].trim();
    if (!name || name.toLowerCase() === "index" || name.toLowerCase() === "home" || name.toLowerCase() === "loading") {
      try {
        const hostname = new URL(homepage.url).hostname.replace("www.", "");
        name = hostname.split(".")[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
      } catch {
        name = "Unknown Business";
      }
    }
    businessNameVal = name;
  }
  const businessNameStatus = determineStatus(businessNameVal, ["Homepage"], pages);
  const businessNameItem: EvidenceItem<string> = {
    value: businessNameStatus.value,
    status: businessNameStatus.status,
    sourcePage: businessNameStatus.sourcePage
  };

  // 2. Email Pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/gi;
  const emailMatch = searchPagesForPattern([contact, homepage, about, products, faq], emailRegex);
  const emailStatus = determineStatus(emailMatch.value ? emailMatch.value.toLowerCase() : null, ["Contact", "Homepage", "About"], pages);
  const emailItem: EvidenceItem<string> = {
    value: emailStatus.value,
    status: emailStatus.status,
    sourcePage: emailStatus.sourcePage
  };

  // 3. Phone Pattern
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phoneMatch = searchPagesForPattern([contact, homepage, about, products, faq], phoneRegex);
  const phoneStatus = determineStatus(phoneMatch.value, ["Contact", "Homepage", "About"], pages);
  const phoneItem: EvidenceItem<string> = {
    value: phoneStatus.value,
    status: phoneStatus.status,
    sourcePage: phoneStatus.sourcePage
  };

  // 4. Address Pattern (Looks for Street names, Suite, Zip codes)
  const addressRegex = /\d{1,5}\s+(?:[a-zA-Z0-9.#/]+\s+){1,4}(?:Street|St|Avenue|Ave|Road|Rd|Highway|Hwy|Boulevard|Blvd|Suite|Ste|Drive|Dr|Way|Court|Ct|PO Box)\b[^,]*,\s*[A-Z]{2}\s+\d{5}/gi;
  const addressMatch = searchPagesForPattern([contact, homepage, about], addressRegex);
  const addressStatus = determineStatus(addressMatch.value, ["Contact", "Homepage", "About"], pages);
  const addressItem: EvidenceItem<string> = {
    value: addressStatus.value,
    status: addressStatus.status,
    sourcePage: addressStatus.sourcePage
  };

  // 5. Products Found (Task 5: Expanded keyword catalog matching)
  let productsFoundVal: string[] | null = null;
  const prodPage = products || homepage;
  if (prodPage && prodPage.success && prodPage.text) {
    const text = prodPage.text.toLowerCase();
    const items: string[] = [];
    const productKeywords = [
      "software", "pricing", "plan", "features", "solutions", "bundle", "subscription",
      "hardware", "catalog", "shop", "store", "buy", "product details", "merchandise"
    ];
    productKeywords.forEach(kw => {
      if (text.includes(kw)) {
        items.push(kw.charAt(0).toUpperCase() + kw.slice(1));
      }
    });
    if (items.length > 0) {
      productsFoundVal = items;
    }
  }
  const productsFoundStatus = determineStatus(productsFoundVal, ["Products", "Homepage"], pages);
  const productsFoundItem: EvidenceItem<string[]> = {
    value: productsFoundStatus.value,
    status: productsFoundStatus.status,
    sourcePage: productsFoundStatus.sourcePage
  };

  // 6. Services Found
  let servicesFoundVal: string[] | null = null;
  const serviceKeywords = ["consulting", "support", "delivery", "maintenance", "integration", "training", "custom setup", "professional services"];
  const foundServices: string[] = [];
  pages.forEach(p => {
    if (p.success && p.text) {
      const pTextLower = p.text.toLowerCase();
      serviceKeywords.forEach(s => {
        if (pTextLower.includes(s) && !foundServices.includes(s)) {
          foundServices.push(s.charAt(0).toUpperCase() + s.slice(1));
        }
      });
    }
  });
  if (foundServices.length > 0) {
    servicesFoundVal = foundServices;
  }
  const servicesFoundStatus = determineStatus(servicesFoundVal, ["Products", "About", "Homepage"], pages);
  const servicesFoundItem: EvidenceItem<string[]> = {
    value: servicesFoundStatus.value,
    status: servicesFoundStatus.status,
    sourcePage: servicesFoundStatus.sourcePage
  };

  // 7. Product Titles
  let productTitlesVal: string[] | null = null;
  const pPageForTitles = products || homepage;
  if (pPageForTitles && pPageForTitles.success) {
    const h2Regex = /<h2[^>]*>([^<]+)<\/h2>/gi;
    const h2s: string[] = [];
    let match;
    while ((match = h2Regex.exec(pPageForTitles.html)) !== null) {
      const h2Text = match[1].trim();
      if (h2Text.length > 3 && h2Text.length < 50 && !h2Text.toLowerCase().includes("menu") && !h2Text.toLowerCase().includes("contact")) {
        h2s.push(h2Text);
      }
    }
    if (h2s.length > 0) {
      productTitlesVal = h2s.slice(0, 8);
    }
  }
  const productTitlesStatus = determineStatus(productTitlesVal, ["Products"], pages);
  const productTitlesItem: EvidenceItem<string[]> = {
    value: productTitlesStatus.value,
    status: productTitlesStatus.status,
    sourcePage: productTitlesStatus.sourcePage
  };

  // 8. Product Specifications (Task 5: Expanded synonymous specifications keywords)
  let productSpecsVal: string[] | null = null;
  const specKeywords = [
    "dimension", "weight", "material", "system requirements", "specifications", "purity", 
    "size", "compatibility", "technical details", "features", "attributes", "specs"
  ];
  const foundSpecs: string[] = [];
  const pPageForSpecs = products || homepage;
  if (pPageForSpecs && pPageForSpecs.success && pPageForSpecs.text) {
    const specLower = pPageForSpecs.text.toLowerCase();
    specKeywords.forEach(sk => {
      if (specLower.includes(sk)) {
        foundSpecs.push(sk.charAt(0).toUpperCase() + sk.slice(1));
      }
    });
  }
  if (foundSpecs.length > 0) {
    productSpecsVal = foundSpecs;
  }
  const productSpecsStatus = determineStatus(productSpecsVal, ["Products"], pages);
  const productSpecsItem: EvidenceItem<string[]> = {
    value: productSpecsStatus.value,
    status: productSpecsStatus.status,
    sourcePage: productSpecsStatus.sourcePage
  };

  // 9. FAQ Questions (Task 5: Support/Help/Knowledge base synonymous extraction)
  let faqQuestionsVal: string[] | null = null;
  const faqPageForQ = faq || homepage;
  if (faqPageForQ && faqPageForQ.success) {
    const questionRegex = /([^.!?\n]+\?)/g;
    const matches = faqPageForQ.text.match(questionRegex) || [];
    const questions = matches
      .map(q => q.trim())
      .filter(q => q.length > 15 && q.length < 120 && !q.toLowerCase().includes("cookie"))
      .slice(0, 10);

    if (questions.length > 0) {
      faqQuestionsVal = questions;
    }
  }
  const faqQuestionsStatus = determineStatus(faqQuestionsVal, ["FAQ"], pages);
  const faqQuestionsItem: EvidenceItem<string[]> = {
    value: faqQuestionsStatus.value,
    status: faqQuestionsStatus.status,
    sourcePage: faqQuestionsStatus.sourcePage
  };

  // 10. Policies: Shipping, Return, Warranty (Task 5: Expanded synonyms matching)
  const shippingMatch = searchPagesForPattern(
    [products, homepage, faq],
    /[^.!?\n]*(?:shipping policy|delivery rate|shipping method|standard shipping|delivery option|dispatch time|postage charge)[^.!?\n]*/gi
  );
  const shippingStatus = determineStatus(shippingMatch.value, ["Products", "FAQ", "Homepage"], pages);
  const shippingItem: EvidenceItem<string> = {
    value: shippingStatus.value,
    status: shippingStatus.status,
    sourcePage: shippingStatus.sourcePage
  };

  const returnMatch = searchPagesForPattern(
    [products, homepage, faq],
    /[^.!?\n]*(?:return policy|refund|refund policy|money back guarantee|exchange option|cancellation policy|cancel order)[^.!?\n]*/gi
  );
  const returnPolicyStatus = determineStatus(returnMatch.value, ["Products", "FAQ", "Homepage"], pages);
  const returnPolicyItem: EvidenceItem<string> = {
    value: returnPolicyStatus.value,
    status: returnPolicyStatus.status,
    sourcePage: returnPolicyStatus.sourcePage
  };

  const warrantyMatch = searchPagesForPattern(
    [products, homepage, faq],
    /[^.!?\n]*(?:warranty|guarantee|certified warranty|active guarantee|warranty period|product guarantee)[^.!?\n]*/gi
  );
  const warrantyStatus = determineStatus(warrantyMatch.value, ["Products", "FAQ", "Homepage"], pages);
  const warrantyItem: EvidenceItem<string> = {
    value: warrantyStatus.value,
    status: warrantyStatus.status,
    sourcePage: warrantyStatus.sourcePage
  };

  // 11. Trust Signals & Certificates
  let certificatesVal: string[] | null = null;
  const trustKeywords = ["iso", "soc2", "pci", "gdpr", "pci-dss", "ssl", "certified", "trusted", "secure checkout", "norton secured"];
  const foundTrust: string[] = [];
  pages.forEach(p => {
    if (p.success && p.text) {
      const pTextLower = p.text.toLowerCase();
      trustKeywords.forEach(tk => {
        if (pTextLower.includes(tk) && !foundTrust.includes(tk)) {
          foundTrust.push(tk.toUpperCase());
        }
      });
    }
  });
  if (foundTrust.length > 0) {
    certificatesVal = foundTrust;
  }
  const certificatesStatus = determineStatus(certificatesVal, ["About", "Homepage"], pages);
  const certificatesItem: EvidenceItem<string[]> = {
    value: certificatesStatus.value,
    status: certificatesStatus.status,
    sourcePage: certificatesStatus.sourcePage
  };

  // 12. Business Descriptions (Scrape about description or meta tags)
  const descriptions: string[] = [];
  if (homepage && homepage.success && homepage.description) {
    descriptions.push(homepage.description);
  }
  if (about && about.success && about.description) {
    descriptions.push(about.description);
  }
  const businessDescStatus = determineStatus(descriptions.length > 0 ? descriptions : null, ["About", "Homepage"], pages);
  const businessDescItem: EvidenceItem<string[]> = {
    value: businessDescStatus.value,
    status: businessDescStatus.status,
    sourcePage: businessDescStatus.sourcePage
  };

  // 13. Pricing Information
  const pricingMatch = searchPagesForPattern(
    [products, homepage],
    /(?:pricing starts at|subscription starts at|starting from|plan is|\$\d+(?:\.\d{2})?|cost is|price is)/gi
  );
  const pricingStatus = determineStatus(pricingMatch.value, ["Products"], pages);
  const pricingInfoItem: EvidenceItem<string> = {
    value: pricingStatus.value,
    status: pricingStatus.status,
    sourcePage: pricingStatus.sourcePage
  };

  // 14. Images Count
  let totalImages = 0;
  pages.forEach(p => {
    if (p.success && p.html) {
      const count = (p.html.match(/<img[^>]+/gi) || []).length;
      totalImages += count;
    }
  });
  const imagesStatus = determineStatus(totalImages > 0 ? totalImages : null, ["Homepage", "Products"], pages);
  const imagesCountItem: EvidenceItem<number> = {
    value: imagesStatus.value,
    status: imagesStatus.status,
    sourcePage: imagesStatus.sourcePage
  };

  // 15. Page Titles
  const titlesMap: Record<string, string> = {};
  pages.forEach(p => {
    if (p.success && p.title) {
      titlesMap[p.role] = p.title;
    }
  });
  const titlesStatus = determineStatus(Object.keys(titlesMap).length > 0 ? titlesMap : null, ["Homepage"], pages);
  const pageTitlesItem: EvidenceItem<Record<string, string>> = {
    value: titlesStatus.value,
    status: titlesStatus.status,
    sourcePage: titlesStatus.sourcePage
  };

  // 16. Meta Descriptions
  const descriptionsMap: Record<string, string> = {};
  pages.forEach(p => {
    if (p.success && p.description) {
      descriptionsMap[p.role] = p.description;
    }
  });
  const descriptionsStatus = determineStatus(Object.keys(descriptionsMap).length > 0 ? descriptionsMap : null, ["Homepage"], pages);
  const metaDescriptionsItem: EvidenceItem<Record<string, string>> = {
    value: descriptionsStatus.value,
    status: descriptionsStatus.status,
    sourcePage: descriptionsStatus.sourcePage
  };

  // 17. Detected Languages
  const languages: string[] = [];
  pages.forEach(p => {
    if (p.success && p.html) {
      const match = p.html.match(/<html[^>]*lang=["']([^"']+)["']/i);
      if (match && match[1]) {
        const langCode = match[1].toLowerCase().split("-")[0];
        const langName = langCode === "es" ? "Spanish" : langCode === "fr" ? "French" : langCode === "de" ? "German" : "English";
        if (!languages.includes(langName)) {
          languages.push(langName);
        }
      }
    }
  });
  if (languages.length === 0) {
    languages.push("English"); // Fallback
  }
  const languagesStatus = determineStatus(languages, ["Homepage"], pages);
  const detectedLanguagesItem: EvidenceItem<string[]> = {
    value: languagesStatus.value,
    status: languagesStatus.status,
    sourcePage: languagesStatus.sourcePage
  };

  // Compile full list of page crawling logs for audit
  const pagesCrawledLogs = pages.map(p => {
    let finalStatus: "Success" | "Failed" | "Unknown" = "Unknown";
    if (p.success) {
      finalStatus = "Success";
    } else if (p.isRestricted) {
      finalStatus = "Unknown"; // backward compatibility limit
    } else {
      finalStatus = "Failed";
    }

    return {
      url: p.url,
      role: p.role,
      status: finalStatus,
      error: p.error,
    };
  });

  // Calculate detailed stats from crawl outcomes
  let pAttempted = pages.length;
  let pCrawled = pages.filter(p => p.success).length;
  let pFailed = pages.filter(p => !p.success && !p.skipped && !p.isRestricted).length;
  let pSkipped = pages.filter(p => p.skipped).length;
  let pDuplicated = pages.filter(p => p.skipped && p.failureReason === "Duplicate Content").length;
  let pRestricted = pages.filter(p => p.isRestricted).length;
  
  // Track redirects in chain
  let pRedirected = pages.filter(p => p.redirectChain && p.redirectChain.length > 0).length;

  let totalTime = 0;
  let largestSize = 0;
  let smallestSize = Infinity;
  pages.forEach(p => {
    if (p.responseTime) totalTime += p.responseTime;
    if (p.responseSize) {
      largestSize = Math.max(largestSize, p.responseSize);
      smallestSize = Math.min(smallestSize, p.responseSize);
    }
  });
  const avgTime = pAttempted > 0 ? Math.round(totalTime / pAttempted) : 0;
  const sRate = pAttempted > 0 ? Math.round((pCrawled / pAttempted) * 100) : 0;

  const model: EvidenceModel = {
    businessName: businessNameItem,
    contactInfo: {
      phone: phoneItem,
      email: emailItem,
      address: addressItem,
    },
    productsFound: productsFoundItem,
    servicesFound: servicesFoundItem,
    productTitles: productTitlesItem,
    productSpecifications: productSpecsItem,
    faqQuestions: faqQuestionsItem,
    policies: {
      shippingInfo: shippingItem,
      returnPolicy: returnPolicyItem,
      warranty: warrantyItem,
    },
    trustSignals: {
      certificates: certificatesItem,
    },
    businessDescriptions: businessDescItem,
    pricingInfo: pricingInfoItem,
    imagesCount: imagesCountItem,
    pageTitles: pageTitlesItem,
    metaDescriptions: metaDescriptionsItem,
    detectedLanguages: detectedLanguagesItem,
    pagesCrawled: pagesCrawledLogs,
    crawlReport: {
      pages: pages.map(p => ({
        url: p.url,
        role: p.semanticRole || p.role,
        httpStatus: p.httpStatus || 0,
        contentType: p.contentType || "Unknown",
        responseSize: p.responseSize || 0,
        responseTime: p.responseTime || 0,
        success: p.success,
        failureReason: p.failureReason || p.error || undefined,
        titleFound: p.titleFound || false,
        metaDescriptionFound: p.metaDescriptionFound || false,
        linksExtracted: p.linksExtracted || 0
      }))
    },
    crawlStatsEnriched: {
      pagesAttempted: pAttempted,
      pagesSuccessfullyCrawled: pCrawled,
      pagesFailed: pFailed,
      pagesRedirected: pRedirected,
      pagesSkipped: pSkipped,
      pagesDuplicated: pDuplicated,
      pagesRestricted: pRestricted,
      averageResponseTime: avgTime,
      largestPageSize: largestSize,
      smallestPageSize: smallestSize === Infinity ? 0 : smallestSize,
      successRate: sRate
    }
  };

  console.log(`[EVIDENCE FACTORY COMPLETE] Compiled. Attempted: ${pAttempted}, Successes: ${pCrawled}, Restricted: ${pRestricted}. Success Rate: ${sRate}%`);
  
  // Apply Evidence Consistency rules (Sprint 3.1.2 Task 6)
  return applyEvidenceConsistencyRules(model, pages);
}

/**
 * Post-processing validator to automatically correct impossible or contradictory evidence.
 * Implements Sprint 3.1.2 Task 6 Evidence Consistency Engine.
 */
function applyEvidenceConsistencyRules(model: EvidenceModel, pages: ScrapedPage[]): EvidenceModel {
  const hasHomepage = pages.some(p => p.role === "Homepage" && p.success);
  const anyPageSuccess = pages.some(p => p.success);

  // Rule 1: 'Homepage Found' and 'Business Name Missing' should not occur.
  if (hasHomepage) {
    if (model.businessName.status === "Not Found" || model.businessName.status === "Unknown" || !model.businessName.value) {
      const homepagePage = pages.find(p => p.role === "Homepage");
      let name = "Verifiable Business";
      if (homepagePage && homepagePage.url) {
        try {
          const hostname = new URL(homepagePage.url).hostname.replace("www.", "");
          name = hostname.split(".")[0];
          name = name.charAt(0).toUpperCase() + name.slice(1);
        } catch {}
      }
      model.businessName.value = name;
      model.businessName.status = "Found";
      model.businessName.sourcePage = "Homepage";
    }
  }

  // Rule 2: If any page crawled successfully, we successfully evaluated global layout and assets.
  if (anyPageSuccess) {
    if (model.imagesCount.status === "Not Found" || model.imagesCount.status === "Unknown") {
      model.imagesCount.status = "Found";
      model.imagesCount.value = model.imagesCount.value ?? 0;
      model.imagesCount.sourcePage = "Homepage";
    }
    if (model.pageTitles.status === "Not Found" || model.pageTitles.status === "Unknown") {
      model.pageTitles.status = "Found";
      model.pageTitles.sourcePage = "Homepage";
    }
    if (model.metaDescriptions.status === "Not Found" || model.metaDescriptions.status === "Unknown") {
      model.metaDescriptions.status = "Found";
      model.metaDescriptions.sourcePage = "Homepage";
    }
    if (model.detectedLanguages.status === "Not Found" || model.detectedLanguages.status === "Unknown") {
      model.detectedLanguages.status = "Found";
      model.detectedLanguages.value = model.detectedLanguages.value ?? ["English"];
      model.detectedLanguages.sourcePage = "Homepage";
    }
  }

  // Rule 3: Reconcile status based on page reachability (Task 5 rules):
  // - "Found → Verified"
  // - "Missing → Verified page crawled. Evidence absent." (i.e. status is "Not Found")
  // - "Unknown → Relevant page never found."
  // - "Restricted → Relevant page exists but crawler could not analyze it."
  
  const homepagePage = pages.find(p => p.role === "Homepage");
  const aboutPage = pages.find(p => p.role === "About");
  const productsPage = pages.find(p => p.role === "Products");
  const faqPage = pages.find(p => p.role === "FAQ");
  const contactPage = pages.find(p => p.role === "Contact");

  // A. Products page state mapping
  if (model.productsFound.status !== "Found") {
    if (productsPage?.isRestricted || homepagePage?.isRestricted) {
      model.productsFound.status = "Restricted";
    } else if (!productsPage) {
      model.productsFound.status = "Unknown";
    }
  }
  if (model.productTitles.status !== "Found") {
    if (productsPage?.isRestricted || homepagePage?.isRestricted) {
      model.productTitles.status = "Restricted";
    } else if (!productsPage) {
      model.productTitles.status = "Unknown";
    }
  }
  if (model.productSpecifications.status !== "Found") {
    if (productsPage?.isRestricted || homepagePage?.isRestricted) {
      model.productSpecifications.status = "Restricted";
    } else if (!productsPage) {
      model.productSpecifications.status = "Unknown";
    }
  }

  // B. FAQ page state mapping
  if (model.faqQuestions.status !== "Found") {
    if (faqPage?.isRestricted || homepagePage?.isRestricted) {
      model.faqQuestions.status = "Restricted";
    } else if (!faqPage) {
      model.faqQuestions.status = "Unknown";
    }
  }

  // C. Contact/Human inquiry state mapping
  if (model.contactInfo.phone.status !== "Found") {
    if (contactPage?.isRestricted || homepagePage?.isRestricted) {
      model.contactInfo.phone.status = "Restricted";
    } else if (!contactPage) {
      model.contactInfo.phone.status = "Unknown";
    }
  }
  if (model.contactInfo.email.status !== "Found") {
    if (contactPage?.isRestricted || homepagePage?.isRestricted) {
      model.contactInfo.email.status = "Restricted";
    } else if (!contactPage) {
      model.contactInfo.email.status = "Unknown";
    }
  }
  if (model.contactInfo.address.status !== "Found") {
    if (contactPage?.isRestricted || homepagePage?.isRestricted) {
      model.contactInfo.address.status = "Restricted";
    } else if (!contactPage) {
      model.contactInfo.address.status = "Unknown";
    }
  }

  // D. Policies state mapping
  if (model.policies.shippingInfo.status !== "Found") {
    if (productsPage?.isRestricted || faqPage?.isRestricted || homepagePage?.isRestricted) {
      model.policies.shippingInfo.status = "Restricted";
    } else if (!productsPage && !faqPage) {
      model.policies.shippingInfo.status = "Unknown";
    }
  }
  if (model.policies.returnPolicy.status !== "Found") {
    if (productsPage?.isRestricted || faqPage?.isRestricted || homepagePage?.isRestricted) {
      model.policies.returnPolicy.status = "Restricted";
    } else if (!productsPage && !faqPage) {
      model.policies.returnPolicy.status = "Unknown";
    }
  }
  if (model.policies.warranty.status !== "Found") {
    if (productsPage?.isRestricted || faqPage?.isRestricted || homepagePage?.isRestricted) {
      model.policies.warranty.status = "Restricted";
    } else if (!productsPage && !faqPage) {
      model.policies.warranty.status = "Unknown";
    }
  }

  // E. Trust & Certificates mapping
  if (model.trustSignals.certificates.status !== "Found") {
    if (aboutPage?.isRestricted || homepagePage?.isRestricted) {
      model.trustSignals.certificates.status = "Restricted";
    } else if (!aboutPage) {
      model.trustSignals.certificates.status = "Unknown";
    }
  }

  // F. Business Description mapping
  if (model.businessDescriptions.status !== "Found") {
    if (aboutPage?.isRestricted || homepagePage?.isRestricted) {
      model.businessDescriptions.status = "Restricted";
    } else if (!aboutPage) {
      model.businessDescriptions.status = "Unknown";
    }
  }

  // G. Pricing mapping
  if (model.pricingInfo.status !== "Found") {
    if (productsPage?.isRestricted || homepagePage?.isRestricted) {
      model.pricingInfo.status = "Restricted";
    } else if (!productsPage) {
      model.pricingInfo.status = "Unknown";
    }
  }

  return model;
}
