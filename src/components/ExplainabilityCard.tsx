/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Explainability } from "../types";
import { ShieldCheck, ShieldAlert, Sparkles, AlertCircle, CheckCircle2, TrendingUp, HelpCircle } from "lucide-react";

interface ExplainabilityCardProps {
  darkMode: boolean;
  explainability: Explainability;
}

export default function ExplainabilityCard({ darkMode, explainability }: ExplainabilityCardProps) {
  const items = [
    {
      key: "missingStructuredData",
      label: "Product Information Structure (Can AI Understand Your Products?)",
      data: explainability.missingStructuredData,
      impact: "Baseline for automated catalog comparison.",
    },
    {
      key: "missingFaq",
      label: "Customer Queries & FAQ Structure",
      data: explainability.missingFaq,
      impact: "Feeds conversational response caches directly.",
    },
    {
      key: "weakProductDescriptions",
      label: "Product Detail & Attribute Completeness",
      data: explainability.weakProductDescriptions,
      impact: "Enables precise specification filters.",
    },
    {
      key: "noTrustBadges",
      label: "Brand Verifiability & Trust Badges",
      data: explainability.noTrustBadges,
      impact: "Required by transactional safety filters.",
    },
    {
      key: "noCertifications",
      label: "Regulatory & Industry Certifications",
      data: explainability.noCertifications,
      impact: "Validates enterprise trust specifications.",
    },
    {
      key: "poorComparisonInfo",
      label: "Brand Differential & Competitor Comparisons",
      data: explainability.poorComparisonInfo,
      impact: "Solves comparative purchasing decisions.",
    },
    {
      key: "weakAuthority",
      label: "Mentions Volume & Digital Authority",
      data: explainability.weakAuthority,
      impact: "Weights model baseline confidence ranking.",
    },
  ];

  return (
    <div className="space-y-6" id="explainability-module">
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="mb-6">
          <h3 className="font-display font-bold text-base tracking-tight">AI Decision-Making Interpretability</h3>
          <p className="text-xs text-slate-500 mt-1">
            Corporate causal analysis detailing exactly why conversational AI search assistants recommend your products or prioritize competitors.
          </p>
        </div>

        {/* List of Audit Elements */}
        <div className="space-y-4">
          {items.map((item) => {
            const isGap = item.data?.hasGap ?? false;
            return (
              <div
                key={item.key}
                id={`explain-row-${item.key}`}
                className={`p-5 rounded-xl border transition-all ${
                  isGap
                    ? darkMode
                      ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/20"
                      : "bg-rose-50/50 border-rose-100 hover:border-rose-200 shadow-sm"
                    : darkMode
                    ? "bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20"
                    : "bg-emerald-50/50 border-emerald-100 hover:border-emerald-200 shadow-sm"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-500/10 pb-3 mb-3">
                  <div className="flex items-center space-x-2.5">
                    {isGap ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-black ${
                        darkMode ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-rose-100 text-rose-700"
                      }`}>
                        !
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                        darkMode ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        ✓
                      </div>
                    )}
                    <span className="font-display font-bold text-xs tracking-tight">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">{item.impact}</span>
                    <span
                      className={`text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                        isGap
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      {isGap ? "Action Required" : "Fully Optimized"}
                    </span>
                  </div>
                </div>

                {/* Body Content with business answers */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">Diagnostic Finding</span>
                    <p className={`text-xs font-bold leading-tight ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
                      {item.data?.description || (isGap ? "Gap Detected" : "AI Compliant")}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">Root Cause (Why)</span>
                    <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {item.data?.reasoning || "No configuration gaps discovered during catalog spidering."}
                    </p>
                  </div>

                  {item.data?.businessImpact && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 mt-2 border-t border-slate-500/5">
                      <div className={`p-3 rounded-lg ${darkMode ? "bg-slate-950/40" : "bg-slate-50"}`}>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-rose-500 block font-bold mb-1">
                          Commercial Risk (Why Care)
                        </span>
                        <p className={`text-xs leading-snug ${darkMode ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                          {item.data.businessImpact}
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg ${darkMode ? "bg-slate-950/40" : "bg-slate-50"}`}>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-500 block font-bold mb-1">
                          Expected Growth Improvement
                        </span>
                        <p className={`text-xs leading-snug ${darkMode ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                          {item.data.expectedImprovement}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
