/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { VisibilityMetrics, PlatformMetrics } from "../types";
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  CornerDownRight, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  ShieldAlert 
} from "lucide-react";

interface VisibilityCardProps {
  darkMode: boolean;
  visibility: VisibilityMetrics;
}

export default function VisibilityCard({ darkMode, visibility }: VisibilityCardProps) {
  const [selectedEngine, setSelectedEngine] = React.useState<"chatgpt" | "gemini" | "claude" | "perplexity">("chatgpt");

  // Determine Compatibility Status & Text based on deterministic metrics
  const getCompatibilityDetails = (id: string, likelihood: string) => {
    let status: "Compatible" | "Partially Compatible" | "Needs Attention" = "Compatible";
    let statusColor = "";
    let confidence = "High";
    let assessment = "";

    // Map status from likelihood
    if (likelihood === "High") {
      status = "Compatible";
      statusColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      confidence = "High";
    } else if (likelihood === "Medium") {
      status = "Partially Compatible";
      statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
      confidence = "Medium";
    } else {
      status = "Needs Attention";
      statusColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
      confidence = "Low";
    }

    // Set consistent, factual, evidence-backed assessment texts
    switch (id) {
      case "chatgpt":
        assessment = "Public website information is sufficiently structured to support AI understanding.";
        break;
      case "gemini":
        assessment = "Business information is accessible and consistently organized.";
        break;
      case "claude":
        assessment = "Business trust information is available for AI interpretation.";
        break;
      case "perplexity":
        assessment = "Public evidence supports factual understanding.";
        break;
      default:
        assessment = "Public evidence supports factual understanding.";
    }

    return { status, statusColor, confidence, assessment };
  };

  const engines = [
    {
      id: "chatgpt" as const,
      name: "ChatGPT (SearchGPT)",
      intent: "Comparative Shopping & Product Matches",
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20",
      bgDark: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30",
      textColor: "text-emerald-400",
      metric: visibility.chatgpt,
      desc: "Evaluates Product Information Structure, catalog consistency, and user review structures. Identifies direct consumer catalog matches.",
    },
    {
      id: "gemini" as const,
      name: "Google Gemini",
      intent: "Real-time Queries & Knowledge Directory Integration",
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20",
      bgDark: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30",
      textColor: "text-blue-400",
      metric: visibility.gemini,
      desc: "Integrates with local business listings, corporate directories, and interactive customer FAQs via conversational lookup caches.",
    },
    {
      id: "claude" as const,
      name: "Anthropic Claude",
      intent: "Enterprise Procurement & Specifications Auditing",
      color: "from-amber-600 to-orange-700",
      bgLight: "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20",
      bgDark: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30",
      textColor: "text-amber-400",
      metric: visibility.claude,
      desc: "Analyzes technical specifications sheets, attribute tables, and industry standard compliance credentials.",
    },
    {
      id: "perplexity" as const,
      name: "Perplexity AI",
      intent: "Direct Factual Verifications & Citations",
      color: "from-purple-500 to-fuchsia-600",
      bgLight: "bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/20",
      bgDark: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30",
      textColor: "text-purple-400",
      metric: visibility.perplexity,
      desc: "Synthesizes citation hierarchies, verified brand landing links, and public press release documentation records.",
    },
  ];

  const activeEngineData = engines.find((e) => e.id === selectedEngine)!;
  const activeComp = getCompatibilityDetails(activeEngineData.id, activeEngineData.metric.likelihood);

  return (
    <div className="space-y-6" id="compatibility-module">
      {/* Module Title */}
      <div>
        <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-500 font-bold">
          AI Brand Perception
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Compatibility and discoverability readiness matrix for major conversational platforms.
        </p>
      </div>

      {/* 4 Engine Grid Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {engines.map((eng) => {
          const isSelected = selectedEngine === eng.id;
          const { status, statusColor, confidence, assessment } = getCompatibilityDetails(eng.id, eng.metric.likelihood);
          
          return (
            <button
              key={eng.id}
              onClick={() => setSelectedEngine(eng.id)}
              id={`compatibility-btn-${eng.id}`}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-48 ${
                isSelected
                  ? `ring-2 ring-indigo-500 ${darkMode ? "bg-slate-900 border-indigo-500/50" : "bg-white border-indigo-500/50 shadow-sm"}`
                  : darkMode
                  ? `bg-slate-900/60 border-slate-800 hover:border-slate-700`
                  : `bg-white border-slate-200 hover:border-slate-300 shadow-sm`
              }`}
            >
              <div className="w-full flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs text-white font-black shrink-0 ${
                    eng.id === "chatgpt" ? "bg-emerald-500" :
                    eng.id === "claude" ? "bg-amber-600" :
                    eng.id === "gemini" ? "bg-blue-500" : "bg-purple-500"
                  }`}>
                    {eng.id === "chatgpt" ? "GPT" : eng.id === "claude" ? "CLD" : eng.id === "gemini" ? "GEM" : "PPL"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-display tracking-tight leading-tight">{eng.name}</h4>
                    <span className="text-[9px] opacity-60 block leading-tight mt-0.5">{eng.intent}</span>
                  </div>
                </div>
              </div>

              {/* Assessment Area - No percentages, high-trust indicators */}
              <div className="mt-3 w-full space-y-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">
                    Compatibility Assessment
                  </span>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${statusColor}`}>
                      {status}
                    </span>
                    <div className="text-[10px] text-slate-500 flex items-center space-x-1 font-mono">
                      <span>Conf:</span>
                      <span className={confidence === "High" ? "text-emerald-500 font-bold" : "text-amber-500"}>
                        {confidence}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[10.5px] leading-snug text-slate-400 dark:text-slate-300 font-medium">
                  {assessment}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Engine Deep Dive */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-5 gap-3 border-slate-500/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${activeEngineData.color}`}></span>
              <h3 className="font-display font-bold text-base tracking-tight">{activeEngineData.name} Compatibility Deep Dive</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">{activeEngineData.desc}</p>
          </div>
          <div className="flex items-center space-x-4 shrink-0 font-mono">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block tracking-wider">Evidence Confidence</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${
                activeComp.confidence === "High" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              }`}>
                {activeComp.confidence} Confidence
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block tracking-wider">Compatibility Status</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${activeComp.statusColor}`}>
                {activeComp.status}
              </span>
            </div>
          </div>
        </div>

        {/* Strengths & Vulnerabilities columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className={`p-4 rounded-xl border ${darkMode ? "bg-emerald-500/5 border-emerald-500/10" : "bg-emerald-50 border-emerald-100"}`}>
            <div className="flex items-center space-x-2 text-emerald-500 font-bold text-xs mb-3 uppercase tracking-wider">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
              <span>Commercial Strengths</span>
            </div>
            <ul className="space-y-2.5">
              {activeEngineData.metric.strengths.map((str, index) => (
                <li key={index} className="text-xs flex items-start space-x-2">
                  <CornerDownRight className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={darkMode ? "text-slate-300" : "text-slate-700 font-medium"}>
                    {str.replace(/\b(LLM|RAG|Schema|JSON-LD)\b/g, (match) => {
                      if (match === "LLM") return "AI search assistant";
                      if (match === "RAG") return "information lookup";
                      if (match === "Schema" || match === "JSON-LD") return "business metadata";
                      return match;
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className={`p-4 rounded-xl border ${darkMode ? "bg-rose-500/5 border-rose-500/10" : "bg-rose-50 border-rose-100"}`}>
            <div className="flex items-center space-x-2 text-rose-500 font-bold text-xs mb-3 uppercase tracking-wider">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
              <span>Target Conversion Vulnerabilities</span>
            </div>
            <ul className="space-y-2.5">
              {activeEngineData.metric.weaknesses.map((weak, index) => (
                <li key={index} className="text-xs flex items-start space-x-2">
                  <CornerDownRight className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span className={darkMode ? "text-slate-300" : "text-slate-700 font-medium"}>
                    {weak.replace(/\b(LLM|RAG|Schema|JSON-LD)\b/g, (match) => {
                      if (match === "LLM") return "AI search assistant";
                      if (match === "RAG") return "information lookup";
                      if (match === "Schema" || match === "JSON-LD") return "business metadata";
                      return match;
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Subtle Professional Information Panel / Disclosure */}
      <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
        darkMode ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
      }`}>
        <Info className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Compatibility Disclosure:</strong> Compatibility assessments are derived from deterministic analysis of publicly accessible website information. 
          Perceptiq AI Version 1.0 does not directly query, benchmark, or measure responses from individual AI assistants. Future versions may support direct cross-platform benchmarking.
        </p>
      </div>
    </div>
  );
}
