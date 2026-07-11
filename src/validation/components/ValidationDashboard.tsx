/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AIReadinessReport } from "../../types";
import { ValidationService } from "../service";
import { ImprovementService } from "../../improvement/service";
import { ValidationItem, ValidationStatus, EffectivenessCategory } from "../types";
import { 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  HelpCircle,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Gauge,
  TrendingUp,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  Award,
  BookOpen
} from "lucide-react";

interface ValidationDashboardProps {
  darkMode: boolean;
  report: AIReadinessReport;
  simulatedScoreOffset: number;
}

export default function ValidationDashboard({
  darkMode,
  report,
  simulatedScoreOffset,
}: ValidationDashboardProps) {
  // 1. Compile live tasks from the improvement service
  const tasks = React.useMemo(() => {
    return ImprovementService.compileTasks(report);
  }, [report]);

  // 2. Generate live validation items using the validation service
  const validationItems = React.useMemo(() => {
    return ValidationService.compileValidationItems(report, tasks);
  }, [report, tasks]);

  // 3. Compute dynamic metrics
  const metrics = React.useMemo(() => {
    return ValidationService.calculateMetrics(validationItems);
  }, [validationItems]);

  // 4. Generate the dedicated validation timeline
  const timelineEvents = React.useMemo(() => {
    return ValidationService.compileValidationTimeline(validationItems);
  }, [validationItems]);

  // 5. Selected item for detailed explorer panel (Feature 4)
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    validationItems.length > 0 ? validationItems[0].taskId : null
  );

  const selectedItem = React.useMemo(() => {
    return validationItems.find((item) => item.taskId === selectedItemId) || null;
  }, [validationItems, selectedItemId]);

  // Filter state for the verification checklist
  const [statusFilter, setStatusFilter] = React.useState<ValidationStatus | "All">("All");

  const filteredItems = React.useMemo(() => {
    if (statusFilter === "All") return validationItems;
    return validationItems.filter((item) => item.status === statusFilter);
  }, [validationItems, statusFilter]);

  // 6. Dynamic Validation Narrative (Feature 8)
  const validationSummaryText = React.useMemo(() => {
    const company = report.companyName || "Your business";
    const verifiedCount = metrics.verifiedCount;
    
    if (verifiedCount > 0) {
      return `${verifiedCount} critical recommended actions have now been fully verified by Perceptiq AI's crawler audits. Your public brand consistency and structured schema are significantly more robust than before. The next primary optimization opportunity centers on refining technical product descriptions and catalog specifications.`;
    } else {
      return `Perceptiq AI has established validation models for ${company}. All recommendation checkpoints are actively monitored. Zero completed playbooks are currently published; complete and deploy your first website update in the Improvement Center to trigger verification.`;
    }
  }, [report.companyName, metrics.verifiedCount]);

  // Status Badge Helper
  const getStatusBadge = (status: ValidationStatus) => {
    switch (status) {
      case "Verified":
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Verified</span>
          </span>
        );
      case "Partially Verified":
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Partially Verified</span>
          </span>
        );
      case "Unable to Verify":
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20 flex items-center space-x-1">
            <HelpCircle className="h-3 w-3" />
            <span>Unable to Verify</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Not Yet Verified</span>
          </span>
        );
    }
  };

  // Effectiveness Badge Helper (Feature 7)
  const getEffectivenessBadge = (rating: EffectivenessCategory) => {
    switch (rating) {
      case "Highly Effective":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Moderately Effective":
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      case "Limited Evidence":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/10";
    }
  };

  return (
    <div className="space-y-10 font-sans max-w-7xl mx-auto px-1 py-2" id="validation-dashboard-root">
      
      {/* HEADER SECTION & EXECUTIVE BRIEF */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b pb-6 border-slate-500/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Evidence Audit Suite</span>
          </div>
          <h1 className="text-2xl font-display font-black tracking-tight">
            AI Evidence Validation
          </h1>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Inspect public crawl traces, verify deployed website schema modifications, and confirm AI discovery representation.
          </p>
        </div>

        {/* Feature 8: Dynamic Validation Summary Narrative */}
        <div className={`p-4 rounded-xl border max-w-lg ${
          darkMode 
            ? "bg-slate-900/60 border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950/10 text-slate-300" 
            : "bg-white border-indigo-100 text-slate-700 shadow-xs"
        }`} id="validation-executive-summary">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <FileCheck className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">Executive Validation Summary</span>
              <p className="text-[11px] leading-relaxed">
                {validationSummaryText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 1: AI Validation Dashboard Metrics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="validation-metrics-grid">
        {/* Metric 1: Progress Circle */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
        }`}>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Verification Rate</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-display font-black text-indigo-400">
              {metrics.overallValidationPercentage}%
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Confirmed</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-500/10 overflow-hidden mt-2">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500" 
              style={{ width: `${metrics.overallValidationPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Total Recommendations */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
        }`}>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Total Playbooks</span>
          <div className="text-2xl font-display font-black text-slate-300 mt-2">
            {metrics.totalRecommendations}
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Monitored checkpoints</span>
        </div>

        {/* Metric 3: Verified Count */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-emerald-500/[0.02] border-emerald-500/10" : "bg-emerald-50/[0.02] border-emerald-500/15"
        }`}>
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block">Fully Verified</span>
          <div className="text-2xl font-display font-black text-emerald-400 mt-2">
            {metrics.verifiedCount}
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Active crawler evidence</span>
        </div>

        {/* Metric 4: Partially Verified */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-amber-50/[0.02] border-amber-500/15"
        }`}>
          <span className="text-[9px] font-mono font-bold text-amber-400 uppercase block">Partially Verified</span>
          <div className="text-2xl font-display font-black text-amber-400 mt-2">
            {metrics.partiallyVerifiedCount}
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Incomplete structural drafts</span>
        </div>

        {/* Metric 5: Not Yet Verified */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
        }`}>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Not Yet Verified</span>
          <div className="text-2xl font-display font-black text-rose-400 mt-2">
            {metrics.notYetVerifiedCount}
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Awaiting execution</span>
        </div>

        {/* Metric 6: Unable to Verify */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
        }`}>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Unable to Verify</span>
          <div className="text-2xl font-display font-black text-slate-400 mt-2">
            {metrics.unableToVerifyCount}
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Protected/Gated files</span>
        </div>
      </div>

      {/* CORE SPLIT GRID: Validation List (Left) & Deep Explorer/Comparison (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="validation-deep-inspect-grid">
        
        {/* LEFT COLUMN: Recommendation Verification Selector (Feature 2) */}
        <div className="lg:col-span-5 space-y-4" id="validation-selector-column">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Audit Checklist
            </span>
            
            {/* Filter Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-slate-500">Filter:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`text-[10px] font-mono rounded px-2 py-0.5 border ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-300 text-slate-700"
                }`}
              >
                <option value="All">All Checkpoints</option>
                <option value="Verified">✓ Verified</option>
                <option value="Partially Verified">△ Partially</option>
                <option value="Not Yet Verified">○ Not Yet</option>
                <option value="Unable to Verify">? Unable</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = item.taskId === selectedItemId;
              return (
                <button
                  key={item.taskId}
                  onClick={() => setSelectedItemId(item.taskId)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 block ${
                    isSelected
                      ? darkMode
                        ? "bg-indigo-500/10 border-indigo-500/40 shadow-xs shadow-indigo-500/10"
                        : "bg-indigo-50/30 border-indigo-300 shadow-xs"
                      : darkMode
                      ? "bg-slate-900/10 border-slate-800/80 hover:bg-slate-900/30"
                      : "bg-white border-slate-200 hover:bg-slate-50/50"
                  }`}
                  id={`validation-item-btn-${item.taskId}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h4 className={`text-xs font-bold truncate leading-snug ${isSelected ? "text-indigo-400" : ""}`}>
                        {item.taskTitle}
                      </h4>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.whatAiFound}
                  </p>

                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase mt-3 pt-2.5 border-t border-slate-500/5">
                    <span>Engine: {item.taskId.includes("schema") ? "Knowledge" : "Trust"} Mapping</span>
                    {isSelected && <span className="text-indigo-400 font-bold">Deep View &rarr;</span>}
                  </div>
                </button>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="py-12 text-center border border-dashed border-slate-500/10 rounded-xl">
                <p className="text-xs text-slate-500 italic">No checkpoints match the active filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence Comparison & Explorer Panels (Feature 3, 4, 7) */}
        <div className="lg:col-span-7 space-y-6" id="validation-explorer-column">
          
          {selectedItem ? (
            <div className="space-y-6">
              
              {/* PANEL TITLE */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? "bg-slate-900/20 border-slate-800" : "bg-slate-50/30 border-slate-200 shadow-2xs"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-mono text-indigo-400 uppercase font-black tracking-widest block">
                      Active Investigation View
                    </span>
                    <h3 className="text-base font-display font-black tracking-tight mt-0.5">
                      {selectedItem.taskTitle}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    {getStatusBadge(selectedItem.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-500/5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">What AI Found:</span>
                    <p className={`mt-1 font-semibold leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {selectedItem.whatAiFound}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Status Justification:</span>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      {selectedItem.whyAssigned}
                    </p>
                  </div>
                </div>
              </div>

              {/* FEATURE 3: Evidence Comparison Block */}
              <div className="space-y-3" id="evidence-comparison-block">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Before vs Current Evidence Comparison</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before card */}
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-wider block">
                      Historical Baseline Status
                    </span>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed italic">
                      &ldquo;{selectedItem.comparison.before}&rdquo;
                    </p>
                  </div>

                  {/* After card */}
                  <div className={`p-4 rounded-xl border ${
                    selectedItem.status === "Verified"
                      ? darkMode ? "bg-emerald-500/[0.02] border-emerald-500/20" : "bg-emerald-50/10 border-emerald-200"
                      : darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <span className={`text-[9px] font-mono font-black uppercase tracking-wider block ${
                      selectedItem.status === "Verified" ? "text-emerald-400" : "text-slate-400"
                    }`}>
                      Current Live Audit Status
                    </span>
                    <p className={`text-xs mt-1.5 leading-relaxed ${selectedItem.status === "Verified" ? "font-semibold text-indigo-300" : "text-slate-500"}`}>
                      &ldquo;{selectedItem.comparison.after}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Analysis Delta Row */}
                <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4 ${
                  darkMode ? "bg-slate-900/20 border-slate-800" : "bg-white border-slate-200 shadow-2xs"
                }`}>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">What Changed:</span>
                    <p className={`text-xs mt-0.5 leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {selectedItem.comparison.whatChanged}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Potential AI Impact:</span>
                    <p className="text-xs font-semibold text-indigo-400 mt-0.5 leading-relaxed">
                      {selectedItem.comparison.potentialAiImpact}
                    </p>
                  </div>
                </div>
              </div>

              {/* FEATURE 4: Evidence Explorer Detail Panel */}
              <div className="space-y-3" id="evidence-explorer-panel">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Search className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Validation Trace & Explorer</span>
                </h4>

                <div className={`p-5 rounded-2xl border ${
                  darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Source and location metadata */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Where AI Found It:</span>
                        <p className={`text-xs font-bold mt-0.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                          {selectedItem.explorer.whereFound}
                        </p>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Target Crawl Route:</span>
                        <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-indigo-400 font-mono">
                          <span className="truncate max-w-[200px]">{selectedItem.explorer.sourcePage}</span>
                          {selectedItem.explorer.sourcePage !== "None" && <ExternalLink className="h-3 w-3 shrink-0" />}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">Scan Timestamp:</span>
                          <span className="font-semibold block mt-0.5">{selectedItem.explorer.lastDetected}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">Trace Confidence:</span>
                          <span className="font-semibold block mt-0.5 text-indigo-400 font-mono">
                            {selectedItem.explorer.confidence}% Match
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Matched raw data content */}
                    <div className="space-y-3 p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                      <span className="text-[9px] font-mono text-indigo-400 uppercase font-black block">Parsed Crawler String:</span>
                      
                      {selectedItem.status === "Verified" || selectedItem.status === "Partially Verified" ? (
                        <code className="text-[10px] font-mono block break-all leading-normal bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-indigo-300 max-h-[110px] overflow-y-auto">
                          {selectedItem.explorer.matchedInformation}
                        </code>
                      ) : (
                        <p className="text-[10px] text-slate-500 italic leading-relaxed">
                          {selectedItem.explorer.missingExplanation}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* FEATURE 7: Improvement Effectiveness Appraisal */}
              <div className="space-y-3" id="effectiveness-appraisal">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Award className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Effectiveness & Commercial Impact</span>
                </h4>

                <div className={`p-5 rounded-2xl border ${
                  darkMode ? "bg-slate-900/20 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Impact Evaluation:</span>
                    <span className={`text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded border ${getEffectivenessBadge(selectedItem.effectiveness.rating)}`}>
                      {selectedItem.effectiveness.rating}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-500/5 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Evaluation Reason:</span>
                      <p className={`leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {selectedItem.effectiveness.why}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Business Outlook:</span>
                      <p className={`leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {selectedItem.effectiveness.businessImpact}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Compass className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="text-slate-500">Suggested Next Validation Step:</span>
                      <strong className="text-indigo-300 font-semibold">{selectedItem.effectiveness.suggestedNextStep}</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-slate-500/10 rounded-2xl">
              <p className="text-sm text-slate-500 italic">Select a recommendation from the left checklist to view deep validation evidence.</p>
            </div>
          )}

        </div>

      </div>

      {/* FEATURE 5: Validation Timeline Focusing ONLY on Verified Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-slate-500/10">
        
        {/* Timeline View (Left 8 columns) */}
        <div className="lg:col-span-8 space-y-4" id="validation-timeline-section">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="text-sm font-display font-black uppercase tracking-wider">
              Verification Deployment Timeline
            </h3>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-500/15">
            {timelineEvents.map((evt, idx) => (
              <div key={evt.id} className="relative space-y-1.5 group">
                {/* Visual node */}
                <div className={`absolute -left-[20px] top-1.5 h-3 w-3 rounded-full border-2 transition-transform ${
                  idx === timelineEvents.length - 1
                    ? "bg-indigo-500 border-indigo-500 animate-pulse"
                    : "bg-slate-950 border-slate-700"
                }`} />

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                    {evt.month}
                  </span>
                  {idx === timelineEvents.length - 1 && (
                    <span className="text-[8px] font-mono uppercase font-black px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                      Latest Check
                    </span>
                  )}
                </div>

                <div className={`p-4 rounded-xl border ${
                  darkMode ? "bg-slate-900/20 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h4 className="text-xs font-bold leading-snug">{evt.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {evt.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-500/5 text-[10px] font-mono text-indigo-400">
                    <span className="font-bold text-slate-500 uppercase mr-1">Crawler Impact:</span>
                    {evt.impactSummary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURE 6: AI Confidence Analysis (Right 4 columns) */}
        <div className="lg:col-span-4 space-y-4" id="ai-confidence-analysis">
          <div className="flex items-center space-x-2">
            <Gauge className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="text-sm font-display font-black uppercase tracking-wider">
              AI Confidence Outlook
            </h3>
          </div>

          <div className={`p-5 rounded-2xl border space-y-4 ${
            darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block border-b pb-2 border-slate-500/5">
              Algorithm Understanding Metrics
            </span>

            {/* Metric 1: Entity Found Consistency */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Entity Findability Consistency</span>
                <span className="font-mono text-emerald-400 font-bold">Consistently Found</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Structured contact coordinates and organizational schemas prevent conversational synthesizers from misattributing or excluding your brand.
              </p>
            </div>

            {/* Metric 2: Brand Trust Confidence */}
            <div className="space-y-1.5 pt-3 border-t border-slate-500/5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Authority & Trust Confidence</span>
                <span className="font-mono text-emerald-400 font-bold">Elevated</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Verifying refunds, policy blocks, and customer service escalation nodes increases the compliance scores assigned by LLM filtering protocols.
              </p>
            </div>

            {/* Metric 3: Product Context Quality */}
            <div className="space-y-1.5 pt-3 border-t border-slate-500/5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Product Understanding Depth</span>
                <span className="font-mono text-amber-400 font-bold">Expanding</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Deploying structured pricing structures and clean FAQ tables provides comparative shopping engines with standardized metrics to execute comparisons.
              </p>
            </div>

            {/* Careful Disclaimer */}
            <div className="p-3 rounded-lg bg-amber-500/[0.03] border border-amber-500/10 text-[9px] text-amber-400 leading-normal flex items-start space-x-2">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Careful Outlook:</strong> Deployed optimizations elevate LLM retrieval matchmaking scores. However, conversational engine algorithms are dynamic; actual referral traffic is not guaranteed.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
