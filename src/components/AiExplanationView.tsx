/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ExplanationResponse } from "../types";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Info, 
  ShieldCheck, 
  ArrowRight,
  Award,
  ChevronRight,
  Activity,
  ShieldAlert
} from "lucide-react";

interface AiExplanationViewProps {
  darkMode: boolean;
  explanation: ExplanationResponse;
}

export default function AiExplanationView({ darkMode, explanation }: AiExplanationViewProps) {
  const [activeStep, setActiveStep] = React.useState<number>(0);

  const getPriorityColor = (priority: string) => {
    const val = priority.toLowerCase();
    if (val === "high") {
      return darkMode ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (val === "medium") {
      return darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200";
    }
    return darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  return (
    <div className="space-y-6" id="ai-explanation-view">
      {/* Consulting Signature Banner */}
      <div className={`p-6 rounded-2xl border ${
        darkMode 
          ? "bg-slate-900/40 border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" 
          : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 mb-5 border-b border-slate-500/10">
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg ${darkMode ? "bg-indigo-950/50 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                <span>Executive AI Intelligence Report</span>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase">
                  Sprint 6 Active
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                PwC / EY style narrative translation of verified deterministic scores.
              </p>
            </div>
          </div>
          <div className="text-left md:text-right text-[10px] font-mono text-slate-400">
            <span>Framework: Consultant-v1.4</span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 block font-bold">
            01. Executive Summary
          </span>
          <div className={`p-5 rounded-xl border leading-relaxed text-xs ${
            darkMode ? "bg-slate-950/40 border-slate-800 text-slate-300" : "bg-indigo-50/20 border-indigo-100/40 text-slate-700 font-medium"
          }`}>
            {explanation.executiveSummary}
          </div>
        </div>
      </div>

      {/* Two column grid for Strengths and Business Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Key Strengths */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 block font-bold mb-4">
            02. Verified Strengths
          </span>
          <div className="space-y-3">
            {explanation.keyStrengths.map((strength, i) => (
              <div 
                key={i} 
                className={`p-3.5 rounded-xl border text-xs flex items-start space-x-3 transition-all hover:translate-x-1 ${
                  darkMode ? "bg-emerald-500/5 border-emerald-500/10" : "bg-emerald-50/20 border-emerald-100"
                }`}
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className={`font-bold block ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
                    Strength Verified
                  </span>
                  <p className={`opacity-85 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-650"}`}>
                    {strength}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Business Impact */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        } flex flex-col justify-between`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 block font-bold mb-4">
              03. Recommendation Business Impact
            </span>
            <div className={`p-4 rounded-xl border mb-4 flex items-start space-x-3 ${
              darkMode ? "bg-indigo-500/5 border-indigo-500/10" : "bg-indigo-50/40 border-indigo-100"
            }`}>
              <TrendingUp className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className={`font-bold text-xs block ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
                  AI Assistant Standing Implication
                </span>
                <p className={`text-xs leading-relaxed opacity-85 ${darkMode ? "text-slate-400" : "text-slate-650"}`}>
                  {explanation.businessImpact}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border text-[10px] flex items-center space-x-2 ${
            darkMode ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
          }`}>
            <Info className="h-4.5 w-4.5 text-slate-500 shrink-0" />
            <span>AI recommendation status and discoverability depend heavily on well-structured business information.</span>
          </div>
        </div>
      </div>

      {/* 3. Priority Improvements */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 block font-bold mb-4">
          04. Prioritized Recommendations
        </span>
        <div className="space-y-4">
          {explanation.priorityImprovements.map((imp, idx) => (
            <div 
              key={idx} 
              className={`p-5 rounded-xl border transition-all ${
                darkMode ? "bg-slate-950/30 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-100 hover:shadow-sm"
              }`}
            >
              {/* Header block with Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-500/10 pb-3 mb-3">
                <div className="flex items-center space-x-2.5">
                  <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-700"}`}>
                    Item 0{idx+1}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(imp.priority)}`}>
                    Priority {imp.priority}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Target: Conversational Visibility
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Left col - Problem and Evidence */}
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 font-bold block mb-0.5">
                      Identified Gap
                    </span>
                    <p className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
                      {imp.problem}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                      Supporting Evidence
                    </span>
                    <p className={`opacity-85 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-650"}`}>
                      {imp.supportingEvidence}
                    </p>
                  </div>
                </div>

                {/* Right col - Impact and Suggested Action */}
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold block mb-0.5">
                      Business Danger
                    </span>
                    <p className={`opacity-85 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-650"}`}>
                      {imp.businessImpact}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 font-bold block mb-0.5">
                      Suggested Advisory Action
                    </span>
                    <p className={`opacity-85 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-650"}`}>
                      {imp.suggestedAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom expected outcome sheet */}
              <div className={`mt-3.5 pt-3.5 border-t border-dashed border-slate-500/10 flex items-center space-x-2 text-xs ${
                darkMode ? "text-emerald-400" : "text-emerald-800 font-semibold"
              }`}>
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Expected Value Unlocked: {imp.expectedImprovement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Limitations & Next Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Limitations */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        } flex flex-col justify-between`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 block font-bold mb-4">
              05. Analysis Limitations
            </span>
            <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-3 ${
              darkMode ? "bg-slate-950/40 border-slate-800 text-slate-300" : "bg-rose-50/15 border-rose-100 text-slate-700"
            }`}>
              <div className="flex items-center space-x-2 text-rose-500 font-mono text-[10px] uppercase font-bold">
                <ShieldAlert className="h-4.5 w-4.5" />
                <span>Verification Scope Boundaries</span>
              </div>
              <p>{explanation.limitations}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-500/10 text-[9px] font-mono text-slate-500 leading-snug">
            {explanation.analysisBoundaries}
          </div>
        </div>

        {/* 6. Next Actions */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 block font-bold mb-4">
            06. Strategic Action Checklist
          </span>
          <div className="space-y-2.5">
            {explanation.nextActions.slice(0, 5).map((act, i) => (
              <div 
                key={i} 
                onClick={() => setActiveStep(i)}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  activeStep === i 
                    ? (darkMode ? "bg-indigo-500/10 border-indigo-500/35 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-950 font-bold")
                    : (darkMode ? "bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700" : "bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200")
                }`}
              >
                <div className="flex items-center space-x-3 pr-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                    activeStep === i 
                      ? "bg-indigo-500 text-white" 
                      : (darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600")
                  }`}>
                    0{i+1}
                  </span>
                  <span className="leading-snug">{act}</span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-45" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
