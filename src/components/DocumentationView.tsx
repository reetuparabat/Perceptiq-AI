/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  Network, 
  TrendingUp, 
  Sparkles, 
  Compass, 
  Zap, 
  Lock,
  ArrowRight,
  HelpCircle,
  Hash,
  ChevronDown,
  Info
} from "lucide-react";

interface DocumentationViewProps {
  darkMode: boolean;
}

export default function DocumentationView({
  darkMode,
}: DocumentationViewProps) {
  const [activeTab, setActiveTab] = React.useState<"docs" | "faqs" | "terms">("docs");
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does AI Search work (Generative Engine Optimization)?",
      a: "Unlike traditional search engines that index page titles and match keywords to rank blue links, conversational AI assistants (such as ChatGPT, Gemini, Claude, and SearchGPT) read, synthesize, and summarize unstructured web data. They respond to natural language purchase queries with inline prose, comparing products, evaluating company trust, and making direct brand recommendations. Perceptiq maps and audits how these bots construct that synthesis on behalf of enterprise brands."
    },
    {
      q: "How is the Perceptiq AI Readiness Score calculated?",
      a: "Our deterministic scoring engine combines five core components: 1) Knowledge Quality (context completeness across scanned touchpoints), 2) Technical AI Readability (access policy verifiability), 3) Product Information Structure (presence of semantic JSON-LD schema layers), 4) Brand Verifiability & Trust Badges (presence of clear merchant trust anchors), and 5) Brand Authority & Mentions (external contextual backlinks and citation volume)."
    },
    {
      q: "How do I improve my brand's AI Visibility?",
      a: "The most direct route to improving AI recommendation probability is eliminating 'Perception Gaps'—areas where AI assistants misrepresent your business because information is missing. This is resolved by deploying structured schema markup, converting product parameters from static PDF sheets into semantic HTML tables, compiling detailed FAQ blocks to feed LLM intent matching, and linking clear refund/warranty pages in your footer."
    },
    {
      q: "What is an AI Bot Access Policy & can I control it?",
      a: "Yes. You can manage whether AI crawlers are allowed to inspect your domain via your robots.txt file. While some companies block AI crawlers to protect intellectual property, doing so prevents AI assistants from indexing real-time pricing and inventory updates, meaning your business will likely be excluded from active purchase recommendation outputs."
    }
  ];

  const terms = [
    {
      name: "LLM Visibility Share",
      category: "Metrics",
      definition: "The percentage of industry-specific purchase prompts or commercial search intent queries in which an AI assistant includes, mentions, or explicitly recommends your brand relative to competitors."
    },
    {
      name: "Perception Gap",
      category: "Auditing",
      definition: "The structural discrepancy between a company's true operational capabilities and how generative AI models explain or represent those capabilities due to outdated, conflicting, or sparse web coverage."
    },
    {
      name: "Trust Anchor",
      category: "Compliance",
      definition: "Critical verification parameters (such as explicit return policies, physical street coordinates, public phone lines, and SSL certificates) that safety-filtering algorithms require before certifying a business is safe to suggest to consumers."
    },
    {
      name: "Semantic Knowledge Graph",
      category: "Architecture",
      definition: "A structured network of entities (your company, its founders, its products, its physical locations) and their relationships. Generative AI relies heavily on these relational nodes to retrieve facts during retrieval-augmented generation (RAG)."
    },
    {
      name: "Conversational Context Quality",
      category: "Content Optimization",
      definition: "The linguistic clarity and information density of your website's paragraphs, optimized specifically to match conversational intents and long-tail direct questions asked by consumers using AI assistants."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8 font-sans animate-fade-in" id="documentation-view-container">
      {/* Banner Hero */}
      <div className={`p-8 rounded-3xl border relative overflow-hidden ${
        darkMode ? "bg-gradient-to-br from-indigo-950/40 to-slate-950/40 border-indigo-950" : "bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100 shadow-sm"
      }`}>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
          <BookOpen className="w-96 h-96 text-indigo-500" />
        </div>
        
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-indigo-500 font-mono font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Advisory Manual & FAQ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
            Perceptiq AI Learning Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Perceptiq AI operates as a semantic auditing pipeline that crawls, validates, and grades how conversational search engines index and reference your company's digital footprint.
          </p>
        </div>
      </div>

      {/* Selector Navigation Tabs */}
      <div className={`flex border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`} id="docs-sub-tabs">
        <button
          onClick={() => setActiveTab("docs")}
          className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "docs"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          1. Platform Architecture
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "faqs"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          2. Help & Learning FAQs
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
            activeTab === "terms"
              ? "border-indigo-500 text-indigo-400"
              : darkMode
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          3. AI Terminology Guide
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="mt-4">
        {activeTab === "docs" && (
          <div className="space-y-10 animate-fade-in">
            {/* 3 Core Architecture Pillars */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
                Audit Methodology & Framework
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"} space-y-3`}>
                  <div className="w-9 h-9 bg-indigo-600/15 rounded-lg flex items-center justify-center text-indigo-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">1. Strategic Discovery</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We validate domain configuration, structure schema files, and crawl important business pages to see if crawler bots are systematically welcomed or blocked.
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"} space-y-3`}>
                  <div className="w-9 h-9 bg-indigo-600/15 rounded-lg flex items-center justify-center text-indigo-400">
                    <Network className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">2. Semantic Synthesis</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our analyzer maps unstructured website contents to a structured semantic knowledge graph, identifying the primary corporate entities and business capabilities.
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"} space-y-3`}>
                  <div className="w-9 h-9 bg-indigo-600/15 rounded-lg flex items-center justify-center text-indigo-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">3. Cognitive Valuation</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Using mathematical scoring vectors, we calculate your AI brand index, estimating recommendations, trust signals, authority levels, and competitive benchmarks.
                  </p>
                </div>
              </div>
            </div>

            {/* API Integrations */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${
              darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            } space-y-4`}>
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Authentication & Security Policies
                </h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Perceptiq AI prioritizes absolute security across our multi-user enterprise foundation:
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold shrink-0">✓</span>
                  <span><strong>PBKDF2 Password Hashing</strong>: Secure cryptographic salting on every client credential.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold shrink-0">✓</span>
                  <span><strong>Secure Session Handshake</strong>: Secure cookies with automatic fallback Bearer Header persistence to bypass sandboxed iframe restrictions.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold shrink-0">✓</span>
                  <span><strong>Sovereign Workspace Identity</strong>: Automatic workspace isolation for subsequent project scaling in Sprint 3.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold shrink-0">✓</span>
                  <span><strong>SSO Provider Federation</strong>: Google and GitHub ready SSO pathways.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="space-y-4 animate-fade-in" id="learning-faqs-panel">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono mb-2">
              Help & Learning Center (FAQs)
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                    darkMode 
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-800" 
                      : "bg-white border-slate-200/80 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                    aria-expanded={expandedFaq === idx}
                  >
                    <div className="flex items-start space-x-3 pr-4">
                      <HelpCircle className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold tracking-tight">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${expandedFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {expandedFaq === idx && (
                    <div className={`p-5 pt-0 text-xs leading-relaxed border-t ${darkMode ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-600 font-medium"}`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="space-y-4 animate-fade-in" id="terminology-guide-panel">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
                AI Visibility Terminology Guide
              </h2>
              <span className="text-[10px] font-mono text-indigo-400">GEO Reference v1.2</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terms.map((term, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    darkMode 
                      ? "bg-slate-900/40 border-slate-800" 
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {term.category}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Ref PQ-{100 + idx}</span>
                  </div>
                  <h3 className="text-sm font-bold font-display">{term.name}</h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600 font-medium"}`}>
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
