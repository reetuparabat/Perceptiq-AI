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
import ImprovementCenter from "./components/ImprovementCenter";
import ExecutiveReport from "./components/ExecutiveReport";
import EvidenceAuditor from "./components/EvidenceAuditor";
import AiExplanationView from "./components/AiExplanationView";
import ExecutiveDashboardView from "./components/ExecutiveDashboardView";
import { 
  BarChart3, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  CheckSquare, 
  FileText, 
  ArrowLeft,
  ShieldCheck
} from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    const saved = localStorage.getItem("perceptiq-dark-mode");
    return saved ? saved === "true" : true;
  });

  const [urlInput, setUrlInput] = React.useState("");
  const [scanning, setScanning] = React.useState(false);
  const [scanStep, setScanStep] = React.useState<string>("initiating");
  const [report, setReport] = React.useState<AIReadinessReport | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>("overview");
  const [simulatedScoreOffset, setSimulatedScoreOffset] = React.useState(0);

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
      />

      <main className="pb-24">
        {!report ? (
          <LandingScanner
            darkMode={darkMode}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            scanning={scanning}
            scanStep={scanStep}
            onScan={triggerScan}
            errorMsg={errorMsg}
          />
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

            {/* Premium Custom Tab Bar */}
            <div className={`border-b flex flex-wrap gap-2 ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
              {[
                { id: "overview", label: "Executive Dashboard", icon: Layers },
                { id: "evidence", label: "Evidence Auditor", icon: ShieldCheck },
                { id: "visibility", label: "AI Brand Perception", icon: TrendingUp },
                { id: "explainability", label: "Interpretability WHY", icon: HelpCircle },
                { id: "competitors", label: "Competitors", icon: BarChart3 },
                { id: "improvements", label: "Improvement Center", icon: CheckSquare },
                { id: "report", label: "One-Page Advisory Brief", icon: FileText },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    id={`tab-btn-${tab.id}`}
                    className={`px-4 py-3 text-xs font-semibold flex items-center space-x-2 border-b-2 -mb-[2px] transition-all cursor-pointer ${
                      isActive
                        ? "border-indigo-500 text-indigo-400"
                        : darkMode
                        ? "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Staged Tab Content Modules */}
            <div className="mt-6">
              {activeTab === "evidence" && (
                <EvidenceAuditor 
                  darkMode={darkMode} 
                  evidence={report.evidence} 
                  companyName={report.companyName}
                  url={report.url}
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

              {activeTab === "visibility" && (
                <div className="space-y-6">
                  <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
                    darkMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-950"
                  }`}>
                    <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block font-bold">Visibility Estimations Locked</strong>
                      <span className="opacity-80">This module is currently awaiting Sprint 5 Confidence & Visibility Model Integration.</span>
                    </div>
                  </div>
                  <VisibilityCard darkMode={darkMode} visibility={report.visibility} />
                </div>
              )}

              {activeTab === "explainability" && (
                <div className="space-y-6">
                  {report.explanation ? (
                    <AiExplanationView darkMode={darkMode} explanation={report.explanation} />
                  ) : (
                    <>
                      <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
                        darkMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-950"
                      }`}>
                        <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                        <div>
                          <strong className="block font-bold">Interpretability Explainers Offline</strong>
                          <span className="opacity-80">This module has gracefully fell back to high-fidelity deterministic explanations.</span>
                        </div>
                      </div>
                      <ExplainabilityCard darkMode={darkMode} explainability={report.explainability} />
                    </>
                  )}
                </div>
              )}

              {activeTab === "competitors" && (
                <div className="space-y-6">
                  <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
                    darkMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-950"
                  }`}>
                    <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block font-bold">Competitor Benchmarks Locked</strong>
                      <span className="opacity-80">This module is currently awaiting Sprint 4 competitor indexing models.</span>
                    </div>
                  </div>
                  <CompetitorBenchmark
                    darkMode={darkMode}
                    companyName={report.companyName}
                    myScores={{
                      aiReadiness: typeof currentOverallScore === "number" ? currentOverallScore : 0,
                      trust: typeof currentBreakdown.trustSignals === "number" ? currentBreakdown.trustSignals : 0,
                      content: typeof currentBreakdown.contentQuality === "number" ? currentBreakdown.contentQuality : 0,
                      visibility: typeof report.executiveSummary.estimatedVisibility === "number" ? report.executiveSummary.estimatedVisibility : 0,
                      productInfo: typeof currentBreakdown.productCompleteness === "number" ? currentBreakdown.productCompleteness : 0,
                      recommendationProbability: typeof report.executiveSummary.recommendationProbability === "number" ? report.executiveSummary.recommendationProbability : 0,
                    }}
                    initialCompetitors={report.competitors}
                  />
                </div>
              )}

              {activeTab === "improvements" && (
                <div className="space-y-6">
                  <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
                    darkMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-950"
                  }`}>
                    <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block font-bold">Action Recommendations Locked</strong>
                      <span className="opacity-80">This module is currently awaiting Sprint 6 strategic checklists mapping.</span>
                    </div>
                  </div>
                  <ImprovementCenter
                    darkMode={darkMode}
                    recommendations={report.recommendations}
                    onSimulateFix={handleSimulateFix}
                  />
                </div>
              )}

              {activeTab === "report" && (
                <div className="space-y-6">
                  <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
                    darkMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-950"
                  }`}>
                    <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block font-bold">One-Page Brief Pending Scoring</strong>
                      <span className="opacity-80">Executive advisory output is currently waiting for downstream Sprint 4 Scoring pipelines.</span>
                    </div>
                  </div>
                  <ExecutiveReport
                    darkMode={darkMode}
                    companyName={report.companyName}
                    url={report.url}
                    scannedAt={report.scannedAt}
                    summary={{
                      ...report.executiveSummary,
                      overallScore: currentOverallScore,
                    }}
                    crawlStats={report.crawlStats}
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
    </div>
  );
}
