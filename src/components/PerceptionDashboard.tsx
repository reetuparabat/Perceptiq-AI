/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  HeartHandshake, 
  MapPin, 
  Layers, 
  FileText, 
  CheckSquare, 
  Info, 
  XCircle,
  HelpCircle as QuestionIcon,
  Phone,
  Mail,
  Building,
  DollarSign,
  TrendingUp,
  Activity,
  ThumbsUp,
  ThumbsDown,
  ChevronDown
} from "lucide-react";
import { AIReadinessReport } from "../types";
import { calculatePerception } from "../perception/engine";
import { IdentityCompletenessStatus, RecommendationReadinessRating, AmbiguityLevel } from "../perception/types";

interface PerceptionDashboardProps {
  report: AIReadinessReport;
  darkMode: boolean;
}

export default function PerceptionDashboard({ report, darkMode }: PerceptionDashboardProps) {
  // Run the AI Perception Engine to compute results
  const data = React.useMemo(() => calculatePerception(report), [report]);
  const [activeStoryTab, setActiveStoryTab] = React.useState<"who" | "what" | "whom" | "how" | "why">("who");

  // Style helpers for completeness status chips
  const getStatusChipStyles = (status: IdentityCompletenessStatus) => {
    switch (status) {
      case "Complete":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Mostly Complete":
        return "text-sky-400 bg-sky-500/10 border-sky-500/20";
      case "Partially Understood":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Needs More Information":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "Missing":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  // Style helpers for recommendation readiness
  const getReadinessStyles = (rating: RecommendationReadinessRating) => {
    switch (rating) {
      case "Excellent":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/25",
          badge: "bg-emerald-500 text-white"
        };
      case "Good":
        return {
          color: "text-sky-400",
          bg: "bg-sky-500/10 border-sky-500/25",
          badge: "bg-sky-500 text-white"
        };
      case "Average":
        return {
          color: "text-amber-400",
          bg: "bg-amber-500/10 border-amber-500/25",
          badge: "bg-amber-500 text-white"
        };
      case "Needs Improvement":
        return {
          color: "text-rose-400",
          bg: "bg-rose-500/10 border-rose-500/25",
          badge: "bg-rose-500 text-white"
        };
    }
  };

  const readinessStyle = getReadinessStyles(data.recommendationReadiness.rating);

  // Ambiguity level styles
  const getAmbiguityStyles = (level: AmbiguityLevel) => {
    switch (level) {
      case "No Ambiguity":
        return {
          color: "text-emerald-400",
          badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          icon: CheckCircle2
        };
      case "Low Ambiguity":
        return {
          color: "text-sky-400",
          badge: "bg-sky-500/10 border-sky-500/20 text-sky-400",
          icon: Info
        };
      case "Medium Ambiguity":
        return {
          color: "text-amber-400",
          badge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
          icon: AlertTriangle
        };
      case "High Ambiguity":
        return {
          color: "text-rose-400",
          badge: "bg-rose-500/10 border-rose-500/20 text-rose-400",
          icon: XCircle
        };
    }
  };

  const ambiguityStyle = getAmbiguityStyles(data.ambiguityDetection.level);
  const AmbiguityIcon = ambiguityStyle.icon;

  // Render Category Icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Business Name": return Building;
      case "Industry": return Layers;
      case "Business Type": return Activity;
      case "Products": return FileText;
      case "Services": return HeartHandshake;
      case "Target Customers": return BookOpen;
      case "Locations": return MapPin;
      case "Support": return HelpCircle;
      case "Contact Information": return Phone;
      default: return Info;
    }
  };

  return (
    <div className="space-y-8" id="perception-dashboard">
      
      {/* Title & Introductory Section */}
      <div>
        <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-500 font-bold">
          AI Brand Perception
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Step inside the mind of search engines to understand what conversational models actually interpret from your website.
        </p>
      </div>

      {/* Feature 1 & Feature 10: Top Summary & Recommendation Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Feature 1: AI Business Understanding Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
          id="ai-understanding-hero"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <h3 className="font-display font-extrabold text-lg tracking-tight text-indigo-400">
                How AI Understands Your Business
              </h3>
            </div>
            
            <p className={`text-sm md:text-base leading-relaxed font-serif italic ${
              darkMode ? "text-slate-200" : "text-slate-800 font-medium"
            }`}>
              "{data.aiSummary}"
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-500/15 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center space-x-1.5">
              <Info className="h-4 w-4 text-slate-400" />
              <span>Synthesized directly from active website evidence.</span>
            </div>
            <span>Factual & Verifiable Only</span>
          </div>
        </motion.div>

        {/* Feature 10: AI Recommendation Readiness Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`p-6 rounded-2xl border flex flex-col justify-between ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
          id="recommendation-readiness-card"
        >
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Recommendation Readiness
            </h4>
            
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-display font-black tracking-tight ${readinessStyle.color}`}>
                {data.recommendationReadiness.rating}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Score: <strong className={`font-bold ${readinessStyle.color}`}>{data.recommendationReadiness.score}</strong>/100
              </span>
            </div>

            {/* Custom visual score meter */}
            <div className="h-2 w-full bg-slate-800/85 rounded-full overflow-hidden border border-slate-700/20">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  data.recommendationReadiness.rating === "Excellent" ? "bg-emerald-500" :
                  data.recommendationReadiness.rating === "Good" ? "bg-sky-500" :
                  data.recommendationReadiness.rating === "Average" ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${data.recommendationReadiness.score}%` }}
              ></div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              {data.recommendationReadiness.explanation}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-500/15 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Query Likelihood</span>
            <span className="font-bold text-indigo-400">
              {data.recommendationReadiness.rating === "Excellent" ? "High Impact" : "Moderated"}
            </span>
          </div>
        </motion.div>

      </div>

      {/* Feature 9: Perception Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className={`p-6 rounded-2xl border ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
        id="perception-timeline"
      >
        <div className="mb-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
            Perception Journey
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Step-by-step pathway showing how an AI agent incrementally builds cognitive understanding of your organization.
          </p>
        </div>

        {/* Timeline Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-2 relative mt-4">
          {data.timeline.map((step, idx) => {
            const isCompleted = step.status === "Understood";
            const isPartial = step.status === "Partial";
            
            return (
              <div key={idx} className="flex flex-col space-y-2 relative">
                {/* Horizontal progress guide line (desktop only) */}
                {idx < 6 && (
                  <div className="hidden md:block absolute top-4 left-1/2 right-[-50%] h-[2px] bg-slate-800 z-0">
                    <div className={`h-full ${isCompleted ? "bg-indigo-500" : isPartial ? "bg-amber-500" : "bg-slate-800"}`} style={{ width: isCompleted ? "100%" : isPartial ? "50%" : "0%" }}></div>
                  </div>
                )}
                
                {/* Step badge */}
                <div className="flex items-center space-x-2 md:space-x-0 md:flex-col md:items-center text-center z-10">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-black border shrink-0 transition-all ${
                    isCompleted 
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.25)]" 
                      : isPartial
                      ? "bg-amber-500/10 border-amber-500 text-amber-400"
                      : "bg-slate-950/60 border-slate-800 text-slate-600"
                  }`}>
                    {idx + 1}
                  </div>
                  
                  <div className="mt-0 md:mt-2 text-left md:text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                      {step.step}
                    </span>
                    <span className="text-xs font-bold leading-tight block truncate max-w-[120px]">
                      {step.label}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] leading-snug text-slate-500 text-left md:text-center px-1">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Grid: Feature 2 & Feature 3 (Identity Completeness & Confidence) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Feature 2: Business Identity Completeness */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`p-6 rounded-2xl border flex flex-col justify-between ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
          id="identity-completeness-card"
        >
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-4">
              <Layers className="h-5 w-5 text-indigo-400" />
              <h3 className="font-display font-bold text-sm tracking-tight text-slate-200 dark:text-slate-100 uppercase">
                Business Identity Completeness
              </h3>
            </div>

            <div className="divide-y divide-slate-500/10 space-y-3.5">
              {data.identityCompleteness.map((item, idx) => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <div key={idx} className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <div className="flex items-start space-x-2.5">
                      <div className="h-7 w-7 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold font-display tracking-tight leading-tight block">
                          {item.category}
                        </span>
                        <p className="text-[10.5px] leading-relaxed text-slate-500 font-medium mt-0.5 max-w-sm">
                          {item.explanation}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 text-center sm:self-start ${getStatusChipStyles(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Feature 3 & Feature 4: Confidence & Consulting Story */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* Feature 3: AI Understanding Confidence */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className={`p-6 rounded-2xl border ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
            id="understanding-confidence"
          >
            <div className="flex items-center space-x-2 text-indigo-400 mb-4">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <h3 className="font-display font-bold text-sm tracking-tight text-slate-200 dark:text-slate-100 uppercase">
                AI Understanding Confidence
              </h3>
            </div>

            <div className="space-y-4">
              {data.understandingConfidence.map((item, idx) => {
                const isHigh = item.confidence >= 80;
                const isMedium = item.confidence >= 50 && item.confidence < 80;
                
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold font-display">{item.area}</span>
                      <span className={`font-mono font-bold ${isHigh ? "text-emerald-400" : isMedium ? "text-amber-400" : "text-rose-400"}`}>
                        {item.confidence}%
                      </span>
                    </div>
                    
                    {/* Compact custom progress bar */}
                    <div className="h-1.5 w-full bg-slate-950/60 rounded-full overflow-hidden border border-slate-800/10">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isHigh ? "bg-emerald-500" : isMedium ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${item.confidence}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-[10px] leading-relaxed text-slate-500 font-medium pl-0.5">
                      {item.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Feature 4: Business Story (Speaking like a consultant) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between h-[310px] ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
            id="business-story-card"
          >
            <div>
              <div className="flex items-center justify-between mb-3 border-b pb-3 border-slate-500/10">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  <h3 className="font-display font-bold text-sm tracking-tight text-slate-200 dark:text-slate-100 uppercase">
                    Your Business Story
                  </h3>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Consulting Narrative</span>
              </div>

              {/* Minimalist pill buttons to toggle story aspects */}
              <div className="flex flex-wrap gap-1 mb-4">
                {[
                  { id: "who" as const, label: "Who We Are" },
                  { id: "what" as const, label: "What We Offer" },
                  { id: "whom" as const, label: "Who We Help" },
                  { id: "how" as const, label: "How It Works" },
                  { id: "why" as const, label: "Why Choose Us" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStoryTab(tab.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                      activeStoryTab === tab.id
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Story Content Area */}
              <div className="min-h-[120px] max-h-[140px] overflow-y-auto pr-1">
                <p className={`text-xs md:text-sm leading-relaxed font-serif italic ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}>
                  {activeStoryTab === "who" && data.businessStory.whoIs}
                  {activeStoryTab === "what" && data.businessStory.whatOffers}
                  {activeStoryTab === "whom" && data.businessStory.whoHelps}
                  {activeStoryTab === "how" && data.businessStory.howWorks}
                  {activeStoryTab === "why" && data.businessStory.whyChooses}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-500/10 text-[10px] text-slate-500 flex items-center justify-between font-mono">
              <span>Audience Target Map</span>
              <span className="font-bold text-emerald-400">Verifiable Profile</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Grid: Feature 7 & Feature 8 (Strengths & Weaknesses) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Feature 7: What AI Understands Well (Strengths) */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className={`p-6 rounded-2xl border ${
            darkMode ? "bg-emerald-500/5 border-emerald-500/10" : "bg-emerald-50/40 border-emerald-100 shadow-sm"
          }`}
          id="perception-strengths"
        >
          <div className="flex items-center space-x-2 text-emerald-500 font-bold text-xs mb-4 uppercase tracking-wider">
            <ThumbsUp className="h-5 w-5 shrink-0" />
            <span>What AI Understands Well (Strengths)</span>
          </div>

          <div className="space-y-4">
            {data.strengths.map((str, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-xs font-bold leading-tight font-display">{str.area}</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed pl-3 text-slate-400 dark:text-slate-300">
                  {str.why}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature 8: What AI Finds Difficult (Weaknesses) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className={`p-6 rounded-2xl border ${
            darkMode ? "bg-rose-500/5 border-rose-500/10" : "bg-rose-50/40 border-rose-100 shadow-sm"
          }`}
          id="perception-weaknesses"
        >
          <div className="flex items-center space-x-2 text-rose-500 font-bold text-xs mb-4 uppercase tracking-wider">
            <ThumbsDown className="h-5 w-5 shrink-0" />
            <span>What AI Finds Difficult (Weaknesses)</span>
          </div>

          <div className="space-y-4">
            {data.weaknesses.map((weak, idx) => (
              <div key={idx} className="space-y-1 pb-3 last:pb-0 border-b last:border-0 border-rose-500/10">
                <div className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="text-xs font-bold leading-tight font-display">{weak.area}</span>
                </div>
                <p className="text-[11.5px] font-medium leading-relaxed pl-3 text-slate-400 dark:text-slate-300">
                  {weak.why}
                </p>
                <div className="mt-1.5 pl-3 flex items-start space-x-1 text-[10.5px] text-slate-500">
                  <span className="font-bold text-indigo-400 font-mono">Action:</span>
                  <span className="italic">{weak.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Grid: Feature 6: Ambiguity Detection & Feature 5: Understanding Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Feature 6: Ambiguity Detection Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`p-6 rounded-2xl border flex flex-col justify-between ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
          id="ambiguity-detection-card"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-500/10">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-indigo-400" />
                <h3 className="font-display font-bold text-sm tracking-tight text-slate-200 dark:text-slate-100 uppercase">
                  Ambiguity Detection
                </h3>
              </div>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase ${ambiguityStyle.badge}`}>
                {data.ambiguityDetection.level}
              </span>
            </div>

            {/* Custom Circular Gauge for Ambiguity Score */}
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <svg className="absolute h-full w-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={darkMode ? "#1e293b" : "#e2e8f0"}
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={
                      data.ambiguityDetection.level === "No Ambiguity" ? "#10b981" :
                      data.ambiguityDetection.level === "Low Ambiguity" ? "#0ea5e9" :
                      data.ambiguityDetection.level === "Medium Ambiguity" ? "#f59e0b" : "#ef4444"
                    }
                    strokeWidth="5"
                    strokeDasharray="213.63"
                    strokeDashoffset={213.63 - (213.63 * data.ambiguityDetection.score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="flex flex-col items-center justify-center font-mono">
                  <span className={`text-lg font-black ${ambiguityStyle.color}`}>
                    {data.ambiguityDetection.score}%
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-500">Inconsistency</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-1">
              {data.ambiguityDetection.explanations.map((exp, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[11px] leading-relaxed text-slate-400 font-medium">
                  <AmbiguityIcon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${ambiguityStyle.color}`} />
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-500/10 text-[9px] text-slate-500 flex items-center justify-between font-mono">
            <span>Detection Integrity</span>
            <span className="font-bold text-emerald-400">Verifiable Output</span>
          </div>
        </motion.div>

        {/* Feature 5: AI Understanding Gaps Table / Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
          id="understanding-gaps-card"
        >
          <div>
            <div className="flex items-center justify-between border-b pb-3 border-slate-500/10 mb-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-indigo-400" />
                <h3 className="font-display font-bold text-sm tracking-tight text-slate-200 dark:text-slate-100 uppercase">
                  AI Understanding Gaps
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Actionable Opportunities</span>
            </div>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {data.understandingGaps.map((gap, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-start md:justify-between gap-3.5 transition-all ${
                    gap.isMissing 
                      ? (darkMode ? "bg-rose-500/5 border-rose-500/10" : "bg-rose-50/20 border-rose-100") 
                      : (darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100")
                  }`}
                >
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center space-x-1.5">
                      <span className={`h-2 w-2 rounded-full ${gap.isMissing ? "bg-rose-500 animate-pulse" : "bg-slate-500"}`}></span>
                      <h4 className="text-xs font-bold leading-tight font-display">{gap.gap}</h4>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border leading-none ${
                        gap.isMissing ? "bg-rose-500/15 border-rose-500/20 text-rose-400" : "bg-slate-800/80 border-slate-700/50 text-slate-400"
                      }`}>
                        {gap.isMissing ? "Missing" : "Addressed"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-300 font-medium">
                      {gap.explanation}
                    </p>
                    <p className="text-[10.5px] leading-relaxed text-slate-500 font-medium italic">
                      <strong className="text-slate-400 not-italic">Risk:</strong> {gap.whyThisMatters}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-right md:max-w-xs md:self-stretch flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block leading-tight">
                        Suggested Resolution
                      </span>
                      <p className="text-[10.5px] text-slate-400 font-medium mt-0.5 leading-snug">
                        {gap.howToImprove}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 md:justify-end text-[10px] text-emerald-400 font-semibold font-mono mt-2 md:mt-0">
                      <span>Lift:</span>
                      <span>{gap.expectedImprovement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-500/10 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>Resolving gaps raises recommendation confidence.</span>
            <span className="text-indigo-400 font-bold">Priority Actions</span>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
