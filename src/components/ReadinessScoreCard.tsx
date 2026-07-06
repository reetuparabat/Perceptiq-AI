/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ScoreBreakdown, CrawlStats, ConfidenceResponse } from "../types";
import { Info, HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Terminal, FileText, ChevronRight, Activity, ShieldAlert } from "lucide-react";

interface ReadinessScoreCardProps {
  darkMode: boolean;
  score: number | string;
  breakdown: any;
  crawlStats: CrawlStats;
  evidenceCoverage?: number;
  confidence?: ConfidenceResponse;
}

export default function ReadinessScoreCard({
  darkMode,
  score,
  breakdown,
  crawlStats,
  evidenceCoverage,
  confidence,
}: ReadinessScoreCardProps) {

  const [activeTab, setActiveTab] = React.useState<string>("overall");

  const getScoreColor = (val: number | string) => {
    if (typeof val !== "number") return "text-indigo-400 border-indigo-500/20 bg-indigo-500/5";
    if (val >= 80) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    if (val >= 65) return "text-amber-500 border-amber-500/20 bg-amber-500/5";
    return "text-rose-500 border-rose-500/20 bg-rose-500/5";
  };

  const getScoreColorBg = (val: number | string) => {
    if (typeof val !== "number") return "bg-indigo-500";
    if (val >= 80) return "bg-emerald-500";
    if (val >= 65) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getCategoryConfidence = (key: string) => {
    if (!confidence) return null;
    if (key === "structuredData" || key === "productCompleteness") return confidence.categories.productInformation;
    if (key === "trustSignals") return confidence.categories.businessTrust;
    if (key === "aiReadability") return confidence.categories.aiAccessibility;
    if (key === "contentQuality") return confidence.categories.customerSupport;
    return null;
  };

  const items = [

    {
      key: "structuredData",
      label: "AI Understanding",
      score: breakdown.structuredData,
      desc: "Ensures artificial intelligence assistants and voice shopping agents can fully grasp your product offerings, categories, and attributes without parsing errors.",
      what: "AI assistants cannot fully understand your products because important product information is missing.",
      whyHappened: "Websites are often designed only for visual human reading, without organizing core catalog facts in formats that AI platforms easily ingest.",
      whyCare: "AI assistants cannot confidently identify or compare your offerings, leading them to exclude your brand from direct buyer recommendations.",
      action: "Provide more structured and complete product information so AI assistants can understand and compare your offerings more accurately.",
      improvement: "Ensures your product details are easily parsed and verified by automated buyer-facing services.",
    },
    {
      key: "contentQuality",
      label: "Quality of Conversational Context",
      score: breakdown.contentQuality,
      desc: "Clear, descriptive, and comprehensive product and business descriptions that help AI systems answer consumer questions about your brand.",
      what: "Descriptions are too brief or generic, leaving automated assistants with insufficient factual details to address pre-purchase inquiries.",
      whyHappened: "Creative marketing copy often favors brief visual slogans over comprehensive, clear explanations of product benefits and specifications.",
      whyCare: "If facts are sparse, AI systems will assume your product does not meet the buyer's exact needs or requirements.",
      action: "Publish robust product descriptions and clear answers to customer questions.",
      improvement: "Provides sufficient brand details to confidently resolve complex pre-purchase customer queries.",
    },
    {
      key: "productCompleteness",
      label: "Completeness of Attribute Sheets",
      score: breakdown.productCompleteness,
      desc: "Standardized specification sheets, measurement tables, and material parameters that let AI platforms filter and rank your products.",
      what: "Product specification grids are missing or incomplete.",
      whyHappened: "Technical parameters are often scattered across multiple tabs or buried inside styled media files instead of structured text.",
      whyCare: "When buyers use shopping assistants to search for products with exact technical dimensions or materials, your listings are filtered out.",
      action: "Consolidate all technical product specifications in standard descriptive tables.",
      improvement: "Secures high visibility when buyers run comparative queries or filter for precise requirements.",
    },
    {
      key: "trustSignals",
      label: "Brand Verifiability & Trust Badges",
      score: breakdown.trustSignals,
      desc: "Verifiable refund terms, product warranties, physical operational addresses, and legal certifications evaluated by safety algorithms.",
      what: "Refund parameters, physical operating locations, or customer review references are unverified.",
      whyHappened: "Security policies or warranty claims are presented as generic graphics or missing entirely from standard footer directories.",
      whyCare: "AI engines enforce strict risk protocols and filter out merchant sites that lack verifiable business locations or refund terms.",
      action: "Publish clear, explicit returns guidelines and your physical corporate headquarters address.",
      improvement: "Ensures your business satisfies automated shopper safety criteria, preventing high-risk filtering.",
    },
    {
      key: "aiReadability",
      label: "AI Accessibility & Design Clarity",
      score: breakdown.aiReadability,
      desc: "Clean page layouts, readable text density, and simple navigation channels that allow search engines to read your site safely.",
      what: "Heavy visual elements or excessive visual scripting block smooth text retrieval.",
      whyHappened: "Page templates are over-optimized with complex visual blocks, leading to slow page loading times.",
      whyCare: "If automated assistants timeout trying to read your pages, your business info is ignored.",
      action: "Streamline page layout designs to prioritize clean, readable, text-centric frameworks.",
      improvement: "Guarantees rapid and complete indexing during weekly automated catalog updates.",
    },
    {
      key: "authority",
      label: "Business Presence",
      score: breakdown.authority,
      desc: "The volume, reach, and reputational sentiment of your brand across online channels and customer feedback networks.",
      what: "External business mentions and consumer feedback references are limited.",
      whyHappened: "Promotional campaigns are confined to traditional media, neglecting broad digital reach and review directories.",
      whyCare: "AI systems prioritize brands with established external reputation patterns to assure buyer satisfaction.",
      action: "Establish verifiable business listings across high-credibility brand directories and customer review platforms.",
      improvement: "Increases brand authority, elevating your ranking on competitive buyer shopping prompts.",
    },
    {
      key: "technicalHealth",
      label: "Website Reliability",
      score: breakdown.technicalHealth,
      desc: "Accessible domain-level access configurations, valid secure connections, and reliable server response times.",
      what: "Default website access settings prevent automated shopping systems from verifying catalog details.",
      whyHappened: "Generic security configurations inadvertently block standard automated consumer shopping crawlers.",
      whyCare: "When AI agents are blocked from checking your domain, they treat your catalog as unavailable or outdated.",
      action: "Configure website accessibility rules to explicitly permit verification by automated shopping agents.",
      improvement: "Enables immediate verification of your latest prices, inventory levels, and product availability.",
    },
  ];

  // Active item based on selection or overall
  const activeDetail = items.find(i => i.key === activeTab);

  const numericScore = typeof score === "number" ? score : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="readiness-module">
      {/* Overall Score Wheel Column */}
      <div className={`lg:col-span-4 p-6 rounded-2xl border flex flex-col justify-between ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wide">Overall AI Readiness</h3>
          <p className="text-xs text-slate-500">Composite index of conversational search engine viability</p>
        </div>

        {/* Circular Dial */}
        <div className="my-6 flex flex-col items-center justify-center relative">
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="72"
              cy="72"
              r="62"
              className={`${darkMode ? "stroke-slate-800" : "stroke-slate-100"} fill-none`}
              strokeWidth="10"
            />
            {/* Progress Circle */}
            <circle
              cx="72"
              cy="72"
              r="62"
              className="fill-none transition-all duration-1000 ease-out"
              strokeDasharray={389.5}
              strokeDashoffset={typeof score === "number" ? 389.5 - (389.5 * numericScore) / 100 : 389.5}
              strokeLinecap="round"
              strokeWidth="10"
              stroke={typeof score === "number" ? (score >= 80 ? "#10b981" : score >= 65 ? "#f59e0b" : "#f43f5e") : "#6366f1"}
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute flex flex-col items-center">
            <span className={typeof score === "number" ? "text-4xl font-display font-black tracking-tight" : "text-xl font-display font-bold tracking-tight text-indigo-400"}>
              {score}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 mt-1 rounded-md border ${getScoreColor(score)}`}>
              {typeof score === "number" ? (score >= 80 ? "Optimal" : score >= 65 ? "Requires Action" : "High Risk") : "Awaiting Sprint 4"}
            </span>
          </div>
        </div>

        {confidence ? (
          <div className={`p-4 rounded-xl border mb-2 text-left space-y-3 ${
            darkMode ? "bg-slate-950/40 border-slate-800" : "bg-indigo-50/20 border-indigo-100 shadow-xs"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Evidence Confidence
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                confidence.confidenceLevel === "High"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : confidence.confidenceLevel === "Medium"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}>
                {confidence.confidenceLevel} ({confidence.confidenceScore}%)
              </span>
            </div>

            <p className={`text-[11px] leading-relaxed opacity-90 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {confidence.confidenceReason}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-500/10 text-[10px] font-mono text-slate-500">
              <div className="flex flex-col">
                <span>Coverage</span>
                <span className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{confidence.evidenceCoverage}% verified</span>
              </div>
              <div className="flex flex-col">
                <span>Diversity</span>
                <span className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{confidence.evidenceDiversity}% analyzed</span>
              </div>
              <div className="flex flex-col">
                <span>Unknown Ratio</span>
                <span className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{confidence.unknownRatio}% unverified</span>
              </div>
              <div className="flex flex-col">
                <span>Crawl Status</span>
                <span className={`font-bold ${
                  confidence.validationStatus === "Optimal" ? "text-emerald-400" : confidence.validationStatus === "Warning" ? "text-amber-400" : "text-rose-400"
                }`}>{confidence.validationStatus}</span>
              </div>
            </div>
          </div>
        ) : (
          evidenceCoverage !== undefined && (
            <div className="text-center mb-2">
              <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                darkMode ? "bg-indigo-950/40 text-indigo-300 border border-indigo-500/20" : "bg-indigo-50 text-indigo-950 border border-indigo-100"
              }`}>
                <span>Evidence Coverage:</span>
                <span className="text-indigo-500">{evidenceCoverage}%</span>
              </div>
            </div>
          )
        )}


        {/* Quick Crawl Stats Footer */}
        <div className="space-y-3 mt-4">
          <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
            <div className="flex items-center space-x-2 text-xs font-semibold mb-2 text-indigo-400">
              <Terminal className="h-4 w-4" />
              <span>Diagnostic Crawl Telemetry</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-mono text-slate-500">
              <div>Catalog Scanned: <span className={`${darkMode ? "text-slate-200" : "text-slate-700"} font-bold`}>{crawlStats.pagesCrawled} Pages</span></div>
              <div>Visual Assets: <span className={`${darkMode ? "text-slate-200" : "text-slate-700"} font-bold`}>{crawlStats.imageCount} Items</span></div>
              <div>Catalog Structure: <span className={`${darkMode ? "text-slate-200" : "text-slate-700"} font-bold truncate block max-w-full`}>{crawlStats.schemaMarkupType[0] || "None"}</span></div>
              <div>Answering Nodes: <span className={`${darkMode ? "text-slate-200" : "text-slate-700"} font-bold`}>{crawlStats.faqCount > 0 ? "Configured" : "None Detected"}</span></div>
            </div>
          </div>

          {/* Active Pro Plan Widget */}
          <div className={`p-3 rounded-xl text-xs border ${
            darkMode ? "bg-slate-950/80 border-slate-800 text-white" : "bg-slate-900 border-slate-950 text-white shadow-sm"
          }`}>
            <p className="font-bold mb-1 flex items-center justify-between">
              <span>Enterprise Plan Status</span>
              <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-semibold uppercase">Active</span>
            </p>
            <p className="opacity-70 mb-2 text-[11px]">Commercial crawler credits utilized: 124 / 500 scans</p>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-1 rounded-full w-[24.8%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Parameter Lists & Business Answers Panel */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Core Dimensions list */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <h3 className="font-display font-semibold text-sm tracking-wide mb-4">AI Brand Perception Audit Dimensions</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div 
                key={item.key} 
                className={`group p-3 rounded-xl transition-all border cursor-pointer ${
                  activeTab === item.key 
                    ? darkMode ? "bg-indigo-500/10 border-indigo-500/30 text-white" : "bg-indigo-50 border-indigo-200 text-indigo-950" 
                    : darkMode ? "bg-transparent border-transparent hover:bg-slate-800/50 text-slate-300" : "bg-transparent border-transparent hover:bg-slate-50 text-slate-700"
                }`}
                onClick={() => setActiveTab(item.key)}
                id={`score-item-${item.key}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold">{item.label}</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-indigo-400 cursor-help" />
                    {getCategoryConfidence(item.key) && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        getCategoryConfidence(item.key)?.level === "High"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : getCategoryConfidence(item.key)?.level === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        Conf: {getCategoryConfidence(item.key)?.level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold">{item.score}/100</span>
                    <ChevronRight className={`h-4.5 w-4.5 text-slate-400 transition-transform ${activeTab === item.key ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative w-full h-1.5 rounded-full bg-slate-500/10 overflow-hidden mt-2.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${getScoreColorBg(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Critical Strategic Questions Card */}
        <div className={`p-6 rounded-2xl border transition-all ${
          darkMode ? "bg-slate-900/60 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-500/10">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-indigo-500">
              Strategic Diagnostic: {activeTab === "overall" ? "Composite Overview" : items.find(i => i.key === activeTab)?.label}
            </h4>
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md font-bold uppercase">
              C-Suite Briefing
            </span>
          </div>

          {activeTab === "overall" ? (
            <div className="space-y-3.5 text-xs">
              <p className="leading-relaxed text-slate-500">
                Click on any of the specific <strong className={darkMode ? "text-slate-300" : "text-slate-800"}>AI Audit Dimensions</strong> above to drill down into the five key business analysis questions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3 rounded-xl bg-slate-500/5">
                  <span className="font-bold text-slate-400 font-mono text-[10px] block mb-1">1. WHAT HAPPENED?</span>
                  <span className="text-slate-500 text-[11px]">Understand our current indexing standing on search agents.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/5">
                  <span className="font-bold text-slate-400 font-mono text-[10px] block mb-1">2. WHY DID IT HAPPEN?</span>
                  <span className="text-slate-500 text-[11px]">Inspect the exact gaps causing exclusion in competitor matchings.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/5">
                  <span className="font-bold text-slate-400 font-mono text-[10px] block mb-1">3. WHY SHOULD WE CARE?</span>
                  <span className="text-slate-500 text-[11px]">Pinpoint the commercial impact on active sales and lead acquisition.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/5">
                  <span className="font-bold text-slate-400 font-mono text-[10px] block mb-1">4. WHAT ACTION TO TAKE?</span>
                  <span className="text-slate-500 text-[11px]">Deploy the exact priority technical checklists required to win.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-500/5">
                  <h5 className="font-bold text-indigo-400 font-mono text-[10px] uppercase mb-1">1. What Happened?</h5>
                  <p className="text-slate-500 leading-normal">{activeDetail?.what}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-500/5">
                  <h5 className="font-bold text-indigo-400 font-mono text-[10px] uppercase mb-1">2. Why Did It Happen?</h5>
                  <p className="text-slate-500 leading-normal">{activeDetail?.whyHappened}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-500/5">
                  <h5 className="font-bold text-rose-400 font-mono text-[10px] uppercase mb-1">3. Why Should the Business Care?</h5>
                  <p className="text-slate-500 leading-normal font-medium">{activeDetail?.whyCare}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-500/5">
                  <h5 className="font-bold text-emerald-400 font-mono text-[10px] uppercase mb-1">4. What Action Should Be Taken?</h5>
                  <p className="text-slate-500 leading-normal">{activeDetail?.action}</p>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border flex items-center space-x-2.5 ${
                darkMode ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-300" : "bg-indigo-50/50 border-indigo-100 text-indigo-950"
              }`}>
                <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 animate-pulse" />
                <div>
                  <h5 className="font-bold font-mono text-[10px] uppercase">5. What Improvement is Expected?</h5>
                  <p className="opacity-80 text-[11px] leading-snug">{activeDetail?.improvement}</p>
                </div>
              </div>

              {getCategoryConfidence(activeTab) && (
                <div className={`p-3.5 rounded-xl border flex items-center space-x-2.5 ${
                  darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100 text-slate-900"
                }`}>
                  <Activity className={`h-5 w-5 shrink-0 ${
                    getCategoryConfidence(activeTab)?.level === "High"
                      ? "text-emerald-400"
                      : getCategoryConfidence(activeTab)?.level === "Medium"
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`} />
                  <div>
                    <h5 className="font-bold font-mono text-[10px] uppercase flex items-center space-x-1.5">
                      <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Evidence Assessment Confidence:</span>
                      <span className={
                        getCategoryConfidence(activeTab)?.level === "High"
                          ? "text-emerald-400"
                          : getCategoryConfidence(activeTab)?.level === "Medium"
                          ? "text-amber-400"
                          : "text-rose-400"
                      }>
                        {getCategoryConfidence(activeTab)?.level} ({getCategoryConfidence(activeTab)?.score}%)
                      </span>
                    </h5>
                    <p className={`opacity-80 text-[11px] leading-snug mt-0.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {getCategoryConfidence(activeTab)?.reason}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
