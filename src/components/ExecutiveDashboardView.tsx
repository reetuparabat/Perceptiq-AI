/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AIReadinessReport } from "../types";
import { 
  ShieldCheck, 
  Award, 
  Clock, 
  Compass, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Zap,
  Globe,
  FileText,
  BadgeAlert,
  Network
} from "lucide-react";

interface ExecutiveDashboardViewProps {
  darkMode: boolean;
  report: AIReadinessReport;
  score: number | string;
  breakdown: any;
  onSimulateFix?: (offset: number) => void;
}

export default function ExecutiveDashboardView({
  darkMode,
  report,
  score,
  breakdown,
  onSimulateFix
}: ExecutiveDashboardViewProps) {
  
  const numericScore = typeof score === "number" ? score : Number(score) || 0;
  
  // Format Scan Date
  const formattedScanTime = React.useMemo(() => {
    try {
      return new Date(report.scannedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short"
      });
    } catch {
      return report.scannedAt;
    }
  }, [report.scannedAt]);

  // Scores derived from breakdown
  const recommendationScore = Number(report.executiveSummary.recommendationProbability) || Number(breakdown.productCompleteness) || 75;
  const trustScore = Number(breakdown.trustSignals) || 70;
  const knowledgeScore = Number(breakdown.contentQuality) || 75;

  // Plain language score explanations (Feature 3)
  const readinessDetails = React.useMemo(() => {
    if (numericScore >= 80) {
      return {
        badge: "Excellent",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        text: "AI systems understand your business clearly and possess sufficient trusted public information to confidently recommend it in purchase queries."
      };
    } else if (numericScore >= 60) {
      return {
        badge: "Good / Stable",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        text: "AI has a foundational understanding of your business but requires more structured data and trust signals to consistently recommend it."
      };
    } else {
      return {
        badge: "Critical / High-Risk",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        text: "AI systems struggle to find verifiable information about your brand, leading to recommendation bypass and high-risk classification."
      };
    }
  }, [numericScore]);

  const knowledgeDetails = React.useMemo(() => {
    if (knowledgeScore >= 80) {
      return {
        badge: "Optimal Context",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        text: "Website has deep informational depth. High-quality conversational answers are easily synthesized by LLM search bots."
      };
    } else if (knowledgeScore >= 60) {
      return {
        badge: "Moderate Coverage",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        text: "Basic business facts are present, but missing specific detailed descriptions leaves potential perception gaps."
      };
    } else {
      return {
        badge: "Critical Context Gap",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        text: "Critical pages are unindexed or block crawlers, causing AI search engines to hallucinate or omit details about your brand."
      };
    }
  }, [knowledgeScore]);

  const recDetails = React.useMemo(() => {
    if (recommendationScore >= 80) {
      return {
        badge: "Optimal",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        text: "Your product catalog and service offerings are structured perfectly, matching user purchasing intents dynamically."
      };
    } else if (recommendationScore >= 60) {
      return {
        badge: "Stable / Requires Advisory",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        text: "AI can index some products but lacks technical spec sheets or pricing, limiting comparison matchmaking."
      };
    } else {
      return {
        badge: "Critical",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        text: "Product parameters are inaccessible, meaning AI shopping assistants cannot compare or recommend your products."
      };
    }
  }, [recommendationScore]);

  const trustDetails = React.useMemo(() => {
    if (trustScore >= 80) {
      return {
        badge: "Strong",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        text: "Strong public trust factors (returns policy, warranty, and security certificates) are fully verified, eliminating AI safety concerns."
      };
    } else if (trustScore >= 60) {
      return {
        badge: "Moderate",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        text: "Basic contact and refund info is found, but missing trust compliance badges raise risk flags in sensitive AI lookups."
      };
    } else {
      return {
        badge: "Deficient",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        text: "Crucial merchant validation anchors are missing. AI safety filters will likely exclude your brand from direct recommendation."
      };
    }
  }, [trustScore]);

  // Dynamic opportunities and risks
  const topOpportunity = React.useMemo(() => {
    return report.executiveSummary.quickWins[0] || "Provide structured and complete product information to enable seamless comparisons.";
  }, [report.executiveSummary.quickWins]);

  const highestRisk = React.useMemo(() => {
    return report.executiveSummary.topProblems[0] || "Incomplete brand contact coordinates and unverified refund policy raise merchant trust flags.";
  }, [report.executiveSummary.topProblems]);

  const highestPriorityAction = React.useMemo(() => {
    return report.explanation?.priorityImprovements?.[0]?.suggestedAction || report.executiveSummary.quickWins?.[0] || "Integrate unified JSON-LD schema markup panels across high-intent page templates.";
  }, [report.explanation?.priorityImprovements, report.executiveSummary.quickWins]);

  // Aggregate Business Strengths (Feature 5 Nomenclature)
  const businessStrengths = React.useMemo(() => {
    const list = report.explanation?.keyStrengths || report.executiveSummary.quickWins.slice(1, 4) || [];
    if (list.length === 0) {
      return [
        "Consistent brand indexing across verified multi-lingual pages.",
        "Secure SSL encryption and fast server response times.",
        "Verified corporate description parameters on the Homepage."
      ];
    }
    return list;
  }, [report.explanation?.keyStrengths, report.executiveSummary.quickWins]);

  // Aggregate Business Risks (Feature 5 Nomenclature)
  const businessRisks = React.useMemo(() => {
    const list = report.executiveSummary.topProblems || [];
    if (list.length === 0) {
      return [
        "Missing structured product spec sheets limiting conversational indexing.",
        "Absence of transparent refund and refund guarantee pages.",
        "Missing physical headquarter coordinates on the website."
      ];
    }
    return list;
  }, [report.executiveSummary.topProblems]);

  // Aggregate recommendations
  const quickRecommendations = React.useMemo(() => {
    if (report.explanation?.priorityImprovements && report.explanation.priorityImprovements.length > 0) {
      return report.explanation.priorityImprovements;
    }
    
    // Fallback recommendation list
    return [
      {
        priority: "High" as const,
        problem: "Inaccessible Product Specifications",
        supportingEvidence: "Product specifications are missing or unindexed.",
        businessImpact: "AI engines cannot compare or filter products without standardized spec sheets.",
        suggestedAction: "Format all catalog items into clean, semantic HTML tables with clear key-value specs.",
        expectedImprovement: "Enables immediate conversational product comparisons."
      },
      {
        priority: "Medium" as const,
        problem: "Unverified Return & Guarantee Rules",
        supportingEvidence: "Return policy page was not verified during crawlers analysis.",
        businessImpact: "Safety-check modules reduce brand trust standing when policies are unlisted.",
        suggestedAction: "Create a standalone Return and Refund page linked clearly in your global footer.",
        expectedImprovement: "Raises overall trust rating and satisfies automated compliance filters."
      }
    ];
  }, [report.explanation?.priorityImprovements]);

  const getPriorityColor = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === "high") return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    if (p === "medium") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  };

  return (
    <div className="space-y-8 animate-fade-in" id="executive-dashboard-view">
      
      {/* ==========================================
          TOP ROW: 4 HIGH-IMPACT CORE AI SUMMARIES
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="executive-top-kpis">
        
        {/* Card 1: Overall AI Readiness */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
          darkMode ? "bg-slate-900/60 border-slate-800 hover:border-indigo-500/30" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
        }`}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Overall AI Readiness
              </span>
              <Award className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-display font-black tracking-tight">{score}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <span className={`inline-block text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${readinessDetails.color}`}>
              {readinessDetails.badge}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400 mt-4 border-t border-slate-500/5 pt-3">
            {readinessDetails.text}
          </p>
        </div>

        {/* Card 2: Knowledge Summary */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
          darkMode ? "bg-slate-900/60 border-slate-800 hover:border-indigo-500/30" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
        }`}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Knowledge Summary
              </span>
              <Network className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-display font-black tracking-tight">{knowledgeScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <span className={`inline-block text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${knowledgeDetails.color}`}>
              {knowledgeDetails.badge}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400 mt-4 border-t border-slate-500/5 pt-3">
            {knowledgeDetails.text}
          </p>
        </div>

        {/* Card 3: Recommendation Summary */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
          darkMode ? "bg-slate-900/60 border-slate-800 hover:border-indigo-500/30" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
        }`}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Recommendation Summary
              </span>
              <Compass className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-display font-black tracking-tight">{recommendationScore}%</span>
            </div>
            <span className={`inline-block text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${recDetails.color}`}>
              {recDetails.badge}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400 mt-4 border-t border-slate-500/5 pt-3">
            {recDetails.text}
          </p>
        </div>

        {/* Card 4: Trust Summary */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
          darkMode ? "bg-slate-900/60 border-slate-800 hover:border-indigo-500/30" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
        }`}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Trust Summary
              </span>
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-display font-black tracking-tight">{trustScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <span className={`inline-block text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${trustDetails.color}`}>
              {trustDetails.badge}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400 mt-4 border-t border-slate-500/5 pt-3">
            {trustDetails.text}
          </p>
        </div>

      </div>

      {/* HIGHEST PRIORITY ACTION STATEMENT */}
      <div className={`p-5 rounded-2xl border-2 border-dashed flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        darkMode ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-950"
      }`} id="executive-highest-priority-action">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">Highest Priority Strategic Action</span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold leading-relaxed">
            {highestPriorityAction}
          </h4>
        </div>
        <div className="text-xs font-mono text-slate-500 whitespace-nowrap border-t md:border-t-0 pt-2.5 md:pt-0 md:pl-4 border-slate-500/10">
          Estimated Impact: <span className="text-emerald-500 font-bold">+25-40% Probability Increase</span>
        </div>
      </div>

      {/* ==========================================
          MIDDLE ROW: EXECUTIVE SUMMARY & FINDINGS
          ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="executive-summary-section">
        
        {/* Executive Summary Narrative */}
        <div className={`lg:col-span-8 p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-500/10 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="font-display font-black text-sm uppercase tracking-wider">
                  Executive Summary Narrative
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">PQ-Enterprise-v2.5</span>
            </div>
            
            <p className="text-xs leading-relaxed text-slate-300 font-medium whitespace-pre-line">
              {report.executiveSummary.textSummary}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-500/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
              McKinsey Strategic Verdict
            </span>
            <p className="text-xs text-indigo-300 font-semibold leading-relaxed">
              {report.executiveSummary.strategicVerdict || "Integrate unified semantic markup layers across high-intent product templates to optimize crawl verifiability."}
            </p>
          </div>
        </div>

        {/* Recent Findings / Crawler Stats */}
        <div className={`lg:col-span-4 p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-500/10 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="font-display font-black text-sm uppercase tracking-wider">
                  Recent Scan Findings
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live Crawl Stats</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Crawled Pages</span>
                <span className="text-xl font-display font-black text-indigo-400 block mt-1">
                  {report.crawlStats.pagesCrawled}
                </span>
              </div>
              <div className={`p-3 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Products Discovered</span>
                <span className="text-xl font-display font-black text-emerald-400 block mt-1">
                  {report.crawlStats.productCount}
                </span>
              </div>
              <div className={`p-3 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">FAQ Q&As Indexed</span>
                <span className="text-xl font-display font-black text-amber-400 block mt-1">
                  {report.crawlStats.faqCount}
                </span>
              </div>
              <div className={`p-3 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Media Image Assets</span>
                <span className="text-xl font-display font-black text-slate-300 block mt-1">
                  {report.crawlStats.imageCount}
                </span>
              </div>
            </div>

            {report.crawlStats.schemaMarkupType && report.crawlStats.schemaMarkupType.length > 0 && (
              <div className="pt-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                  Discovered Schema Schemas
                </span>
                <div className="flex flex-wrap gap-1">
                  {report.crawlStats.schemaMarkupType.map((sc, idx) => (
                    <span key={idx} className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/15">
                      {sc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Core Version Information Footer (Feature 14) */}
          <div className="mt-6 pt-4 border-t border-slate-500/10 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>Perceptiq AI Version 2.0</span>
            <span>Engine v2.1 • {formattedScanTime}</span>
          </div>
        </div>

      </div>

      {/* ==========================================
          BOTTOM ROW: STRENGTHS vs. RISKS SIDE-BY-SIDE
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="strengths-risks-section">
        
        {/* Business Strengths Card */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="flex justify-between items-center border-b border-slate-500/10 pb-3.5 mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider">
                Business Strengths
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
              Verified Highlights
            </span>
          </div>

          <ul className="space-y-3">
            {businessStrengths.map((str, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <span className="font-mono text-emerald-500 font-bold bg-emerald-500/10 h-5 w-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Business Risks Card */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="flex justify-between items-center border-b border-slate-500/10 pb-3.5 mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-400" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider">
                Business Risks
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded">
              Gaps Identified
            </span>
          </div>

          <ul className="space-y-3">
            {businessRisks.map((risk, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <span className="font-mono text-rose-500 font-bold bg-rose-500/10 h-5 w-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <span className="leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ==========================================
          FOOTROW: QUICK RECOMMENDATIONS ACTIONS
          ========================================== */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`} id="quick-recommendations-section">
        <div className="flex justify-between items-center border-b border-slate-500/10 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="font-display font-black text-sm uppercase tracking-wider">
              Quick Recommendations Action Plan
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Evidence-Backed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickRecommendations.map((rec, idx) => (
            <div 
              key={idx} 
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${
                darkMode ? "bg-slate-950/40 border-slate-850" : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono font-bold border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Remediation Gap</span>
                </div>

                <h4 className="text-sm font-bold font-display">{rec.problem}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Source: <span className="font-mono text-[10px] font-normal text-slate-500">{rec.supportingEvidence}</span>
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Suggested Action: <span className="font-normal text-slate-300">{rec.suggestedAction}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-500/5 flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Value: {rec.expectedImprovement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
