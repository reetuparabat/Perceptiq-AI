/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Info,
  Award,
  FileText,
  Sliders,
  CheckSquare,
  RefreshCw,
  Clock,
  Compass
} from "lucide-react";
import { AIReadinessReport } from "../types";
import { calculateDecisionIntelligence, simulateImprovements } from "../decision/engine";
import {
  DecisionStoryNode,
  RootCauseNode,
  ImpactChainModel,
  PriorityActionItem,
  DecisionTraceNode,
  CrossModuleInsight,
  ModuleHealth
} from "../decision/types";

interface DecisionDashboardProps {
  report: AIReadinessReport;
  darkMode: boolean;
}

export const DecisionDashboard: React.FC<DecisionDashboardProps> = ({ report, darkMode }) => {
  // Compute decision data once based on the active report
  const decisionData = useMemo(() => calculateDecisionIntelligence(report), [report]);

  // UI state managers
  const [activeSubSection, setActiveSubSection] = useState<"orchestrator" | "actions" | "simulation" | "trace" | "report">("orchestrator");
  
  // Interactive Simulation State
  const [simulatedFaq, setSimulatedFaq] = useState(false);
  const [simulatedPricing, setSimulatedPricing] = useState(false);
  const [simulatedReturns, setSimulatedReturns] = useState(false);
  const [simulatedAddress, setSimulatedAddress] = useState(false);

  // Compute live simulated lifts
  const simulation = useMemo(() => {
    return simulateImprovements(report, {
      faq: simulatedFaq,
      pricing: simulatedPricing,
      returns: simulatedReturns,
      address: simulatedAddress
    });
  }, [report, simulatedFaq, simulatedPricing, simulatedReturns, simulatedAddress]);

  // Reset Simulation
  const handleResetSimulation = () => {
    setSimulatedFaq(false);
    setSimulatedPricing(false);
    setSimulatedReturns(false);
    setSimulatedAddress(false);
  };

  // Expandable trace nodes manager (keys are node IDs)
  const [expandedTraceNodes, setExpandedTraceNodes] = useState<Record<string, boolean>>({
    "root-trace": true,
    "cognitive-trace": true,
    "trust-trace": true
  });

  const toggleTraceNode = (nodeId: string) => {
    setExpandedTraceNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Active action category filter
  const [actionCategory, setActionCategory] = useState<"All" | "Do Immediately" | "Do This Month" | "Long-Term Improvements">("All");

  const filteredActions = useMemo(() => {
    if (actionCategory === "All") return decisionData.priorityActions;
    return decisionData.priorityActions.filter(a => a.group === actionCategory);
  }, [decisionData.priorityActions, actionCategory]);

  // Helper styles for badges & status markers
  const getStatusIcon = (status: "success" | "warning" | "error" | "neutral") => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
      case "error": return <XCircle className="h-5 w-5 text-rose-500 shrink-0" />;
      default: return <Info className="h-5 w-5 text-slate-400 shrink-0" />;
    }
  };

  const getStatusColor = (status: "success" | "warning" | "error" | "neutral") => {
    switch (status) {
      case "success": return "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
      case "warning": return "border-amber-500/20 bg-amber-500/5 text-amber-400";
      case "error": return "border-rose-500/20 bg-rose-500/5 text-rose-400";
      default: return "border-slate-500/10 bg-slate-500/5 text-slate-400";
    }
  };

  const getHealthStatusColor = (status: "Optimal" | "Warning" | "Critical") => {
    switch (status) {
      case "Optimal": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Warning": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Critical": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    }
  };

  const getConfidenceBadgeColor = (conf: string) => {
    switch (conf) {
      case "Very High": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "High": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Moderate": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  // Trace Rendering Component Tree
  const renderTraceNode = (node: DecisionTraceNode, level = 0) => {
    const isExpanded = !!expandedTraceNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="ml-2 pl-2 border-l border-slate-500/10" id={`trace-node-${node.id}`}>
        <div 
          onClick={() => hasChildren && toggleTraceNode(node.id)}
          className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
            hasChildren ? "cursor-pointer hover:bg-slate-500/5" : ""
          }`}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-4 w-4 text-indigo-400 mt-1" /> : <ChevronRight className="h-4 w-4 text-indigo-400 mt-1" />
          ) : (
            <div className="w-4" />
          )}

          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                {node.label}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border text-xs font-semibold ${
                node.status === "Verified" ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10" :
                node.status === "Incomplete" ? "bg-amber-500/5 text-amber-400 border-amber-500/10" :
                "bg-rose-500/5 text-rose-400 border-rose-500/10"
              }`}>
                {node.status}
              </span>
            </div>
            <h4 className="text-sm font-semibold">{node.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{node.description}</p>
            {node.evidenceSource && (
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-slate-500 bg-slate-500/5 px-2 py-0.5 rounded mt-1">
                <span>Verified Source:</span>
                <span className="text-indigo-400">{node.evidenceSource}</span>
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-2 pl-4">
            {node.children!.map(child => renderTraceNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
      id="decision-dashboard"
    >
      {/* SECTION NAVIGATION RAIL */}
      <div className={`p-1.5 rounded-xl border flex flex-wrap gap-1 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        {[
          { id: "orchestrator", label: "Decision Orchestrator", icon: Compass },
          { id: "actions", label: "Priority Action Center", icon: CheckSquare },
          { id: "simulation", label: "Improvement Simulator", icon: Sliders },
          { id: "trace", label: "AI Decision Trace", icon: Layers },
          { id: "report", label: "Executive Advisory Brief", icon: FileText }
        ].map((sec) => {
          const isActive = activeSubSection === sec.id;
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSubSection(sec.id as any)}
              id={`sec-btn-${sec.id}`}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOP CONFIDENCE WIDGET */}
      <div className={`p-6 rounded-2xl border ${
        darkMode 
          ? "bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border-slate-800" 
          : "bg-gradient-to-r from-white via-indigo-50/10 to-white border-slate-200 shadow-sm"
      } grid grid-cols-1 md:grid-cols-4 gap-6 items-center`} id="confidence-widget">
        <div className="md:col-span-3 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold font-mono">Platform Audit Verdict</span>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold font-display">Decision Recommendation Confidence</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getConfidenceBadgeColor(decisionData.confidence)}`}>
                  {decisionData.confidence} Confidence
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">{decisionData.confidenceReason}</p>
        </div>
        <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center space-y-1 ${
          darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"
        }`}>
          <span className="text-[10px] uppercase font-mono text-slate-500">Traceable Indicators</span>
          <span className="text-3xl font-display font-extrabold text-indigo-400">
            {decisionData.traces[0].children?.length || 2}
          </span>
          <span className="text-[11px] text-slate-400">Core Decision Paths Found</span>
        </div>
      </div>

      {/* RENDERED PANEL CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          
          {/* PANELS 1: ORCHESTRATOR */}
          {activeSubSection === "orchestrator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="orchestrator-workspace">
              
              {/* TIMELINE PATHWAY (Left Column) */}
              <div className="lg:col-span-7 space-y-6">
                <div className={`p-6 rounded-2xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-0.5">
                      <h3 className="text-md font-bold font-display flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-indigo-400" />
                        <span>AI Decision Story</span>
                      </h3>
                      <p className="text-xs text-slate-500">How conversational AI structures its final opinion</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">Thought Pathway</span>
                  </div>

                  <div className="relative pl-6 space-y-6 border-l border-slate-500/10">
                    {decisionData.decisionStory.map((node, i) => (
                      <div key={i} className="relative">
                        {/* Dot */}
                        <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-4 flex items-center justify-center bg-slate-950 ${
                          node.status === "success" ? "border-emerald-500" :
                          node.status === "warning" ? "border-amber-500" : "border-rose-500"
                        }`} />

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold">{node.step}</h4>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">{node.connectedModule}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{node.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROOT CAUSE ANALYSIS */}
                <div className={`p-6 rounded-2xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="space-y-0.5 mb-6">
                    <h3 className="text-md font-bold font-display flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                      <span>Root Cause Analysis</span>
                    </h3>
                    <p className="text-xs text-slate-500">Tracing secondary bottlenecks back to their point of origin</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {decisionData.rootCauses.map((node, i) => (
                      <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 ${
                        darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"
                      }`}>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-rose-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span>IDENTIFIED GAP:</span>
                          </div>
                          <h4 className="text-xs font-bold text-rose-300">{node.issue}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-semibold">Consequence: <span className="font-normal">{node.consequence}</span></p>
                          <p className="text-xs text-slate-400 leading-relaxed font-semibold">Reason: <span className="font-normal text-slate-300">{node.reason}</span></p>
                        </div>
                        <div className="pt-2 border-t border-slate-500/10 text-[10px] font-mono text-slate-500">
                          Root Origin: <span className="text-indigo-400 font-semibold">{node.rootSource}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BENTO HEALTH BOXES & CROSS MODULE INSIGHTS (Right Column) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* BUSINESS HEALTH SUMMARY */}
                <div className={`p-6 rounded-2xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="space-y-0.5 mb-6">
                    <h3 className="text-md font-bold font-display flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-emerald-400" />
                      <span>Business Health Summary</span>
                    </h3>
                    <p className="text-xs text-slate-500">Consolidated score cards for each operational layer</p>
                  </div>

                  <div className="space-y-3">
                    {decisionData.healthOverview.map((item, i) => (
                      <div key={i} className={`p-3 rounded-xl border flex items-center justify-between ${
                        darkMode ? "bg-slate-950/40 border-slate-800/80 hover:border-slate-700" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                      } transition-all`}>
                        <div className="space-y-0.5 flex-1 pr-4">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold">{item.moduleName}</h4>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border uppercase font-mono font-semibold ${getHealthStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{item.biggestStrength}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-mono block">SCORE</span>
                          <span className="text-sm font-extrabold font-display text-indigo-400">{item.score}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CROSS MODULE INSIGHTS */}
                <div className={`p-6 rounded-2xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="space-y-0.5 mb-6">
                    <h3 className="text-md font-bold font-display flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-indigo-400" />
                      <span>Cross-Module Insights</span>
                    </h3>
                    <p className="text-xs text-slate-500">How small missing pieces cause wider intelligence failures</p>
                  </div>

                  {decisionData.crossModuleInsights.map((ins, idx) => (
                    <div key={idx} className="space-y-4">
                      <div className={`p-4 rounded-xl border space-y-3 text-xs leading-relaxed ${
                        darkMode ? "bg-slate-950/30 border-slate-800/60" : "bg-slate-50 border-slate-100"
                      }`}>
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-indigo-400 font-bold uppercase">
                          <Clock className="h-3 w.5 h-3 shrink-0" />
                          <span>Interconnected Breakdown Path:</span>
                        </div>
                        <div className="space-y-2 border-l border-slate-500/10 pl-3">
                          <p className="text-[11px] text-slate-400"><strong className="text-slate-300 font-bold">1. Crawler discovery: </strong>{ins.knowledgeNode}</p>
                          <p className="text-[11px] text-slate-400"><strong className="text-slate-300 font-bold">2. Understanding: </strong>{ins.perceptionNode}</p>
                          <p className="text-[11px] text-slate-400"><strong className="text-slate-300 font-bold">3. Cognitive logic: </strong>{ins.reasoningNode}</p>
                          <p className="text-[11px] text-slate-400"><strong className="text-slate-300 font-bold">4. Recommendation: </strong>{ins.recommendationNode}</p>
                          <p className="text-[11px] text-slate-400"><strong className="text-slate-300 font-bold">5. Trust level: </strong>{ins.trustNode}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PANEL 2: PRIORITY ACTION CENTER */}
          {activeSubSection === "actions" && (
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`} id="priority-action-center">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="space-y-0.5">
                  <h3 className="text-md font-bold font-display flex items-center space-x-2">
                    <CheckSquare className="h-4 w-4 text-indigo-400" />
                    <span>Priority Action Center</span>
                  </h3>
                  <p className="text-xs text-slate-500">Detailed guidelines organized by timeline and execution priority</p>
                </div>

                {/* Categories filter */}
                <div className="flex flex-wrap gap-1">
                  {["All", "Do Immediately", "Do This Month", "Long-Term Improvements"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActionCategory(cat as any)}
                      className={`px-3 py-1 text-xs rounded-lg transition-all border font-semibold cursor-pointer ${
                        actionCategory === cat
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                          : darkMode
                          ? "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredActions.map((action, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${
                    darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono font-bold border ${
                          action.priority === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                          action.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                          {action.priority} Priority
                        </span>
                        <span className="text-[11px] font-semibold text-indigo-400 font-mono">{action.group}</span>
                      </div>

                      <h4 className="text-sm font-bold font-display">{action.title}</h4>
                      
                      <div className="space-y-1.5 pt-2 border-t border-slate-500/5">
                        <p className="text-xs text-slate-400"><strong className="text-slate-300 font-bold">Identified issue: </strong>{action.currentIssue}</p>
                        <p className="text-xs text-slate-400"><strong className="text-slate-300 font-bold">Reason: </strong>{action.reason}</p>
                        <p className="text-xs text-slate-400"><strong className="text-slate-300 font-bold">Expected benefit: </strong>{action.expectedBenefit}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-500/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>Difficulty: <strong className="text-slate-400 font-semibold">{action.difficulty}</strong></span>
                      <span>Effort: <strong className="text-indigo-400 font-semibold">{action.estimatedEffort}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANEL 3: IMPROVEMENT SIMULATOR */}
          {activeSubSection === "simulation" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="improvement-simulator">
              
              {/* Toggles Panel (Left Column) */}
              <div className="lg:col-span-5 space-y-6">
                <div className={`p-6 rounded-2xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-0.5">
                      <h3 className="text-md font-bold font-display flex items-center space-x-2">
                        <Sliders className="h-4 w-4 text-indigo-400" />
                        <span>Interactive Simulator</span>
                      </h3>
                      <p className="text-xs text-slate-500">Toggle specific fixes to model immediate score lifts</p>
                    </div>
                    <button 
                      onClick={handleResetSimulation}
                      className={`p-1.5 rounded-lg border text-xs hover:text-slate-100 ${
                        darkMode ? "bg-slate-950/40 border-slate-800/80 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
                      } cursor-pointer`}
                      title="Reset Simulator"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: "faq",
                        title: "Publish Pre-Sales FAQ Grid",
                        desc: "Injects conversational Q&As so crawlers can easily pull immediate answers.",
                        state: simulatedFaq,
                        setter: setSimulatedFaq
                      },
                      {
                        id: "pricing",
                        title: "Publish Starting Cost Metrics",
                        desc: "Creates clear cost-tables preventing bots from guessing service fees.",
                        state: simulatedPricing,
                        setter: setSimulatedPricing
                      },
                      {
                        id: "returns",
                        title: "Publish Refund & Cancellation Policies",
                        desc: "Improves customer transactional verifiability, lowering buyer risk.",
                        state: simulatedReturns,
                        setter: setSimulatedReturns
                      },
                      {
                        id: "address",
                        title: "Publish localized business address coordinates",
                        desc: "Pins company to a real geological landmark unlocking local map results.",
                        state: simulatedAddress,
                        setter: setSimulatedAddress
                      }
                    ].map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => item.setter(!item.state)}
                        className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                          item.state 
                            ? "bg-indigo-600/10 border-indigo-500/40" 
                            : darkMode ? "bg-slate-950/40 border-slate-850 hover:border-slate-800" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.state}
                          onChange={() => {}} // Swallowed since card is clickable
                          className="mt-1 h-3.5 w-3.5 accent-indigo-500 shrink-0 pointer-events-none"
                        />
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold leading-none">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outputs Panel (Right Column) */}
              <div className="lg:col-span-7 space-y-6">
                <div className={`p-6 rounded-2xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="space-y-0.5 mb-6">
                    <h3 className="text-md font-bold font-display flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span>Modeled Intelligence Lifts</span>
                    </h3>
                    <p className="text-xs text-slate-500">Deterministic estimates mapping simulated improvements to intelligence tiers</p>
                  </div>

                  {/* Impact Chains (Cascasding representation) */}
                  <div className="space-y-6">
                    {/* Overall Score Dial */}
                    <div className="flex items-center space-x-6 pb-6 border-b border-slate-500/10">
                      <div className={`w-20 h-20 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center ${
                        simulation.overallLift > 0 ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "text-slate-400"
                      }`}>
                        <span className="text-[10px] font-mono leading-none">OVERALL LIFT</span>
                        <span className="text-xl font-extrabold font-display">+{simulation.overallLift}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">New Simulated Score Outlook</h4>
                        <p className="text-xs text-slate-400">
                          Your score would elevate from <strong className="text-slate-300 font-extrabold">{report.overallScore}</strong> to <strong className="text-emerald-400 font-extrabold">{Math.min(100, Number(report.overallScore) + simulation.overallLift)}/100</strong>, transitioning you into an optimized recommendation range.
                        </p>
                      </div>
                    </div>

                    {/* Bar chart representing module level lifts */}
                    <div className="space-y-4">
                      {[
                        { label: "Business Information Level", lift: simulation.knowledgeLift },
                        { label: "AI Perception (Understanding) Level", lift: simulation.perceptionLift },
                        { label: "AI Cognitive Reasoning Level", lift: simulation.reasoningLift },
                        { label: "Recommendation Readiness Level", lift: simulation.recommendationLift },
                        { label: "Trust & Authority Level", lift: simulation.trustLift }
                      ].map((bar, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-300">{bar.label}</span>
                            <span className="font-mono text-emerald-400 font-bold">+{bar.lift} pts</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-500/10 overflow-hidden relative">
                            {/* Base indicator */}
                            <div className="h-full bg-indigo-500/30 rounded-full" style={{ width: "65%" }} />
                            {/* Simulated Lift indicator */}
                            <div className="absolute top-0 h-full bg-emerald-500 rounded-full transition-all duration-300" 
                              style={{ 
                                left: "65%", 
                                width: bar.lift > 0 ? `${Math.min(35, bar.lift)}%` : "0%" 
                              }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Simulation Context disclaimer */}
                    <div className="p-3 rounded-lg border border-indigo-500/15 bg-indigo-500/5 text-[11px] leading-relaxed text-indigo-300 flex items-start space-x-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>These lifts represent deterministic estimates based on Perceptiq's evaluation criteria. Real-world crawls by ChatGPT or Google Gemini typically index footer-linked pages within 1-3 business days after uploading your updated files.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 4: AI DECISION TRACE */}
          {activeSubSection === "trace" && (
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`} id="decision-trace-workspace">
              <div className="space-y-0.5 mb-6">
                <h3 className="text-md font-bold font-display flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <span>AI Decision Trace</span>
                </h3>
                <p className="text-xs text-slate-500">Trace your high-level recommendation score directly down to crawl-level plain-text evidence</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-100"
              } space-y-4`}>
                {decisionData.traces.map(rootNode => renderTraceNode(rootNode))}
              </div>
            </div>
          )}

          {/* PANEL 5: EXECUTIVE ACTION REPORT */}
          {activeSubSection === "report" && (
            <div className={`p-8 rounded-2xl border ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800 shadow-sm"
            } space-y-6 font-sans max-w-4xl mx-auto`} id="executive-action-brief-tab">
              
              {/* Header decorative logo */}
              <div className="flex items-center justify-between border-b border-slate-500/15 pb-6">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-indigo-400" />
                  <div>
                    <h3 className="text-lg font-extrabold font-display uppercase tracking-widest text-indigo-300">Executive Advisory Brief</h3>
                    <p className="text-[10px] font-mono text-slate-500">CONFIDENTIAL CORPORATE REPORT</p>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-500">
                  <p>Target Company: {report.companyName}</p>
                  <p>Audited Domain: {report.url}</p>
                  <p>Scan Timeline: {report.scannedAt}</p>
                </div>
              </div>

              {/* REPORT SECTIONS */}
              <div className="space-y-6 text-xs leading-relaxed">
                
                {/* 1. CURRENT STATUS */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-300">1. Current AI Positioning Summary</h4>
                  <p className="text-slate-400 leading-relaxed font-sans">{decisionData.executiveReport.currentStatus}</p>
                </div>

                {/* 2. STRENGTHS & RISKS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-500/10">
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400">2. Business Strengths</h4>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                      {decisionData.executiveReport.strengths.map((st, idx) => (
                        <li key={idx}>{st}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-rose-400">3. Business Risks</h4>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                      {decisionData.executiveReport.risks.map((sk, idx) => (
                        <li key={idx}>{sk}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3. PRIORITY GUIDELINES */}
                <div className="space-y-2 pt-4 border-t border-slate-500/10">
                  <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-300">4. Highest Priority Remediation Actions</h4>
                  <p className="text-slate-400">The orchestrator has singled out the following corrective updates to be executed immediately:</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                    {decisionData.executiveReport.priorityActions.map((act, idx) => (
                      <li key={idx} className="font-semibold text-slate-300">
                        {act}
                      </li>
                    ))}
                  </ul>
                  <p className="text-slate-400 pt-1 italic">{decisionData.executiveReport.expectedImprovements}</p>
                </div>

                {/* 4. STRATEGIC PATHWAY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-500/10">
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-300">5. Quick-Wins Portfolio</h4>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                      {decisionData.executiveReport.quickWins.map((qw, idx) => (
                        <li key={idx}>{qw}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-300">6. Long-Term Strategic Path</h4>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                      {decisionData.executiveReport.longTermStrategy.map((lt, idx) => (
                        <li key={idx}>{lt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="border-t border-slate-500/15 pt-6 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>PERCEPTIQ INTELLIGENCE ORCHESTRATOR © 2026</span>
                <span className="uppercase">Sprint 5 Certified Delivery</span>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
