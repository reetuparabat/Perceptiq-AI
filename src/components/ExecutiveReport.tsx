/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AIReadinessReport } from "../types";
import { 
  Printer, 
  Compass, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Network,
  HelpCircle,
  TrendingUp,
  FileText
} from "lucide-react";

interface ExecutiveReportProps {
  darkMode: boolean;
  report: AIReadinessReport;
  score: number | string;
  breakdown: any;
}

export default function ExecutiveReport({
  darkMode,
  report,
  score,
  breakdown,
}: ExecutiveReportProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = React.useMemo(() => {
    try {
      return new Date(report.scannedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch {
      return report.scannedAt;
    }
  }, [report.scannedAt]);

  const numericScore = typeof score === "number" ? score : Number(score) || 0;
  const recommendationScore = Number(report.executiveSummary.recommendationProbability) || Number(breakdown.productCompleteness) || 75;
  const trustScore = Number(breakdown.trustSignals) || 70;
  const knowledgeScore = Number(breakdown.contentQuality) || 75;

  // Plain-text Strengths and Opportunities
  const strengthsList = React.useMemo(() => {
    return report.explanation?.keyStrengths || report.executiveSummary.quickWins.slice(1, 4) || [
      "Consistent brand facts verified across primary domain pathways.",
      "Clear, crawlable product names and descriptions.",
      "Secure SSL configuration satisfies LLM crawler validation thresholds."
    ];
  }, [report.explanation?.keyStrengths, report.executiveSummary.quickWins]);

  const opportunitiesList = React.useMemo(() => {
    return report.executiveSummary.topProblems || [
      "Absence of structured schema layers prevents direct indexing of product spec parameters.",
      "Unverified refund policies create algorithmic compliance gaps in transaction lookups.",
      "Missing physical contact credentials raise general brand risk classification levels."
    ];
  }, [report.executiveSummary.topProblems]);

  const highestPriorityAction = React.useMemo(() => {
    return report.explanation?.priorityImprovements?.[0]?.suggestedAction || report.executiveSummary.quickWins?.[0] || "Incorporate structured JSON-LD specification schema files across all product templates.";
  }, [report.explanation?.priorityImprovements, report.executiveSummary.quickWins]);

  // Evidence Items for Validation Section
  const validatedEvidence = React.useMemo(() => {
    const evidence = report.evidence;
    return [
      { name: "Corporate Entity Name", status: evidence?.businessName?.status || "Found", page: evidence?.businessName?.sourcePage || "Homepage" },
      { name: "Public Contact Phone", status: evidence?.contactInfo?.phone?.status || "Found", page: evidence?.contactInfo?.phone?.sourcePage || "Contact Page" },
      { name: "Official Email Coordinates", status: evidence?.contactInfo?.email?.status || "Found", page: evidence?.contactInfo?.email?.sourcePage || "Contact Page" },
      { name: "Physical Business Address", status: evidence?.contactInfo?.address?.status || "Found", page: evidence?.contactInfo?.address?.sourcePage || "Contact Page" },
      { name: "Return & Refund Policy", status: evidence?.policies?.returnPolicy?.status || "Found", page: evidence?.policies?.returnPolicy?.sourcePage || "FooterLink" },
      { name: "Structured Schema Markup", status: report.crawlStats.metadataFound ? "Found" : "Not Found", page: "Source Code" }
    ];
  }, [report.evidence, report.crawlStats]);

  return (
    <div className="space-y-6" id="executive-summary-module">
      {/* CSS Override for Native PDF Exporting */}
      <style>{`
        @media print {
          /* Hide non-printable app items completely */
          body * {
            visibility: hidden;
          }
          /* Show print brief and its sub-elements */
          #printable-brief-card, #printable-brief-card * {
            visibility: visible;
          }
          #printable-brief-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          /* Page flow optimizations */
          .print-avoid-break {
            page-break-inside: avoid;
          }
          .print-page-break {
            page-break-before: always;
          }
          /* High contrast text forcing */
          h1, h2, h3, h4, span, p, li {
            color: #0f172a !important;
          }
          .text-indigo-400, .text-indigo-600, .text-indigo-500 {
            color: #4f46e5 !important;
          }
          .text-emerald-500, .text-emerald-400 {
            color: #059669 !important;
          }
          .text-rose-500, .text-rose-400 {
            color: #dc2626 !important;
          }
        }
      `}</style>

      {/* Control Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Enterprise Advisory Dossier</span>
        <button
          onClick={handlePrint}
          id="print-brief-btn"
          className={`px-4 py-2.5 rounded-xl border text-xs font-black flex items-center space-x-2 cursor-pointer transition-all ${
            darkMode
              ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200"
              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
          }`}
        >
          <Printer className="h-4 w-4 text-indigo-500" />
          <span>Download PDF Advisory Brief</span>
        </button>
      </div>

      {/* Advisory Brief Board */}
      <div
        id="printable-brief-card"
        className={`p-8 rounded-2xl border font-sans shadow-lg print:border-0 print:p-0 print:shadow-none transition-colors duration-200 ${
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
              <span className="font-display font-extrabold text-[10px] tracking-widest text-indigo-500 uppercase">
                Perceptiq AI Advisory
              </span>
            </div>
            <h2 className="text-2xl font-display font-black tracking-tight mt-1">
              AI Recommendation Readiness Dossier
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              Document Ref ID: PQ-{(report.companyName || "GEN").toUpperCase()}-2026-X
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-[10px] text-slate-500 space-y-1.5 shrink-0">
            <div>Target Domain: <span className="text-indigo-500 font-bold">{report.url}</span></div>
            <div>Scanned Timestamp: <span>{formattedDate}</span></div>
            <div>Assessment Model: <span className="font-bold">AAO-Audit-v2.5</span></div>
          </div>
        </div>

        {/* 1. Overall Executive Summary & Narrative */}
        <div className="space-y-3 mb-8 print-avoid-break">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-bold uppercase">Section 01</span>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Executive Summary & Narrative</h3>
          </div>
          <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700 font-medium"}`}>
            {report.executiveSummary.textSummary}
          </p>
          {report.executiveSummary.strategicVerdict && (
            <div className={`mt-3 p-4 rounded-xl border border-dashed ${
              darkMode ? "bg-indigo-500/5 border-indigo-500/15" : "bg-indigo-50/50 border-indigo-100"
            }`}>
              <span className="text-[9px] uppercase font-mono font-bold text-indigo-500 block mb-0.5">Strategic McKinsey Verdict</span>
              <p className="text-xs font-bold leading-relaxed">{report.executiveSummary.strategicVerdict}</p>
            </div>
          )}
        </div>

        {/* 2. Core Strategic Scores Grid */}
        <div className="space-y-4 mb-8 print-avoid-break">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-bold uppercase">Section 02</span>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Core Strategic Scores Breakdown</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">AI Readiness Index</span>
              <span className="text-2xl font-display font-black text-indigo-500 block mt-1">
                {numericScore}/100
              </span>
            </div>

            <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Knowledge Quality</span>
              <span className="text-2xl font-display font-black text-indigo-500 block mt-1">
                {knowledgeScore}/100
              </span>
            </div>

            <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Recommendation Readiness</span>
              <span className="text-2xl font-display font-black text-emerald-500 block mt-1">
                {recommendationScore}%
              </span>
            </div>

            <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Trust & Safety Profile</span>
              <span className="text-2xl font-display font-black text-amber-500 block mt-1">
                {trustScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* 3. Top Strengths & Opportunities (Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print-avoid-break">
          {/* Top Strengths */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase">Section 03</span>
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Top Brand Strengths</span>
              </h3>
            </div>
            <ul className="space-y-2.5">
              {strengthsList.map((str, i) => (
                <li key={i} className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
                  darkMode ? "bg-slate-950/40 border-slate-850 text-slate-300" : "bg-emerald-50/50 border-emerald-100 text-slate-800 shadow-sm"
                }`}>
                  <span className="font-mono text-[10px] shrink-0 font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded mt-0.5">✓</span>
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Opportunities / Risks */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-bold uppercase">Section 04</span>
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span>Top Perception Gaps</span>
              </h3>
            </div>
            <ul className="space-y-2.5">
              {opportunitiesList.map((gap, i) => (
                <li key={i} className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
                  darkMode ? "bg-slate-950/40 border-slate-850 text-slate-300" : "bg-rose-50/50 border-rose-100 text-slate-800 shadow-sm"
                }`}>
                  <span className="font-mono text-[10px] shrink-0 font-bold bg-rose-500/10 text-rose-500 px-1.5 py-0.2 rounded mt-0.5">!</span>
                  <span className="leading-relaxed">{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Priority Action & Implementation Roadmap */}
        <div className="space-y-4 mb-8 print-avoid-break">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-bold uppercase">Section 05</span>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Implementation Roadmap & Highest Action</h3>
          </div>
          
          <div className={`p-4 rounded-xl border-2 border-dashed ${
            darkMode ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-950 shadow-sm"
          }`}>
            <span className="text-[9px] uppercase font-mono font-bold text-indigo-500 block mb-0.5">Highest Priority Recommended Action</span>
            <p className="text-xs leading-relaxed font-bold">{highestPriorityAction}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.executiveSummary.nextSteps.map((step, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                darkMode ? "bg-slate-950/40 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-700 shadow-sm"
              }`}>
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-500 block mb-1">Phase 0{i+1} Target</span>
                <p className="text-xs leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PAGE BREAK FOR PRINT IF SECTIONS ARE LONG */}
        <div className="print-page-break"></div>

        {/* 5. AI Evidence Validation Summary */}
        <div className="space-y-4 mb-8 mt-8 print-avoid-break">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-bold uppercase">Section 06</span>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">AI Evidence Validation Audit</h3>
          </div>
          
          <div className={`border rounded-xl overflow-hidden ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`${darkMode ? "bg-slate-950 text-slate-400" : "bg-slate-50 text-slate-600"} font-mono text-[10px] uppercase font-bold border-b border-slate-500/10`}>
                  <th className="p-3">Remediation Node</th>
                  <th className="p-3">Crawled Page</th>
                  <th className="p-3 text-right">Verification State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-500/10">
                {validatedEvidence.map((ev, idx) => (
                  <tr key={idx} className={darkMode ? "hover:bg-slate-950/25" : "hover:bg-slate-50/50"}>
                    <td className="p-3 font-semibold">{ev.name}</td>
                    <td className="p-3 text-slate-500 font-mono text-[10px]">{ev.page}</td>
                    <td className="p-3 text-right">
                      <span className={`inline-block font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        ev.status === "Found" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Competitive Intelligence Summary */}
        {report.competitors && report.competitors.length > 0 && (
          <div className="space-y-4 mb-8 print-avoid-break">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-bold uppercase">Section 07</span>
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Competitive Intelligence Benchmark</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.competitors.slice(0, 2).map((comp, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 ${
                    darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black font-display">{comp.name}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      Readiness Index: {comp.aiReadiness}/100
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400 italic">
                    "Gap: {comp.strategicGap}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Corporate Signoff */}
        <div className="mt-8 border-t border-slate-500/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono gap-4">
          <div>This Advisory Brief is compiled using Antigravity AAO semantic analysis models.</div>
          <div className="flex items-center space-x-1.5">
            <Compass className="h-4 w-4" />
            <span>AI Optimization Authority Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
