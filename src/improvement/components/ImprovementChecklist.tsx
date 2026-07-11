/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ImprovementTask, ImprovementPriority, ImprovementCategory, ImprovementStatus } from "../types";
import { Search, ChevronDown, ChevronUp, Check, Play, Circle, Trash2, HelpCircle } from "lucide-react";

interface ImprovementChecklistProps {
  darkMode: boolean;
  tasks: ImprovementTask[];
  onStatusChange: (taskId: string, status: ImprovementStatus) => void;
  onSelectTask: (task: ImprovementTask) => void;
}

const CATEGORIES: ImprovementCategory[] = [
  "Business Information",
  "Website Structure",
  "Products",
  "Services",
  "Trust",
  "Recommendation",
  "Content",
  "Technical Signals"
];

const PRIORITIES: ImprovementPriority[] = ["High", "Medium", "Low"];
const STATUSES: ImprovementStatus[] = ["Not Started", "In Progress", "Completed"];

export default function ImprovementChecklist({
  darkMode,
  tasks,
  onStatusChange,
  onSelectTask,
}: ImprovementChecklistProps) {
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<ImprovementPriority | "All">("All");
  const [categoryFilter, setCategoryFilter] = React.useState<ImprovementCategory | "All">("All");
  const [statusFilter, setStatusFilter] = React.useState<ImprovementStatus | "All">("All");

  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  // Memoized Filtering (Feature 12)
  const filteredTasks = React.useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (priorityFilter !== "All" && task.priority !== priorityFilter) return false;
      if (categoryFilter !== "All" && task.category !== categoryFilter) return false;
      if (statusFilter !== "All" && task.status !== statusFilter) return false;

      if (cleanSearch) {
        const titleMatch = task.title.toLowerCase().includes(cleanSearch);
        const descMatch = task.whyItMatters.toLowerCase().includes(cleanSearch);
        const wrongMatch = task.whatIsWrong.toLowerCase().includes(cleanSearch);
        const categoryMatch = task.category.toLowerCase().includes(cleanSearch);
        return titleMatch || descMatch || wrongMatch || categoryMatch;
      }
      return true;
    });
  }, [tasks, search, priorityFilter, categoryFilter, statusFilter]);

  const getPriorityBadgeColor = (p: ImprovementPriority) => {
    switch (p) {
      case "High":
        return darkMode ? "bg-rose-500/10 text-rose-400 border border-rose-500/15" : "bg-rose-50 text-rose-700 border border-rose-100";
      case "Medium":
        return darkMode ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" : "bg-amber-50 text-amber-700 border border-amber-100";
      default:
        return darkMode ? "bg-sky-500/10 text-sky-400 border border-sky-500/15" : "bg-sky-50 text-sky-700 border border-sky-100";
    }
  };

  const getStatusBadge = (status: ImprovementStatus) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15";
      case "In Progress":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/15";
      default:
        return darkMode ? "bg-slate-800 text-slate-400 border border-slate-700" : "bg-slate-100 text-slate-500 border border-slate-200";
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCheckboxClick = (e: React.MouseEvent, task: ImprovementTask) => {
    e.stopPropagation();
    const nextStatus: ImprovementStatus = task.status === "Completed" ? "Not Started" : "Completed";
    onStatusChange(task.id, nextStatus);
  };

  return (
    <div className="space-y-4 font-sans" id="improvement-checklist-module">
      {/* Filters Board (Feature 9) */}
      <div 
        className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-3 items-center ${
          darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"
        }`}
        id="checklist-filters"
      >
        {/* Keyword Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search optimization tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-1.8 text-xs rounded-lg border outline-none transition-all ${
              darkMode 
                ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500/50" 
                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-300"
            }`}
            aria-label="Search recommendations"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all ${
              darkMode 
                ? "bg-slate-950 border-slate-800 text-slate-300 focus:border-indigo-500/50" 
                : "bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-300"
            }`}
            aria-label="Filter by priority"
          >
            <option value="All">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p} Priority</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all ${
              darkMode 
                ? "bg-slate-950 border-slate-800 text-slate-300 focus:border-indigo-500/50" 
                : "bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-300"
            }`}
            aria-label="Filter by business category"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all ${
              darkMode 
                ? "bg-slate-950 border-slate-800 text-slate-300 focus:border-indigo-500/50" 
                : "bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-300"
            }`}
            aria-label="Filter by progress status"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Checklist Grid (Feature 2) */}
      <div className="space-y-2.5" id="checklist-tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No optimization tasks match your current filters. Clear search or filters to reset.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedId === task.id;
            const isCompleted = task.status === "Completed";
            const isInProgress = task.status === "In Progress";

            return (
              <div
                key={task.id}
                id={`checklist-item-${task.id}`}
                onClick={() => onSelectTask(task)}
                className={`border rounded-xl transition-all duration-150 overflow-hidden cursor-pointer ${
                  isCompleted
                    ? darkMode
                      ? "bg-slate-950/20 border-emerald-500/15 opacity-70"
                      : "bg-emerald-50/10 border-emerald-100 opacity-80"
                    : darkMode
                    ? "bg-slate-900/30 border-slate-800/80 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Accordion Row Header */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                    {/* Multi-state Interactive Checklist Marker (Feature 2) */}
                    <button
                      onClick={(e) => handleCheckboxClick(e, task)}
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : isInProgress
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                          : darkMode
                          ? "border-slate-700 bg-slate-950 hover:border-indigo-500"
                          : "border-slate-300 bg-slate-50 hover:border-indigo-500"
                      }`}
                      id={`checkbox-${task.id}`}
                      aria-label={`Mark task ${task.title} as ${isCompleted ? "Incomplete" : "Completed"}`}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : isInProgress ? (
                        <Play className="h-2.5 w-2.5 fill-current" />
                      ) : null}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${getPriorityBadgeColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">
                          {task.category}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold leading-snug mt-0.5 truncate ${isCompleted ? "line-through text-slate-500" : ""}`}>
                        {task.title}
                      </p>
                    </div>
                  </div>

                  {/* Status pills + expand indicator */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>

                    <button
                      onClick={(e) => toggleExpand(task.id, e)}
                      className="text-slate-500 hover:text-slate-300 focus:outline-none p-1"
                      aria-label="Expand basic task details"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Micro Expand details inside the row */}
                {isExpanded && (
                  <div className={`px-4 pb-4 pt-2 border-t text-xs space-y-3 ${
                    darkMode ? "border-slate-800 bg-slate-950/30" : "border-slate-100 bg-slate-50/20"
                  }`}>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">
                        Quick Status Switcher
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {STATUSES.map((status) => (
                          <button
                            key={status}
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(task.id, status);
                            }}
                            className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded-md border cursor-pointer transition-all ${
                              task.status === status
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : darkMode
                                ? "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">
                          AI Reasoning:
                        </span>
                        <p className={`mt-0.5 leading-relaxed text-[11px] ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                          {task.whyItMatters}
                        </p>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">
                          Suggested Action:
                        </span>
                        <p className={`mt-0.5 leading-relaxed text-[11px] ${darkMode ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                          {task.whatShouldIDo}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
