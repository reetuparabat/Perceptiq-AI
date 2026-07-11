/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  Brain,
  Lightbulb,
  HelpCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  Dna,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  Heart,
  ChevronDown,
  ChevronUp,
  Award,
  DollarSign,
  Briefcase,
  Users,
  MapPin,
  Lock,
  MessageSquare,
  Compass,
  Zap,
  Tag
} from "lucide-react";
import { AIReadinessReport } from "../types";
import { calculateReasoning } from "../reasoning/engine";
import {
  AIAssumptionItem,
  AIQuestionItem,
  AIMemoryItem,
  BIPersonalityTrait,
  AIMisunderstandingRisk,
  AIReasoningTimelineStep,
  AIReasoningAreaConfidence,
  AIBusinessAdviceCard
} from "../reasoning/types";

interface ReasoningDashboardProps {
  report: AIReadinessReport;
  darkMode: boolean;
}

export default function ReasoningDashboard({ report, darkMode }: ReasoningDashboardProps) {
  const reasoning = React.useMemo(() => calculateReasoning(report), [report]);

  // Component States
  const [selectedArea, setSelectedArea] = React.useState<string>("Business Identity");
  const [expandedTimelineStep, setExpandedTimelineStep] = React.useState<string | null>("step-1");
  const [questionPriorityFilter, setQuestionPriorityFilter] = React.useState<"All" | "High" | "Medium" | "Low">("All");
  const [activeSubTab, setActiveSubTab] = React.useState<"overview" | "timeline" | "personality" | "advice">("overview");

  // Filtered Questions
  const filteredQuestions = React.useMemo(() => {
    return reasoning.questions.filter(q => {
      if (questionPriorityFilter === "All") return true;
      return q.priority === questionPriorityFilter;
    });
  }, [reasoning.questions, questionPriorityFilter]);

  // Priority Chip Styles
  const getPriorityStyle = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return darkMode ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-rose-700 bg-rose-50 border-rose-200";
      case "Medium":
        return darkMode ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-amber-700 bg-amber-50 border-amber-200";
      case "Low":
        return darkMode ? "text-sky-400 bg-sky-500/10 border-sky-500/20" : "text-sky-700 bg-sky-50 border-sky-200";
    }
  };

  // Risk Level Styles
  const getRiskStyle = (level: "Low" | "Medium" | "High" | "Critical") => {
    switch (level) {
      case "Critical":
        return darkMode ? "text-rose-400 bg-rose-500/15 border-rose-500/30 font-extrabold" : "text-rose-800 bg-rose-50 border-rose-300 font-extrabold";
      case "High":
        return darkMode ? "text-orange-400 bg-orange-500/10 border-orange-500/20 font-bold" : "text-orange-800 bg-orange-50 border-orange-200 font-bold";
      case "Medium":
        return darkMode ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-amber-800 bg-amber-50 border-amber-200";
      case "Low":
        return darkMode ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-800 bg-emerald-50 border-emerald-200";
    }
  };

  // Confidence Level Styles
  const getConfidenceLevelStyle = (level: "High" | "Medium" | "Low") => {
    switch (level) {
      case "High":
        return "text-emerald-500";
      case "Medium":
        return "text-amber-500";
      case "Low":
        return "text-rose-500";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="reasoning-engine-dashboard">
      
      {/* Intro Consultant Note Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        darkMode 
          ? "bg-slate-900/40 border-indigo-500/20 text-slate-100" 
          : "bg-gradient-to-r from-indigo-50/50 to-sky-50/50 border-indigo-100 text-slate-800"
      }`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl shrink-0 ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
            <Brain className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-display font-bold text-indigo-500 dark:text-indigo-400">
              Inside the Mind of AI: Cognitive Reasoning Engine
            </h2>
            <p className="text-xs leading-relaxed opacity-90 max-w-4xl">
              Unlike static analytics, this system simulates how advanced neural models (ChatGPT, Claude, Gemini, Copilot) process website datasets. It exposes the logical leaps, cognitive assumptions, informational gaps, and risk weights that dictate why AI recommends or bypasses your business.
            </p>
          </div>
        </div>
      </div>

      {/* Internal Navigation Sub-tabs */}
      <div className={`flex border-b text-xs ${darkMode ? "border-slate-800" : "border-slate-200"}`} id="reasoning-inner-tabs">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-4 py-2 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "overview"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Brain className="h-3.5 w-3.5" />
          <span>Cognitive Profile & Gaps</span>
        </button>
        <button
          onClick={() => setActiveSubTab("timeline")}
          className={`px-4 py-2 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "timeline"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Reasoning Timeline</span>
        </button>
        <button
          onClick={() => setActiveSubTab("personality")}
          className={`px-4 py-2 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "personality"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Dna className="h-3.5 w-3.5" />
          <span>Brand Personality</span>
        </button>
        <button
          onClick={() => setActiveSubTab("advice")}
          className={`px-4 py-2 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "advice"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5" />
          <span>Advisory Consulting</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: FEATURE 7: Reasoning Confidence Map (8 area grid) */}
          <div className="lg:col-span-8 space-y-6">
            <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} id="feature-reasoning-confidence">
              <div className="flex items-center justify-between mb-4 border-b pb-3 dark:border-slate-800 border-slate-100">
                <div className="space-y-1">
                  <h3 className="text-sm font-display font-extrabold flex items-center space-x-1.5">
                    <Compass className="h-4 w-4 text-indigo-400" />
                    <span>Feature 7: Reasoning Confidence Profile</span>
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Measures AI confidence in its own logical inferences across 8 critical commercial areas.
                  </p>
                </div>
              </div>

              {/* 8 Areas Flex-grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {reasoning.areaConfidences.map((ac) => {
                  const isActive = selectedArea === ac.area;
                  return (
                    <button
                      key={ac.area}
                      onClick={() => setSelectedArea(ac.area)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                        isActive
                          ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                          : darkMode
                          ? "border-slate-800 bg-slate-950/60 hover:bg-slate-800/40"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[11px] font-bold block truncate opacity-90">{ac.area}</span>
                      <div className="space-y-0.5">
                        <span className={`text-xl font-display font-black block leading-none ${getConfidenceLevelStyle(ac.level)}`}>
                          {ac.confidence}%
                        </span>
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block">
                          {ac.level} Confidence
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detail view of active confidence selection */}
              {(() => {
                const ac = reasoning.areaConfidences.find(item => item.area === selectedArea);
                if (!ac) return null;
                return (
                  <motion.div
                    key={ac.area}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border leading-relaxed text-xs space-y-3 ${
                      darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/60 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-500 dark:text-indigo-400">{ac.area} Reasoning Context</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                        ac.level === "High" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                        ac.level === "Medium" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                        "text-rose-400 bg-rose-500/10 border-rose-500/20"
                      }`}>
                        {ac.level} Confidence Engine
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-bold">Why AI reasoning settled here:</span>
                        <p className="opacity-90">{ac.reason}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-bold">Supporting raw evidence:</span>
                        <p className="opacity-90">{ac.evidence}</p>
                      </div>
                    </div>

                    <div className="border-t pt-2 dark:border-slate-800 border-slate-200/60 flex items-start space-x-1.5 text-[11px] opacity-80">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      <div>
                        <strong className="font-semibold text-slate-400">Potential Uncertainty Point: </strong>
                        <span>{ac.uncertainty}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

            {/* FEATURE 5: AI Misunderstanding Risk */}
            <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} id="feature-misunderstanding-risks">
              <div className="flex items-center justify-between mb-4 border-b pb-3 dark:border-slate-800 border-slate-100">
                <div className="space-y-1">
                  <h3 className="text-sm font-display font-extrabold flex items-center space-x-1.5">
                    <ShieldAlert className="h-4 w-4 text-indigo-400 animate-bounce" />
                    <span>Feature 5: AI Misunderstanding Risks</span>
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Critical warning points where ambiguous data causes AI algorithms to misclassify your business model.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {reasoning.misunderstandingRisks.map((risk, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                      darkMode ? "bg-slate-950/40 border-slate-800 hover:border-slate-700" : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 dark:text-white text-sm block">
                        {risk.misunderstanding}
                      </span>
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${getRiskStyle(risk.riskLevel)}`}>
                        {risk.riskLevel} Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-slate-500">
                      <div className="space-y-1">
                        <strong className="block text-[10px] text-indigo-400 dark:text-indigo-400 font-bold uppercase tracking-wider">Root Cause</strong>
                        <p className="text-slate-300 dark:text-slate-300 text-xs">{risk.reason}</p>
                      </div>
                      <div className="space-y-1">
                        <strong className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Business Impact</strong>
                        <p className="text-slate-300 dark:text-slate-300 text-xs">{risk.businessImpact}</p>
                      </div>
                    </div>

                    <div className="border-t pt-2.5 dark:border-slate-800 border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <strong className="text-slate-400">Scan Evidence: </strong>
                        <span className="text-slate-500 italic font-mono">{risk.evidence}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Consultant Recommendation: </strong>
                        <span className="text-indigo-400 font-medium">{risk.recommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: FEATURE 3: AI Memory Snapshot (top 5 retained cards) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* FEATURE 3: AI Memory Snapshot */}
            <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} id="feature-memory-snapshot">
              <div className="mb-4 border-b pb-3 dark:border-slate-800 border-slate-100">
                <h3 className="text-sm font-display font-extrabold flex items-center space-x-1.5">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  <span>Feature 3: AI Memory Snapshot</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  The top 5 facts an AI assistant is highly likely to retain after scanning your pages.
                </p>
              </div>

              <div className="space-y-4">
                {reasoning.memorySnapshot.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border relative text-xs space-y-2 transition-all ${
                      darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/40 border-slate-200"
                    }`}
                  >
                    <div className="absolute top-2 right-2 flex items-center space-x-1 text-[9px] font-mono text-slate-500">
                      <span>Ref #{index + 1}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-indigo-500 dark:text-indigo-400 font-bold">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>{item.item}</span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-500">
                      <strong className="text-slate-400">Why it sticks: </strong>
                      {item.whyAIRemembersIt}
                    </p>

                    <div className="border-t pt-1.5 dark:border-slate-800/60 border-slate-200/60 flex justify-between items-center text-[10px] text-slate-500">
                      <span>Source: <strong className="font-mono">{item.evidenceSource}</strong></span>
                      <span className="font-semibold uppercase tracking-wider text-emerald-500">
                        {item.confidence} Confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURE 1: AI Assumptions */}
            <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} id="feature-assumptions">
              <div className="mb-4 border-b pb-3 dark:border-slate-800 border-slate-100">
                <h3 className="text-sm font-display font-extrabold flex items-center space-x-1.5">
                  <Zap className="h-4 w-4 text-indigo-400" />
                  <span>Feature 1: AI Assumptions</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  How AI algorithms fill in informational gaps using commercial heuristics.
                </p>
              </div>

              <div className="space-y-4">
                {reasoning.assumptions.map((asm, index) => (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                      darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/40 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                        asm.isStrong 
                          ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" 
                          : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      }`}>
                        {asm.isStrong ? "Strong Assumption" : "Secondary Assumption"}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {asm.confidence} Confidence
                      </span>
                    </div>

                    <p className="font-bold text-indigo-400 dark:text-indigo-400">{asm.assumption}</p>
                    <p className="text-[11px] leading-relaxed text-slate-500">{asm.whyAIThinksThis}</p>

                    <div className="border-t pt-1.5 dark:border-slate-800/60 border-slate-200/60 text-[10px] text-slate-500">
                      <strong className="text-slate-400 font-semibold">Inferred from: </strong>
                      <span>{asm.supportingEvidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* FEATURE 6: Reasoning Timeline */}
      {activeSubTab === "timeline" && (
        <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} id="feature-reasoning-timeline">
          <div className="mb-6 border-b pb-4 dark:border-slate-800 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-display font-extrabold flex items-center space-x-1.5">
                <Clock className="h-5 w-5 text-indigo-400" />
                <span>Feature 6: Step-by-Step Reasoning Pathway</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Visualizes the sequential timeline as our crawler passes telemetry to the entity extraction and cognitive profiling loops. Click on any step to inspect the logical operations.
              </p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full dark:bg-indigo-500/10 bg-indigo-50 dark:text-indigo-400 text-indigo-700 border dark:border-indigo-500/20 border-indigo-200 font-mono">
              Model: Cognitive Emulator v2.1
            </span>
          </div>

          <div className="relative pl-6 border-l border-indigo-500/20 space-y-6 max-w-4xl">
            {reasoning.timelineSteps.map((step, index) => {
              const isExpanded = expandedTimelineStep === step.stepId;
              return (
                <div key={step.stepId} className="relative">
                  {/* Indicator Dot */}
                  <button
                    onClick={() => setExpandedTimelineStep(isExpanded ? null : step.stepId)}
                    className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${
                      isExpanded
                        ? "bg-indigo-500 border-indigo-400 ring-4 ring-indigo-500/25 scale-110"
                        : darkMode
                        ? "bg-slate-900 border-slate-700 hover:border-slate-500"
                        : "bg-white border-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <span className={`h-1 w-1 rounded-full ${isExpanded ? "bg-white" : "bg-transparent"}`}></span>
                  </button>

                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => setExpandedTimelineStep(isExpanded ? null : step.stepId)}
                      className="text-left font-bold text-sm block cursor-pointer group flex items-center space-x-2"
                    >
                      <span className="text-slate-500 font-mono text-xs font-semibold mr-1">0{index + 1}.</span>
                      <span className="group-hover:text-indigo-400 transition-colors text-slate-800 dark:text-slate-100">{step.title}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`p-4 rounded-xl border mt-2 space-y-2 leading-relaxed ${
                          darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <strong className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold block">
                          What happens at this stage?
                        </strong>
                        <p className="opacity-90 text-xs text-slate-500">{step.explanation}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FEATURE 4: Business Personality */}
      {activeSubTab === "personality" && (
        <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} id="feature-business-personality">
          <div className="mb-6 border-b pb-4 dark:border-slate-800 border-slate-100">
            <h3 className="text-base font-display font-extrabold flex items-center space-x-1.5">
              <Dna className="h-5 w-5 text-indigo-400" />
              <span>Feature 4: AI-Perceived Business Personality</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Describes how the semantic tone, layout structure, and verbiage of your digital assets shape the general persona of your brand in modern consumer directories.
            </p>
          </div>

          {!reasoning.personalityStatus.hasEnoughInfo ? (
            <div className={`p-6 rounded-xl border text-center text-xs text-slate-500 space-y-2 ${
              darkMode ? "bg-slate-950/50 border-slate-800" : "bg-slate-100 border-slate-200"
            }`}>
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
              <strong className="block font-bold">Incomplete Personality Profile</strong>
              <p className="max-w-md mx-auto leading-relaxed">{reasoning.personalityStatus.explanation}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reasoning.personalityTraits.map((trait, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl border text-xs space-y-3 transition-all ${
                    darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/40 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800/60 border-slate-200/60">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <strong className="text-sm font-bold text-indigo-400">{trait.trait}</strong>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full dark:bg-emerald-500/10 bg-emerald-50 text-emerald-400 border dark:border-emerald-500/20 border-emerald-200 font-semibold">
                      {trait.confidence} Confidence
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-500">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Perception Basis</span>
                    <p className="text-xs">{trait.reason}</p>
                  </div>

                  <div className="pt-2 border-t dark:border-slate-800/60 border-slate-200/60 flex items-center space-x-1.5 text-[11px] text-slate-500">
                    <strong className="text-slate-400">Verbal Evidence: </strong>
                    <span className="font-mono italic">"{trait.evidence}"</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Conversational Questions Box (FEATURE 2) - Nested neatly here as a logical followup to personality or missing details */}
          <div className="mt-8 border-t dark:border-slate-800 border-slate-200/60 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-display font-extrabold flex items-center space-x-1.5">
                  <HelpCircle className="h-4 w-4 text-indigo-400" />
                  <span>Feature 2: Conversational Questions AI is Asking</span>
                </h4>
                <p className="text-[10px] text-slate-500">
                  Instead of diagnostic checks, AI asks direct clarifying questions to fix its model uncertainties.
                </p>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center space-x-1 border dark:border-slate-800 border-slate-200 p-0.5 rounded-lg text-[10px] font-bold">
                {["All", "High", "Medium", "Low"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setQuestionPriorityFilter(p as any)}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      questionPriorityFilter === p
                        ? "bg-indigo-500 text-white"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map((q, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                    darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/40 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-extrabold text-xs block max-w-[80%] leading-relaxed">
                      "{q.question}"
                    </span>
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${getPriorityStyle(q.priority)}`}>
                      {q.priority} Priority
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1.5 border-t dark:border-slate-800/80 border-slate-200/80 text-slate-500">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Why AI is asking: </strong>
                      {q.whyAsking}
                    </p>
                    <p className="text-xs text-indigo-400">
                      <strong className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Answering improves: </strong>
                      {q.improvementOutcome}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 8: Business Advice From AI */}
      {activeSubTab === "advice" && (
        <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`} id="feature-advice">
          <div className="mb-6 border-b pb-4 dark:border-slate-800 border-slate-100">
            <h3 className="text-base font-display font-extrabold flex items-center space-x-1.5">
              <Lightbulb className="h-5 w-5 text-indigo-400" />
              <span>Feature 8: AI-Powered Advisory Insights</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Short, high-value consulting advice from AI based on semantic analysis. Formulated in business-oriented language for actionable improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasoning.adviceCards.map((card, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border text-xs space-y-4 transition-all relative overflow-hidden ${
                  darkMode 
                    ? "bg-slate-950/40 border-slate-800 hover:border-slate-700" 
                    : "bg-slate-50/40 border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-sky-400"></div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Observation Point</span>
                  <strong className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{card.observation}</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 leading-relaxed">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Reasoning</span>
                    <p className="text-slate-500 dark:text-slate-400">{card.reason}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Business Impact</span>
                    <p className="text-slate-500 dark:text-slate-400">{card.businessImpact}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                  darkMode ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-300" : "bg-indigo-50/50 border-indigo-100 text-indigo-950"
                }`}>
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span>Recommended Action</span>
                  </div>
                  <p>{card.suggestedImprovement}</p>
                  <div className="border-t pt-2 mt-2 dark:border-indigo-500/15 border-indigo-100 text-[11px] text-slate-400 flex items-center space-x-1">
                    <strong>Expected Benefit: </strong>
                    <span>{card.expectedBenefit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
