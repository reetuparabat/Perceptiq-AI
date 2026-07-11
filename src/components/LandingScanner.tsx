/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Loader2, ArrowRight, Shield, Sparkles, CheckCircle, Database, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingScannerProps {
  darkMode: boolean;
  urlInput: string;
  setUrlInput: (val: string) => void;
  scanning: boolean;
  scanStep: string;
  onScan: (url: string) => void;
  errorMsg: string | null;
}

export default function LandingScanner({
  darkMode,
  urlInput,
  setUrlInput,
  scanning,
  scanStep,
  onScan,
  errorMsg,
}: LandingScannerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onScan(urlInput);
  };

  const getStepDescription = (step: string) => {
    switch (step) {
      case "validating":
        return "Validating website reliability and checking secure SSL configurations...";
      case "collecting":
        return "Collecting core business evidence markers, catalog directories, and policies...";
      case "scoring":
        return "Calculating deterministic brand perception readiness scores...";
      case "confidence":
        return "Evaluating evidence coverage, source diversity, and validation confidence levels...";
      case "explaining":
        return "Generating executive business advisory narrative detailing perception gaps...";
      default:
        return "Performing diagnostic audit...";
    }
  };

  const sampleDomains = ["stripe.com", "nike.com", "shopify.com", "airbnb.com", "linear.app"];

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-4">
      {/* Brand Hero */}
      <div className="text-center space-y-6 mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-bounce">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>The First AI Brand Perception Analysis Platform</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-tight">
          Understand How AI <br />
          <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Perceives Your Brand
          </span>
        </h1>
        <p className={`max-w-2xl mx-auto text-sm sm:text-base md:text-lg ${darkMode ? "text-slate-400" : "text-slate-600"} font-normal`}>
          Perceptiq AI analyzes publicly accessible business information to help organizations understand how conversational AI systems interpret their digital presence.
        </p>
      </div>

      {/* Main Action Bar */}
      <div className={`p-1.5 rounded-2xl shadow-xl transition-all duration-200 border ${
        darkMode ? "bg-slate-900/90 border-slate-800 focus-within:border-indigo-500/50" : "bg-white border-slate-200 focus-within:border-indigo-500/50"
      }`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={scanning}
              placeholder="Enter your product website URL (e.g. stripe.com)"
              className="w-full pl-11 pr-4 py-4 bg-transparent outline-none text-base border-0 focus:ring-2 focus:ring-indigo-500 focus:rounded-xl placeholder-slate-500 font-sans transition-all"
              id="scanner-url-input"
              aria-label="Target Website URL for AI Audit"
            />
          </div>
          <button
            type="submit"
            disabled={scanning || !urlInput.trim()}
            id="start-audit-btn"
            aria-label="Start AI Audit Analysis"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            {scanning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>Analyze Website</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>
      </div>
 
      {/* Actionable Non-Technical Error Message (Feature 8) */}
      {errorMsg && (
        <div className="mt-4 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col space-y-4 text-rose-400">
          {errorMsg === "Analysis Couldn't Be Completed" ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-rose-400">
                <AlertCircle className="h-6 w-6 shrink-0" />
                <h3 className="font-display font-bold text-lg text-rose-200">Analysis Couldn't Be Completed</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
                <p>
                  We couldn't access enough public information to analyze this website.
                </p>
                <p>
                  This may happen because the website restricts automated access or is temporarily unavailable.
                </p>
                <p className="text-rose-300/95 font-semibold">
                  Please try another website or try again later.
                </p>
              </div>
              <div className="pt-3 border-t border-rose-500/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setUrlInput("")}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  Clear search bar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3.5 text-xs">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
              <div className="space-y-1.5 flex-1">
                <p className="font-semibold text-sm">Diagnostic Alert: Reachability Blocked</p>
                <p className="opacity-95 leading-relaxed">
                  Our secure crawler could not complete the discovery handshake with <strong className="text-rose-300 font-mono">{urlInput}</strong>. 
                  The target server might be offline, requires a secure protocol, or is currently blocking automated crawlers inside its robots.txt file.
                </p>
                <div className="pt-2 border-t border-rose-500/5 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-rose-500 font-mono font-bold">Suggested advice: {errorMsg}. Verify URL accuracy or try scanning a suggested company below.</span>
                  <button
                    type="button"
                    onClick={() => setUrlInput("")}
                    className="text-[11px] font-bold text-rose-300 hover:text-white underline cursor-pointer self-start"
                  >
                    Clear domain field
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Crawl Stepper Loader Overlay */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-8 p-6 rounded-2xl border text-center ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin flex items-center justify-center"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Database className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1 max-w-lg">
                <p className="font-display font-semibold text-sm tracking-wide capitalize bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Step: {scanStep}
                </p>
                <p className="text-sm font-medium">{getStepDescription(scanStep)}</p>
                <p className={`text-[11px] ${darkMode ? "text-slate-500" : "text-slate-400"} font-mono`}>
                  This takes 4-8 seconds. Powered by our high-performance discovery crawler.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md bg-slate-500/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width:
                      scanStep === "initiating"
                        ? "15%"
                        : scanStep === "crawling"
                        ? "40%"
                        : scanStep === "extracting"
                        ? "65%"
                        : scanStep === "analyzing"
                        ? "85%"
                        : "98%",
                  }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Quick Starts */}
      {!scanning && (
        <div className="mt-12 text-center space-y-3">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Try Scanning Industry Leaders</p>
          <div className="flex flex-wrap justify-center gap-2">
            {sampleDomains.map((domain) => (
              <button
                key={domain}
                onClick={() => {
                  setUrlInput(domain);
                  onScan(domain);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-slate-900"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Value Prop Cards */}
      {!scanning && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"} space-y-3`}>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-sm">Not Traditional SEO</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Google ranks websites for human eyeballs. LLMs parse content for factual vectors and structured product databases. Perceptiq targets LLMs directly.
            </p>
          </div>
          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"} space-y-3`}>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-sm">Information Formatting</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understand if your product titles, services listings, pricing plans, and policy charts are perfectly organized and formatted for conversational AI indexing.
            </p>
          </div>
          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"} space-y-3`}>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-sm">Trust & Risk Assessment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify if LLMs can find active reviews, security badges, and corporate trust parameters to declare your store safe for recommendation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
