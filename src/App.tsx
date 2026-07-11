/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AIReadinessReport, HistoryItem } from "./types";
import Header from "./components/Header";
import LandingScanner from "./components/LandingScanner";
import VisibilityCard from "./components/VisibilityCard";
import ExplainabilityCard from "./components/ExplainabilityCard";
import CompetitorBenchmark from "./components/CompetitorBenchmark";
import CompetitiveDashboard from "./competitive/components/CompetitiveDashboard";
import ImprovementCenter from "./components/ImprovementCenter";
import ProgressTimeline from "./improvement/components/ProgressTimeline";
import ValidationDashboard from "./validation/components/ValidationDashboard";
import ExecutiveReport from "./components/ExecutiveReport";
import EvidenceAuditor from "./components/EvidenceAuditor";
import AiExplanationView from "./components/AiExplanationView";
import ExecutiveDashboardView from "./components/ExecutiveDashboardView";
import KnowledgeMap from "./components/KnowledgeMap";
import PerceptionDashboard from "./components/PerceptionDashboard";
import ReasoningDashboard from "./components/ReasoningDashboard";
import RecommendationDashboard from "./components/RecommendationDashboard";
import TrustDashboard from "./components/TrustDashboard";
import { DecisionDashboard } from "./components/DecisionDashboard";
import DocumentationView from "./components/DocumentationView";
import ProductTour from "./components/ProductTour";
import { 
  BarChart3, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  CheckSquare, 
  FileText, 
  ArrowLeft,
  ShieldCheck,
  Network,
  ThumbsUp,
  Shield,
  FileCheck,
  Globe,
  Lock,
  FileWarning,
  AlertCircle
} from "lucide-react";

const navGroups = [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      { id: "overview", label: "Executive Dashboard", icon: Layers }
    ]
  },
  {
    id: "intelligence",
    label: "Intelligence",
    items: [
      { id: "knowledge", label: "Knowledge Map", icon: Network },
      { id: "visibility", label: "AI Brand Perception", icon: TrendingUp },
      { id: "decision", label: "AI Decision Intelligence", icon: Sparkles }
    ]
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      { id: "recommendation", label: "Recommendation Intelligence", icon: ThumbsUp },
      { id: "trust", label: "Trust & Authority", icon: Shield },
      { id: "competitors", label: "Competitive Intelligence", icon: Network }
    ]
  },
  {
    id: "evidence",
    label: "Evidence",
    items: [
      { id: "evidence", label: "Evidence Auditor", icon: ShieldCheck },
      { id: "validation", label: "AI Evidence Validation", icon: FileCheck },
      { id: "explainability", label: "Interpretability WHY", icon: HelpCircle }
    ]
  },
  {
    id: "actions",
    label: "Actions",
    items: [
      { id: "improvements", label: "Improvement Center", icon: CheckSquare },
      { id: "progress", label: "AI Improvement Journey", icon: TrendingUp },
      { id: "report", label: "One-Page Advisory Brief", icon: FileText }
    ]
  }
];

const getCategoryForTab = (tabId: string): string => {
  if (tabId === "overview") return "dashboard";
  if (["knowledge", "visibility", "decision"].includes(tabId)) return "intelligence";
  if (["recommendation", "trust", "competitors"].includes(tabId)) return "insights";
  if (["evidence", "validation", "explainability"].includes(tabId)) return "evidence";
  if (["improvements", "progress", "report"].includes(tabId)) return "actions";
  return "dashboard";
};

