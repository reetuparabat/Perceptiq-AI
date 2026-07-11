/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  Users,
  Search,
  Zap,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  Lightbulb,
  FileText,
  BadgeAlert,
  Activity,
  ThumbsUp,
  MapPin,
  Mail,
  Phone,
  Layers
} from "lucide-react";
import { AIReadinessReport } from "../types";
import { calculateTrust } from "../trust/engine";
import { 
  VerifiedFact, 
  AuthoritySignal, 
  TrustGap, 
  ClaimVerificationItem, 
  TrustJourneyStep, 
  TrustConfidenceArea, 
  EvidenceCoverageCategory, 
  TrustRisk, 
  TrustConsultantAdvisory 
} from "../trust/types";

interface TrustDashboardProps {
  report: AIReadinessReport;
  darkMode: boolean;
}

export default function TrustDashboard({ report, darkMode }: TrustDashboardProps) {
  const trustData = React.useMemo(() => calculateTrust(report), [report]);

  // Sub-tabs for Trust Intelligence
  const [activeSubTab, setActiveSubTab] = React.useState<"profile" | "facts" | "authority" | "advisory">("profile");
  
  // Interactive Journey State
  const [selectedJourneyStep, setSelectedJourneyStep] = React.useState<number>(6); // Default to step 6 (Authority signals checked)

  // Interactive Verified Facts filter
  const [factFilter, setFactFilter] = React.useState<"all" | "verified" | "unverified">("all");

  // Interactive Claim index selector
  const [selectedClaimIndex, setSelectedClaimIndex] = React.useState<number>(0);

  // Badges & Styles helper
  const getTrustProfileStyle = (level: string) => {
    switch (level) {
      case "Very High Trust":
        return darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "High Trust":
        return darkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Moderate Trust":
        return darkMode ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-sky-50 text-sky-700 border-sky-200";
      case "Developing Trust":
        return darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200";
      case "Low Public Trust":
        return darkMode ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getCoverageLabelStyle = (label: string) => {
    switch (label) {
      case "Excellent":
        return darkMode ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-700 bg-emerald-50";
      case "Good":
        return darkMode ? "text-indigo-400 bg-indigo-500/10" : "text-indigo-700 bg-indigo-50";
      case "Average":
        return darkMode ? "text-amber-400 bg-amber-500/10" : "text-amber-700 bg-amber-50";
      case "Needs Improvement":
        return darkMode ? "text-rose-400 bg-rose-500/10" : "text-rose-700 bg-rose-50";
      default:
        return "text-slate-500 bg-slate-50";
    }
  };

  const getSignalStatusStyle = (status: string) => {
    switch (status) {
      case "Strong":
        return darkMode ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Moderate":
        return darkMode ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" : "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Weak":
        return darkMode ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-800 border-amber-200";
      case "Missing":
        return darkMode ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getFactStatusStyle = (status: string) => {
    switch (status) {
      case "Verified":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Not Yet Verified":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getClaimStatusStyle = (status: string) => {
    switch (status) {
      case "Verified":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Partially Supported":
        return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
      case "Not Supported":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
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

  const filteredFacts = trustData.verifiedFacts.filter(fact => {
    if (factFilter === "verified") return fact.isVerified;
    if (factFilter === "unverified") return !fact.isVerified;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in" id="ai-trust-authority-intelligence-dashboard">
      
      {/* Consultant Advisory Header */}
      <div className={`p-6 rounded-2xl border transition-all ${
        darkMode 
          ? "bg-slate-900/40 border-indigo-500/20 text-slate-100" 
          : "bg-gradient-to-r from-indigo-50/50 to-sky-50/50 border-indigo-100 text-slate-800"
      }`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl shrink-0 ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
            <Shield className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-display font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5">
              <span>AI Trust & Authority Intelligence Engine</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider ${
                darkMode ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-800"
              }`}>Sprint 4</span>
            </h2>
            <p className="text-xs leading-relaxed opacity-90 max-w-4xl">
              Can conversational AI bots trust your business enough to refer you? This engine processes your public profile and maps out verified operational facts, authority signals, and promotion claims. Rather than generating a general score, it separates what is fully verified from what remains unverified due to lack of public evidence.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sub-Tabs */}
      <div className={`flex border-b text-xs ${darkMode ? "border-slate-800" : "border-slate-200"}`} id="trust-tabs">
        <button
          onClick={() => setActiveSubTab("profile")}
          className={`px-4 py-2.5 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "profile"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Executive Profile & Journey</span>
        </button>
        <button
          onClick={() => setActiveSubTab("facts")}
          className={`px-4 py-2.5 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "facts"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>Fact & Claim Auditor</span>
        </button>
        <button
          onClick={() => setActiveSubTab("authority")}
          className={`px-4 py-2.5 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "authority"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Authority & Coverage</span>
        </button>
        <button
          onClick={() => setActiveSubTab("advisory")}
          className={`px-4 py-2.5 font-bold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === "advisory"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5" />
          <span>Gaps, Risks & Advisory</span>
        </button>
      </div>

      {/* Sub-tab 1: Profile & Journey */}
      {activeSubTab === "profile" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: AI Trust Profile Card */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 1: AI Trust Profile
                </span>
                
                <div className="flex items-center space-x-3">
                  <div className={`px-4 py-2 text-md font-display font-black rounded-xl border ${getTrustProfileStyle(trustData.trustProfile)}`}>
                    {trustData.trustProfile}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-500">
                  {trustData.profileReason}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-500/10 space-y-1 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Profile Criteria</span>
                <p className="text-[11px] text-slate-500">Calculated deterministically based on primary identity coordinates, registered domain, and active policy files.</p>
              </div>
            </div>

            {/* Feature 11: Trust Executive Summary Card */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between bg-gradient-to-br ${
              darkMode 
                ? "from-indigo-950/20 via-slate-900/30 to-slate-900/40 border-indigo-500/10 text-slate-100" 
                : "from-indigo-50/20 via-sky-50/20 to-white border-indigo-100 text-slate-800"
            }`}>
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 11: Trust Executive Summary
                </span>

                <p className="text-xs leading-relaxed font-serif italic text-slate-500">
                  "{trustData.summary.executiveSummaryText}"
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-500/10 space-y-2 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Key trust highlights:</span>
                <ul className="space-y-1">
                  {trustData.summary.coreStrengths.slice(0, 2).map((strength, i) => (
                    <li key={i} className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 10: Trust Consultant Highlights */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
              darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 10: Consultant Insights
                </span>
                
                {trustData.advisory.slice(0, 1).map((adv, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-xs font-bold font-display text-indigo-400">
                      {adv.observation}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {adv.reason}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-500/5 p-3 rounded-xl border border-slate-500/10">
                      <strong className="text-indigo-400 font-bold block mb-1">Strategic Remedy:</strong>
                      {adv.suggestedImprovement}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-500/10 text-xs flex justify-between items-center text-slate-500">
                <span className="font-mono text-[9px] uppercase">Est. Benefit</span>
                <span className="text-emerald-500 font-bold font-mono">Maximum Verification Confidence</span>
              </div>
            </div>

          </div>

          {/* Feature 6: Trust Journey Timeline */}
          <div className={`p-6 rounded-2xl border ${
            darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
          }`}>
            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 6: AI Trust Journey (Reasoning Pathway)
              </span>
              <h3 className="text-sm font-bold font-display">
                How Search bots build trust in your website
              </h3>
              <p className="text-xs text-slate-500">
                AI systems compile trust incrementally. Select any stage along the path to evaluate how well your website validates its credentials.
              </p>
            </div>

            {/* Timline steps rail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {trustData.journeySteps.map((step) => {
                const isSelected = selectedJourneyStep === step.stepNumber;
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setSelectedJourneyStep(step.stepNumber)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between h-28 ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20"
                        : darkMode
                        ? "border-slate-800 bg-slate-900/10 hover:bg-slate-800/30 hover:border-slate-700"
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
                      <span className={`text-[9px] font-mono uppercase block ${
                        step.status === "completed" 
                          ? "text-emerald-400" 
                          : step.status === "active" 
                          ? "text-indigo-400 font-bold" 
                          : "text-slate-500"
                      }`}>
                        {step.status === "completed" ? "Verified" : step.status === "active" ? "Auditing" : "Locked"}
                      </span>
                      <span className="text-xs font-bold font-display line-clamp-1 block">
                        {step.stepName}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-indigo-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active timeline detailed panel */}
            <div className={`mt-6 p-5 rounded-xl border ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/50 border-slate-100"
            }`}>
              {(() => {
                const activeStep = trustData.journeySteps.find(s => s.stepNumber === selectedJourneyStep);
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
                          Stage {activeStep.stepNumber} • {activeStep.status.toUpperCase()}
                        </span>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">WHAT OCCURS AT THIS STAGE?</h4>
                      </div>
                      <p className="text-xs font-display font-extrabold text-indigo-500 dark:text-indigo-400 text-sm">
                        {activeStep.stepName}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-500 max-w-4xl">
                        {activeStep.whatHappened}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[9px] text-slate-500 uppercase block font-mono">Cognitive Method</span>
                      <span className="text-xs font-bold font-mono">Semantic Entity Match</span>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      )}

      {/* Sub-tab 2: Facts & Claims */}
      {activeSubTab === "facts" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Feature 2: Verified Business Facts */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 2: Verified Business Facts Auditor
                </span>
                <h3 className="text-sm font-bold font-display">
                  Verification Records Map (Excludes Assumptions)
                </h3>
                <p className="text-xs text-slate-500">
                  We check your page copy for absolute confirmation of trading variables. Things not found are clearly indicated.
                </p>
              </div>

              {/* Filtering tabs */}
              <div className={`p-1.5 rounded-xl border flex space-x-1.5 text-xs ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <button
                  onClick={() => setFactFilter("all")}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    factFilter === "all" ? "bg-indigo-500 text-white font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  All ({trustData.verifiedFacts.length})
                </button>
                <button
                  onClick={() => setFactFilter("verified")}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    factFilter === "verified" ? "bg-indigo-500 text-white font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Verified ({trustData.verifiedFacts.filter(f => f.isVerified).length})
                </button>
                <button
                  onClick={() => setFactFilter("unverified")}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    factFilter === "unverified" ? "bg-indigo-500 text-white font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Unverified ({trustData.verifiedFacts.filter(f => !f.isVerified).length})
                </button>
              </div>
            </div>

            {/* Facts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFacts.map((fact, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    darkMode ? "bg-slate-900/30 border-slate-800 hover:border-slate-700" : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold font-display text-slate-800 dark:text-slate-200">
                        {fact.factName}
                      </h4>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${getFactStatusStyle(fact.status)}`}>
                        {fact.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {fact.reason}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-500/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Source: <strong className="text-indigo-400 font-normal">{fact.evidenceSource}</strong></span>
                    <span>Confidence: <strong className={fact.confidence === "High" ? "text-emerald-500" : "text-slate-400"}>{fact.confidence}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className={darkMode ? "border-slate-800/80" : "border-slate-200"} />

          {/* Feature 5: Claim Verification */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 5: Claim Verification Auditor
              </span>
              <h3 className="text-sm font-bold font-display">
                Promotional & Qualitative Claims Evaluator
              </h3>
              <p className="text-xs text-slate-500">
                To guarantee zero bias or halluncinated accusations, Perceptiq checks marketing statements against public evidence and classifies support.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Claims sidebar */}
              <div className="lg:col-span-5 space-y-2">
                {trustData.claims.map((claim, idx) => {
                  const isSelected = selectedClaimIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedClaimIndex(idx)}
                      className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/5 text-indigo-400 font-bold"
                          : darkMode
                          ? "border-slate-800 bg-slate-900/10 hover:bg-slate-800/30 hover:border-slate-700"
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 shadow-sm"
                      }`}
                    >
                      <span className="text-xs line-clamp-1 pr-4">{claim.claimText}</span>
                      <span className={`text-[9px] shrink-0 font-mono font-bold px-2 py-0.5 rounded-full border ${getClaimStatusStyle(claim.classification)}`}>
                        {claim.classification}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active claim details display */}
              <div className="lg:col-span-7">
                {(() => {
                  const claim = trustData.claims[selectedClaimIndex];
                  if (!claim) return null;
                  return (
                    <div className={`p-6 rounded-2xl border space-y-6 ${
                      darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                    }`}>
                      <div className="border-b border-slate-500/10 pb-4 flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Claims Profile</span>
                          <h4 className="text-xs font-bold font-display italic text-slate-400">
                            "{claim.claimText}"
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 uppercase font-mono block">AI Support Rating</span>
                          <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded border ${getClaimStatusStyle(claim.classification)}`}>
                            {claim.classification}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] uppercase font-mono block text-slate-500 font-bold">What evidence was found:</span>
                          <p className="text-slate-500 leading-relaxed text-[11px]">{claim.evidenceFound}</p>
                        </div>

                        <div className="space-y-1 text-xs bg-slate-500/5 p-4 rounded-xl border border-slate-500/10">
                          <span className="text-[10px] uppercase font-mono text-indigo-400 block font-bold flex items-center gap-1.5 mb-1">
                            <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            <span>AI Diagnostic Explanation</span>
                          </span>
                          <p className="text-slate-500 leading-relaxed text-[11px]">{claim.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Sub-tab 3: Authority & Coverage */}
      {activeSubTab === "authority" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Feature 8 & Feature 7 Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Feature 8: Public Evidence Coverage List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 8: Public Evidence Coverage
                </span>
                <h3 className="text-sm font-bold font-display">
                  Crawl Coverage Indices
                </h3>
                <p className="text-xs text-slate-500">
                  These labels represent the completeness of public details harvested per category.
                </p>
              </div>

              <div className="space-y-3">
                {trustData.evidenceCoverage.map((cov, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold font-display block">{cov.categoryName}</span>
                      <span className="text-[10px] text-slate-500 block">{cov.reason}</span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getCoverageLabelStyle(cov.coverageLabel)}`}>
                      {cov.coverageLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 7: Separate Trust Confidence Areas */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 7: Separate Trust Confidence
                </span>
                <h3 className="text-sm font-bold font-display">
                  Targeted Area Confidence Metrics
                </h3>
                <p className="text-xs text-slate-500">
                  Review how confident search bots are about separate sectors of your business operations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trustData.confidenceAreas.map((area, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold font-display">{area.areaName}</span>
                        <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${
                          area.confidenceLevel === "High" 
                            ? "text-emerald-500 bg-emerald-500/10" 
                            : area.confidenceLevel === "Medium" 
                            ? "text-amber-500 bg-amber-500/10" 
                            : "text-rose-500 bg-rose-500/10"
                        }`}>
                          {area.confidenceLevel} Confidence
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">{area.reason}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-500/10 text-[10px] text-slate-500 space-y-1">
                      <div><strong className="text-indigo-400 font-normal uppercase font-mono text-[9px]">Evidence:</strong> {area.evidence}</div>
                      <div><strong className="text-rose-400 font-normal uppercase font-mono text-[9px]">Uncertainty Risk:</strong> {area.uncertainty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <hr className={darkMode ? "border-slate-800/80" : "border-slate-200"} />

          {/* Feature 3: Authority Signals */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 3: Authority Signals Checklist
              </span>
              <h3 className="text-sm font-bold font-display">
                Authority Signal Diagnostics
              </h3>
              <p className="text-xs text-slate-500">
                These signals directly dictate how heavily conversational search engines favor your page copy for general competitive questions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trustData.authoritySignals.map((signal, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    darkMode ? "bg-slate-900/30 border-slate-800 hover:border-slate-700" : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold font-display leading-tight">{signal.signalName}</span>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded shrink-0 ${getSignalStatusStyle(signal.status)}`}>
                        {signal.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      <strong className="font-semibold block text-slate-500 mb-0.5 uppercase font-mono text-[9px]">Why it matters:</strong>
                      {signal.whyItMatters}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-500/10 text-[10px] text-slate-500 leading-tight">
                    <span className="text-indigo-400 font-normal block font-mono uppercase text-[9px] mb-0.5">Crawler Match:</span>
                    <p className="italic text-slate-500">"{signal.evidence}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Sub-tab 4: Gaps, Risks & Advisory */}
      {activeSubTab === "advisory" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Feature 10: Complete Trust Advisory */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Feature 10: Trust Consultant Comprehensive Advisory
              </span>
              <h3 className="text-sm font-bold font-display">
                Strategic Consulting Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Actionable guidelines from our expert advisory framework. Execute these steps to maximize your recommendation rates.
              </p>
            </div>

            <div className="space-y-4">
              {trustData.advisory.map((adv, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-500/10 pb-3 mb-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Consultant Observation</span>
                      <h4 className="text-xs font-bold font-display text-sm text-indigo-400">
                        {adv.observation}
                      </h4>
                    </div>
                    
                    <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Actionable Guideline
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-xs text-slate-500 leading-relaxed">
                    <div>
                      <strong className="text-[9px] uppercase font-mono text-slate-500 block mb-0.5">Diagnostic Reason:</strong>
                      <p className="text-slate-500 text-[11px]">{adv.reason}</p>
                    </div>

                    <div>
                      <strong className="text-[9px] uppercase font-mono text-slate-500 block mb-0.5">AI Search Impact:</strong>
                      <p className="text-slate-500 text-[11px]">{adv.businessImpact}</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
                    darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/50 border-slate-100"
                  }`}>
                    <div className="md:col-span-8 text-xs text-slate-500 leading-relaxed">
                      <strong className="text-[9px] uppercase font-mono text-indigo-400 block flex items-center gap-1 mb-1">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                        <span>How to improve your website:</span>
                      </strong>
                      <p className="text-slate-500 text-[11px]">{adv.suggestedImprovement}</p>
                    </div>

                    <div className="md:col-span-4 text-right border-t md:border-t-0 md:border-l border-slate-500/10 pt-3 md:pt-0 md:pl-4">
                      <span className="text-[9px] text-slate-500 uppercase block font-mono">Expected Outcome</span>
                      <strong className="text-xs font-bold text-emerald-500">{adv.expectedBenefit}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className={darkMode ? "border-slate-800/80" : "border-slate-200"} />

          {/* Feature 4 & Feature 9 Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Feature 4: Trust Gaps */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 4: Structural Trust Gaps
                </span>
                <h3 className="text-sm font-bold font-display">
                  Identified Structural trust voids
                </h3>
                <p className="text-xs text-slate-500">
                  These missing variables on your website prevent search crawlers from establishing high confidence.
                </p>
              </div>

              <div className="space-y-4">
                {trustData.trustGaps.map((gap, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-rose-500 font-bold text-xs font-display">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{gap.gapName}</span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-500 leading-relaxed">
                        <div>
                          <strong className="text-[9px] uppercase font-mono text-slate-500 block">Why AI expects this:</strong>
                          <p className="text-slate-500 text-[11px]">{gap.whyExpected}</p>
                        </div>
                        <div>
                          <strong className="text-[9px] uppercase font-mono text-slate-500 block">Crawler Exclusion Impact:</strong>
                          <p className="text-slate-500 text-[11px]">{gap.businessImpact}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 p-3 rounded-lg border text-xs space-y-1 ${
                      darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/50 border-slate-100"
                    }`}>
                      <strong className="text-[9px] uppercase font-mono text-indigo-400 block flex items-center gap-1">
                        <Lightbulb className="h-3 w-3 shrink-0" />
                        <span>Actionable improvement:</span>
                      </strong>
                      <p className="text-slate-500 text-[11px]">{gap.howToImprove}</p>
                      <div className="text-[9px] text-emerald-500 font-bold font-mono pt-1">
                        Expected lift: {gap.expectedImprovement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 9: AI Trust Risks */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                  Feature 9: AI Trust & Consistency Risks
                </span>
                <h3 className="text-sm font-bold font-display">
                  Search Crawler Trust Risks
                </h3>
                <p className="text-xs text-slate-500">
                  Potential items that reduce AI's verification status and favor competitors.
                </p>
              </div>

              <div className="space-y-4">
                {trustData.risks.map((risk, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      darkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold font-display text-rose-500 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{risk.riskName}</span>
                        </h4>
                        
                        <span className={`text-[9px] font-bold font-mono px-2.5 py-0.5 rounded border ${getPriorityStyle(risk.priority)}`}>
                          {risk.priority} Priority
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-500 leading-relaxed">
                        <div>
                          <strong className="text-[9px] uppercase font-mono text-slate-500 block">Risk Condition:</strong>
                          <p className="text-slate-500 text-[11px]">{risk.reason}</p>
                        </div>
                        <div>
                          <strong className="text-[9px] uppercase font-mono text-slate-500 block">AI Recommendation Impact:</strong>
                          <p className="text-slate-500 text-[11px]">{risk.businessImpact}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 p-3 rounded-lg border text-[11px] text-slate-500 leading-relaxed ${
                      darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/50 border-slate-100"
                    }`}>
                      <strong className="text-[9px] uppercase font-mono text-indigo-400 block flex items-center gap-1 mb-0.5">
                        <Zap className="h-3 w-3 text-indigo-400 shrink-0" />
                        <span>Recommended action plan:</span>
                      </strong>
                      {risk.suggestedImprovement}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
