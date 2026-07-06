/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import dns from "dns";
import { promisify } from "util";

const dnsLookup = promisify(dns.lookup);

export interface ValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
  reason?: string;
  suggestion?: string;
  status: "Passed" | "Failed";
  confidence: "Valid" | "Invalid";
}

/**
 * Validates format of the target URL and normalizes it.
 */
export function validateUrl(targetUrl: string): { isValid: boolean; normalizedUrl?: string; error?: string } {
  if (!targetUrl || typeof targetUrl !== "string") {
    return { isValid: false, error: "URL query parameter is required." };
  }

  const trimmed = targetUrl.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: "URL cannot be empty." };
  }

  try {
    const hasProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://");
    const withProtocol = hasProtocol ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    
    // Ensure protocol is supported (http or https)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        isValid: false,
        error: "Supported protocols are only HTTP and HTTPS.",
      };
    }

    return {
      isValid: true,
      normalizedUrl: parsed.toString(),
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Please enter a valid website URL (e.g., example.com).",
    };
  }
}

/**
 * Performs deep server-side DNS resolution and HTTP/HTTPS reachability checks.
 */
export async function validateWebsiteReachability(normalizedUrl: string): Promise<ValidationResult> {
  console.log(`[VALIDATION STARTED] Verifying reachability of: ${normalizedUrl}`);

  try {
    const parsedUrl = new URL(normalizedUrl);
    const hostname = parsedUrl.hostname;

    console.log(`[URL PARSED] Hostname identified: ${hostname}`);

    // 1. DNS Resolution Check
    try {
      await dnsLookup(hostname);
      console.log(`[DNS SUCCESS] Hostname resolved successfully.`);
    } catch (dnsErr: any) {
      console.log(`[VALIDATION FAILED] DNS Lookup failed for ${hostname}. Reason: ${dnsErr.message}`);
      return {
        isValid: false,
        status: "Failed",
        confidence: "Invalid",
        error: "DNS Lookup Failed",
        reason: `The domain name '${hostname}' could not be resolved. This usually means the website does not exist or has no active DNS records.`,
        suggestion: "Please double-check the spelling of the domain and ensure it has been published online.",
      };
    }

    // 2. Fetch Reachability with Timeout & SSL inspection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 4000); // Strict 4-second timeout limit

    try {
      console.log(`[HTTPS VERIFIED] Attempting connection check...`);
      const response = await fetch(normalizedUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "PerceptiqCrawler/1.0 (+https://ai.studio/build; validation-engine)",
        },
      });
      clearTimeout(timeoutId);

      // 3. HTTP Status Inspection
      if (response.status === 404) {
        console.log(`[VALIDATION FAILED] Server returned HTTP 404.`);
        return {
          isValid: false,
          status: "Failed",
          confidence: "Invalid",
          error: "HTTP 404",
          reason: `The server returned a '404 Not Found' status code for ${normalizedUrl}.`,
          suggestion: "Verify that the path or landing page exists and has public viewing permissions.",
        };
      }

      if (response.status >= 500) {
        console.log(`[VALIDATION FAILED] Server returned HTTP ${response.status}.`);
        return {
          isValid: false,
          status: "Failed",
          confidence: "Invalid",
          error: `HTTP ${response.status}`,
          reason: `The server at ${hostname} is experiencing technical issues or is temporarily offline.`,
          suggestion: "Please try scanning again in a few minutes once host services are restored.",
        };
      }

      // 4. Content completeness (Empty response check)
      const text = await response.text();
      if (!text || text.trim().length === 0) {
        console.log(`[VALIDATION FAILED] Received empty HTML response.`);
        return {
          isValid: false,
          status: "Failed",
          confidence: "Invalid",
          error: "Empty Response",
          reason: "The server successfully completed the handshake but returned a completely empty body with zero content.",
          suggestion: "Check your landing directory index file to verify template contents are published.",
        };
      }

      console.log(`[VALIDATION PASSED] Website is fully reachable.`);
      return {
        isValid: true,
        normalizedUrl,
        status: "Passed",
        confidence: "Valid",
      };
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      const errMsg = fetchErr.message || "";
      const errCode = fetchErr.code || "";

      console.log(`[VALIDATION FAILED] Connection failure. Code: ${errCode}, Message: ${errMsg}`);

      // Handle Timeout
      if (fetchErr.name === "AbortError" || errMsg.includes("aborted") || errCode === "ETIMEDOUT") {
        return {
          isValid: false,
          status: "Failed",
          confidence: "Invalid",
          error: "Timeout",
          reason: "The target server took too long to complete the initial connection request (exceeded 4.0s).",
          suggestion: "Check your server hosting speeds, or verify that your CDN is not throttling requests.",
        };
      }

      // Handle Connection Refused
      if (errCode === "ECONNREFUSED" || errMsg.includes("refused")) {
        return {
          isValid: false,
          status: "Failed",
          confidence: "Invalid",
          error: "Connection Refused",
          reason: `The web server at ${hostname} actively refused connection on standard HTTP/HTTPS ports.`,
          suggestion: "Ensure that standard web hosting server processes (Apache, Nginx, Node) are running on the server.",
        };
      }

      // Handle SSL certificate failures
      const isSslError = 
        errCode.startsWith("CERT_") || 
        errCode.startsWith("ERR_TLS_") || 
        errCode === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || 
        errCode === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
        errMsg.toLowerCase().includes("ssl") || 
        errMsg.toLowerCase().includes("tls") || 
        errMsg.toLowerCase().includes("certificate") ||
        errMsg.toLowerCase().includes("cert");

      if (isSslError) {
        return {
          isValid: false,
          status: "Failed",
          confidence: "Invalid",
          error: "SSL Certificate Problem",
          reason: `A secure connection could not be established because of an SSL/TLS handshake or certificate error (${errCode || "Handshake Error"}).`,
          suggestion: "Check that your SSL certificates are active, correctly chained, and not expired on your web host.",
        };
      }

      // Handle standard network unreachable or generic errors
      return {
        isValid: false,
        status: "Failed",
        confidence: "Invalid",
        error: "Network Unreachable",
        reason: `An unexpected connection failure occurred during verification: ${errMsg || errCode}`,
        suggestion: "Please double check the address coordinates, or try again later.",
      };
    }
  } catch (error: any) {
    console.log(`[VALIDATION FAILED] Critical validation crash: ${error.message}`);
    return {
      isValid: false,
      status: "Failed",
      confidence: "Invalid",
      error: "Network Unreachable",
      reason: "The website validation process encountered an internal network boundary error.",
      suggestion: "Please double check the spelling and structure of your domain input.",
    };
  } finally {
    console.log(`[ANALYSIS STOPPED] Reachability workflow ended.`);
  }
}