export default function App() {
  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    const saved = localStorage.getItem("perceptiq-dark-mode");
    return saved ? saved === "true" : true;
  });

  const [activeSection, setActiveSection] = React.useState<"dashboard" | "docs">("dashboard");

  const [urlInput, setUrlInput] = React.useState("");
  const [scanning, setScanning] = React.useState(false);
  const [scanStep, setScanStep] = React.useState<string>("initiating");
  const [report, setReport] = React.useState<AIReadinessReport | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>("overview");
  const [visibilitySubTab, setVisibilitySubTab] = React.useState<"understanding" | "reasoning" | "compatibility">("understanding");
  const [simulatedScoreOffset, setSimulatedScoreOffset] = React.useState(0);
  const [isTourOpen, setIsTourOpen] = React.useState(false);

  // Auto-start Guided Tour on first successful scan
  React.useEffect(() => {
    if (report && localStorage.getItem("perceptiq-tour-completed") !== "true") {
      setIsTourOpen(true);
    }
  }, [report]);

  const [history, setHistory] = React.useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("perceptiq-history");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist dark mode
  React.useEffect(() => {
    localStorage.setItem("perceptiq-dark-mode", String(darkMode));
  }, [darkMode]);

  // Persist scan history
  React.useEffect(() => {
    localStorage.setItem("perceptiq-history", JSON.stringify(history));
  }, [history]);

  // Handle live backend URL analysis with staged steps for optimal UX
  const triggerScan = async (targetUrl: string) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    // Normalization helper
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = "https://" + cleanUrl;
    }

    setScanning(true);
    setReport(null);
    setErrorMsg(null);
    setSimulatedScoreOffset(0);
    setActiveTab("overview");

    // Timeline steps generator for realistic crawler reporting
    const steps = ["validating", "collecting", "scoring", "confidence", "explaining"];
    let stepIndex = 0;
    setScanStep(steps[0]);

    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setScanStep(steps[stepIndex]);
      }
    }, 1200);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: cleanUrl }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Establish crawler session failed.");
      }

      const reportData: AIReadinessReport = await response.json();
      setReport(reportData);

      // Append to history list safely
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        url: reportData.url,
        companyName: reportData.companyName,
        scannedAt: reportData.scannedAt,
        overallScore: reportData.overallScore,
      };

      // Filter out duplicate domain entries in historical list
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.url.toLowerCase() !== reportData.url.toLowerCase());
        return [newItem, ...filtered].slice(0, 10); // Keep top 10 scans
      });

    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || "Network timeout. Could not scan target URL.");
    } finally {
      setScanning(false);
    }
  };

  const handleSimulateFix = (offset: number) => {
    setSimulatedScoreOffset((prev) => prev + offset);
  };

  const handleSelectHistory = (url: string) => {
    setUrlInput(url);
    triggerScan(url);
  };

  const handleReset = () => {
    setReport(null);
    setErrorMsg(null);
    setUrlInput("");
    setSimulatedScoreOffset(0);
  };

  // Adjust scores on the fly when the user interactively applies checklist fixes
  const isScored = report && typeof report.overallScore === "number";
  const currentOverallScore = isScored ? Math.min(100, Math.max(0, (report.overallScore as number) + simulatedScoreOffset)) : "Unknown";
  const currentBreakdown = isScored ? {
    contentQuality: Math.min(100, Math.max(0, (report.scoreBreakdown.contentQuality as number) + simulatedScoreOffset)),
    productCompleteness: Math.min(100, Math.max(0, (report.scoreBreakdown.productCompleteness as number) + simulatedScoreOffset)),
    structuredData: Math.min(100, Math.max(0, (report.scoreBreakdown.structuredData as number) + (simulatedScoreOffset * 1.5))),
    trustSignals: Math.min(100, Math.max(0, (report.scoreBreakdown.trustSignals as number) + simulatedScoreOffset)),
    aiReadability: Math.min(100, Math.max(0, (report.scoreBreakdown.aiReadability as number) + simulatedScoreOffset)),
    authority: report.scoreBreakdown.authority, // Authority relies on external backlinks - constant
    technicalHealth: Math.min(100, Math.max(0, (report.scoreBreakdown.technicalHealth as number) + simulatedScoreOffset)),
  } : {
    contentQuality: "Unknown",
    productCompleteness: "Unknown",
    structuredData: "Unknown",
    trustSignals: "Unknown",
    aiReadability: "Unknown",
    authority: "Unknown",
    technicalHealth: "Unknown",
  };

  return (
    <div className={darkMode ? "dark bg-slate-950 text-slate-100 min-h-screen font-sans transition-colors duration-200" : "bg-slate-50 text-slate-900 min-h-screen font-sans transition-colors duration-200"}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        history={history}
        onSelectHistory={handleSelectHistory}
        activeReportUrl={report?.url}
        onReset={handleReset}
        activeSection={activeSection}
        onNavigate={(sec) => {
          setActiveSection(sec);
        }}
        onStartTour={() => setIsTourOpen(true)}
      />

      <main className="pb-24">
        {activeSection === "docs" ? (
          <DocumentationView 
            darkMode={darkMode} 
          />
        ) : !report ? (
          <LandingScanner
            darkMode={darkMode}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            scanning={scanning}
            scanStep={scanStep}
            onScan={triggerScan}
            errorMsg={errorMsg}
          />
        ) : report.scanStatus && report.scanStatus !== "SUCCESS" ? (
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center space-y-6 animate-fade-in" id="error-screen">
            <div className={`p-8 rounded-3xl border ${
              darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            } space-y-6`}>
              <div className="flex justify-center">
                {report.scanStatus === "INVALID_DOMAIN" && (
                  <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500 animate-pulse">
                    <Globe className="h-10 w-10" />
                  </div>
                )}
                {report.scanStatus === "LIMITED_PUBLIC_ACCESS" && (
                  <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                    <Lock className="h-10 w-10" />
                  </div>
                )}
                {report.scanStatus === "INSUFFICIENT_PUBLIC_EVIDENCE" && (
                  <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-500">
                    <FileWarning className="h-10 w-10" />
                  </div>
                )}
                {report.scanStatus === "SCAN_FAILED" && (
                  <div className="p-4 bg-slate-500/10 rounded-2xl border border-slate-500/20 text-slate-500">
                    <AlertCircle className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h1 className={`text-xl sm:text-2xl font-display font-black tracking-tight ${
                  darkMode ? "text-slate-100" : "text-slate-950"
                }`}>
                  {report.scanStatus === "INVALID_DOMAIN" && "Website Not Found"}
                  {report.scanStatus === "LIMITED_PUBLIC_ACCESS" && "Limited Public Access"}
                  {report.scanStatus === "INSUFFICIENT_PUBLIC_EVIDENCE" && "Not Enough Public Information"}
                  {report.scanStatus === "SCAN_FAILED" && "Scan Failed"}
                </h1>
                <p className={`text-xs sm:text-sm leading-relaxed max-w-md mx-auto ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  {report.scanStatus === "INVALID_DOMAIN" && "We couldn't find a publicly accessible website at this address. Please check the website address and try again."}
                  {report.scanStatus === "LIMITED_PUBLIC_ACCESS" && "This website restricts automated access to its public content. Perceptiq AI only analyzes publicly accessible business information. Because sufficient public evidence could not be collected, no analysis has been generated."}
                  {report.scanStatus === "INSUFFICIENT_PUBLIC_EVIDENCE" && "We couldn't find enough publicly available business information to generate a reliable analysis. Perceptiq AI only generates reports when sufficient public evidence can be verified."}
                  {report.scanStatus === "SCAN_FAILED" && "The scan could not be completed. Please try again later."}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer transition-colors"
                  id="error-screen-reset-btn"
                >
                  Scan Different Domain
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
            {/* Active Report Header Dashboard */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
              <div className="space-y-1">
                <button
                  onClick={handleReset}
                  className={`inline-flex items-center space-x-1 text-xs font-semibold ${
                    darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900"
                  } mb-2 cursor-pointer`}
                  id="back-to-scanner-btn"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Audit Another Website</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                  <h1 className="text-xl font-display font-extrabold tracking-tight">
                    {report.companyName} Report
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-mono">Target Domain: {report.url}</p>
              </div>

              {/* Header Mini Widgets */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-semibold">Ready Score</span>
                  <span className={`text-2xl font-display font-extrabold ${
                    typeof currentOverallScore === "number" 
                      ? (currentOverallScore >= 80 ? "text-emerald-500" : currentOverallScore >= 60 ? "text-amber-500" : "text-rose-500")
                      : "text-indigo-400"
                  }`}>
                    {typeof currentOverallScore === "number" ? `${currentOverallScore}/100` : "Unknown"}
                  </span>
                </div>
                <div className="h-8 border-l border-slate-500/15"></div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-semibold">AI Visibility</span>
                  <span className="text-2xl font-display font-extrabold text-indigo-400 block">
                    {report.executiveSummary.estimatedVisibility}%
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Grouped Enterprise Navigation System */}
            <div className="space-y-4" id="grouped-enterprise-navigation">
              {/* Category Groups (Row 1) */}
              <div className={`p-1.5 rounded-xl border flex flex-wrap gap-1.5 ${
                darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                {[
                  { id: "dashboard", label: "Dashboard", badge: "Strategic" },
                  { id: "intelligence", label: "Intelligence", badge: "Layers" },
                  { id: "insights", label: "Insights", badge: "Metrics" },
                  { id: "evidence", label: "Evidence", badge: "Trace" },
                  { id: "actions", label: "Actions", badge: "Remediation" }
                ].map((group) => {
                  const isCurrentGroup = getCategoryForTab(activeTab) === group.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => {
                        if (group.id === "dashboard") setActiveTab("overview");
                        else if (group.id === "intelligence") setActiveTab("knowledge");
                        else if (group.id === "insights") setActiveTab("recommendation");
                        else if (group.id === "evidence") setActiveTab("evidence");
                        else if (group.id === "actions") setActiveTab("improvements");
                      }}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                        isCurrentGroup
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/10"
                          : darkMode
                          ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                          : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                      }`}
                    >
                      <span>{group.label}</span>
                      <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-md ${
                        isCurrentGroup 
                          ? "bg-indigo-500 text-indigo-100" 
                          : darkMode ? "bg-slate-850 text-slate-500" : "bg-slate-200/60 text-slate-500"
                      }`}>
                        {group.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Category's Sub-Tabs (Row 2) */}
              <div className={`p-1 flex flex-wrap gap-2 border-b ${
                darkMode ? "border-slate-800" : "border-slate-200"
              }`}>
                {navGroups
                  .find((g) => g.id === getCategoryForTab(activeTab))
                  ?.items.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        id={`tab-btn-${tab.id}`}
                        className={`px-3 py-2 text-xs font-bold flex items-center space-x-2 border-b-2 -mb-[1px] transition-all cursor-pointer ${
                          isActive
                            ? "border-indigo-500 text-indigo-400"
                            : darkMode
                            ? "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
                            : "border-transparent text-slate-600 hover:text-slate-950 hover:border-slate-300"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Staged Tab Content Modules */}
            <div className="mt-6">
              {activeTab === "knowledge" && (
                <KnowledgeMap 
                  report={report} 
                  darkMode={darkMode} 
                />
              )}

              {activeTab === "evidence" && (
                <EvidenceAuditor 
                  darkMode={darkMode} 
                  evidence={report.evidence} 
                  companyName={report.companyName}
                  url={report.url}
                />
              )}

              {activeTab === "validation" && (
                <ValidationDashboard 
                  darkMode={darkMode} 
                  report={report}
                  simulatedScoreOffset={simulatedScoreOffset}
                />
              )}

              {activeTab === "overview" && (
                <ExecutiveDashboardView
                  darkMode={darkMode}
                  report={report}
                  score={currentOverallScore}
                  breakdown={currentBreakdown}
                />
              )}

              {activeTab === "decision" && (
                <DecisionDashboard
                  report={report}
                  darkMode={darkMode}
                />
              )}

              {activeTab === "visibility" && (
                <div className="space-y-6">
                  {/* Sub Tab Switcher */}
                  <div className={`flex border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <button
                      onClick={() => setVisibilitySubTab("understanding")}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
                        visibilitySubTab === "understanding"
                          ? "border-indigo-500 text-indigo-400"
                          : darkMode
                          ? "border-transparent text-slate-400 hover:text-slate-200"
                          : "border-transparent text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      AI Understanding Map (Perception Engine)
                    </button>
                    <button
                      onClick={() => setVisibilitySubTab("reasoning")}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
                        visibilitySubTab === "reasoning"
                          ? "border-indigo-500 text-indigo-400"
                          : darkMode
                          ? "border-transparent text-slate-400 hover:text-slate-200"
                          : "border-transparent text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      AI Cognitive Reasoning (How AI Thinks)
                    </button>
                    <button
                      onClick={() => setVisibilitySubTab("compatibility")}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
                        visibilitySubTab === "compatibility"
                          ? "border-indigo-500 text-indigo-400"
                          : darkMode
                          ? "border-transparent text-slate-400 hover:text-slate-200"
                          : "border-transparent text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Platform Compatibility Profile
                    </button>
                  </div>

                  {visibilitySubTab === "understanding" ? (
                    <PerceptionDashboard 
                      report={report} 
                      darkMode={darkMode} 
                    />
                  ) : visibilitySubTab === "reasoning" ? (
                    <ReasoningDashboard
                      report={report}
                      darkMode={darkMode}
                    />
                  ) : (
                    <VisibilityCard darkMode={darkMode} visibility={report.visibility} />
                  )}
                </div>
              )}

              {activeTab === "recommendation" && (
                <RecommendationDashboard 
                  report={report} 
                  darkMode={darkMode} 
                />
              )}

              {activeTab === "trust" && (
                <TrustDashboard 
                  report={report} 
                  darkMode={darkMode} 
                />
              )}

              {activeTab === "explainability" && (
                <div className="space-y-6">
                  {report.explanation ? (
                    <AiExplanationView darkMode={darkMode} explanation={report.explanation} />
                  ) : (
                    <ExplainabilityCard darkMode={darkMode} explainability={report.explainability} />
                  )}
                </div>
              )}

              {activeTab === "competitors" && (
                <CompetitiveDashboard
                  darkMode={darkMode}
                  report={report}
                  onUpdateCompetitors={(updated) => {
                    setReport({
                      ...report,
                      competitors: updated
                    });
                  }}
                />
              )}

              {activeTab === "improvements" && (
                <ImprovementCenter
                  darkMode={darkMode}
                  recommendations={report.recommendations}
                  onSimulateFix={handleSimulateFix}
                  report={report}
                />
              )}

              {activeTab === "progress" && (
                <ProgressTimeline
                  darkMode={darkMode}
                  report={report}
                  simulatedScoreOffset={simulatedScoreOffset}
                />
              )}

              {activeTab === "report" && (
                <div className="space-y-6">
                  <ExecutiveReport
                    darkMode={darkMode}
                    report={report}
                    score={currentOverallScore}
                    breakdown={currentBreakdown}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Professional Polish Status Footer */}
      <footer className={`border-t py-5 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest font-bold font-mono transition-colors duration-200 ${
        darkMode ? "bg-slate-950/60 border-slate-900 text-slate-500" : "bg-white border-slate-200 text-slate-400 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]"
      }`}>
        <div>Engine: Perceptiq Core v2.4</div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-2.5 sm:mt-0">
          <span>Token Usage: 4.2k</span>
          <span>Last Crawler Cycle: 14:22:01</span>
          <span className="text-emerald-500 flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            <span>System Operational</span>
          </span>
        </div>
      </footer>

      <ProductTour
        darkMode={darkMode}
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
}
