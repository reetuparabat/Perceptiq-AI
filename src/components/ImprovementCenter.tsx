/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Recommendation } from "../types";
import { ImprovementTask, ImprovementStatus, ImprovementProgressStats } from "../improvement/types";
import { ImprovementService } from "../improvement/service";
import ImprovementDashboard from "../improvement/components/ImprovementDashboard";
import ImprovementRoadmap from "../improvement/components/ImprovementRoadmap";
import ImprovementChecklist from "../improvement/components/ImprovementChecklist";
import ImprovementDetailPanel from "../improvement/components/ImprovementDetailPanel";
import QuickWinsList from "../improvement/components/QuickWinsList";
import { Sparkles, CheckCircle2, ChevronRight, FileText, Settings, BookOpen } from "lucide-react";

interface ImprovementCenterProps {
  darkMode: boolean;
  recommendations: Recommendation[];
  onSimulateFix: (scoreOffset: number) => void;
  // Let's also pass the active report if available so we can read domain-specific metadata!
  report?: any; 
}

export default function ImprovementCenter({
  darkMode,
  recommendations,
  onSimulateFix,
  report,
}: ImprovementCenterProps) {
  // 1. Compile the tasks dynamically based on the current report
  // Fallback if no report is passed (e.g., from old props structure)
  const activeReport = React.useMemo(() => {
    if (report) return report;
    return {
      url: "perceptiq.ai",
      companyName: "Perceptiq AI",
      recommendations: recommendations,
      crawlStats: {
        productCount: recommendations.some(r => r.category.toLowerCase().includes("product")) ? 5 : 0,
        faqCount: recommendations.some(r => r.category.toLowerCase().includes("faq")) ? 5 : 0,
        metadataFound: true,
      }
    };
  }, [report, recommendations]);

  const [tasks, setTasks] = React.useState<ImprovementTask[]>([]);
  const [activeView, setActiveView] = React.useState<"checklist" | "roadmap" | "quickwins">("checklist");
  const [selectedTask, setSelectedTask] = React.useState<ImprovementTask | null>(null);
  const [docGenerated, setDocGenerated] = React.useState(false);

  // Initialize tasks on report load
  React.useEffect(() => {
    const compiled = ImprovementService.compileTasks(activeReport);
    setTasks(compiled);
  }, [activeReport]);

  // Compute stats and next step (Feature 3, 8)
  const stats = React.useMemo(() => {
    return ImprovementService.calculateProgress(tasks);
  }, [tasks]);

  const nextStep = React.useMemo(() => {
    return ImprovementService.getMostImportantNextStep(tasks);
  }, [tasks]);

  // Handle task status changes (Feature 2)
  const handleStatusChange = React.useCallback((taskId: string, newStatus: ImprovementStatus) => {
    setTasks((prevTasks) => {
      const targetIndex = prevTasks.findIndex((t) => t.id === taskId);
      if (targetIndex === -1) return prevTasks;

      const oldTask = prevTasks[targetIndex];
      const oldStatus = oldTask.status;
      if (oldStatus === newStatus) return prevTasks;

      // Persist the status
      ImprovementService.saveTaskStatus(activeReport.url, taskId, newStatus);

      // Map dynamic simulated score offset from Version 2.5
      // Doing this via onSimulateFix keeps compatibility with existing simulation boards
      let scoreChange = 0;
      if (newStatus === "Completed" && oldStatus !== "Completed") {
        scoreChange = oldTask.priority === "High" ? 6 : oldTask.priority === "Medium" ? 4 : 2;
      } else if (oldStatus === "Completed" && newStatus !== "Completed") {
        scoreChange = oldTask.priority === "High" ? -6 : oldTask.priority === "Medium" ? -4 : -2;
      }
      
      if (scoreChange !== 0) {
        onSimulateFix(scoreChange);
      }

      const updated = [...prevTasks];
      updated[targetIndex] = {
        ...oldTask,
        status: newStatus
      };

      // Keep detail panel selected task in sync if open
      setSelectedTask((current) => {
        if (current && current.id === taskId) {
          return { ...current, status: newStatus };
        }
        return current;
      });

      return updated;
    });
  }, [activeReport, onSimulateFix]);

  return (
    <div className="space-y-8 font-sans" id="improvements-center-view">
      {/* 1. Progress Stats and Recommendations Dashboard (Feature 8) */}
      <ImprovementDashboard
        darkMode={darkMode}
        stats={stats}
        nextStep={nextStep}
        onSelectTask={(task) => setSelectedTask(task)}
      />

      {/* 2. Visual View Toggles */}
      <div className={`p-1.5 rounded-xl border flex flex-wrap gap-1.5 ${
        darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
      }`}>
        <button
          onClick={() => setActiveView("checklist")}
          className={`px-4 py-1.8 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeView === "checklist"
              ? "bg-indigo-600 text-white shadow-sm"
              : darkMode
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
          aria-label="Toggle Checklist View"
        >
          Structured Playbooks
        </button>
        <button
          onClick={() => setActiveView("roadmap")}
          className={`px-4 py-1.8 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeView === "roadmap"
              ? "bg-indigo-600 text-white shadow-sm"
              : darkMode
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
          aria-label="Toggle Roadmap View"
        >
          Priority Alignment Roadmap
        </button>
        <button
          onClick={() => setActiveView("quickwins")}
          className={`px-4 py-1.8 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeView === "quickwins"
              ? "bg-indigo-600 text-white shadow-sm"
              : darkMode
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
          aria-label="Toggle Quick Wins View"
        >
          ⚡ High-Yield Quick Wins
        </button>
      </div>

      {/* 3. Render Selected View Pane */}
      <div className="space-y-4">
        {activeView === "checklist" && (
          <ImprovementChecklist
            darkMode={darkMode}
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onSelectTask={(task) => setSelectedTask(task)}
          />
        )}

        {activeView === "roadmap" && (
          <ImprovementRoadmap
            darkMode={darkMode}
            tasks={tasks}
            onSelectTask={(task) => setSelectedTask(task)}
          />
        )}

        {activeView === "quickwins" && (
          <QuickWinsList
            darkMode={darkMode}
            tasks={tasks}
            onSelectTask={(task) => setSelectedTask(task)}
          />
        )}
      </div>

      {/* 4. Playbook Detail Side-sheet (Feature 10) */}
      <ImprovementDetailPanel
        darkMode={darkMode}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChange}
      />

      {/* 5. Legacy Technical Export Tooling */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold font-display">Export Schema & Playbook Integration Template</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compile and share structured JSON-LD Organization markups, conversational FAQs codes, and robots.txt rules directly with your development team.
            </p>
          </div>
          <button
            onClick={() => {
              setDocGenerated(true);
              setTimeout(() => setDocGenerated(false), 5000);
            }}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center space-x-1.5 shrink-0 ${
              docGenerated
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : darkMode
                ? "border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{docGenerated ? "Playbooks Compiled!" : "Export Technical Guidelines"}</span>
          </button>
        </div>

        {docGenerated && (
          <div className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center space-x-2.5 animate-fade-in ${
            darkMode ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}>
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500 animate-bounce" />
            <span>
              <strong>Success:</strong> Standard JSON-LD structures, robot crawler bot parameters, and site FAQs scripts compiled to clipboards. Ready for direct injection to page sitemaps and corporate heads.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
