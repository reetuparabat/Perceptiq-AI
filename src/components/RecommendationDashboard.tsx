/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  ThumbsUp,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  Award,
  DollarSign,
  MapPin,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Users,
  Compass,
  ArrowDownRight,
  User,
  Activity,
  Layers,
  ChevronRight,
  Target
} from "lucide-react";
import { AIReadinessReport } from "../types";
import { calculateRecommendation } from "../recommendation/engine";
import { 
  RecommendationSignal, 
  MissingRecommendationSignal, 
  RecommendationJourneyStep, 
  RecommendationScenario, 
  PromptCategory, 
  CompetitiveFactor, 
  RecommendationOpportunity 
} from "../recommendation/types";

interface RecommendationDashboardProps {
  report: AIReadinessReport;
  darkMode: boolean;
}

export default function RecommendationDashboard({ report, darkMode }: RecommendationDashboardProps) {
  const recommendation = React.useMemo(() => calculateRecommendation(report), [report]);

  // Sub-tabs state
  const [activeSubTab, setActiveSubTab] = React.useState<"readiness" | "signals" | "scenarios" | "opportunities">("readiness");
  
  // Interactive Journey State
  const [selectedJourneyStep, setSelectedJourneyStep] = React.useState<number>(4); // Default to active step (Step 4: AI Evaluates Your Business)

  // Interactive Scenario State
  const [selectedScenarioIndex, setSelectedScenarioIndex] = React.useState<number>(0);

  // Interactive Prompt Category State
  const [selectedPromptCategoryIndex, setSelectedPromptCategoryIndex] = React.useState<number>(0);

  // Badges & Styles helper
  const getReadinessBadgeClass = (level: string) => {
    switch (level) {
      case "Excellent":
        return darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Strong":
        return darkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Good":
        return darkMode ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-sky-50 text-sky-700 border-sky-200";
      case "Average":
        return darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200";
      case "Needs Improvement":
        return darkMode ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-orange-50 text-orange-700 border-orange-200";
      case "Poor":
        return darkMode ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getSignalStatusClass = (status: "Met" | "Partial" | "Unmet") => {
    switch (status) {
      case "Met":
        return darkMode ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Partial":
        return darkMode ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-800 border-amber-200";
      case "Unmet":
        return darkMode ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : "bg-rose-50 text-rose-800 border-rose-200";
    }
  };

  const getImpactBadgeClass = (impact: "High" | "Medium" | "Low") => {
    switch (impact) {
      case "High":
        return darkMode ? "text-rose-400 bg-rose-500/10" : "text-rose-700 bg-rose-50";
      case "Medium":
        return darkMode ? "text-amber-400 bg-amber-500/10" : "text-amber-700 bg-amber-50";
      case "Low":
        return darkMode ? "text-slate-400 bg-slate-500/10" : "text-slate-700 bg-slate-50";
    }
  };

  const getPriorityStyle = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return darkMode ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-rose-700 bg-rose-50 border-rose-200";
      case "Medium":
        return darkMode ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-amber-700 bg-amber-50 border-amber-200";
      case "Low":
        return darkMode ? "text-slate-400 bg-slate-500/10 border-slate-500/20" : "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  const getLikelihoodStyle = (likelihood: "High" | "Medium" | "Low" | "Unlikely") => {
    switch (likelihood) {
      case "High":
        return darkMode ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-700 bg-emerald-50";
      case "Medium":
        return darkMode ? "text-indigo-400 bg-indigo-500/10" : "text-indigo-700 bg-indigo-50";
      case "Low":
        return darkMode ? "text-amber-400 bg-amber-500/10" : "text-amber-700 bg-amber-50";
      case "Unlikely":
        return darkMode ? "text-rose-400 bg-rose-500/10" : "text-rose-700 bg-rose-50";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="recommendation-intelligence-dashboard">
      
      {/* Consultant Note Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        darkMode 
          ? "bg-slate-900/40 border-indigo-500/20 text-slate-100" 
          : "bg-gradient-to-r from-indigo-50/50 to-sky-50/50 border-indigo-100 text-slate-800"
      }`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl shrink-0 ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
            <ThumbsUp className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-display font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5">
              <span>Recommendation Intelligence Engine</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider ${
                darkMode ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-800"
              }`}>Sprint 3</span>
            </h2>
            <p className="text-xs leading-relaxed opacity-90 max-w-4xl">
              "If someone asks an AI assistant about businesses like mine, how likely is AI to recommend my business?" 
              Rather than predicting chaotic live models, this engine provides a fully explainable, evidence-backed evaluation. 
              Every recommendation estimation traces directly back to verifiable credentials indexed from your website.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`flex border-b text-xs ${darkMode ? "border-slate-800" : "border-slate-200"}`} id="recommendation-tabs">
        <button
          onClick={() => setActiveSubTab("readiness")}
          className={`px-4 py-2 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "readiness"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Readiness & Journey</span>
        </button>
        <button
          onClick={() => setActiveSubTab("signals")}
          className={`px-4 py-2 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "signals"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>Recommendation Signals</span>
        </button>
        <button
          onClick={() => setActiveSubTab("scenarios")}
          className={`px-4 py-2 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "scenarios"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Scenarios & Prompts</span>
        </button>
        <button
          onClick={() => setActiveSubTab("opportunities")}
          className={`px-4 py-2 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "opportunities"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          <span>Opportunities & Gaps</span>
        </button>
      </div>

      {/* Tab Content 1: Readiness & Journey */}
      {activeSubTab === "readiness" && (
        <div className="space-y-6">
          
          {/* Executive Consultant Summary & Score row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recommendation Readiness Level Card */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 1: Recommendation Readiness
                </span>
                
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2.5 text-lg font-display font-black rounded-xl border ${getReadinessBadgeClass(recommendation.readinessLevel)}`}>
                    {recommendation.readinessLevel}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-500">
                  {recommendation.whyLikelyOrUnlikely}
                </p>
              </div>

              {/* Progress visual */}
              <div className="mt-6 pt-4 border-t border-slate-500/10 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Recommendation Index</span>
                  <span>{report.overallScore || "80"}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-500/10 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${report.overallScore || 80}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recommendation Confidence Card */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                    Feature 9: Recommendation Confidence
                  </span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                    recommendation.confidence.confidenceLevel === "High" 
                      ? "text-emerald-500 bg-emerald-500/10" 
                      : recommendation.confidence.confidenceLevel === "Medium" 
                      ? "text-amber-500 bg-amber-500/10" 
                      : "text-rose-500 bg-rose-500/10"
                  }`}>
                    {recommendation.confidence.confidenceLevel} Confidence
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    {recommendation.confidence.reason}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong className="text-indigo-400">Core Evidence:</strong> {recommendation.confidence.evidence}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-500/10 text-xs">
                <span className="text-[10px] font-mono text-slate-500 block uppercase mb-1">Index Consistency Risk</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {recommendation.confidence.possibleUncertainty}
                </p>
              </div>
            </div>

            {/* Consultant Style Summary Text */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between bg-gradient-to-br ${
              darkMode 
                ? "from-indigo-950/20 via-slate-900/30 to-slate-900/40 border-indigo-500/10 text-slate-100" 
                : "from-indigo-50/20 via-sky-50/20 to-white border-indigo-100 text-slate-800"
            }`}>
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 10: Advisory Executive Summary
                </span>

                <p className="text-xs leading-relaxed font-serif italic text-slate-500">
                  "{recommendation.summary.consultantOverview}"
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-500/10 space-y-2 text-xs">
                <strong className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Strongest recommendation vectors:</strong>
                <ul className="space-y-1">
                  {recommendation.summary.strongestSignals.slice(0, 2).map((sig, i) => (
                    <li key={i} className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                      <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Feature 4: Recommendation Journey */}
          <div className={`p-6 rounded-2xl border ${
            darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
          }`}>
            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 4: Recommendation Journey (Reasoning Steps)
              </span>
              <h3 className="text-sm font-bold font-display">
                How AI Evaluates and Selects Your Business
              </h3>
              <p className="text-xs text-slate-500">
                AI doesn't instantly output names. It follows a multi-step cognitive journey. Click on any node below to inspect exactly what the search bot is executing.
              </p>
            </div>

            {/* Interactive Timeline Rail */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {recommendation.journeySteps.map((step) => {
                const isSelected = selectedJourneyStep === step.stepNumber;
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setSelectedJourneyStep(step.stepNumber)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between h-28 ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20"
                        : darkMode
                        ? "border-slate-800/80 bg-slate-900/10 hover:bg-slate-800/30 hover:border-slate-700"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        0{step.stepNumber}
                      </span>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        step.status === "completed"
                          ? "bg-emerald-500"
                          : step.status === "active"
                          ? "bg-indigo-500 animate-ping"
                          : "bg-slate-500/30"
                      }`} />
                    </div>

                    <div className="space-y-1">
                      <span className={`text-[10px] font-mono uppercase block ${
                        step.status === "completed" 
                          ? "text-emerald-400" 
                          : step.status === "active" 
                          ? "text-indigo-400 font-bold" 
                          : "text-slate-500"
                      }`}>
                        {step.status === "completed" ? "Completed" : step.status === "active" ? "Analyzing" : "Queued"}
                      </span>
                      <span className="text-xs font-bold font-display line-clamp-1 block">
                        {step.stepName}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Expanded step details panel */}
            <div className={`mt-6 p-5 rounded-xl border ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/50 border-slate-100"
            }`}>
              {(() => {
                const activeStep = recommendation.journeySteps.find(s => s.stepNumber === selectedJourneyStep);
                if (!activeStep) return null;
                return (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          activeStep.status === "completed" 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : activeStep.status === "active" 
                            ? "bg-indigo-500/10 text-indigo-400" 
                            : "bg-slate-500/10 text-slate-400"
                        }`}>
                          Step {activeStep.stepNumber} • {activeStep.status.toUpperCase()}
                        </span>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">WHAT IS AI DOING HERE?</h4>
                      </div>
                      <p className="text-xs font-display font-extrabold text-indigo-500 dark:text-indigo-400 text-sm">
                        {activeStep.stepName}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-500 max-w-4xl">
                        {activeStep.whatIsAIDoing}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 uppercase block font-mono">Process Method</span>
                        <span className="text-xs font-bold font-mono">Deterministic Index Match</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      )}

      {/* Tab Content 2: Recommendation Signals */}
      {activeSubTab === "signals" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
              Feature 2: Recommendation Signals
            </span>
            <h3 className="text-sm font-bold font-display">
              AI Crawl Diagnostics & Data Sufficiency
            </h3>
            <p className="text-xs text-slate-500">
              Below is a full breakdown of the signals that AI search crawlers audit to determine if they can safely recommend a business. 
              Each status represents real evidence found on your pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendation.signals.map((sig, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode ? "bg-slate-900/30 border-slate-800 hover:border-slate-700" : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${getImpactBadgeClass(sig.impact)}`}>
                      {sig.impact} Impact
                    </span>
                    <h4 className="text-xs font-bold font-display mt-1">
                      {sig.name}
                    </h4>
                  </div>
                  
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getSignalStatusClass(sig.status)}`}>
                    {sig.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <strong className="text-[10px] uppercase font-mono block text-slate-500 mb-0.5">Why it matters to AI:</strong>
                    {sig.whyItMatters}
                  </div>
                  
                  <div className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                    darkMode ? "bg-slate-900/50 border border-slate-800/50" : "bg-slate-50/50 border border-slate-100"
                  }`}>
                    <ShieldCheck className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                      sig.status === "Met" ? "text-emerald-500" : sig.status === "Partial" ? "text-amber-500" : "text-rose-500"
                    }`} />
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Crawl Evidence:</span>
                      <p className="text-slate-500 leading-relaxed text-[11px]">{sig.supportingEvidence}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Scenarios & Prompts */}
      {activeSubTab === "scenarios" && (
        <div className="space-y-8">
          
          {/* Feature 5: Recommendation Scenarios */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 5: Recommendation Scenarios
              </span>
              <h3 className="text-sm font-bold font-display">
                How Your Business is Referred for Different Customer Intents
              </h3>
              <p className="text-xs text-slate-500">
                AI recommends different solutions depending on customer context. Review your likelihood rating across core customer segments.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Scenario selector sidebar */}
              <div className="lg:col-span-4 space-y-2">
                {recommendation.scenarios.map((scen, idx) => {
                  const isSelected = selectedScenarioIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedScenarioIndex(idx)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/5 text-indigo-400 font-bold"
                          : darkMode
                          ? "border-slate-800 bg-slate-900/10 hover:bg-slate-800/30 hover:border-slate-700"
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 shadow-sm"
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs block font-display">{scen.scenarioName}</span>
                      </div>
                      
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getLikelihoodStyle(scen.likelihood)}`}>
                        {scen.likelihood}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Scenario detail display */}
              <div className="lg:col-span-8">
                {(() => {
                  const scen = recommendation.scenarios[selectedScenarioIndex];
                  if (!scen) return null;
                  return (
                    <div className={`p-6 rounded-2xl border space-y-6 ${
                      darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                    }`}>
                      <div className="flex justify-between items-start border-b border-slate-500/10 pb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Active Scenario Profile</span>
                          <h4 className="text-sm font-bold font-display">{scen.scenarioName}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 uppercase font-mono block">Likelihood Rate</span>
                          <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded ${getLikelihoodStyle(scen.likelihood)}`}>
                            {scen.likelihood}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1 text-xs">
                          <strong className="text-[10px] uppercase font-mono block text-slate-500">Why AI behaves this way:</strong>
                          <p className="text-slate-500 leading-relaxed">{scen.reason}</p>
                        </div>

                        <div className="space-y-1 text-xs">
                          <strong className="text-[10px] uppercase font-mono block text-slate-500">Scanned evidence context:</strong>
                          <p className="text-slate-500 leading-relaxed">{scen.supportingEvidence}</p>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4 ${
                        darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/50 border-slate-100"
                      }`}>
                        <div className="space-y-1 text-xs">
                          <strong className="text-[10px] uppercase font-mono text-rose-500 block flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            <span>Risk / Weakness Factor</span>
                          </strong>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{scen.weaknesses}</p>
                        </div>

                        <div className="space-y-1 text-xs">
                          <strong className="text-[10px] uppercase font-mono text-indigo-400 block flex items-center gap-1">
                            <Lightbulb className="h-3 w-3 shrink-0" />
                            <span>Recommended Improvement</span>
                          </strong>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{scen.suggestedImprovements}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>

          <hr className={darkMode ? "border-slate-800/80" : "border-slate-200"} />

          {/* Feature 6: Prompt Categories */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 6: Prompt Categories
              </span>
              <h3 className="text-sm font-bold font-display">
                Commercial Intent Grouping (How Prepared is Your Business?)
              </h3>
              <p className="text-xs text-slate-500">
                Customer prompts generally fall into distinct categories. Review how prepared Perceptiq calculates your website index to satisfy these categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {recommendation.promptCategories.map((cat, idx) => {
                const isSelected = selectedPromptCategoryIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedPromptCategoryIndex(idx)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer h-32 flex flex-col justify-between ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/5 text-indigo-400 font-bold"
                        : darkMode
                        ? "border-slate-800 bg-slate-900/10 hover:bg-slate-800/30 hover:border-slate-700"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className={`text-[10px] font-mono uppercase block ${
                        cat.preparedness === "Fully Prepared"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}>
                        {cat.preparedness}
                      </span>
                      <h4 className="text-xs font-bold font-display line-clamp-1">
                        {cat.categoryName}
                      </h4>
                    </div>

                    <div className="flex items-center text-[10px] font-mono text-slate-500 hover:text-indigo-400 gap-1 mt-2">
                      <span>View details</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={`p-5 rounded-xl border ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-slate-50/50 border-slate-100"
            }`}>
              {(() => {
                const cat = recommendation.promptCategories[selectedPromptCategoryIndex];
                if (!cat) return null;
                return (
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-500/10 pb-2">
                      <h4 className="font-bold text-sm font-display text-indigo-400">{cat.categoryName}</h4>
                      <span className="text-[10px] font-mono text-slate-500">Preparedness: <strong className="text-emerald-500 font-bold">{cat.preparedness}</strong></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase block text-slate-500">What AI already knows:</span>
                        <p className="text-slate-500 leading-relaxed text-[11px]">{cat.whatAIKnows}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase block text-slate-500">What AI still needs from your site:</span>
                        <p className="text-slate-500 leading-relaxed text-[11px]">{cat.whatAINeeds}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      )}

      {/* Tab Content 4: Opportunities & Gaps */}
      {activeSubTab === "opportunities" && (
        <div className="space-y-8">
          
          {/* Feature 8: Recommendation Opportunities */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 8: Prioritized Recommendation Opportunities
              </span>
              <h3 className="text-sm font-bold font-display">
                Prioritized Actions to Maximize AI Referrals
              </h3>
              <p className="text-xs text-slate-500">
                These are structured growth actions, ranked by priority. Addressing these issues directly raises your index readiness.
              </p>
            </div>

            <div className="space-y-4">
              {recommendation.opportunities.map((opp, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                  }`}
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${getPriorityStyle(opp.priority)}`}>
                        {opp.priority} Priority
                      </span>
                      <h4 className="text-xs font-bold font-display text-sm">
                        {opp.opportunityName}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {opp.why}
                    </p>
                    
                    <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span><strong className="font-bold text-indigo-400">Business Impact:</strong> {opp.businessImpact}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-slate-500/10 pt-4 md:pt-0 md:pl-6 text-xs text-slate-500 font-mono">
                    <div className="text-left">
                      <span className="text-[9px] uppercase block tracking-wider">Difficulty</span>
                      <strong className={`text-xs font-bold ${
                        opp.difficulty === "Easy" ? "text-emerald-500" : "text-amber-500"
                      }`}>{opp.difficulty}</strong>
                    </div>

                    <div className="text-left">
                      <span className="text-[9px] uppercase block tracking-wider">Est. Boost</span>
                      <strong className="text-xs font-bold text-indigo-400">{opp.estimatedImprovement}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className={darkMode ? "border-slate-800/80" : "border-slate-200"} />

          {/* Feature 3: Missing Recommendation Signals */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 3: Missing Recommendation Signals (Obstacles)
              </span>
              <h3 className="text-sm font-bold font-display">
                What Prevents Stronger AI Recommendations?
              </h3>
              <p className="text-xs text-slate-500">
                These are specific structural voids on your website that cause search crawlers to bypass your profile. Addressing them acts as an immediate growth opportunity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendation.missingSignals.map((gap, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-rose-500 font-bold text-xs font-display">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{gap.problem}</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-500">
                      <div>
                        <strong className="text-[9px] uppercase font-mono block text-slate-500">Why AI needs it:</strong>
                        <p className="text-slate-500 leading-relaxed text-[11px]">{gap.whyNeeded}</p>
                      </div>

                      <div>
                        <strong className="text-[9px] uppercase font-mono block text-slate-500">Business impact:</strong>
                        <p className="text-slate-500 leading-relaxed text-[11px]">{gap.businessImpact}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 p-3 rounded-xl border text-xs space-y-1 ${
                    darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/50 border-slate-100"
                  }`}>
                    <strong className="text-[10px] uppercase font-mono text-indigo-400 block flex items-center gap-1">
                      <Lightbulb className="h-3 w-3 shrink-0" />
                      <span>Recommended Improvement Action</span>
                    </strong>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{gap.recommendation}</p>
                    <div className="text-[10px] text-emerald-500 font-mono font-bold mt-1">
                      Expected outcome: +{gap.expectedImprovement}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className={darkMode ? "border-slate-800/80" : "border-slate-200"} />

          {/* Feature 7: Competitive Recommendation Factors */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 7: Competitive Recommendation Factors
              </span>
              <h3 className="text-sm font-bold font-display">
                Why Another Business Might Be Recommended First
              </h3>
              <p className="text-xs text-slate-500">
                To keep results completely deterministic and protect privacy, we benchmark your profile against "Typical businesses with stronger recommendation signals" rather than scraping direct local competitors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendation.competitiveFactors.map((factor, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold font-display flex items-center gap-2">
                      <Target className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>{factor.factorName}</span>
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {factor.comparisonDescription}
                    </p>

                    <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                      darkMode ? "bg-slate-900/50 border-slate-800/80" : "bg-slate-100/30 border-slate-100"
                    }`}>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Typical High-Signal Benchmark:</span>
                      <p className="text-slate-500 leading-relaxed text-[11px] italic">"{factor.typicalCompetitorSignal}"</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-500/10 text-xs flex justify-between items-center text-slate-500">
                    <span className="font-mono text-[10px]">Strategic Remedy:</span>
                    <strong className="text-indigo-400 font-bold">{factor.remedyAction}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
