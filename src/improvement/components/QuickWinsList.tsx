/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ImprovementTask } from "../types";
import { Zap, Clock, ArrowRight, ShieldCheck } from "lucide-react";

interface QuickWinsListProps {
  darkMode: boolean;
  tasks: ImprovementTask[];
  onSelectTask: (task: ImprovementTask) => void;
}

export default function QuickWinsList({
  darkMode,
  tasks,
  onSelectTask,
}: QuickWinsListProps) {
  const quickWins = React.useMemo(() => {
    return tasks.filter((t) => t.isQuickWin && t.status !== "Completed");
  }, [tasks]);

  if (quickWins.length === 0) {
    return (
      <div className={`p-6 rounded-xl border text-center ${
        darkMode ? "bg-slate-900/10 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"
      } text-xs font-sans`}>
        No pending Quick Wins! Outstanding effort resolving easy low-hanging fruits.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans" id="quick-wins-list">
      {quickWins.map((task) => (
        <div
          key={task.id}
          onClick={() => onSelectTask(task)}
          className={`p-5 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-indigo-500/40 cursor-pointer ${
            darkMode 
              ? "bg-slate-900/20 border-slate-800/80 hover:bg-slate-900/40" 
              : "bg-white border-slate-200 hover:shadow-xs"
          }`}
          id={`quick-win-item-${task.id}`}
        >
          <div className="space-y-3">
            {/* Header / Tags */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                <Zap className="h-3 w-3 animate-pulse" />
                <span>Quick Win</span>
              </span>

              <span className="text-[9px] font-mono text-slate-500 uppercase">
                {task.category}
              </span>
            </div>

            {/* Title / Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold leading-snug">
                {task.title}
              </h4>
              <p className={`text-[11px] leading-relaxed line-clamp-3 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {task.whyItMatters}
              </p>
            </div>

            {/* Quick Win details */}
            <div className={`p-3 rounded-lg text-[11px] space-y-1.5 ${
              darkMode ? "bg-slate-950/40 border border-slate-800/60" : "bg-slate-50 border border-slate-100"
            }`}>
              <div>
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block">Expected Benefit:</span>
                <span className="font-semibold text-indigo-400">{task.expectedAIBenefit}</span>
              </div>
              {task.quickWinReason && (
                <div>
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block">Why it's fast:</span>
                  <p className={darkMode ? "text-slate-400" : "text-slate-600"}>{task.quickWinReason}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-500/5 flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase">
            <span className="flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Est: {task.estimatedEffort}</span>
            </span>

            <span className="inline-flex items-center space-x-1 text-indigo-400">
              <span>View Guide</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
