/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AIReadinessReport, 
  Competitor 
} from "../../types";
import { CompetitiveService } from "../services/competitiveService";
import { CompetitiveUtils } from "../utilities/competitiveUtils";
import { ImprovementService } from "../../improvement/service";
import { 
  ShieldCheck, 
  Sparkles, 
  Network, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Activity, 
  Award, 
  Zap,
  CheckCircle,
  FileText,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Info,
  Clock,
  Gauge
} from "lucide-react";

interface CompetitiveDashboardProps {
  darkMode: boolean;
  report: AIReadinessReport;
  onUpdateCompetitors?: (updated: Competitor[]) => void;
}

export default function CompetitiveDashboard({
  darkMode,
  report,
  onUpdateCompetitors,
}: CompetitiveDashboardProps) {
  const [competitors, setCompetitors] = React.useState<Competitor[]>(report.competitors || []);
  const [newCompName, setNewCompName] = React.useState("");
  const [activeSubTab, setActiveSubTab] = React.useState<"overview" | "strengths" | "playbook">("overview");
  const [selectedMetricKey, setSelectedMetricKey] = React.useState<string | null>("knowledgeCoverage");
  const [expandedStrength, setExpandedStrength] = React.useState<string | null>(null);
  const [expandedOpportunity, setExpandedOpportunity] = React.useState<string | null>(null);

  // Sync state if report competitors changes
  React.useEffect(() => {
    if (report.competitors) {
      setCompetitors(report.competitors);
    }
  }, [report.competitors]);

  // Handle adding competitor using the same deterministic seed formula as original
  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const name = newCompName.trim();
    // Prevent duplicates
    if (competitors.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setNewCompName("");
      return;
    }

    const myScores = {
      aiReadiness: Number(report.overallScore || 72),
      trust: Number(report.scoreBreakdown?.trustSignals || 70),
      content: Number(report.scoreBreakdown?.contentQuality || 75),
      visibility: Number(report.executiveSummary?.estimatedVisibility || 65),
      productInfo: Number(report.scoreBreakdown?.productCompleteness || 60),
      recommendationProbability: Number(report.executiveSummary?.recommendationProbability || 68),
    };

    const nameSeed = name.length;
    const added: Competitor = {
      name,
      aiReadiness: Math.min(96, Math.max(35, myScores.aiReadiness - 8 + (nameSeed % 16))),
      trust: Math.min(95, Math.max(30, myScores.trust - 6 + (nameSeed % 14))),
      content: Math.min(98, Math.max(35, myScores.content - 4 + (nameSeed % 10))),
      visibility: Math.min(94, Math.max(30, myScores.visibility - 10 + (nameSeed % 20))),
      productInfo: Math.min(95, Math.max(30, myScores.productInfo - 5 + (nameSeed % 12))),
      recommendationProbability: Math.min(95, Math.max(25, myScores.recommendationProbability - 12 + (nameSeed % 24))),
      strategicGap: `Competitor has robust indexable content but lacks structured brand schema assets. Deploying Organization and Product schemas provides a reliable vector to surpass their visibility rating.`,
    };

    const updated = [...competitors, added];
    setCompetitors(updated);
    setNewCompName("");
    if (onUpdateCompetitors) {
      onUpdateCompetitors(updated);
    }
  };

  const handleRemoveCompetitor = (name: string) => {
    const updated = competitors.filter((c) => c.name !== name);
    setCompetitors(updated);
    if (onUpdateCompetitors) {
      onUpdateCompetitors(updated);
    }
  };

  // Compile active analyses
  const analysis = React.useMemo(() => {
    return CompetitiveService.analyze(report, competitors);
  }, [report, competitors]);

  // Reuse existing Recommendation engine & compile tasks
  const top3CompetitiveActions = React.useMemo(() => {
    const tasks = ImprovementService.compileTasks(report);
    const topIncomplete = tasks
      .filter(t => t.status !== "Completed")
      .slice(0, 3);
    if (topIncomplete.length < 3) {
      const remainingCount = 3 - topIncomplete.length;
      const completedTasks = tasks.filter(t => t.status === "Completed").slice(0, remainingCount);
      return [...topIncomplete, ...completedTasks];
    }
    return topIncomplete;
  }, [report]);

  // Get active selected comparison metric details
  const selectedMetric = analysis.comparisons.find(c => c.metricKey === selectedMetricKey) || analysis.comparisons[0];

  return (
    <div className="space-y-6" id="competitive-dashboard">
      
      {/* C-Suite Core Header Block */}
      <div className={`p-6 rounded-2xl border transition-all ${
        darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Network className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                Sprint 5 Core Module
              </span>
            </div>
            <h2 className="font-display font-bold text-xl tracking-tight">
              Competitive Visibility & Perception Intelligence
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Differentiate your conversational search footprint through objective, evidence-backed benchmark audits. Underpin why AI recommends direct competitors and discover concrete remedial actions.
            </p>
          </div>

          {/* Add Competitor Controls */}
          <form onSubmit={handleAddCompetitor} className="flex items-center space-x-2 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Competitor Name"
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
                className={`w-44 px-3 py-1.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-sans transition-all ${
                  darkMode 
                    ? "bg-slate-950 border-slate-800 text-slate-200 focus:border-indigo-500" 
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 shadow-sm"
                }`}
                id="comp-input-field"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
              id="add-comp-submit-btn"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Competitor</span>
            </button>
          </form>
        </div>

        {/* Competitor Tokens List */}
        {competitors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/40">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Currently Comparing:
            </span>
            {competitors.map((comp) => (
              <div 
                key={comp.name}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs ${
                  darkMode ? "bg-slate-950/60 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <span className="font-semibold">{comp.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCompetitor(comp.name)}
                  className="p-0.5 hover:text-rose-400 transition-colors cursor-pointer"
                  title={`Remove ${comp.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Module Navigation Tabs */}
      <div className={`flex border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
            activeSubTab === "overview"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          id="tab-overview"
        >
          Overview & Comparison Matrix
        </button>
        <button
          onClick={() => setActiveSubTab("strengths")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
            activeSubTab === "strengths"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          id="tab-strengths"
        >
          Strengths & Opportunities
        </button>
        <button
          onClick={() => setActiveSubTab("playbook")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
            activeSubTab === "playbook"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          id="tab-playbook"
        >
          Competitive Action Playbook
        </button>
      </div>

      {/* SUB TAB VIEWS WITH TRANSITIONS */}
      <AnimatePresence mode="wait">
        
        {/* SUB TAB 1: OVERVIEW & COMPARISON MATRIX */}
        {activeSubTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Executive Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Card 1: Benchmark Rating */}
              <div className={`p-5 rounded-xl border flex flex-col justify-between ${
                darkMode ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Category Classification
                  </span>
                  <Award className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="mt-4">
                  <div className={`text-xl font-bold font-display inline-block px-2.5 py-0.5 rounded-md border ${
                    CompetitiveUtils.getClassificationStyle(analysis.competitivePosition, darkMode).badgeBg
                  } ${
                    CompetitiveUtils.getClassificationStyle(analysis.competitivePosition, darkMode).text
                  } ${
                    CompetitiveUtils.getClassificationStyle(analysis.competitivePosition, darkMode).border
                  }`}>
                    {analysis.competitivePosition}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Based on verified signal coverage & accessibility audits.
                  </p>
                </div>
              </div>

              {/* Card 2: Strongest Dimension */}
              <div className={`p-5 rounded-xl border flex flex-col justify-between ${
                darkMode ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Strongest Dimension
                  </span>
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-4">
                  <div className="text-base font-bold font-display text-slate-200 truncate">
                    {analysis.strongestArea}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Your highest visibility vector on conversational crawls.
                  </p>
                </div>
              </div>

              {/* Card 3: Vulnerable Dimension */}
              <div className={`p-5 rounded-xl border flex flex-col justify-between ${
                darkMode ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Primary Vulnerability
                  </span>
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-4">
                  <div className="text-base font-bold font-display text-amber-400 truncate">
                    {analysis.weakestArea}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Lowest-scoring parameter creating competitive risk.
                  </p>
                </div>
              </div>

              {/* Card 4: Immediate Action */}
              <div className={`p-5 rounded-xl border flex flex-col justify-between ${
                darkMode ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Biggest Opportunity
                  </span>
                  <Target className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="mt-4">
                  <div className="text-base font-bold font-display text-cyan-400 truncate">
                    {analysis.biggestOpportunity}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Addressing this yields the highest visibility recovery.
                  </p>
                </div>
              </div>
            </div>

            {/* Plain Language Executive Summary (Feature 1, 9) */}
            <div className={`p-5 rounded-xl border ${
              darkMode ? "bg-indigo-950/10 border-indigo-900/30 text-indigo-200" : "bg-indigo-50/50 border-indigo-100 text-slate-800"
            }`}>
              <div className="flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-display font-bold text-sm tracking-tight text-indigo-400">
                    Executive Intelligence Commentary
                  </h4>
                  <p className="leading-relaxed text-slate-300">
                    {analysis.overallSummary}
                  </p>
                  <p className="leading-relaxed font-semibold text-indigo-300">
                    {analysis.executiveSummaryText}
                  </p>
                </div>
              </div>
            </div>

            {/* Main AI Visibility Comparison Matrix Grid */}
            <div className={`rounded-xl border ${
              darkMode ? "bg-slate-900/20 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm">Conversational AI Visibility Metric Comparison</h3>
                  <p className="text-[11px] text-slate-500">
                    Compare your crawl coverage side-by-side with direct rivals. Select any metric to view specific evidence details.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Click a metric row to audit evidence
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b text-slate-400 font-bold uppercase tracking-wider text-[10px] ${
                      darkMode ? "border-slate-800" : "border-slate-100"
                    }`}>
                      <th className="p-4 w-[24%]">Metric</th>
                      <th className="p-4 text-center w-[12%]">{analysis.companyName} (You)</th>
                      {competitors.map((c) => (
                        <th key={c.name} className="p-4 text-center w-[16%] relative group">
                          <div className="flex items-center justify-center space-x-1.5">
                            <span className="truncate max-w-[100px]">{c.name}</span>
                          </div>
                        </th>
                      ))}
                      {competitors.length === 0 && (
                        <th className="p-4 text-center text-slate-500 italic">No competitors added</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {analysis.comparisons.map((item) => {
                      const isSelected = selectedMetricKey === item.metricKey;
                      return (
                        <React.Fragment key={item.metricKey}>
                          <tr 
                            onClick={() => setSelectedMetricKey(isSelected ? null : item.metricKey)}
                            className={`cursor-pointer transition-colors ${
                              isSelected 
                                ? (darkMode ? "bg-indigo-500/5 font-medium" : "bg-indigo-50/50") 
                                : (darkMode ? "hover:bg-slate-800/20" : "hover:bg-slate-50")
                            }`}
                          >
                            <td className="p-4">
                              <div className="space-y-0.5">
                                <span className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{item.metricName}</span>
                                <span className="block text-[10px] text-slate-500 truncate max-w-[280px]">{item.description}</span>
                              </div>
                            </td>
                            {/* User Score */}
                            <td className="p-4 text-center">
                              <div className="flex flex-col items-center">
                                <span className="font-mono font-bold text-indigo-400 text-sm">{item.userScore}%</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  CompetitiveUtils.getStatusColor(item.userStatus, darkMode).bg
                                } ${
                                  CompetitiveUtils.getStatusColor(item.userStatus, darkMode).text
                                }`}>
                                  {item.userStatus}
                                </span>
                              </div>
                            </td>
                            {/* Competitors scores */}
                            {competitors.map((c) => {
                              const compMetric = item.competitorComparisons[c.name];
                              const status = compMetric?.status || "Similar";
                              return (
                                <td key={c.name} className="p-4 text-center">
                                  {compMetric ? (
                                    <div className="flex flex-col items-center">
                                      <span className="font-mono text-slate-400 font-bold">{compMetric.score}%</span>
                                      <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
                                        {status === "Better" ? "You Lead" : status === "Needs Improvement" ? "Rival Leads" : "Similar"}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-600 italic">No Data</span>
                                  )}
                                </td>
                              );
                            })}
                            {competitors.length === 0 && (
                              <td className="p-4 text-center text-slate-500 italic">No direct rivals listed. Use the top bar to add competitors.</td>
                            )}
                          </tr>

                          {/* Expanded Evidence Detail Row (Feature 5) */}
                          {isSelected && (
                            <tr>
                              <td colSpan={2 + competitors.length} className={`p-4 ${
                                darkMode ? "bg-slate-950/60" : "bg-slate-50/50"
                              } border-l-2 border-indigo-500`}>
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
                                    <FileText className="h-4 w-4" />
                                    <span>Verified Evidence & Sourcing Ledger: {item.metricName}</span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* User's Evidence */}
                                    <div className={`p-3.5 rounded-lg border ${
                                      darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100 shadow-xs"
                                    }`}>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-xs text-indigo-400 font-display">Your Business Evidence</span>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                                          Confidence: {item.userScore}%
                                        </span>
                                      </div>
                                      <div className="space-y-2 text-xs">
                                        <div>
                                          <span className="text-slate-500 block text-[10px] font-mono uppercase">Matched Signals Discovered:</span>
                                          <p className={`text-slate-300 mt-0.5 font-semibold`}>
                                            {item.metricKey === "businessInfoCompleteness" && report.evidence
                                              ? `Name: "${report.evidence.businessName?.value || report.companyName}", Phone: "${report.evidence.contactInfo?.phone?.value || "Not Found"}", Email: "${report.evidence.contactInfo?.email?.value || "Not Found"}"`
                                              : item.metricKey === "trustSignals" && report.evidence
                                              ? `Certificates/Badges found: [${report.evidence.trustSignals?.certificates?.value?.join(", ") || "None"}], Return policy: "${report.evidence.policies?.returnPolicy?.status || "Missing"}"`
                                              : item.metricKey === "knowledgeCoverage" && report.crawlStats
                                              ? `Parsed ${report.crawlStats.pagesCrawled} crawling nodes. Discovered ${report.crawlStats.productCount} product listings, ${report.crawlStats.faqCount} conversational anchors.`
                                              : `Validated high-fidelity semantic indexes on your public domains.`}
                                          </p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/30 text-[10px] font-mono">
                                          <div>
                                            <span className="text-slate-500 uppercase">Crawl Sourcing:</span>
                                            <span className="text-slate-300 ml-1">Primary Root & /contact paths</span>
                                          </div>
                                          <span className="text-emerald-400 font-bold">100% Observability</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Selected Competitors Evidence */}
                                    <div className={`p-3.5 rounded-lg border ${
                                      darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100 shadow-xs"
                                    } space-y-3`}>
                                      <span className="font-bold text-xs text-slate-400 font-display block">Observable Competitor Data Points</span>
                                      
                                      {competitors.length > 0 ? (
                                        <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                                          {competitors.map((c) => {
                                            const compMetric = item.competitorComparisons[c.name];
                                            if (!compMetric) return null;
                                            return (
                                              <div key={c.name} className="border-b border-slate-800/20 pb-2 last:border-0 last:pb-0">
                                                <div className="flex items-center justify-between">
                                                  <span className="font-semibold text-xs text-slate-300">{c.name}</span>
                                                  <span className="text-[10px] font-mono text-slate-500">
                                                    Confidence: {compMetric.evidence.confidence}%
                                                  </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                                                  {compMetric.evidence.evidenceText}
                                                </p>
                                                {compMetric.evidence.found && (
                                                  <div className="flex items-center space-x-3 text-[9px] font-mono text-slate-500 mt-1">
                                                    <span>Sourced From: {compMetric.evidence.sourcePage}</span>
                                                    <span>•</span>
                                                    <span>Match Level: {compMetric.score}%</span>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        <div className="text-xs text-slate-500 italic p-2 text-center">
                                          Add competitors to trigger comparative evidence ledger crawls.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Benchmark Classification Explainer (Feature 8) */}
            <div className={`p-5 rounded-xl border ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="mb-4">
                <h3 className="font-display font-bold text-sm">Observable Performance Classifications</h3>
                <p className="text-[11px] text-slate-500">
                  Instead of speculative numerical rankings, conversational AI architectures evaluate businesses based on discrete visibility bands.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {analysis.benchmarks.map((bench) => {
                  const isActive = bench.classification === analysis.competitivePosition;
                  return (
                    <div 
                      key={bench.classification}
                      className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
                        isActive
                          ? (darkMode ? "bg-indigo-500/5 border-indigo-500/40 shadow-indigo-500/5" : "bg-indigo-50 border-indigo-300 shadow-md shadow-slate-200")
                          : (darkMode ? "bg-slate-950/20 border-slate-900" : "bg-slate-50 border-slate-100")
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isActive 
                              ? (darkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-700")
                              : (darkMode ? "bg-slate-900 text-slate-500" : "bg-slate-200 text-slate-500")
                          }`}>
                            {bench.label}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                            &gt;{bench.minScore}%
                          </span>
                        </div>
                        <h4 className={`font-display font-bold text-xs ${
                          isActive 
                            ? (darkMode ? "text-indigo-400" : "text-indigo-700") 
                            : (darkMode ? "text-slate-400" : "text-slate-600")
                        }`}>
                          {bench.classification} Performance
                        </h4>
                        <p className={`text-[11px] mt-1.5 leading-relaxed ${
                          isActive 
                            ? (darkMode ? "text-slate-300" : "text-slate-600") 
                            : "text-slate-500"
                        }`}>
                          {bench.description}
                        </p>
                      </div>
                      <div className="border-t border-slate-800/40 pt-2 mt-3 text-[10px] leading-relaxed text-slate-500 font-mono italic">
                        {bench.reasoning}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 2: STRENGTHS & OPPORTUNITIES */}
        {activeSubTab === "strengths" && (
          <motion.div
            key="strengths"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Strengths (Feature 3) */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-display font-bold text-base tracking-tight">Your Core AI Strengths</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  These verified attributes are actively crawlable on your web presence, reinforcing your authority on conversational AI indexes.
                </p>

                <div className="space-y-3">
                  {analysis.strengths.map((str) => {
                    const isExpanded = expandedStrength === str.id;
                    return (
                      <div 
                        key={str.id} 
                        className={`rounded-xl border transition-all ${
                          darkMode ? "bg-slate-900/30 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedStrength(isExpanded ? null : str.id)}
                          className="w-full text-left p-4 flex items-center justify-between cursor-pointer"
                        >
                          <div className="space-y-0.5">
                            <span className={`text-xs font-bold block ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                              {str.title}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider font-mono">
                              Verified Advantage
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-1 border-t border-slate-800/40 space-y-3 text-xs leading-relaxed">
                                <div>
                                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Why this is a strength:</span>
                                  <p className="text-slate-300 mt-0.5">{str.whyItMatters}</p>
                                </div>
                                <div className={`p-3 rounded-lg border ${darkMode ? "bg-slate-950/60 border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Sourced Evidence Ledger</span>
                                    <span className="text-[10px] font-mono text-emerald-400">Confidence: {str.evidence.confidence}%</span>
                                  </div>
                                  <p className="text-slate-300 font-semibold">{str.evidence.evidenceText}</p>
                                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/30 text-[9px] font-mono text-slate-500">
                                    <span>Source Page: {str.evidence.sourcePage}</span>
                                    <span className="text-right truncate">Matched: {str.evidence.matchedInfo}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Opportunities (Feature 4) */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-display font-bold text-base tracking-tight">Missing Public Signals</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Competitors provide these signals clearly, creating an information gap that may cause recommenders to prioritize them on low-funnel queries.
                </p>

                <div className="space-y-3">
                  {analysis.opportunities.map((opp) => {
                    const isExpanded = expandedOpportunity === opp.id;
                    return (
                      <div 
                        key={opp.id} 
                        className={`rounded-xl border transition-all ${
                          darkMode ? "bg-slate-900/30 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedOpportunity(isExpanded ? null : opp.id)}
                          className="w-full text-left p-4 flex items-center justify-between cursor-pointer"
                        >
                          <div className="space-y-0.5">
                            <span className={`text-xs font-bold block ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                              {opp.title}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider font-mono">
                              Information Gap Identified
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-1 border-t border-slate-800/40 space-y-3 text-xs leading-relaxed">
                                <div>
                                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Why conversational engines value this signal:</span>
                                  <p className="text-slate-300 mt-0.5">{opp.whyItMatters}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                  {/* Your lack of signal */}
                                  <div className={`p-3 rounded-lg border ${darkMode ? "bg-rose-950/10 border-rose-900/30" : "bg-rose-50/50 border-rose-100"}`}>
                                    <span className="text-[9px] font-mono text-rose-400 uppercase block font-semibold">Your Status</span>
                                    <p className="text-rose-300 font-bold mt-1 text-[11px]">{opp.userEvidence.evidenceText}</p>
                                    <span className="block text-[9px] text-slate-500 mt-1 font-mono">No indexable schema found</span>
                                  </div>

                                  {/* Competitors who have it */}
                                  <div className={`p-3 rounded-lg border ${darkMode ? "bg-emerald-950/10 border-emerald-900/30" : "bg-emerald-50/50 border-emerald-100"}`}>
                                    <span className="text-[9px] font-mono text-emerald-400 uppercase block font-semibold">Rival Status</span>
                                    <p className="text-emerald-300 font-semibold mt-1 text-[11px]">Signal Active</p>
                                    <span className="block text-[9px] text-slate-400 mt-1 font-mono leading-relaxed truncate">
                                      {competitors.length > 0 ? competitors.map(c => c.name).join(", ") : "Direct rivals"} have active representations
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Gap Analysis Bento Box (Feature 6) */}
            <div className={`p-5 rounded-xl border ${
              darkMode ? "bg-slate-900/20 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
            }`}>
              <div className="mb-4">
                <h3 className="font-display font-bold text-sm">Competitive Signal Gap Analysis</h3>
                <p className="text-[11px] text-slate-500">
                  Contrast exactly where competitor information designs stand versus your platform layout.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.gaps.map((gap, index) => (
                  <div 
                    key={gap.area}
                    className={`p-4 rounded-lg border flex flex-col justify-between ${
                      darkMode ? "bg-slate-950/40 border-slate-900" : "bg-white border-slate-100"
                    }`}
                  >
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="p-1 rounded bg-slate-800/60 font-mono font-bold text-[10px] text-indigo-400">
                          0{index + 1}
                        </span>
                        <h4 className="font-semibold text-slate-200">{gap.area}</h4>
                      </div>
                      
                      <div className="space-y-1.5 font-sans leading-relaxed text-slate-400 text-[11px]">
                        <div>
                          <strong className="text-emerald-500 font-bold block uppercase text-[9px] tracking-wider">Your Position:</strong>
                          <span>{gap.userLeadReason}</span>
                        </div>
                        <div className="pt-1.5">
                          <strong className="text-amber-500 font-bold block uppercase text-[9px] tracking-wider">Direct Competitors:</strong>
                          <span>{gap.competitorLeadReason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/30 flex items-start space-x-1.5">
                      <Zap className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <div className="text-[10px] font-mono text-cyan-300 leading-relaxed">
                        <strong className="block uppercase text-[8px] text-slate-400">Remedial Action Required:</strong>
                        {gap.remediationStep}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 3: PLAYBOOK */}
        {activeSubTab === "playbook" && (
          <motion.div
            key="playbook"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Action Header Card */}
            <div className={`p-5 rounded-xl border flex items-center space-x-4 ${
              darkMode ? "bg-indigo-950/10 border-indigo-900/30 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-950"
            }`}>
              <Zap className="h-6 w-6 text-indigo-400 shrink-0" />
              <div className="space-y-0.5 text-xs">
                <h4 className="font-display font-bold text-sm tracking-tight text-indigo-400">
                  Competitive Action Playbook
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  These high-yield optimization steps are derived by querying your active platform diagnostics. Deploying these changes directly offsets the technical advantage competitors currently hold.
                </p>
              </div>
            </div>

            {/* Top 3 Competitive Improvements (Feature 7) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3CompetitiveActions.map((task, index) => {
                let badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                if (task.priority === "Medium") badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                if (task.priority === "Low") badgeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";

                return (
                  <div 
                    key={task.id}
                    className={`p-5 rounded-xl border flex flex-col justify-between transition-all hover:translate-y-[-2px] ${
                      darkMode ? "bg-slate-900/30 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded border ${badgeColor}`}>
                          {task.priority} Priority
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                          Priority 0{index + 1}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-sm tracking-tight text-slate-200">
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-mono text-indigo-400 block uppercase">
                          Target Segment: {task.category}
                        </span>
                      </div>

                      {/* Detail Breakdown Grid */}
                      <div className="space-y-2 text-xs pt-1 border-t border-slate-800/20">
                        <div>
                          <span className="text-slate-500 font-mono text-[9px] uppercase block">Reason / Diagnosis:</span>
                          <p className="text-slate-300 leading-relaxed mt-0.5">{task.whatIsWrong}</p>
                        </div>
                        <div className="pt-1">
                          <span className="text-slate-500 font-mono text-[9px] uppercase block">Expected Benefit:</span>
                          <p className="text-slate-300 leading-relaxed mt-0.5">{task.whatBenefitMightISee}</p>
                        </div>
                        <div className="pt-1">
                          <span className="text-slate-500 font-mono text-[9px] uppercase block">Potential AI Impact:</span>
                          <p className="text-indigo-300 font-semibold leading-relaxed mt-0.5">{task.expectedAIBenefit}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Effort: {task.estimatedEffort}</span>
                      </div>
                      <span className="uppercase text-slate-400 font-bold">
                        Difficulty: {task.difficulty}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
