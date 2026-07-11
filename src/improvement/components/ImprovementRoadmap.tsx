/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ImprovementTask, ImprovementPriority } from "../types";
import { Sparkles, Zap, ShieldAlert, AlertTriangle, Info, ArrowRight, HelpCircle } from "lucide-react";

interface ImprovementRoadmapProps {
  darkMode: boolean;
  tasks: ImprovementTask[];
  onSelectTask: (task: ImprovementTask) => void;
}

export default function ImprovementRoadmap({
  darkMode,
  tasks,
  onSelectTask,
}: ImprovementRoadmapProps) {
  const priorities: ImprovementPriority[] = ["High", "Medium", "Low"];

  const getPriorityIcon = (p: ImprovementPriority) => {
    switch (p) {
      case "High":
        return <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />;
      case "Medium":
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" />;
      default:
        return <Info className="h-4.5 w-4.5 text-sky-500 shrink-0" />;
    }
  };

  const getPriorityColor = (p: ImprovementPriority) => {
    switch (p) {
      case "High":
        return {
          title: "text-rose-500 dark:text-rose-400",
          border: "border-rose-500/10 dark:border-rose-500/20",
          bg: "bg-rose-500/5"
        };
      case "Medium":
        return {
          title: "text-amber-500 dark:text-amber-400",
          border: "border-amber-500/10 dark:border-amber-500/20",
          bg: "bg-amber-500/5"
        };
      default:
        return {
          title: "text-sky-500 dark:text-sky-400",
          border: "border-sky-500/10 dark:border-sky-500/20",
          bg: "bg-sky-500/5"
        };
    }
  };

  return (
    <div className="space-y-8 font-sans" id="improvement-roadmap">
      {priorities.map((priority) => {
        const priorityTasks = tasks.filter((t) => t.priority === priority);
        if (priorityTasks.length === 0) return null;

        const colors = getPriorityColor(priority);

        return (
          <div key={priority} className="space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-500/10">
              {getPriorityIcon(priority)}
              <h3 className={`text-sm font-display font-black uppercase tracking-wider ${colors.title}`}>
                {priority} Priority Alignment
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-slate-500/10 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {priorityTasks.length} {priorityTasks.length === 1 ? "Task" : "Tasks"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priorityTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  id={`roadmap-item-${task.id}`}
                  className={`p-5 rounded-xl border transition-all hover:scale-[1.01] hover:border-indigo-500/40 cursor-pointer flex flex-col justify-between ${
                    task.status === "Completed"
                      ? darkMode
                        ? "bg-slate-950/20 border-emerald-500/20 opacity-60"
                        : "bg-emerald-50/10 border-emerald-200 opacity-70"
                      : darkMode
                      ? "bg-slate-900/40 border-slate-800 hover:bg-slate-900/60"
                      : "bg-white border-slate-200 hover:shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                          Category: {task.category}
                        </span>
                        <h4 className={`text-xs font-bold leading-tight ${task.status === "Completed" ? "line-through text-slate-500" : ""}`}>
                          {task.title}
                        </h4>
                      </div>
                      
                      {task.isQuickWin && (
                        <span className="text-[8px] font-mono font-bold uppercase shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                          ⚡ Quick Win
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-[11px] leading-relaxed">
                      <div>
                        <span className="text-[9px] font-mono uppercase font-bold text-slate-500 block">Why it matters:</span>
                        <p className={darkMode ? "text-slate-400" : "text-slate-600"}>{task.whyItMatters}</p>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono uppercase font-bold text-slate-500 block">Business Impact:</span>
                        <p className={darkMode ? "text-slate-300" : "text-slate-700"}>{task.businessImpact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-500/5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500">
                      <span>Effort: <strong className={darkMode ? "text-slate-300" : "text-slate-700"}>{task.estimatedEffort}</strong></span>
                      <span>Engine: <strong className="text-indigo-400">{task.relatedEngine}</strong></span>
                    </div>

                    <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold text-indigo-400">
                      <span>View Playbook</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
