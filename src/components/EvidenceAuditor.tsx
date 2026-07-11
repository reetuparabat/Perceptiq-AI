/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { EvidenceModel, EvidenceItem } from "../types";
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  DollarSign, 
  HelpCircle, 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  Info,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

function getProfessionalStatusLabel(status: string): string {
  switch (status) {
    case "Found":
    case "Success":
      return "Verified";
    case "Not Found":
    case "Failed":
      return "Needs More Public Info";
    case "Unknown":
      return "Pending Analysis";
    case "Restricted":
      return "Restricted Access";
    default:
      return status;
  }
}

interface EvidenceAuditorProps {
  darkMode: boolean;
  evidence?: EvidenceModel;
  companyName: string;
  url: string;
}

export default function EvidenceAuditor({
  darkMode,
  evidence,
  companyName,
  url
}: EvidenceAuditorProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  if (!evidence) {
    return (
      <div className={`p-8 text-center rounded-2xl border ${
        darkMode ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"
      }`}>
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3 animate-pulse" />
        <h3 className="font-display font-bold text-lg mb-1">Awaiting Evidence Scrapes</h3>
        <p className="text-sm">Initiate a website crawl to collect pristine, traceable evidence.</p>
      </div>
    );
  }

  // Filter list helper for search
  const isMatch = (val: any) => {
    if (!val) return false;
    if (Array.isArray(val)) {
      return val.some(item => String(item).toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (typeof val === "object") {
      return Object.entries(val).some(([k, v]) => 
        String(k).toLowerCase().includes(searchQuery.toLowerCase()) || 
        String(v).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return String(val).toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Convert evidence items to list for general auditing
  const rawItems = [
    {
      id: "biz-name",
      category: "Business Detail",
      label: "Official Business Name",
      icon: ShieldCheck,
      item: evidence.businessName,
    },
    {
      id: "desc",
      category: "Business Detail",
      label: "Business Descriptions",
      icon: Info,
      item: evidence.businessDescriptions,
    },
    {
      id: "phone",
      category: "Contact Detail",
      label: "Corporate Phone Number",
      icon: Phone,
      item: evidence.contactInfo.phone,
    },
    {
      id: "email",
      category: "Contact Detail",
      label: "Corporate Email Address",
      icon: Mail,
      item: evidence.contactInfo.email,
    },
    {
      id: "address",
      category: "Contact Detail",
      label: "Physical Address Location",
      icon: MapPin,
      item: evidence.contactInfo.address,
    },
    {
      id: "products-found",
      category: "Product Detail",
      label: "Product Catalog Categories",
      icon: Layers,
      item: evidence.productsFound,
    },
    {
      id: "services-found",
      category: "Product Detail",
      label: "Core Services Found",
      icon: Globe,
      item: evidence.servicesFound,
    },
    {
      id: "product-titles",
      category: "Product Detail",
      label: "Verified Product Titles",
      icon: FileText,
      item: evidence.productTitles,
    },
    {
      id: "product-specs",
      category: "Product Detail",
      label: "Product Specifications Table",
      icon: Info,
      item: evidence.productSpecifications,
    },
    {
      id: "faq-q",
      category: "Trust & Quality",
      label: "FAQ Questions Discovered",
      icon: HelpCircle,
      item: evidence.faqQuestions,
    },
    {
      id: "policy-shipping",
      category: "Trust & Quality",
      label: "Shipping Information Policy",
      icon: FileText,
      item: evidence.policies.shippingInfo,
    },
    {
      id: "policy-return",
      category: "Trust & Quality",
      label: "Refund & Return Policy",
      icon: FileText,
      item: evidence.policies.returnPolicy,
    },
    {
      id: "policy-warranty",
      category: "Trust & Quality",
      label: "Product Warranty Parameters",
      icon: ShieldCheck,
      item: evidence.policies.warranty,
    },
    {
      id: "certificates",
      category: "Trust & Quality",
      label: "Security & Trust Compliance Certificates",
      icon: ShieldCheck,
      item: evidence.trustSignals.certificates,
    },
    {
      id: "pricing",
      category: "Product Detail",
      label: "Public Pricing Indicators",
      icon: DollarSign,
      item: evidence.pricingInfo,
    },
    {
      id: "images-count",
      category: "System Settings & Assets",
      label: "Product Visual Media Items",
      icon: ImageIcon,
      item: evidence.imagesCount,
    },
    {
      id: "detected-lang",
      category: "System Settings & Assets",
      label: "System Multi-Lingual Locales",
      icon: Globe,
      item: evidence.detectedLanguages,
    },
  ];

  const filteredItems = rawItems.filter(
    x => 
      x.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      x.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      isMatch(x.item.value)
  );

  return (
    <div className="space-y-6" id="evidence-auditor-module">
      {/* Overview Card */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md uppercase">
              Sprint 3 Core Engine
            </span>
            <h2 className="text-lg font-display font-bold">Traceable Evidence Inventory</h2>
            <p className="text-xs text-slate-500">
              Only verified business details. Zero estimation, zero AI hallucination. Every fact links directly to its source.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-500">Trace Integrity Active</span>
          </div>
        </div>

        {/* Strategic Scrape Status Timeline */}
        <div className="mt-6 pt-6 border-t border-slate-500/10">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-500 mb-3">
            Strategic Crawler Scrape Path
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {(["Homepage", "About", "Products", "FAQ", "Contact"] as const).map(role => {
              const crawlLog = evidence.pagesCrawled.find(p => p.role === role);
              const status = crawlLog ? crawlLog.status : "Unknown";
              return (
                <div 
                  key={role}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between space-y-2 ${
                    status === "Success" 
                      ? darkMode ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-emerald-50/50 border-emerald-100 text-emerald-950"
                      : status === "Failed"
                      ? darkMode ? "bg-rose-500/5 border-rose-500/20 text-rose-400" : "bg-rose-50/50 border-rose-100 text-rose-950"
                      : darkMode ? "bg-slate-950/40 border-slate-900 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold tracking-tight">{role}</span>
                    {status === "Success" ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : status === "Failed" ? (
                      <XCircle className="h-3.5 w-3.5" />
                    ) : (
                      <HelpCircle className="h-3.5 w-3.5 opacity-40" />
                    )}
                  </div>
                  <div className="text-[9px] font-mono truncate block opacity-80" title={crawlLog?.url || "Not discovered"}>
                    {crawlLog ? crawlLog.url.replace(/^https?:\/\//i, "") : "Not Discovered"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Directory Audit Tool */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        {/* Search header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="font-display font-bold text-sm">Evidence Fact Directory</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search collected evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl outline-none border transition-all ${
                darkMode 
                  ? "bg-slate-950 border-slate-800 focus:border-indigo-500 text-white" 
                  : "bg-slate-50 border-slate-200 focus:border-indigo-400 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Evidence list layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-slate-500 font-mono ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                <th className="pb-3 font-semibold uppercase tracking-wider w-1/4">Metric Parameter</th>
                <th className="pb-3 font-semibold uppercase tracking-wider w-1/6">Category</th>
                <th className="pb-3 font-semibold uppercase tracking-wider w-1/12">Status</th>
                <th className="pb-3 font-semibold uppercase tracking-wider w-1/3">Extracted Value</th>
                <th className="pb-3 font-semibold uppercase tracking-wider w-1/6">Source Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                    No matching evidence records found.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const Icon = item.icon;
                  const val = item.item.value;
                  const isFound = item.item.status === "Found";
                  
                  return (
                    <tr key={item.id} className={`hover:bg-slate-500/5 transition-colors`}>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center space-x-2.5">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            isFound
                              ? darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                              : darkMode ? "bg-slate-950 text-slate-600" : "bg-slate-100 text-slate-400"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-semibold">{item.label}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-[10px] text-slate-500">
                        {item.category}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          isFound
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : item.item.status === "Not Found"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                        }`}>
                          {getProfessionalStatusLabel(item.item.status)}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-[11px] max-w-xs truncate" title={val ? String(val) : ""}>
                        {isFound && val ? (
                          Array.isArray(val) ? (
                            <div className="flex flex-wrap gap-1">
                              {val.map((tag, idx) => (
                                <span key={idx} className={`px-1.5 py-0.2 rounded text-[9px] ${
                                  darkMode ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-800"
                                }`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : typeof val === "object" ? (
                            <div className="text-[10px]">
                              {Object.entries(val).map(([k, v]) => (
                                <div key={k} className="truncate">
                                  <strong>{k}</strong>: {v}
                                </div>
                              ))}
                            </div>
                          ) : (
                            String(val)
                          )
                        ) : (
                          <span className="opacity-40 italic">Not Found</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        {isFound ? (
                          <span className={`inline-flex items-center text-[10px] font-mono font-bold ${
                            darkMode ? "text-indigo-300" : "text-indigo-800"
                          }`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
                            {item.item.sourcePage}
                          </span>
                        ) : (
                          <span className="opacity-30 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
