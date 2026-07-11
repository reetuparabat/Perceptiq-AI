/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AIReadinessReport } from "../../types";
import { ImprovementTask, ImprovementStatus, TimelineMilestone, AchievementBadge } from "../types";
import { ImprovementService } from "../service";
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  Activity, 
  Zap, 
  ShieldCheck, 
  CheckCircle,
  Clock,
  Compass,
  ArrowDown,
  Sparkles,
  Info,
  ListTodo,
  FileText
} from "lucide-react";

interface ProgressTimelineProps {
  darkMode: boolean;
  report: AIReadinessReport;
  simulatedScoreOffset: number;
}

export default function ProgressTimeline({
  darkMode,
  report,
  simulatedScoreOffset,
}: ProgressTimelineProps) {
  // 1. Compile current active tasks to evaluate user's live completion state
  const tasks = React.useMemo(() => {
    return ImprovementService.compileTasks(report);
  }, [report]);

  // Compute live statistics
  const stats = React.useMemo(() => {
    return ImprovementService.calculateProgress(tasks);
  }, [tasks]);

  // Dynamic baseline calculations
  const baseReadiness = 45;
  const baseRecReadiness = 35;
  const baseTrust = 40;
  const baseKnowledge = 38;

  const previousReadiness = 72;

  // Active metrics computed dynamically on top of current audit + simulation
  const activeReadiness = React.useMemo(() => {
    const reportScore = typeof report.overallScore === "number" ? report.overallScore : 72;
    return Math.min(100, Math.max(0, reportScore + simulatedScoreOffset));
  }, [report.overallScore, simulatedScoreOffset]);

  const activeTrust = React.useMemo(() => {
    const reportTrust = typeof report.scoreBreakdown.trustSignals === "number" ? report.scoreBreakdown.trustSignals : 68;
    return Math.min(100, Math.max(0, reportTrust + simulatedScoreOffset));
  }, [report.scoreBreakdown.trustSignals, simulatedScoreOffset]);

  const activeRecReadiness = React.useMemo(() => {
    const reportRec = typeof report.executiveSummary.recommendationProbability === "number" ? report.executiveSummary.recommendationProbability : 65;
    return Math.min(100, Math.max(0, reportRec + simulatedScoreOffset));
  }, [report.executiveSummary.recommendationProbability, simulatedScoreOffset]);

  const activeKnowledge = React.useMemo(() => {
    const reportContent = typeof report.scoreBreakdown.contentQuality === "number" ? report.scoreBreakdown.contentQuality : 70;
    return Math.min(100, Math.max(0, reportContent + simulatedScoreOffset));
  }, [report.scoreBreakdown.contentQuality, simulatedScoreOffset]);

  // Deltas vs March 2026 Baseline
  const readinessDelta = activeReadiness - baseReadiness;
  const recDelta = activeRecReadiness - baseRecReadiness;
  const trustDelta = activeTrust - baseTrust;
  const knowledgeDelta = activeKnowledge - baseKnowledge;

  // Compile completed, in progress, and pending lists (Feature 7)
  const completedTasks = React.useMemo(() => {
    return tasks.filter(t => t.status === "Completed");
  }, [tasks]);

  const inProgressTasks = React.useMemo(() => {
    return tasks.filter(t => t.status === "In Progress");
  }, [tasks]);

  const pendingTasks = React.useMemo(() => {
    return tasks.filter(t => t.status === "Not Started");
  }, [tasks]);

  // Determine Most Recent Completed or In Progress item for history banner
  const mostRecentActivity = React.useMemo(() => {
    if (completedTasks.length > 0) {
      return { task: completedTasks[0], label: "Recently Completed" };
    }
    if (inProgressTasks.length > 0) {
      return { task: inProgressTasks[0], label: "Currently Active" };
    }
    return null;
  }, [completedTasks, inProgressTasks]);

  // Next Best Action (Feature 5)
  const nextBestAction = React.useMemo(() => {
    return ImprovementService.getMostImportantNextStep(tasks);
  }, [tasks]);

  // High priority stats (Feature 3)
  const highPriorityCompletedCount = React.useMemo(() => {
    return tasks.filter(t => t.priority === "High" && t.status === "Completed").length;
  }, [tasks]);

  const highPriorityRemainingCount = React.useMemo(() => {
    return tasks.filter(t => t.priority === "High" && t.status !== "Completed").length;
  }, [tasks]);

  // Dynamic Journey Narrative (Feature 4)
  const journeyNarrative = React.useMemo(() => {
    const company = report.companyName || "Your business";
    if (stats.completedTasks > 0) {
      const completedTitles = completedTasks.map(t => t.title);
      const examples = completedTitles.length > 1 
        ? `${completedTitles[0]} and ${completedTitles[1]}` 
        : completedTitles[0];
      
      const nextCategory = nextBestAction ? nextBestAction.category : "further structured integrations";
      
      return `Since your first analysis, ${company} has improved AI understanding by successfully implementing optimizations like ${examples}. Your next highest-priority opportunity is refining your ${nextCategory.toLowerCase()} parameters to elevate shopping engine recommendation probability.`;
    } else {
      const firstAction = nextBestAction ? nextBestAction.title : "optimizing Robots.txt and Schema integrations";
      return `Since your first analysis, ${company} has established an initial semantic footprint across active LLM directories. To accelerate search index representation, your immediate next milestone is completing the ${firstAction} playbook.`;
    }
  }, [report.companyName, stats.completedTasks, completedTasks, nextBestAction]);

  // Lightweight Professional Milestones (Feature 6)
  const milestones = React.useMemo(() => {
    return [
      {
        id: "m-first-improvement",
        title: "First Improvement Aligned",
        description: "Successfully complete at least one high-impact crawler compatibility update.",
        unlocked: stats.completedTasks > 0,
      },
      {
        id: "m-faq-improved",
        title: "FAQ Coverage Optimized",
        description: "Publish conversational FAQ blocks to satisfy long-tail question retrievals.",
        unlocked: stats.completedTasks > 1 || tasks.some(t => t.id.includes("faq") && t.status === "Completed"),
      },
      {
        id: "m-trust-improved",
        title: "Brand Authority Enhanced",
        description: "Achieve verified reference structures to increase AI search recommendation index.",
        unlocked: trustDelta > 15,
      },
      {
        id: "m-rec-improved",
        title: "Recommendation Engine Qualified",
        description: "Fulfill minimum specifications for inclusion in active consumer search summaries.",
        unlocked: recDelta > 15,
      },
      {
        id: "m-readiness-80",
        title: "Elite AI Index Status (80+)",
        description: "Attain an overall AI Readiness rating of 80 or above across LLM engines.",
        unlocked: activeReadiness >= 80,
      }
    ];
  }, [stats.completedTasks, tasks, trustDelta, recDelta, activeReadiness]);

  return (
    <div className="space-y-10 font-sans max-w-7xl mx-auto px-1 py-2" id="ai-improvement-journey-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-500/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold">
            <Compass className="h-4 w-4" />
            <span>Optimization Roadmap</span>
          </div>
          <h1 className="text-2xl font-display font-black tracking-tight">
            AI Improvement Journey
          </h1>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Track, verify, and measure your business's transition from initial baseline audit to complete conversational discovery readiness.
          </p>
        </div>

        {/* Dynamic Journey Narrative Brief (Feature 4) */}
        <div className={`p-4 rounded-xl border max-w-md ${
          darkMode 
            ? "bg-indigo-500/5 border-indigo-500/20 text-slate-300" 
            : "bg-indigo-50/20 border-indigo-100 text-slate-700 shadow-xs"
        }`} id="journey-narrative-summary">
          <div className="flex items-start space-x-2.5">
            <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">Journey Narrative</span>
              <p className="text-[11px] leading-relaxed">
                {journeyNarrative}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTINUOUS JOURNEY VISUAL FLOW */}
      <div className="space-y-12 relative" id="journey-steps-flow">
        
        {/* STEP 1: Current AI Status (FEATURE 2) */}
        <div className="space-y-4" id="journey-step-status">
          <div className="flex items-center space-x-3">
            <span className="h-6 w-6 rounded-full bg-indigo-500/15 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">1</span>
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-slate-500">
              Current AI Status: Baseline vs Current
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* CARD 1: AI Readiness */}
            <div className={`p-4 rounded-xl border relative transition-all duration-200 ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">AI Readiness Score</span>
                <span className="text-[9px] font-mono text-emerald-400 font-black px-1.5 py-0.5 bg-emerald-500/10 rounded">
                  +{readinessDelta}%
                </span>
              </div>
              
              <div className="mt-3 flex items-baseline space-x-3">
                <div className="text-2xl font-display font-black text-indigo-400">{activeReadiness}%</div>
                <div className="text-[10px] text-slate-500">Currently</div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-500/5 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500 block">Baseline</span>
                  <span className="font-semibold">{baseReadiness}%</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Difference</span>
                  <span className="text-emerald-500 font-semibold font-mono">+{readinessDelta}%</span>
                </div>
              </div>
            </div>

            {/* CARD 2: Recommendation */}
            <div className={`p-4 rounded-xl border relative transition-all duration-200 ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Recommendation Index</span>
                <span className="text-[9px] font-mono text-emerald-400 font-black px-1.5 py-0.5 bg-emerald-500/10 rounded">
                  +{recDelta}%
                </span>
              </div>
              
              <div className="mt-3 flex items-baseline space-x-3">
                <div className="text-2xl font-display font-black text-indigo-400">{activeRecReadiness}%</div>
                <div className="text-[10px] text-slate-500">Currently</div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-500/5 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500 block">Baseline</span>
                  <span className="font-semibold">{baseRecReadiness}%</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Difference</span>
                  <span className="text-emerald-500 font-semibold font-mono">+{recDelta}%</span>
                </div>
              </div>
            </div>

            {/* CARD 3: Trust */}
            <div className={`p-4 rounded-xl border relative transition-all duration-200 ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Trust Signals Index</span>
                <span className="text-[9px] font-mono text-emerald-400 font-black px-1.5 py-0.5 bg-emerald-500/10 rounded">
                  +{trustDelta}%
                </span>
              </div>
              
              <div className="mt-3 flex items-baseline space-x-3">
                <div className="text-2xl font-display font-black text-indigo-400">{activeTrust}%</div>
                <div className="text-[10px] text-slate-500">Currently</div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-500/5 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500 block">Baseline</span>
                  <span className="font-semibold">{baseTrust}%</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Difference</span>
                  <span className="text-emerald-500 font-semibold font-mono">+{trustDelta}%</span>
                </div>
              </div>
            </div>

            {/* CARD 4: Knowledge Representation */}
            <div className={`p-4 rounded-xl border relative transition-all duration-200 ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Knowledge Quality</span>
                <span className="text-[9px] font-mono text-emerald-400 font-black px-1.5 py-0.5 bg-emerald-500/10 rounded">
                  +{knowledgeDelta}%
                </span>
              </div>
              
              <div className="mt-3 flex items-baseline space-x-3">
                <div className="text-2xl font-display font-black text-indigo-400">{activeKnowledge}%</div>
                <div className="text-[10px] text-slate-500">Currently</div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-500/5 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500 block">Baseline</span>
                  <span className="font-semibold">{baseKnowledge}%</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Difference</span>
                  <span className="text-emerald-500 font-semibold font-mono">+{knowledgeDelta}%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FLOW CONNECTOR */}
        <div className="flex justify-center -my-6">
          <div className="p-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* STEP 2: Current Progress Score (FEATURE 3) */}
        <div className="space-y-4" id="journey-step-progress">
          <div className="flex items-center space-x-3">
            <span className="h-6 w-6 rounded-full bg-indigo-500/15 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">2</span>
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-slate-500">
              Alignment Execution & Progress
            </h2>
          </div>

          <div className={`p-6 rounded-2xl border ${
            darkMode ? "bg-slate-900/20 border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Circular / Thick representation */}
              <div className="flex items-center space-x-6 shrink-0 w-full lg:w-auto">
                <div className="relative flex items-center justify-center h-24 w-24 shrink-0">
                  {/* SVG Circle Track */}
                  <svg className="absolute h-full w-full -rotate-90">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="stroke-slate-500/10 fill-none" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="stroke-indigo-500 fill-none transition-all duration-500" 
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * stats.overallCompletionPercentage) / 100}
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-xl font-display font-black text-indigo-400">{stats.overallCompletionPercentage}%</span>
                    <span className="text-[8px] font-mono block text-slate-500 uppercase tracking-tight">Execution</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold">Improvement Progress Score</h3>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"} max-w-sm`}>
                    This metric evaluates your playbook completion rate. It measures the execution percentage of critical website updates, rather than raw algorithm rating quality.
                  </p>
                </div>
              </div>

              {/* Progress stats breakdown details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <div className="p-3.5 rounded-xl bg-slate-500/5 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Completed Improvements</span>
                  <span className="text-xl font-display font-black text-emerald-400 mt-1 block">
                    {stats.completedTasks}
                  </span>
                </div>
                
                <div className="p-3.5 rounded-xl bg-slate-500/5 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Remaining Checkpoints</span>
                  <span className="text-xl font-display font-black text-indigo-400 mt-1 block">
                    {stats.remainingTasks}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-500/5 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">High Priority Resolved</span>
                  <span className="text-xl font-display font-black text-amber-400 mt-1 block">
                    {highPriorityCompletedCount}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-500/5 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">High Priority Left</span>
                  <span className={`text-xl font-display font-black mt-1 block ${highPriorityRemainingCount > 0 ? "text-rose-500" : "text-slate-400"}`}>
                    {highPriorityRemainingCount}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FLOW CONNECTOR */}
        <div className="flex justify-center -my-6">
          <div className="p-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* STEP 3: Latest Changes & Milestones (FEATURE 6) */}
        <div className="space-y-4" id="journey-step-milestones">
          <div className="flex items-center space-x-3">
            <span className="h-6 w-6 rounded-full bg-indigo-500/15 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">3</span>
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-slate-500">
              Latest AI Changes & Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Milestones Track (Left 8 columns) */}
            <div className={`p-6 rounded-2xl border lg:col-span-8 space-y-4 ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center space-x-1.5">
                <Award className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Optimization Milestones Achieved</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map((m) => (
                  <div 
                    key={m.id}
                    className={`p-3.5 rounded-xl border flex items-start space-x-3 transition-colors duration-200 ${
                      m.unlocked 
                        ? darkMode 
                          ? "bg-indigo-500/5 border-indigo-500/25 text-slate-200" 
                          : "bg-indigo-50/20 border-indigo-200 text-slate-800"
                        : "opacity-45 border-slate-500/10 text-slate-500"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      m.unlocked 
                        ? "bg-indigo-500/15 text-indigo-400" 
                        : "bg-slate-500/5 text-slate-600"
                    }`}>
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold leading-none">{m.title}</span>
                        {m.unlocked && (
                          <span className="text-[7px] font-mono uppercase bg-emerald-500/10 text-emerald-400 font-bold px-1 py-0.2 rounded shrink-0">
                            ✓ Aligned
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity card (Right 4 columns) */}
            <div className={`p-6 rounded-2xl border lg:col-span-4 flex flex-col justify-between space-y-4 ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="space-y-3">
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Audit Status Log</h3>
                </div>

                {mostRecentActivity ? (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/15 inline-block">
                      {mostRecentActivity.label}
                    </span>
                    <h4 className="text-xs font-bold text-indigo-300">
                      {mostRecentActivity.task.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {mostRecentActivity.task.expectedAIBenefit}
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-[11px] text-slate-500 leading-relaxed italic">
                      No updates logged during the active session. Launch playbooks below to begin making progress.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-500/5 text-[9px] font-mono text-slate-500">
                <span>Latest Scan: {new Date(report.scannedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>

          </div>
        </div>

        {/* FLOW CONNECTOR */}
        <div className="flex justify-center -my-6">
          <div className="p-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* STEP 4: Completed Improvements & History (FEATURE 7) */}
        <div className="space-y-4" id="journey-step-history">
          <div className="flex items-center space-x-3">
            <span className="h-6 w-6 rounded-full bg-indigo-500/15 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">4</span>
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-slate-500">
              Improvement History & Alignment State
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMN 1: COMPLETED */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              darkMode ? "bg-emerald-500/[0.02] border-emerald-500/10" : "bg-emerald-50/[0.02] border-emerald-500/15"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Completed ({completedTasks.length})</span>
                </span>
              </div>

              {completedTasks.length > 0 ? (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {completedTasks.map((t) => (
                    <div 
                      key={t.id} 
                      className={`p-2.5 rounded-lg border text-[11px] ${
                        darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-2xs"
                      }`}
                    >
                      <h4 className="font-bold truncate" title={t.title}>{t.title}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 truncate">{t.category} • {t.relatedEngine}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-[10px] text-slate-500 italic">No optimizations completed yet.</p>
                </div>
              )}
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              darkMode ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-amber-50/[0.02] border-amber-500/15"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>In Progress ({inProgressTasks.length})</span>
                </span>
              </div>

              {inProgressTasks.length > 0 ? (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {inProgressTasks.map((t) => (
                    <div 
                      key={t.id} 
                      className={`p-2.5 rounded-lg border text-[11px] ${
                        darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-2xs"
                      }`}
                    >
                      <h4 className="font-bold truncate" title={t.title}>{t.title}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 truncate">{t.category} • {t.relatedEngine}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-[10px] text-slate-500 italic">No active playbooks in progress.</p>
                </div>
              )}
            </div>

            {/* COLUMN 3: PENDING */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              darkMode ? "bg-slate-500/[0.02] border-slate-500/10" : "bg-slate-50/[0.02] border-slate-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <ListTodo className="h-3.5 w-3.5 shrink-0" />
                  <span>Pending ({pendingTasks.length})</span>
                </span>
              </div>

              {pendingTasks.length > 0 ? (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {pendingTasks.map((t) => (
                    <div 
                      key={t.id} 
                      className={`p-2.5 rounded-lg border text-[11px] ${
                        darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold truncate flex-1" title={t.title}>{t.title}</h4>
                        {t.priority === "High" && (
                          <span className="text-[7px] font-mono uppercase bg-rose-500/10 text-rose-400 font-bold px-1 rounded shrink-0">
                            High
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500 mt-0.5 truncate">{t.category} • Effort: {t.estimatedEffort}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-[10px] text-slate-500 italic">All recommendations resolved!</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* FLOW CONNECTOR */}
        <div className="flex justify-center -my-6">
          <div className="p-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* STEP 5: Next Best Action (FEATURE 5) */}
        <div className="space-y-4" id="journey-step-action">
          <div className="flex items-center space-x-3">
            <span className="h-6 w-6 rounded-full bg-indigo-500/15 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">5</span>
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-slate-500">
              Your Next Best Action
            </h2>
          </div>

          <div 
            className={`p-6 rounded-2xl border transition-all duration-200 overflow-hidden relative ${
              darkMode 
                ? "bg-slate-900/60 border-indigo-500/25 bg-gradient-to-br from-slate-900 to-indigo-950/10" 
                : "bg-white border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/10 to-white"
            }`}
            id="next-best-action-footer-panel"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-start justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Highest-Impact Improvement Roadmap</span>
              </span>
              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                Next Action Needed
              </span>
            </div>

            {nextBestAction ? (
              <div className="mt-4 space-y-5">
                <div>
                  <h3 className="text-lg font-display font-black tracking-tight text-indigo-300">
                    {nextBestAction.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-[8px] font-mono uppercase bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded">
                      {nextBestAction.priority} Priority
                    </span>
                    <span className="text-[8px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">
                      {nextBestAction.category}
                    </span>
                    <span className="text-[8px] font-mono uppercase bg-slate-500/10 text-slate-400 px-1.5 py-0.5 rounded">
                      Est Effort: {nextBestAction.estimatedEffort}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Reason:</span>
                    <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {nextBestAction.whyItMatters} {nextBestAction.whyDoesAiCare}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Expected Benefit:</span>
                    <p className="text-xs font-semibold text-indigo-400 leading-relaxed">
                      {nextBestAction.expectedAIBenefit}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Priority Justification:</span>
                  <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {nextBestAction.priority === "High" 
                      ? "This issue holds back critical brand validations. Crawl engines require absolute verifiability here before granting high recommendation scores."
                      : "This improvement resolves secondary contextual gaps. Resolving it establishes robust secondary reference chains across general LLM synthesizers."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-500/5 text-[10px] font-mono text-slate-500 uppercase">
                  <div className="flex items-center space-x-4">
                    <span>Engine: <strong className="text-indigo-400">{nextBestAction.relatedEngine}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1 text-indigo-400 font-bold">
                    <span>Navigate to Improvement Center tab to execute this guide</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 py-6 text-center">
                <p className="text-sm font-semibold text-emerald-500">
                  ✓ Outstanding! All current recommended actions have been completed successfully. Your brand is perfectly aligned.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
