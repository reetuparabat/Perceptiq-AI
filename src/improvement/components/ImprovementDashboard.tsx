/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ImprovementProgressStats, ImprovementTask } from "../types";
import { CheckCircle, Clock, Zap, ArrowRight, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

interface ImprovementDashboardProps {
  darkMode: boolean;
  stats: ImprovementProgressStats;
  nextStep: ImprovementTask | null;
  onSelectTask: (task: ImprovementTask) => void;
}

export default function ImprovementDashboard({
  darkMode,
  stats,
  nextStep,
  onSelectTask,
}: ImprovementDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans" id="improvement-dashboard">
      {/* 1. Overall Completion Progress */}
      <div 
        className={`p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
        id="stat-card-completion"
      >
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Overall Progress
          </h4>
          <p className="text-2xl font-display font-extrabold tracking-tight">
            AI Visibility Alignment
          </p>
        </div>

        <div className="flex items-center space-x-6 py-6">
          {/* Circular Progress Ring */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className={darkMode ? "text-slate-800" : "text-slate-100"}
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 transition-all duration-500 ease-out"
                strokeDasharray={`${stats.overallCompletionPercentage}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-display font-black text-indigo-400">
                {stats.overallCompletionPercentage}%
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                <strong>{stats.completedTasks}</strong> of <strong>{stats.totalTasks}</strong> Completed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                <strong>{stats.pendingTasks}</strong> Tasks Remaining
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
              <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                <strong>{stats.highPriorityRemaining}</strong> High Priority Pending
              </span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center space-x-1.5 pt-2 border-t border-slate-500/5">
          <TrendingUp className="h-3 w-3 text-indigo-400" />
          <span>User tracking progress only. AI Report score remains locked.</span>
        </div>
      </div>

      {/* 2. Most Important Next Step (Feature 8) */}
      <div 
        className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col justify-between relative overflow-hidden ${
          darkMode 
            ? "bg-slate-900/60 border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950/20" 
            : "bg-white border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/10 to-white"
        }`}
        id="stat-card-next-step"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Recommended Next Action</span>
            </span>
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
              Highest Yield
            </span>
          </div>

          {nextStep ? (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-display font-bold tracking-tight text-indigo-400">
                {nextStep.title}
              </h3>
              <p className={`text-xs leading-relaxed line-clamp-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {nextStep.whatIsWrong} {nextStep.whyDoesAiCare}
              </p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-[11px] font-mono">
                <span className={darkMode ? "text-slate-400" : "text-slate-500"}>
                  Effort: <strong className="text-slate-200">{nextStep.estimatedEffort}</strong>
                </span>
                <span className={darkMode ? "text-slate-400" : "text-slate-500"}>
                  Category: <strong className="text-slate-200">{nextStep.category}</strong>
                </span>
                <span className={darkMode ? "text-slate-400" : "text-slate-500"}>
                  Engine: <strong className="text-indigo-400">{nextStep.relatedEngine}</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 py-4 text-center">
              <p className="text-sm font-semibold text-emerald-500">
                ✓ All optimization tasks completed! Outstanding standing.
              </p>
            </div>
          )}
        </div>

        {nextStep && (
          <button
            onClick={() => onSelectTask(nextStep)}
            className="mt-4 inline-flex items-center space-x-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group self-start"
            aria-label={`View details for next step: ${nextStep.title}`}
          >
            <span>View detailed implementation guide</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
}
