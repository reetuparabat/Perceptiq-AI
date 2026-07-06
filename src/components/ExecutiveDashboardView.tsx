/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AIReadinessReport, ExplanationResponse } from "../types";
import { 
  ShieldCheck, 
  Award, 
  Clock, 
  Compass, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle as HelpIcon, 
  Info,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

interface ExecutiveDashboardViewProps {
  darkMode: boolean;
  report: AIReadinessReport;
  score: number | string;
  breakdown: any;
  onSimulateFix?: (offset: number) => void;
}

// Map evidence key to a friendly label, a corporate reason, and its specific business impact
interface EvidenceDetailMap {
  label: string;
  businessImpact: string;
}

const EVIDENCE_DETAILS: Record<string, EvidenceDetailMap> = {
  businessName: {
    label: "Official Business Name Verification",
    businessImpact: "Allows conversational AI systems to link online reviews, social media sentiment, and corporate entity registrations."
  },
  businessDescriptions: {
    label: "Corporate Business Descriptions",
    businessImpact: "Provides necessary high-context brand narratives for AI search bots to summarize what your company does and who it serves."
  },
  phone: {
    label: "Corporate Contact Telephone Number",
    businessImpact: "Used by AI trustworthiness and fraud-prevention modules to verify your business as a legitimate operating merchant."
  },
  email: {
    label: "Corporate Contact Email Address",
    businessImpact: "Establishes a transparent communication point required for automated transaction safety filters."
  },
  address: {
    label: "Physical Headquarters Location",
    businessImpact: "Crucial for local and regional search recommendation engines to match proximity query criteria for buyers."
  },
  productsFound: {
    label: "Product Catalog Discovery",
    businessImpact: "Allows AI assistants to map your full range of offerings into correct AI query taxonomies."
  },
  servicesFound: {
    label: "Core Services Registry",
    businessImpact: "Helps intent-recognition bots categorize and surface service offerings for custom requests."
  },
  productTitles: {
    label: "Verified Product Titles",
    businessImpact: "The key identifier AI shopping agents utilize to match exact consumer brand searches."
  },
  productSpecifications: {
    label: "Product Specifications Table",
    businessImpact: "The primary source of attribute data (dimensions, materials) used by agents to compare and filter products."
  },
  faqQuestions: {
    label: "FAQ Questions Discovered",
    businessImpact: "Directly populates conversational answer caches, helping AI assistants address buyer pre-purchase objections."
  },
  shippingInfo: {
    label: "Shipping Information Policy",
    businessImpact: "AI search engines verify shipping timelines and costs to ensure buyers receive competitive and transparent fulfillment options."
  },
  returnPolicy: {
    label: "Refund & Return Policy",
    businessImpact: "Clear purchase protection structures are heavily weighted by safety-checks looking to minimize risk recommendations."
  },
  warranty: {
    label: "Product Warranty Parameters",
    businessImpact: "A high-trust signal that comparison shopping bots utilize to select premium recommended products."
  },
  certificates: {
    label: "Security & Trust Compliance Certificates",
    businessImpact: "Increases merchant reliability scores, avoiding systemic safety-policy exclusions."
  },
  pricingInfo: {
    label: "Public Pricing Indicators",
    businessImpact: "Required for automated pricing engines and comparative budget filters in chat search models."
  },
  imagesCount: {
    label: "Product Visual Media Items",
    businessImpact: "Verifies visual catalog coverage necessary for next-generation multi-modal conversational shopping interfaces."
  },
  detectedLanguages: {
    label: "System Multi-Lingual Locales",
    businessImpact: "Enables international AI models to index and serve your brand accurately across multiple language requests."
  }
};

export default function ExecutiveDashboardView({
  darkMode,
  report,
  score,
  breakdown,
  onSimulateFix
}: ExecutiveDashboardViewProps) {
  
  const numericScore = typeof score === "number" ? score : 0;
  
  // Format Scan Date
  const formattedScanTime = React.useMemo(() => {
    try {
      return new Date(report.scannedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short"
      });
    } catch {
      return report.scannedAt;
    }
  }, [report.scannedAt]);

  // Determine overall readiness business tier
  const businessStatus = React.useMemo(() => {
    if (numericScore >= 80) return { label: "Optimal Readiness", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    if (numericScore >= 60) return { label: "Requires Advisory", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    return { label: "Critical High-Risk", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
  }, [numericScore]);

  // Aggregate Category breakdown details for Section 2
  const categories = React.useMemo(() => {
    const list = [
      {
        id: "structuredData",
        label: "AI Understanding",
        score: breakdown.structuredData,
        confidence: report.confidence?.categories.productInformation?.level || "Medium",
        desc: "Structured schemas, technical tables, and catalog microdata parsed by search bots.",
        evidenceStatus: report.evidence?.productSpecifications.status === "Found" ? "Verified" : "Action Needed"
      },
      {
        id: "authority",
        label: "Business Presence",
        score: breakdown.authority,
        confidence: "High", // Authority is high confidence
        desc: "External brand reach, mentions, backlinks, and index citations.",
        evidenceStatus: report.evidence?.businessName.status === "Found" ? "Verified" : "Action Needed"
      },
      {
        id: "technicalHealth",
        label: "Website Reliability",
        score: breakdown.technicalHealth,
        confidence: "High",
        desc: "SSL secure status, crawler block policies, and response latencies.",
        evidenceStatus: report.evidence?.pagesCrawled.some(p => p.status === "Success") ? "Verified" : "Action Needed"
      },
      {
        id: "trustSignals",
        label: "Business Trust",
        score: breakdown.trustSignals,
        confidence: report.confidence?.categories.businessTrust?.level || "Medium",
        desc: "Refund policies, physical locations, corporate verification guidelines.",
        evidenceStatus: report.evidence?.policies.returnPolicy.status === "Found" ? "Verified" : "Unknown"
      },
      {
        id: "contentQuality",
        label: "Customer Support",
        score: breakdown.contentQuality,
        confidence: report.confidence?.categories.customerSupport?.level || "Medium",
        desc: "FAQ depth, customer service protocols, and clear pre-purchase content.",
        evidenceStatus: report.evidence?.faqQuestions.status === "Found" ? "Verified" : "Unknown"
      }
    ];
    return list;
  }, [breakdown, report.confidence, report.evidence]);

  // Extract separated evidence states for Section 3
  const evidenceSummary = React.useMemo(() => {
    const verified: { label: string; reason: string; businessImpact: string }[] = [];
    const missing: { label: string; reason: string; businessImpact: string }[] = [];
    const unknown: { label: string; reason: string; businessImpact: string }[] = [];

    const checkItem = (key: string, item: any, defaultLabel: string) => {
      const details = EVIDENCE_DETAILS[key] || { label: defaultLabel, businessImpact: "General credibility signal." };
      if (!item) {
        unknown.push({
          label: details.label,
          reason: "Scope unverified during the diagnostic automated catalog sweep.",
          businessImpact: details.businessImpact
        });
        return;
      }

      if (item.status === "Found" || item.status === "Success") {
        verified.push({
          label: details.label,
          reason: `Verified in active crawler index on page: ${item.sourcePage || "Multiple Pages"}.`,
          businessImpact: details.businessImpact
        });
      } else if (item.status === "Not Found" || item.status === "Failed") {
        missing.push({
          label: details.label,
          reason: "No matching text, semantic schema, or catalog markup detected during page scrape.",
          businessImpact: details.businessImpact
        });
      } else {
        unknown.push({
          label: details.label,
          reason: "Target not fully analyzed inside basic crawler boundary parameters.",
          businessImpact: details.businessImpact
        });
      }
    };

    if (report.evidence) {
      const ev = report.evidence;
      checkItem("businessName", ev.businessName, "Business Identity Name");
      checkItem("businessDescriptions", ev.businessDescriptions, "Company Bio Narrative");
      checkItem("phone", ev.contactInfo.phone, "Support Phone Line");
      checkItem("email", ev.contactInfo.email, "Corporate Email Address");
      checkItem("address", ev.contactInfo.address, "Corporate Physical Headquarters");
      checkItem("productsFound", ev.productsFound, "Catalog Index Count");
      checkItem("servicesFound", ev.servicesFound, "Service Scope Descriptions");
      checkItem("productTitles", ev.productTitles, "Standard Product Headings");
      checkItem("productSpecifications", ev.productSpecifications, "Attribute Technical Spec Sheets");
      checkItem("faqQuestions", ev.faqQuestions, "Interactive FAQ Content Block");
      checkItem("shippingInfo", ev.policies.shippingInfo, "Shipping Guidelines Page");
      checkItem("returnPolicy", ev.policies.returnPolicy, "Refund & Money Back Page");
      checkItem("warranty", ev.policies.warranty, "Product Guarantee Details");
      checkItem("certificates", ev.trustSignals.certificates, "Trust Badges & Regulatory Marks");
      checkItem("pricingInfo", ev.pricingInfo, "Retail Pricing Information");
    }

    return { verified, missing, unknown };
  }, [report.evidence]);

  // Sort and filter recommendations for Section 4
  const priorityRecommendations = React.useMemo(() => {
    // If we have AI priority recommendations from explanation, use them. Otherwise format deterministic templates.
    if (report.explanation?.priorityImprovements && report.explanation.priorityImprovements.length > 0) {
      return report.explanation.priorityImprovements;
    }

    // Fallback deterministic templates that are 100% evidence-backed and comply with absolute safety constraints
    const list = [];
    const ev = report.evidence;

    if (ev?.productSpecifications.status === "Not Found") {
      list.push({
        priority: "High" as const,
        problem: "Missing Attribute Specification Sheets",
        supportingEvidence: "Product specifications status is recorded as 'Not Found'.",
        businessImpact: "AI comparison filters may have limited ability to match products without standard specs.",
        suggestedAction: "Format your specifications sheet into clean semantic HTML tables in the main description panel.",
        expectedImprovement: "Is likely to improve product comparison indexing rates."
      });
    }

    if (ev?.policies.returnPolicy.status === "Not Found") {
      list.push({
        priority: "High" as const,
        problem: "Unverified Refund Policy Protocol",
        supportingEvidence: "Refund & return policy status is recorded as 'Not Found'.",
        businessImpact: "AI engines may flag merchant credibility risks due to missing guarantees.",
        suggestedAction: "Publish an explicit, structured refund policy link prominently inside the footer layout.",
        expectedImprovement: "May improve overall trust verification scores."
      });
    }

    if (ev?.faqQuestions.status === "Not Found" || (ev?.faqQuestions.value?.length || 0) < 3) {
      list.push({
        priority: "Medium" as const,
        problem: "Insufficient Pre-Purchase FAQ Content",
        supportingEvidence: "Fewer than 3 interactive FAQ items detected on active crawl pages.",
        businessImpact: "AI models may have restricted source answers to address consumer pre-sale queries.",
        suggestedAction: "Implement a dedicated FAQ section with questions framed in conversational buyer voice.",
        expectedImprovement: "Can improve voice-search discovery consistency."
      });
    }

    if (ev?.contactInfo.phone.status === "Not Found" || ev?.contactInfo.address.status === "Not Found") {
      list.push({
        priority: "Medium" as const,
        problem: "Incomplete Offline Merchant Trust Anchors",
        supportingEvidence: "Corporate telephone or physical headquarters address missing.",
        businessImpact: "Safety algorithms may classify the transaction index as unverified or higher risk.",
        suggestedAction: "List official address and phone contact details in structured text blocks.",
        expectedImprovement: "Helps to establish clear merchant validation tags."
      });
    }

    // Always sort High -> Medium -> Low
    const sorted = [...list].sort((a, b) => {
      const map = { High: 3, Medium: 2, Low: 1 };
      return map[b.priority] - map[a.priority];
    });

    return sorted;
  }, [report.evidence, report.explanation]);

  const getPriorityColor = (priority: string) => {
    const val = priority.toLowerCase();
    if (val === "high") {
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    }
    if (val === "medium") {
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
    return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  };

  const getScoreBadgeColor = (val: number | string) => {
    if (typeof val !== "number") return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    if (val >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (val >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="space-y-8" id="executive-dashboard-view">
      
      {/* 1. EXECUTIVE OVERVIEW */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/40 border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 mb-6 border-b border-slate-500/10">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-500 font-bold">
              01. Executive Overview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-level strategic analysis and composite AI readiness index.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 bg-slate-500/5 px-2.5 py-1 rounded-lg">
            <Clock className="h-3.5 w-3.5" />
            <span>Analyzed At: {formattedScanTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main score dial */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className={`${darkMode ? "stroke-slate-800" : "stroke-slate-100"} fill-none`}
                  strokeWidth="8"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="fill-none transition-all duration-1000 ease-out"
                  strokeDasharray={389.5}
                  strokeDashoffset={389.5 - (389.5 * numericScore) / 100}
                  strokeLinecap="round"
                  strokeWidth="8"
                  stroke={numericScore >= 80 ? "#10b981" : numericScore >= 60 ? "#f59e0b" : "#f43f5e"}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-black tracking-tight leading-none">
                  {score}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Readiness Index
                </span>
              </div>
            </div>
            
            <div className={`mt-3 text-[10px] font-mono font-bold px-3 py-0.5 rounded-full border ${businessStatus.color}`}>
              {businessStatus.label}
            </div>
          </div>

          {/* Strategic Overview Meta Panels */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Evidence Confidence</span>
                <span className={`text-lg font-display font-black block mt-1 ${
                  report.confidence?.confidenceLevel === "High" ? "text-emerald-500" : report.confidence?.confidenceLevel === "Medium" ? "text-amber-500" : "text-rose-500"
                }`}>
                  {report.confidence?.confidenceLevel || "Medium"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Score: {report.confidence?.confidenceScore || 50}%</span>
              </div>

              <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Evidence Coverage</span>
                <span className="text-lg font-display font-black text-indigo-400 block mt-1">
                  {report.evidenceCoverage}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Verified Markers</span>
              </div>

              <div className={`p-4 rounded-xl border text-center col-span-2 sm:col-span-1 ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">Scanned Touchpoints</span>
                <span className="text-lg font-display font-black text-slate-400 block mt-1">
                  {report.crawlStats.pagesCrawled + report.crawlStats.imageCount} Nodes
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{report.crawlStats.pagesCrawled} HTML / {report.crawlStats.imageCount} Images</span>
              </div>

            </div>

            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              darkMode ? "bg-slate-950/30 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-700 font-medium"
            }`}>
              <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-500 block mb-1 font-bold">Executive Synopsis</span>
              {report.executiveSummary.textSummary}
            </div>
          </div>
        </div>
      </div>

      {/* 2. BUSINESS READINESS BREAKDOWN */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-500 font-bold">
            02. Business Readiness Breakdown
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key brand perception categories evaluated deterministically from verified business evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-sm ${
                darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-display font-bold text-xs ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
                    {cat.label}
                  </span>
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded border ${getScoreBadgeColor(cat.score)}`}>
                    {cat.score}/100
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 mt-1.5">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-500/10 flex flex-wrap gap-2 items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center space-x-1">
                  <span>Conf:</span>
                  <span className={cat.confidence === "High" ? "text-emerald-500" : "text-amber-500"}>{cat.confidence}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Status:</span>
                  <span className={cat.evidenceStatus === "Verified" ? "text-emerald-500" : "text-slate-500"}>{cat.evidenceStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. EVIDENCE SUMMARY */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="pb-4 mb-6 border-b border-slate-500/10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-500 font-bold">
            03. Evidence Summary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Durable traceability mapping. Verify discovered markers against crawl indexes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Verified List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Verified Evidence ({evidenceSummary.verified.length})
              </h3>
            </div>
            
            <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {evidenceSummary.verified.length > 0 ? (
                evidenceSummary.verified.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all hover:translate-x-1 ${
                      darkMode ? "bg-emerald-500/5 border-emerald-500/10" : "bg-emerald-50/20 border-emerald-100"
                    }`}
                  >
                    <span className={`font-bold block ${darkMode ? "text-slate-200" : "text-slate-950"}`}>
                      {item.label}
                    </span>
                    <p className="text-[11px] text-slate-500 font-mono leading-relaxed">{item.reason}</p>
                    <div className="pt-1.5 border-t border-dashed border-slate-500/10 text-[11px] leading-relaxed text-slate-500">
                      <strong className={`font-semibold mr-1 ${darkMode ? "text-emerald-400" : "text-emerald-800"}`}>Business Value:</strong>
                      {item.businessImpact}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No verified items detected.</p>
              )}
            </div>
          </div>

          {/* Missing List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Missing Evidence ({evidenceSummary.missing.length})
              </h3>
            </div>

            <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {evidenceSummary.missing.length > 0 ? (
                evidenceSummary.missing.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all hover:translate-x-1 ${
                      darkMode ? "bg-rose-500/5 border-rose-500/10" : "bg-rose-50/20 border-rose-100"
                    }`}
                  >
                    <span className={`font-bold block ${darkMode ? "text-slate-200" : "text-slate-950"}`}>
                      {item.label}
                    </span>
                    <p className="text-[11px] text-slate-500 font-mono leading-relaxed">{item.reason}</p>
                    <div className="pt-1.5 border-t border-dashed border-slate-500/10 text-[11px] leading-relaxed text-slate-500">
                      <strong className={`font-semibold mr-1 ${darkMode ? "text-rose-400" : "text-rose-800"}`}>Business Danger:</strong>
                      {item.businessImpact}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No missing items detected (All verified).</p>
              )}
            </div>
          </div>

          {/* Unknown List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Unverified / Unknown ({evidenceSummary.unknown.length})
              </h3>
            </div>

            <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {evidenceSummary.unknown.length > 0 ? (
                evidenceSummary.unknown.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all hover:translate-x-1 ${
                      darkMode ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className={`font-bold block ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {item.label}
                    </span>
                    <p className="text-[11px] text-slate-500 font-mono leading-relaxed">{item.reason}</p>
                    <div className="pt-1.5 border-t border-dashed border-slate-500/10 text-[11px] leading-relaxed text-slate-500">
                      <strong className="font-semibold text-slate-500 mr-1">Suggested Advisory Action:</strong>
                      Review whether this attribute is configured in standard metadata containers.
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No unknown categories inside active audit.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 4. PRIORITY IMPROVEMENTS */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="pb-4 mb-6 border-b border-slate-500/10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-500 font-bold">
            04. Prioritized Recommendations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evidence-backed improvements mapped conservatively. No speculative estimates or ranking promises.
          </p>
        </div>

        <div className="space-y-4">
          {priorityRecommendations.length > 0 ? (
            priorityRecommendations.map((rec, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-xl border transition-all ${
                  darkMode ? "bg-slate-950/30 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-100 hover:shadow-sm"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-500/10 pb-3 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-700"}`}>
                      Item 0{idx+1}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(rec.priority)}`}>
                      Priority {rec.priority}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Source: Deterministic Trace Validation
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 font-bold block mb-0.5">
                        Identified Gap
                      </span>
                      <p className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
                        {rec.problem}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                        Supporting Evidence Reference
                      </span>
                      <p className="text-slate-500 font-mono leading-relaxed">
                        {rec.supportingEvidence}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold block mb-0.5">
                        Business Implication
                      </span>
                      <p className={`opacity-85 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-650"}`}>
                        {rec.businessImpact}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 font-bold block mb-0.5">
                        Suggested Action
                      </span>
                      <p className={`opacity-85 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-650"}`}>
                        {rec.suggestedAction}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`mt-3.5 pt-3.5 border-t border-dashed border-slate-500/10 flex items-center space-x-2 text-xs ${
                  darkMode ? "text-emerald-400" : "text-emerald-800 font-semibold"
                }`}>
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span>Expected Value Unlocked: <span className="underline">{rec.expectedImprovement}</span></span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-xs text-slate-500 italic">
              All categories fully optimized. No critical gaps identified.
            </div>
          )}
        </div>
      </div>

      {/* 5. AI BUSINESS EXPLANATION */}
      {report.explanation ? (
        <div className={`p-6 rounded-2xl border ${
          darkMode 
            ? "bg-slate-900/40 border-indigo-500/15 shadow-[0_4px_20px_rgba(99,102,241,0.05)]" 
            : "bg-indigo-50/10 border-indigo-200 shadow-sm"
        }`} id="sprint6-ai-explanation-view">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 mb-5 border-b border-indigo-500/10">
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 rounded-lg ${darkMode ? "bg-indigo-950/50 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>Executive AI Strategic Narrative Report</span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded uppercase">
                    AI Layer Active
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Advisory narrative translation clearly marked as an AI-generated layer based solely on deterministic analysis.
                </p>
              </div>
            </div>
            <div className="text-left md:text-right text-[10px] font-mono text-slate-400">
              <span>Model: {report.explanation.version || "Sprint 6 Refined"}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border leading-relaxed text-xs bg-slate-500/5 border-slate-500/10 text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 block font-bold mb-2">
                EXECUTIVE SUMMARY SYNOPSIS:
              </span>
              {report.explanation.executiveSummary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-slate-500/5 border-slate-500/10 text-xs text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block font-bold mb-2">
                  VERIFIED NARRATIVE STRENGTHS:
                </span>
                <ul className="space-y-1.5 list-disc pl-4 opacity-90">
                  {report.explanation.keyStrengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border bg-slate-500/5 border-slate-500/10 text-xs text-slate-400 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block font-bold mb-2">
                    BUSINESS STANDING IMPLICATION:
                  </span>
                  <p className="opacity-90 leading-relaxed">{report.explanation.businessImpact}</p>
                </div>
                <div className="text-[9px] font-mono text-slate-500 border-t border-slate-500/10 pt-2 mt-2">
                  Note: Conversational rankings are calculated on public evidence indexes.
                </div>
              </div>
            </div>

            {/* Strategic Checklist Row */}
            <div className="p-4 rounded-xl border bg-slate-500/5 border-slate-500/10 text-xs text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block font-bold mb-2">
                RECOMMENDED ACTION PLAN:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                {report.explanation.nextActions.slice(0, 5).map((act, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-500/10 bg-slate-500/5 relative">
                    <span className="absolute top-2 right-2 font-mono text-[10px] text-slate-500 font-bold">0{i+1}</span>
                    <p className="leading-snug pr-4">{act}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`p-6 rounded-2xl border text-center ${
          darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <ShieldAlert className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">AI Business Explanation Unavailable</h4>
          <p className="text-xs text-slate-500 mt-1">
            AI business explanation was excluded. Deterministic analytics completed successfully.
          </p>
        </div>
      )}

      {/* 6. ANALYSIS BOUNDARIES (ALWAYS VISIBLE) */}
      <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500 shadow-xs"
      }`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase font-bold text-slate-500">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>06. Analysis Boundaries & Public Audit Disclosure</span>
          </div>
          <p className="text-[11px] leading-relaxed max-w-4xl">
            {report.explanation?.analysisBoundaries || 
              "This explanation is based only on publicly accessible information successfully collected during analysis. It does not include private systems, unpublished information, customer databases, internal operations, or proprietary business knowledge."
            }
          </p>
        </div>
        <div className="text-[10px] font-mono text-slate-500 text-left sm:text-right shrink-0">
          <div>Scope: Public Site Crawl</div>
          <div>Unverified Areas: Footers / Hidden Tags</div>
        </div>
      </div>

    </div>
  );
}
