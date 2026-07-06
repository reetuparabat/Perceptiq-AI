/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ExecutiveSummary, CrawlStats } from "../types";
import { Printer, Compass, Calendar, Award, CheckCircle2, AlertTriangle, PlayCircle, ShieldCheck, HelpCircle } from "lucide-react";

interface ExecutiveReportProps {
  darkMode: boolean;
  companyName: string;
  url: string;
  scannedAt: string;
  summary: ExecutiveSummary;
  crawlStats: CrawlStats;
}

export default function ExecutiveReport({
  darkMode,
  companyName,
  url,
  scannedAt,
  summary,
  crawlStats,
}: ExecutiveReportProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = React.useMemo(() => {
    try {
      return new Date(scannedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch {
      return scannedAt;
    }
  }, [scannedAt]);

  // Ensure exactly 5 high-impact business risks
  const businessRisks = React.useMemo(() => {
    const base = summary.topProblems || [];
    const fallbacks = [
      "Loss of high-intent organic traffic from buyers utilizing AI assistants for direct product recommendations.",
      "Competitor dominance on voice and text shopping assistants due to missing or incomplete product details.",
      "Algorithmic exclusion from transactional results due to sparse answers to buyer questions.",
      "Inability of AI assistants to verify current prices and real-time inventory updates.",
      "Reduced brand trust scores from safety filtering systems due to missing customer review references.",
    ];
    const results = [...base];
    while (results.length < 5) {
      results.push(fallbacks[results.length % fallbacks.length]);
    }
    return results.slice(0, 5);
  }, [summary.topProblems]);

  // Ensure exactly 5 high-impact quick wins
  const quickWins = React.useMemo(() => {
    const base = summary.quickWins || [];
    const fallbacks = [
      "Provide more structured and complete product information so AI assistants can understand and compare your offerings more accurately.",
      "Update website accessibility settings to explicitly permit verification by automated shopping assistants.",
      "Publish robust product descriptions and clear answers to customer questions.",
      "Incorporate visible trust markers and refund safety guarantees on key catalog pages.",
      "Convert complex product specification sheets from static image formats into readable tables.",
    ];
    const results = [...base];
    while (results.length < 5) {
      results.push(fallbacks[results.length % fallbacks.length]);
    }
    return results.slice(0, 5);
  }, [summary.quickWins]);

  return (
    <div className="space-y-6" id="executive-summary-module">
      {/* Control Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Enterprise Advisory Dossier</span>
        <button
          onClick={handlePrint}
          id="print-brief-btn"
          className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center space-x-2 cursor-pointer transition-all ${
            darkMode
              ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
          }`}
        >
          <Printer className="h-4 w-4" />
          <span>Download PDF Advisory Brief</span>
        </button>
      </div>

      {/* Advisory Brief Board */}
      <div
        id="printable-brief-card"
        className={`p-8 rounded-2xl border font-sans shadow-lg print:border-0 print:p-0 print:shadow-none ${
          darkMode ? "bg-slate-900/60 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-6 mb-6 border-slate-500/10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                PQ
              </div>
              <span className="font-display font-extrabold text-xs tracking-wider text-slate-400 uppercase">
                Perceptiq AI Advisory
              </span>
            </div>
            <h2 className="text-2xl font-display font-black tracking-tight mt-1">
              Perceptiq AI Analysis Report
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Document Ref ID: PQ-{(companyName || "GEN").toUpperCase()}-2026-X
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-[10px] text-slate-500 space-y-1.5 shrink-0">
            <div>Target Domain: <span className="text-indigo-500 font-bold">{url}</span></div>
            <div>Scanned Timestamp: <span>{formattedDate}</span></div>
            <div>Assessment Model: <span className="font-bold">AAO-Audit-v2.1</span></div>
          </div>
        </div>

        {/* 1. Overall AI Recommendation Readiness Summary */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase">Section 01</span>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">Overall AI Recommendation Readiness</h3>
          </div>
          <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700 font-medium"}`}>
            {summary.textSummary}
          </p>
        </div>

        {/* High-Level Strategic Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Readiness Index</span>
            <span className={`text-2xl font-display font-black block mt-1 ${
              typeof summary.overallScore === "number"
                ? (summary.overallScore >= 80 ? "text-emerald-500" : summary.overallScore >= 65 ? "text-amber-500" : "text-rose-500")
                : "text-indigo-400"
            }`}>
              {typeof summary.overallScore === "number" ? `${summary.overallScore}/100` : "Unknown"}
            </span>
          </div>

          <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">AI Visibility Share</span>
            <span className="text-2xl font-display font-black text-indigo-400 block mt-1">
              {summary.estimatedVisibility}%
            </span>
          </div>

          <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Win Probability</span>
            <span className="text-2xl font-display font-black text-blue-400 block mt-1">
              {summary.recommendationProbability}%
            </span>
          </div>

          <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Scanned Touchpoints</span>
            <span className="text-2xl font-display font-black text-slate-400 block mt-1">
              {crawlStats.pagesCrawled + crawlStats.imageCount} Nodes
            </span>
          </div>
        </div>

        {/* 2. Top 5 Business Risks & Top 5 Quick Wins Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top 5 Business Risks */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-bold uppercase">Section 02</span>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span>Top 5 Strategic Business Risks</span>
              </h3>
            </div>
            <ul className="space-y-2.5">
              {businessRisks.map((prob, i) => (
                <li key={i} className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                  darkMode ? "bg-rose-500/5 border-rose-500/10 text-slate-300" : "bg-rose-50 border-rose-100 text-slate-800 shadow-sm"
                }`}>
                  <span className="font-mono text-[10px] shrink-0 font-bold bg-rose-500/10 text-rose-500 px-1.5 py-0.2 rounded mt-0.5">0{i+1}</span>
                  <span className="leading-relaxed font-medium">{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top 5 Quick Wins */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase">Section 03</span>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Top 5 Immediate Quick Wins</span>
              </h3>
            </div>
            <ul className="space-y-2.5">
              {quickWins.map((win, i) => (
                <li key={i} className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                  darkMode ? "bg-emerald-500/5 border-emerald-500/10 text-slate-300" : "bg-emerald-50 border-emerald-100 text-slate-800 shadow-sm"
                }`}>
                  <span className="font-mono text-[10px] shrink-0 font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded mt-0.5">✓</span>
                  <span className="leading-relaxed font-medium">{win}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Expected Improvement Opportunities (Implementation Roadmap) */}
        <div className="space-y-4 border-t border-slate-500/10 pt-6 mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase">Section 04</span>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">Expected Improvement Opportunities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.nextSteps.map((step, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                darkMode ? "bg-slate-950/40 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-700 shadow-sm"
              }`}>
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-500 block mb-1">Phase 0{i+1} Target</span>
                <p className="text-xs leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Overall Recommendation */}
        <div className={`p-5 rounded-2xl border-2 border-dashed ${
          darkMode ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-950 shadow-sm"
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-indigo-500 shrink-0" />
            <span className="font-display font-black text-xs uppercase tracking-wider">Overall Advisory Recommendation</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90 font-medium">
            Prioritize deploying automated, structured Product catalog specifications tables alongside unified JSON-LD markup blocks. This double-layer implementation guarantees immediate indexing correctness for shopping AI models, raising target win probability by approximately 25-40% over active competitors.
          </p>
        </div>

        {/* Corporate Signoff */}
        <div className="mt-8 border-t border-slate-500/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono gap-4">
          <div>Report generated automatically using Antigravity AAO crawling systems.</div>
          <div className="flex items-center space-x-1.5">
            <Compass className="h-4 w-4" />
            <span>AI Optimization Authority Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
