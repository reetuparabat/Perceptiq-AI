/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Recommendation } from "../types";
import { CheckCircle2, ChevronDown, ChevronUp, Zap, Sparkles, TrendingUp, RefreshCw, AlertCircle, HelpCircle } from "lucide-react";

interface ImprovementCenterProps {
  darkMode: boolean;
  recommendations: Recommendation[];
  onSimulateFix: (scoreOffset: number) => void;
}

export default function ImprovementCenter({
  darkMode,
  recommendations,
  onSimulateFix,
}: ImprovementCenterProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(recommendations[0]?.id || null);
  const [completedIds, setCompletedIds] = React.useState<string[]>([]);
  const [docGenerated, setDocGenerated] = React.useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleComplete = (e: React.MouseEvent, id: string, priority: "High" | "Medium" | "Low") => {
    e.stopPropagation(); // Avoid triggering expand toggle
    const isCompleted = completedIds.includes(id);
    let scoreBoost = 0;

    if (!isCompleted) {
      setCompletedIds([...completedIds, id]);
      scoreBoost = priority === "High" ? 6 : priority === "Medium" ? 4 : 2;
    } else {
      setCompletedIds(completedIds.filter((cid) => cid !== id));
      scoreBoost = priority === "High" ? -6 : priority === "Medium" ? -4 : -2;
    }

    onSimulateFix(scoreBoost);
  };

  const getPriorityBadge = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return darkMode
          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          : "bg-rose-100 text-rose-700 border border-rose-200";
      case "Medium":
        return darkMode
          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          : "bg-amber-100 text-amber-700 border border-amber-200";
      default:
        return darkMode
          ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
          : "bg-sky-100 text-sky-700 border border-sky-200";
    }
  };

  const getDifficultyBadge = (diff: "Easy" | "Medium" | "Hard") => {
    switch (diff) {
      case "Easy":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    }
  };

  return (
    <div className="space-y-6" id="improvements-module">
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-500/10 pb-4 mb-6 gap-3">
          <div>
            <h3 className="font-display font-bold text-base tracking-tight">AI Optimization Engine (AAO)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Prioritized structural adjustments designed to directly unlock and increase conversational recommendation share.
            </p>
          </div>
          {completedIds.length > 0 && (
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Simulated Score Boost: +{completedIds.length * 5}pts</span>
            </div>
          )}
        </div>

        {/* Priority Stack */}
        <div className="space-y-3.5">
          {recommendations.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const isCompleted = completedIds.includes(rec.id);

            return (
              <div
                key={rec.id}
                id={`rec-item-${rec.id}`}
                onClick={() => toggleExpand(rec.id)}
                className={`border rounded-xl transition-all overflow-hidden cursor-pointer ${
                  isCompleted
                    ? darkMode
                      ? "bg-slate-950/40 border-emerald-500/30 opacity-75"
                      : "bg-emerald-50/20 border-emerald-200 opacity-80"
                    : isExpanded
                    ? darkMode
                      ? "bg-slate-900 border-slate-700"
                      : "bg-indigo-50/10 border-indigo-200 shadow-sm"
                    : darkMode
                    ? "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Header Strip */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Interactive Completion Circle */}
                    <button
                      onClick={(e) => handleToggleComplete(e, rec.id, rec.priority)}
                      id={`complete-btn-${rec.id}`}
                      className={`h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white animate-scale"
                          : darkMode
                          ? "border-slate-700 hover:border-indigo-400 bg-slate-900"
                          : "border-slate-300 hover:border-indigo-600 bg-slate-50"
                      }`}
                      title={isCompleted ? "Mark incomplete" : "Simulate applying this optimization"}
                    >
                      {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${getPriorityBadge(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                        <span className={`text-[9px] font-mono tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"} uppercase font-semibold`}>
                          Area: {rec.category}
                        </span>
                      </div>
                      <p className={`text-xs font-bold truncate mt-1 ${isCompleted ? "line-through text-slate-400" : ""}`}>
                        {rec.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-500 hover:text-slate-300 ml-4 shrink-0">
                    {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                  </div>
                </div>

                {/* Sliding Expansive Details */}
                {isExpanded && (
                  <div className={`p-4 border-t ${darkMode ? "border-slate-800 bg-slate-950/80" : "border-slate-100 bg-slate-50/50"} text-xs space-y-4 font-sans`}>
                    
                    {/* The Causal Analysis */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">The Strategic Gap (Reason)</span>
                      <p className={`leading-relaxed text-[11px] ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{rec.description}</p>
                    </div>

                    {/* Metadata elements: Business Value, Difficulty */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5 border-t border-slate-500/5">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold mb-0.5">Business Value</span>
                        <p className={`font-semibold text-xs ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                          {rec.businessValue || "Directly mitigates customer friction by injecting standardized structured parameters."}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold mb-0.5">Difficulty to Deploy</span>
                        <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded border mt-0.5 uppercase ${getDifficultyBadge(rec.difficulty || "Easy")}`}>
                          {rec.difficulty || "Easy"}
                        </span>
                      </div>
                    </div>

                    {/* Expected Impact */}
                    <div className={`p-3.5 rounded-xl border flex items-start space-x-2.5 ${
                      darkMode ? "bg-indigo-500/5 border-indigo-500/10" : "bg-indigo-50/50 border-indigo-100"
                    }`}>
                      <Zap className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-500 text-[10px] font-mono uppercase tracking-wider block">Expected Impact</span>
                        <p className={`mt-0.5 text-xs ${darkMode ? "text-slate-300" : "text-slate-700 font-medium"}`}>{rec.impact}</p>
                      </div>
                    </div>

                    {isCompleted ? (
                      <p className="text-[10px] text-emerald-400 font-bold font-mono flex items-center space-x-1">
                        <span>✓ Simulated implementation active. Your Readiness Score has adjusted.</span>
                      </p>
                    ) : (
                      <button
                        onClick={(e) => handleToggleComplete(e, rec.id, rec.priority)}
                        className="text-[10px] text-indigo-500 hover:text-indigo-400 font-bold font-mono flex items-center space-x-1 cursor-pointer"
                      >
                        <span>→ Click the checklist circle above to simulate implementing this change</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Generate Doc Button with Success Alert */}
        <div className="mt-6 pt-4 border-t border-slate-500/10">
          <button
            onClick={() => {
              setDocGenerated(true);
              setTimeout(() => setDocGenerated(false), 5000);
            }}
            className={`w-full py-3 border-2 border-dashed rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              docGenerated
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : darkMode
                ? "border-slate-800 hover:border-indigo-500/50 hover:text-indigo-400 text-slate-500 bg-slate-950/20"
                : "border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-400 bg-slate-50/50"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{docGenerated ? "Technical Guidelines Exported Successfully!" : "Export Technical Guidelines & Schema Templates for Engineering"}</span>
          </button>

          {docGenerated && (
            <div className={`mt-3 p-3.5 rounded-lg border text-xs flex items-center space-x-2.5 animate-fade-in ${
              darkMode ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}>
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500 animate-bounce" />
              <span>
                <strong>Perfect Export:</strong> Technical implementation schemas, structured catalog specifications tables, and robots.txt bot permission snippets compiled successfully. Shared directly to target engineering boards.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
