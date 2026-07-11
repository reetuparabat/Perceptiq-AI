/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ImprovementTask } from "../types";
import { X, CheckSquare, ShieldCheck, Zap, Info, FileText, AlertCircle, Play } from "lucide-react";

interface ImprovementDetailPanelProps {
  darkMode: boolean;
  task: ImprovementTask | null;
  onClose: () => void;
  onStatusChange: (taskId: string, status: "Not Started" | "In Progress" | "Completed") => void;
}

export default function ImprovementDetailPanel({
  darkMode,
  task,
  onClose,
  onStatusChange,
}: ImprovementDetailPanelProps) {
  // Listen for escape key (Feature 13)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!task) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden font-sans" 
      id="recommendation-detail-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-panel-title"
    >
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer content sliding from right */}
      <div className="absolute inset-y-0 right-0 max-w-xl w-full flex pl-10">
        <div className={`w-full h-full flex flex-col justify-between overflow-y-auto shadow-2xl relative ${
          darkMode ? "bg-slate-900 border-l border-slate-800 text-slate-100" : "bg-white border-l border-slate-200 text-slate-900"
        }`}>
          
          {/* Header Panel */}
          <div className={`p-6 border-b flex items-start justify-between ${
            darkMode ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="space-y-1.5 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  task.priority === "High" 
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/15" 
                    : task.priority === "Medium"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                    : "bg-sky-500/10 text-sky-400 border border-sky-500/15"
                }`}>
                  {task.priority} Priority
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">
                  Engine: {task.relatedEngine}
                </span>
              </div>
              <h2 id="detail-panel-title" className="text-base font-display font-bold tracking-tight">
                {task.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                darkMode ? "border-slate-800 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-500"
              }`}
              aria-label="Close playbook panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Main Scroller Content */}
          <div className="p-6 space-y-6 flex-1">
            
            {/* Quick Summary State */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
              darkMode ? "bg-slate-950/50 border-slate-800/80" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Current State</span>
                <p className="text-xs font-bold text-indigo-400">{task.status}</p>
              </div>

              <div className="flex gap-1.5">
                {["Not Started", "In Progress", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(task.id, status as any)}
                    className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded border cursor-pointer transition-all ${
                      task.status === status
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : darkMode
                        ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {status === "Completed" ? "Mark Complete" : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Business-Friendly Detailed Explanations (Feature 7) */}
            <div className="space-y-5">
              
              {/* Section 1: What is wrong */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center space-x-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>1. What is wrong?</span>
                </h4>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {task.whatIsWrong}
                </p>
              </div>

              {/* Section 2: Why does AI care */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center space-x-1.5">
                  <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>2. Why does AI care?</span>
                </h4>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {task.whyDoesAiCare}
                </p>
              </div>

              {/* Section 3: What should I do */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center space-x-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>3. What should I do?</span>
                </h4>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {task.whatShouldIDo}
                </p>
              </div>

              {/* Section 4: What benefit might I see */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center space-x-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>4. What benefit might I see?</span>
                </h4>
                <p className={`text-xs leading-relaxed font-semibold text-indigo-400`}>
                  {task.whatBenefitMightISee}
                </p>
              </div>

            </div>

            {/* Evidence details (Feature 10) */}
            <div className={`p-4 rounded-xl border space-y-1.5 ${
              darkMode ? "bg-slate-950/20 border-slate-800/80" : "bg-slate-50 border-slate-200"
            }`}>
              <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">
                CRAWL EVIDENCE:
              </span>
              <p className={`text-xs leading-relaxed font-mono ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {task.evidence}
              </p>
            </div>

            {/* Affected AI engines (Feature 10) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                Affected AI Engines
              </span>
              <div className="flex flex-wrap gap-2">
                {task.affectedEngines.map((engine) => (
                  <span
                    key={engine}
                    className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border ${
                      darkMode 
                        ? "bg-slate-900 border-slate-800 text-slate-300" 
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {engine}
                  </span>
                ))}
              </div>
            </div>

            {/* Playbook Sub-checklist (Feature 10) */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                Action Playbook Steps
              </span>
              <div className="space-y-2">
                {task.suggestedActions.map((action, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-xl border flex items-start space-x-3 text-xs ${
                      darkMode ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-100 shadow-xs"
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">
                      {i + 1}
                    </span>
                    <p className={darkMode ? "text-slate-300" : "text-slate-600"}>
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer controls */}
          <div className={`p-4 border-t flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider ${
            darkMode ? "border-slate-800 bg-slate-950/40 text-slate-500" : "border-slate-200 bg-slate-50 text-slate-400"
          }`}>
            <span>Module: Playbook-AAO</span>
            <span>Est Effort: {task.estimatedEffort}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
