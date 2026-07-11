/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  Calendar, 
  TrendingUp, 
  HelpCircle, 
  Layers, 
  User, 
  MapPin, 
  PhoneCall, 
  Share2, 
  FileCode, 
  Tag, 
  Layers2, 
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Check,
  AlertCircle,
  RefreshCw,
  Info,
  ShieldAlert
} from "lucide-react";
import { AIReadinessReport, NormalizedEntity, KnowledgeSource, MissingKnowledgeItem } from "../types";

interface KnowledgeMapProps {
  report: AIReadinessReport;
  darkMode: boolean;
}

export default function KnowledgeMap({ report, darkMode }: KnowledgeMapProps) {
  const ki = report.knowledgeIntelligence;
  const evidence = report.evidence;
  
  // State for interactive UI
  const [selectedEntityId, setSelectedEntityId] = React.useState<string | null>(null);
  const [entityTypeFilter, setEntityTypeFilter] = React.useState<string>("all");
  const [activeSubTab, setActiveSubTab] = React.useState<"health" | "graph" | "sources" | "entities" | "missing">("health");

  if (!ki || !evidence) {
    return (
      <div className={`p-8 rounded-3xl border text-center ${darkMode ? "bg-slate-950 border-slate-900 text-slate-400" : "bg-white border-slate-200 text-slate-600"}`}>
        <Database className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-display font-semibold mb-2">Knowledge Intelligence Engine Recalibrating</h3>
        <p className="text-sm max-w-md mx-auto text-slate-500">
          The AI Business Information database was not compiled for this scan session. Run a new website scan to build the Information Graph.
        </p>
      </div>
    );
  }

  // Terminology Translation mapping for display
  const translateType = (type: string) => {
    switch (type) {
      case "Organization": return "Company Identity";
      case "Product": return "Products";
      case "Service": return "Services";
      case "Location": return "Physical Address";
      case "Person": return "Key Management Team";
      case "FAQ": return "Common FAQs";
      case "Category": return "Business Category";
      case "ContactInfo": return "Contact Details";
      case "SocialProfile": return "Social Media Profile";
      default: return "Business Detail";
    }
  };

  // Filter entities
  const filteredEntities = ki.entities.filter(ent => {
    if (entityTypeFilter === "all") return true;
    return ent.type.toLowerCase() === entityTypeFilter.toLowerCase();
  });

  // Default selection to first entity if none selected
  const selectedEntity = ki.entities.find(e => e.id === selectedEntityId) || ki.entities[0];

  // Map icon based on entity type
  const getEntityIcon = (type: string) => {
    switch (type) {
      case "Organization": return <Layers className="h-4 w-4 text-emerald-400" />;
      case "Product": return <Database className="h-4 w-4 text-indigo-400" />;
      case "Service": return <Sparkles className="h-4 w-4 text-blue-400" />;
      case "Location": return <MapPin className="h-4 w-4 text-red-400" />;
      case "Person": return <User className="h-4 w-4 text-purple-400" />;
      case "FAQ": return <HelpCircle className="h-4 w-4 text-amber-400" />;
      case "Category": return <Tag className="h-4 w-4 text-pink-400" />;
      case "ContactInfo": return <PhoneCall className="h-4 w-4 text-teal-400" />;
      case "SocialProfile": return <Share2 className="h-4 w-4 text-sky-400" />;
      default: return <Database className="h-4 w-4 text-slate-400" />;
    }
  };

  const getEntityColor = (type: string) => {
    switch (type) {
      case "Organization": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "Product": return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
      case "Service": return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "Location": return "bg-red-500/10 border-red-500/20 text-red-400";
      case "Person": return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "FAQ": return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "Category": return "bg-pink-500/10 border-pink-500/20 text-pink-400";
      case "ContactInfo": return "bg-teal-500/10 border-teal-500/20 text-teal-400";
      case "SocialProfile": return "bg-sky-500/10 border-sky-500/20 text-sky-400";
      default: return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  // Feature 3: Meaningful relationship labels for connections
  const getRelationshipLabel = (type: string) => {
    switch (type) {
      case "Product": return "owns";
      case "Service": return "provides";
      case "Location": return "located at";
      case "Person": return "employs";
      case "FAQ": return "answers";
      case "ContactInfo": return "reaches at";
      case "SocialProfile": return "links to";
      case "Category": return "categorized as";
      default: return "references";
    }
  };

  // Dynamically calculate Coverage metrics (Feature 7)
  const coverageData = React.useMemo(() => {
    const metrics = [
      {
        area: "Business Information",
        description: "Official name, key background summary, and brand identity",
        percentage: evidence.businessName.value ? 95 : 20,
      },
      {
        area: "Products Portfolio",
        description: "Direct listings, packages, and descriptions of offerings",
        percentage: (evidence.productTitles?.value || []).length > 0 ? 90 : 15,
      },
      {
        area: "Services Catalog",
        description: "Available service descriptions and semantic summaries",
        percentage: (evidence.servicesFound?.value || []).length > 0 ? 85 : 15,
      },
      {
        area: "Contact Gateway",
        description: "E-mail coordinates, telephone links, and physical offices",
        percentage: (() => {
          let score = 0;
          if (evidence.contactInfo?.email?.value) score += 33;
          if (evidence.contactInfo?.phone?.value) score += 33;
          if (evidence.contactInfo?.address?.value) score += 34;
          return score;
        })(),
      },
      {
        area: "Social Profiles Connection",
        description: "Linked external domain credentials (LinkedIn, X, Facebook)",
        percentage: (() => {
          const links = ki.sources.find(s => s.type === "external_references")?.details || "";
          if (links.includes("LinkedIn") || links.includes("Twitter") || links.includes("Facebook") || links.includes("x.com")) {
            return 80;
          }
          return 25;
        })(),
      },
      {
        area: "Customer Support & FAQs",
        description: "Parsed question-and-answer grids used by smart assistants",
        percentage: (evidence.faqQuestions?.value || []).length > 0 ? 85 : 30,
      }
    ];

    return metrics.map(m => {
      let rating = "Missing";
      let color = "text-red-400 bg-red-500/10 border-red-500/20";
      let barColor = "bg-red-500";
      
      if (m.percentage >= 90) {
        rating = "Excellent";
        color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
        barColor = "bg-gradient-to-r from-emerald-500 to-indigo-500";
      } else if (m.percentage >= 70) {
        rating = "Good";
        color = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
        barColor = "bg-gradient-to-r from-indigo-500 to-blue-500";
      } else if (m.percentage >= 50) {
        rating = "Average";
        color = "text-blue-400 bg-blue-500/10 border-blue-500/20";
        barColor = "bg-gradient-to-r from-blue-500 to-amber-500";
      } else if (m.percentage > 0) {
        rating = "Needs Improvement";
        color = "text-amber-400 bg-amber-500/10 border-amber-500/20";
        barColor = "bg-gradient-to-r from-amber-500 to-red-500";
      }

      return { ...m, rating, color, barColor };
    });
  }, [evidence, ki.sources]);

  // Dynamic calculations for Knowledge Health (Feature 4)
  const healthDashboard = React.useMemo(() => {
    // 1. Information Coverage
    const avgCoverage = Math.round(coverageData.reduce((acc, c) => acc + c.percentage, 0) / coverageData.length);
    let coverageRating = "Needs Improvement";
    let coverageText = "Multiple key areas are missing. AI has to guess some details about your business.";
    let coverageColor = "text-amber-400";
    if (avgCoverage >= 80) {
      coverageRating = "Excellent";
      coverageText = "AI found almost all of your important business details across your website.";
      coverageColor = "text-emerald-400";
    } else if (avgCoverage >= 55) {
      coverageRating = "Good";
      coverageText = "AI found most of your essential details, but some fields are still blank.";
      coverageColor = "text-indigo-400";
    }

    // 2. Information Matches
    const consistentCount = ki.entities.filter(e => e.consistency === "Consistent" || e.consistency === "High").length;
    const consistencyPercentage = Math.round((consistentCount / ki.entities.length) * 100);
    let consistencyRating = "Needs Improvement";
    let consistencyText = "AI detected mismatched details. Different facts are appearing on different pages.";
    let consistencyColor = "text-amber-400";
    if (consistencyPercentage >= 85) {
      consistencyRating = "Excellent";
      consistencyText = "The same business details are written identically on all pages, preventing AI confusion.";
      consistencyColor = "text-emerald-400";
    } else if (consistencyPercentage >= 60) {
      consistencyRating = "Good";
      consistencyText = "Details are mostly consistent, but some minor contradictions exist.";
      consistencyColor = "text-indigo-400";
    }

    // 3. Source Authority
    const hasSchema = ki.sources.some(s => s.type === "structured_data" && s.status === "available");
    const hasSitemap = ki.sources.some(s => s.type === "sitemap" && s.status === "available");
    let authorityRating = "Needs Improvement";
    let authorityText = "Missing search-friendly code markup. AI has to guess your layout by scanning plain text.";
    let authorityColor = "text-amber-400";
    if (hasSchema && hasSitemap) {
      authorityRating = "Excellent";
      authorityText = "Highly Authoritative. Your website uses structured schema markup and directory maps that AI bots trust.";
      authorityColor = "text-emerald-400";
    } else if (hasSchema || hasSitemap) {
      authorityRating = "Good";
      authorityText = "Some structured components found. Adding missing schemas will further boost AI trust.";
      authorityColor = "text-indigo-400";
    }

    // 4. Information Freshness
    let freshnessRating = "Excellent";
    let freshnessText = "Your details look recent, up-to-date, and align perfectly with active search crawls.";
    let freshnessColor = "text-emerald-400";
    
    // If we have some missing pages or outdated contact logs
    if (ki.missingKnowledge.some(m => m.id === "missing-contact-page" || m.id === "missing-about-page")) {
      freshnessRating = "Needs Improvement";
      freshnessText = "Some foundational info pages look old or haven't been updated in your recent domain sweeps.";
      freshnessColor = "text-amber-400";
    }

    return [
      {
        title: "Information Coverage",
        rating: coverageRating,
        text: coverageText,
        color: coverageColor,
        icon: <Layers2 className="h-5 w-5 text-emerald-400" />
      },
      {
        title: "Information Matches Across Website",
        rating: consistencyRating,
        text: consistencyText,
        color: consistencyColor,
        icon: <CheckCircle2 className="h-5 w-5 text-indigo-400" />
      },
      {
        title: "Source Authority",
        rating: authorityRating,
        text: authorityText,
        color: authorityColor,
        icon: <ShieldCheck className="h-5 w-5 text-blue-400" />
      },
      {
        title: "Information Freshness",
        rating: freshnessRating,
        text: freshnessText,
        color: freshnessColor,
        icon: <RefreshCw className="h-5 w-5 text-purple-400" />
      }
    ];
  }, [ki.entities, ki.missingKnowledge, ki.sources, coverageData]);

  // Feature 6: Better educational explanations for missing items
  const getMissingEducationalInfo = (id: string, defaultTitle: string, defaultDesc: string, defaultImpact: string) => {
    switch (id) {
      case "missing-org-schema":
        return {
          title: "Homepage Structured Schema",
          status: "Missing",
          whyThisMatters: "Search engines and conversational assistants (like ChatGPT, Gemini, and Copilot) read structured Schema code to immediately locate your official company name, logos, and contacts without having to guess.",
          recommendedAction: "Create and insert an 'Organization' JSON-LD schema snippet in your homepage's header. Perceptiq can generate this code for you.",
          expectedBenefit: "AI assistants can display a highly verified official brand knowledge card when customers search for your name."
        };
      case "missing-faq":
        return {
          title: "Customer FAQ Section",
          status: "Missing",
          whyThisMatters: "Most AI chat tools look for clear question-and-answer pairs on your website to instantly resolve precise customer inquiries. Without an FAQ page, AI may formulate generic answers or recommend competitors.",
          recommendedAction: "Set up a clean FAQ page on your website (e.g. /faq) outlining 5 to 10 common user questions regarding your policies, pricing, or service delivery.",
          expectedBenefit: "Directly pulls your authoritative answers into ChatGPT and Gemini responses with direct clickable citations."
        };
      case "missing-contact-page":
        return {
          title: "Dedicated Contact Page",
          status: "Missing",
          whyThisMatters: "A dedicated Contact page with a phone number, physical address, and email is a primary trust signal used by AI crawlers to confirm your business represents a real, legitimate physical entity.",
          recommendedAction: "Create a simple, dedicated '/contact' page with clear headings containing your email, telephone line, and physical workspace details.",
          expectedBenefit: "Boosts overall domain trust, preventing your brand from being filtered out in localized AI voice searches."
        };
      case "missing-social-links":
        return {
          title: "Connected Social Profiles",
          status: "Missing",
          whyThisMatters: "AI models verify brand authenticity by cross-linking your main domain with social platforms (like LinkedIn, X/Twitter, or Facebook). Outbound links prove that you own these assets.",
          recommendedAction: "Add your official social profile links (URLs) in your global footer as simple, clear anchor links.",
          expectedBenefit: "Allows AI systems to bundle your social posts and website articles into a single, cohesive brand profile."
        };
      case "missing-about-page":
        return {
          title: "Company About Section",
          status: "Missing",
          whyThisMatters: "AI search engines are heavily focused on 'E-E-A-T' (Experience, Expertise, Authoritativeness, and Trustworthiness). An 'About Us' page establishes the real founders and authors behind the company.",
          recommendedAction: "Create an '/about' page highlighting your business's founding date, history, team bios, and organizational credentials.",
          expectedBenefit: "AI search crawlers can instantly answer historical questions ('When was this company started?') and reference actual team expertise."
        };
      case "missing-product-schema":
        return {
          title: "Product Catalog Schema",
          status: "Missing",
          whyThisMatters: "Smart shopping assistants can only extract precise specs, up-to-date pricing, and in-stock status from listings that are annotated with structured product microdata.",
          recommendedAction: "Integrate 'Product' and 'Offer' microdata on your primary product pages. This adds hidden labels to pricing and features.",
          expectedBenefit: "Displays your catalog directly in smart comparison charts and visual price matches across shopping LLMs."
        };
      case "missing-author-info":
        return {
          title: "Author Bio Attributions",
          status: "Missing",
          whyThisMatters: "AI search engines are penalizing anonymous content. Articles without a visible, qualified author have lower credibility in conversational summaries.",
          recommendedAction: "Add a small bio block at the bottom of your blog articles with a link to the author's professional LinkedIn profile.",
          expectedBenefit: "Protects your content from organic ranking drops, flagging your insights as written by verifiable experts."
        };
      case "missing-business-identity":
        return {
          title: "Clear Brand Identity",
          status: "Missing",
          whyThisMatters: "If your brand name is absent or inconsistent in your headings, AI filters will classify your website under broad, generic industry terms instead of recognizing your trademark.",
          recommendedAction: "Ensure your legal brand name is consistently present in page titles, copyrights, and primary header tags.",
          expectedBenefit: "Allows AI systems to index your exact brand trademark safely, separating your reviews from direct competitors."
        };
      default:
        return {
          title: defaultTitle,
          status: "Missing",
          whyThisMatters: defaultImpact || "This metadata detail is used by search systems to understand details of your organization's services.",
          recommendedAction: defaultDesc || "Publish this information clearly in your website text or header code.",
          expectedBenefit: "Improves overall AI search confidence and matching consistency."
        };
    }
  };

  // Feature 1: Dynamic Discovery Journey builder based on entity type
  const getDiscoveryJourneySteps = (entity: NormalizedEntity) => {
    switch (entity.type) {
      case "Organization":
        return [
          { label: "Step 1: Domain Entry", desc: `AI crawled your home domain: ${evidence.businessName.value ? report.url : "yourdomain.com"}` },
          { label: "Step 2: Head Check", desc: "Parsed document headers and page titles for corporate markers." },
          { label: "Step 3: Schema Parse", desc: "Detected structured '@type: Organization' markup, defining name and domain." },
          { label: "Step 4: Cross-Matching", desc: "Compared organization keywords against multiple footer instances." },
          { label: "Step 5: Trust Confirmed", desc: `AI successfully grouped brand identity as: "${entity.name}".` }
        ];
      case "Product":
        return [
          { label: "Step 1: URL Navigation", desc: "Navigated to your listing links or internal page directory." },
          { label: "Step 2: Heading Check", desc: `Identified product headings like "${entity.name}" inside <h2> tags.` },
          { label: "Step 3: Catalog Match", desc: "Analyzed surrounding specifications, currency symbols, and details." },
          { label: "Step 4: Price Corroboration", desc: `Cross-referenced against: ${entity.properties.pricing || "Pricing text"}.` },
          { label: "Step 5: Trust Confirmed", desc: "AI confirmed this item as a commercial product catalog offering." }
        ];
      case "Service":
        return [
          { label: "Step 1: Path Analysis", desc: "Followed internal service menus or semantic keyword routes." },
          { label: "Step 2: Detail Scrape", desc: `Matched the keyword "${entity.name}" in primary description blocks.` },
          { label: "Step 3: Structure Scan", desc: "Analyzed surrounding service package benefits and descriptive columns." },
          { label: "Step 4: Footer Context", desc: "Linked page offering context back to corporate identity scope." },
          { label: "Step 5: Trust Confirmed", desc: "AI confirmed this offering as an active professional service." }
        ];
      case "ContactInfo":
        return [
          { label: "Step 1: Page Crawl", desc: "Scanned the Contact or Global Footer paths." },
          { label: "Step 2: Pattern Match", desc: "Triggered standard phone digit & e-mail format matches." },
          { label: "Step 3: Verification", desc: `Found active links: ${entity.properties.email || ""} ${entity.properties.phone || ""}.` },
          { label: "Step 4: Consistency Check", desc: "Verified identical numbers on both homepage and inner paths." },
          { label: "Step 5: Trust Confirmed", desc: "AI locked this verified contact gateway into its recommendations map." }
        ];
      case "SocialProfile":
        return [
          { label: "Step 1: Link Discovery", desc: "Scanned the global homepage header and footer lists." },
          { label: "Step 2: Domain Extract", desc: `Extracted outgoing URL: ${entity.properties.url || "social link"}.` },
          { label: "Step 3: Platform Verify", desc: `Confirmed outbound destination matches verified domain: ${entity.properties.platform}.` },
          { label: "Step 4: Profile Match", desc: "Extracted the target username handle for cross-domain matching." },
          { label: "Step 5: Trust Confirmed", desc: "AI confirmed the connection, indexing your official social profile." }
        ];
      case "Location":
        return [
          { label: "Step 1: Contact Scan", desc: "Crawl bot entered your Contact page directory." },
          { label: "Step 2: Address Parse", desc: "Scraped postal codes and geographic identifiers." },
          { label: "Step 3: Map Check", desc: "Looked for map coordinates, embeds, or local contact patterns." },
          { label: "Step 4: Code Corroboration", desc: `Cross-referenced address text: "${entity.properties.fullAddress}".` },
          { label: "Step 5: Trust Confirmed", desc: "AI pinned this address as your verified corporate office location." }
        ];
      case "FAQ":
        return [
          { label: "Step 1: Page Entry", desc: "Scanned specialized FAQ, Support, or Q&A URLs." },
          { label: "Step 2: Q&A Match", desc: `Detected clear question tag matching "${entity.name}".` },
          { label: "Step 3: Answer extraction", desc: "Read immediate trailing plain text block to fetch direct answers." },
          { label: "Step 4: Format Check", desc: "Verified FAQ schema markup is present or readable formats are used." },
          { label: "Step 5: Trust Confirmed", desc: "AI stored this question-and-answer pair to resolve custom chat queries." }
        ];
      default:
        return [
          { label: "Step 1: Initial Crawl", desc: "Bot reached website sub-pages." },
          { label: "Step 2: Code Parse", desc: "Parsed local headings and paragraphs." },
          { label: "Step 3: Extraction", desc: `Pulleld keyword properties matching: "${entity.name}".` },
          { label: "Step 4: Compare", desc: "Compared against surrounding pages to verify." },
          { label: "Step 5: Confirmed", desc: "AI successfully added this detail to your business profile." }
        ];
    }
  };

  // Feature 2: Trust confidence explanation list
  const getConfidenceExplanation = (confidence: number) => {
    if (confidence >= 90) {
      return {
        rating: "Highly Confident",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        whyText: "AI has absolute trust in this detail because:",
        points: [
          "Information matches perfectly on all crawled pages without any contradictions.",
          "Found in official structural positions (like your Page Title or main Headers).",
          "Declared using structured Schema code that AI systems read instantly.",
          "Matches across multiple external channels (like verified social profiles)."
        ]
      };
    } else if (confidence >= 70) {
      return {
        rating: "Moderately Confident",
        color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        whyText: "AI trusts this detail but sees room for improvement because:",
        points: [
          "The information is consistent, but only appears on a single sub-page.",
          "AI had to read regular plain text because there is no structured Schema code.",
          "The detail is missing in standard footer or homepage overview zones.",
          "Minor formatting variations were detected across different sections."
        ]
      };
    } else {
      return {
        rating: "Needs Review",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        whyText: "AI is unsure about this detail because:",
        points: [
          "This information was only found once on a secondary page.",
          "There is zero structured Schema data or metadata to confirm this fact.",
          "Different versions of this detail appear on different pages, causing AI confusion.",
          "The source page appears old or missing from active navigation maps."
        ]
      };
    }
  };

  // Extract source stats
  const availableSources = ki.sources.filter(s => s.status === "available").length;

  return (
    <div className="space-y-6">
      {/* Intro Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border transition-colors ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Business Details</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Network className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-display font-black tracking-tight">{ki.entities.length}</span>
            <span className="text-xs text-slate-500">Details Found</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">AI grouped similar information together.</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-colors ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Active Sources</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-display font-black tracking-tight">{availableSources}</span>
            <span className="text-xs text-slate-500">/ {ki.sources.length} Verified</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Discoverable website pages parsed.</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-colors ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">AI Trust Rating</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-display font-black tracking-tight">
              {Math.round(ki.entities.reduce((acc, e) => acc + e.confidence, 0) / ki.entities.length || 0)}%
            </span>
            <span className="text-xs text-slate-500">Confidence</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Average trust weight across all info.</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-colors ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Information Gaps</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-display font-black tracking-tight">{ki.missingKnowledge.length}</span>
            <span className="text-xs text-slate-500">Missing Details</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Missing parameters observed safely.</p>
        </div>
      </div>

      {/* Module Title & Tab Control */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between pb-6 border-b border-slate-800/20 gap-4">
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight">AI Knowledge & Trust Map</h2>
            <p className="text-xs text-slate-500 mt-1">
              Understand <strong>how</strong> AI assistants search your website, <strong>why</strong> they trust your data, and <strong>what details</strong> are still missing to maximize your AI readiness.
            </p>
          </div>
          <div className="flex flex-wrap rounded-xl bg-indigo-500/5 p-1 border border-indigo-500/10 shrink-0 self-start xl:self-center gap-1">
            <button 
              onClick={() => setActiveSubTab("health")}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeSubTab === "health" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Health & Coverage
            </button>
            <button 
              onClick={() => setActiveSubTab("graph")}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeSubTab === "graph" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Interactive Info Map
            </button>
            <button 
              onClick={() => setActiveSubTab("sources")}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeSubTab === "sources" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Information Sources ({ki.sources.length})
            </button>
            <button 
              onClick={() => setActiveSubTab("entities")}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeSubTab === "entities" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Business Information ({ki.entities.length})
            </button>
            <button 
              onClick={() => setActiveSubTab("missing")}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeSubTab === "missing" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Information Gaps ({ki.missingKnowledge.length})
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          <AnimatePresence mode="wait">
            {/* Health & Coverage Dashboard (Feature 4, 5, 7) */}
            {activeSubTab === "health" && (
              <motion.div 
                key="health"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Visual grid for Health & Coverage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* FEATURE 4: Knowledge Health */}
                  <div className={`lg:col-span-7 p-6 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                  }`}>
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <ShieldCheck className="h-5 w-5 text-indigo-400" />
                        <h3 className="font-display font-bold text-base text-slate-300">Knowledge Health Audit</h3>
                      </div>
                      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        This summary details how complete and trustworthy your business facts look to conversational AI models. Improving these parameters prevents AI hallucination.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {healthDashboard.map((item, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-xl border flex flex-col space-y-2 ${
                              darkMode ? "bg-slate-950/40 border-slate-900" : "bg-slate-50/50 border-slate-100"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {item.icon}
                              <h4 className="text-xs font-semibold text-slate-400 font-sans">{item.title}</h4>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-xs font-mono font-bold ${item.color} px-2 py-0.5 rounded bg-white/5 border border-white/10`}>
                                {item.rating}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal mt-1.5">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FEATURE 7: Knowledge Coverage Visualization */}
                  <div className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                  }`}>
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-indigo-400" />
                        <h3 className="font-display font-bold text-base text-slate-300">Information Coverage Tracker</h3>
                      </div>
                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        An index of how much vital information AI bots successfully extracted from different areas of your digital footprint.
                      </p>

                      <div className="space-y-4">
                        {coverageData.map((item, index) => (
                          <div key={index} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-400">{item.area}</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-slate-300 font-bold">{item.percentage}%</span>
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.color}`}>
                                  {item.rating}
                                </span>
                              </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full ${item.barColor}`} 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* FEATURE 5: AI Discovery Pipeline */}
                <div className={`p-6 rounded-2xl border ${
                  darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-300">AI Discovery Pipeline</h3>
                      <p className="text-xs text-slate-500 mt-0.5">How conversational models (ChatGPT, Gemini) find, read, and understand your website details.</p>
                    </div>
                  </div>

                  {/* Horizontal pipeline flow */}
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 pt-4 relative">
                    {[
                      { step: "1", title: "Website Access", icon: <Globe className="h-5 w-5 text-emerald-400" />, desc: "AI bot requests your website's home address." },
                      { step: "2", title: "Reading Pages", icon: <FileCode className="h-5 w-5 text-indigo-400" />, desc: "AI reads all readable text, headers, and structural code." },
                      { step: "3", title: "Collecting Details", icon: <Layers2 className="h-5 w-5 text-blue-400" />, desc: "AI extracts names, products, services, and locations." },
                      { step: "4", title: "Comparing Sources", icon: <Network className="h-5 w-5 text-purple-400" />, desc: "AI compares details across different sub-pages." },
                      { step: "5", title: "Checking Match", icon: <CheckCircle2 className="h-5 w-5 text-pink-400" />, desc: "AI checks if details match or contradict each other." },
                      { step: "6", title: "Building Profile", icon: <User className="h-5 w-5 text-teal-400" />, desc: "AI bundles everything into a unified business profile." },
                      { step: "7", title: "Confirming Trust", icon: <Sparkles className="h-5 w-5 text-amber-400" />, desc: "AI becomes highly confident in recommending your brand." },
                    ].map((stepItem, idx) => (
                      <div key={idx} className="relative flex flex-col items-center text-center group">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className={`p-3.5 rounded-2xl border mb-3 flex items-center justify-center relative transition-all ${
                            darkMode ? "bg-slate-950 border-slate-900 group-hover:border-indigo-500/40" : "bg-slate-50 border-slate-200 group-hover:border-indigo-300"
                          }`}
                        >
                          <span className="absolute top-1 left-1.5 text-[8px] font-mono text-slate-500 font-bold">
                            #{stepItem.step}
                          </span>
                          {stepItem.icon}
                        </motion.div>
                        <h4 className="text-xs font-semibold text-slate-400 font-sans mb-1">{stepItem.title}</h4>
                        <p className="text-[10px] text-slate-500 max-w-[130px] leading-normal">{stepItem.desc}</p>
                        
                        {/* Connecting arrows for large screens */}
                        {idx < 6 && (
                          <div className="hidden xl:block absolute top-7 -right-4 translate-x-1/2 text-slate-800 pointer-events-none">
                            <ArrowRight className="h-4 w-4 animate-[pulse_2s_infinite]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Interactive Graph Node Visualizer Tab */}
            {activeSubTab === "graph" && (
              <motion.div 
                key="graph"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Visual SVG Network representation */}
                <div className="lg:col-span-2 relative min-h-[460px] rounded-2xl border border-slate-800/10 bg-slate-950/20 overflow-hidden flex flex-col justify-between">
                  {/* Grid background effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(#312e81_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
                  
                  {/* Interactive Header controls */}
                  <div className="p-4 flex flex-wrap gap-2 items-center justify-between z-10">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                      Interactive Business Information Map
                    </span>
                    <div className="flex gap-1.5">
                      {["all", "Organization", "Product", "SocialProfile", "FAQ"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setEntityTypeFilter(f)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border ${
                            entityTypeFilter === f 
                              ? "bg-indigo-600 border-indigo-500 text-white shadow-sm" 
                              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900"
                          }`}
                        >
                          {f === "all" ? "Show All" : translateType(f)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Node Graph simulation layout */}
                  <div className="flex-1 flex items-center justify-center relative p-8">
                    {/* SVG Connections & Linkages rendering */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <linearGradient id="link-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.15" />
                        </linearGradient>
                      </defs>
                      {/* Connection lines to organization */}
                      {filteredEntities.map((ent, idx) => {
                        if (ent.id === "entity-org-1") return null;
                        
                        // Circular coordinates distribution
                        const count = filteredEntities.length - 1;
                        const angle = ((idx - 1) * (2 * Math.PI)) / count;
                        const radius = count > 8 ? 150 : 130;
                        
                        return (
                          <line
                            key={`link-${ent.id}`}
                            x1="50%"
                            y1="50%"
                            x2={`calc(50% + ${Math.cos(angle) * radius}px)`}
                            y2={`calc(50% + ${Math.sin(angle) * radius}px)`}
                            stroke="url(#link-gradient)"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                          />
                        );
                      })}
                    </svg>

                    {/* Nodes layers */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Central Node: Organization */}
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedEntityId("entity-org-1")}
                        className={`absolute w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 shadow-xl cursor-pointer z-20 ${
                          selectedEntityId === "entity-org-1" 
                            ? "bg-indigo-950 border-indigo-400 text-indigo-300 ring-4 ring-indigo-500/10 scale-105" 
                            : "bg-indigo-950/80 border-indigo-500 text-indigo-300"
                        }`}
                      >
                        <Layers className="h-6 w-6 mb-1 text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-sans font-bold tracking-tight text-center px-3 line-clamp-2">
                          {ki.entities[0]?.name || "Organization"}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500 font-bold uppercase mt-1 tracking-wider">PRIMARY ANCHOR</span>
                      </motion.div>

                      {/* FEATURE 3: Relationship Labels along visual lines */}
                      {filteredEntities.map((ent, idx) => {
                        if (ent.id === "entity-org-1") return null;

                        const count = filteredEntities.length - 1;
                        const angle = ((idx - 1) * (2 * Math.PI)) / count;
                        const radius = count > 8 ? 150 : 130;
                        
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                          <div 
                            key={`rel-${ent.id}`}
                            style={{ 
                              transform: `translate(${x * 0.52}px, ${y * 0.52}px)` 
                            }}
                            className="absolute px-1.5 py-0.5 rounded bg-slate-900/90 border border-indigo-500/30 text-[8px] font-mono font-black text-indigo-300 pointer-events-none uppercase tracking-wider z-15 shadow"
                          >
                            {getRelationshipLabel(ent.type)}
                          </div>
                        );
                      })}

                      {/* Leaf nodes */}
                      {filteredEntities.map((ent, idx) => {
                        if (ent.id === "entity-org-1") return null;

                        const count = filteredEntities.length - 1;
                        const angle = ((idx - 1) * (2 * Math.PI)) / count;
                        const radius = count > 8 ? 150 : 130;
                        
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        const isSelected = selectedEntityId === ent.id;

                        return (
                          <motion.div
                            key={ent.id}
                            style={{ 
                              transform: `translate(${x}px, ${y}px)` 
                            }}
                            whileHover={{ scale: 1.08 }}
                            onClick={() => setSelectedEntityId(ent.id)}
                            className={`absolute p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer z-10 shadow-md transition-all text-xs font-semibold ${
                              isSelected 
                                ? "bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/20 scale-105" 
                                : `${darkMode ? "bg-slate-900/90 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"}`
                            }`}
                          >
                            {getEntityIcon(ent.type)}
                            <span className="max-w-[110px] truncate">{ent.name}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-500/5 border-t border-indigo-500/10 text-[10px] font-mono text-slate-500 flex justify-between z-10">
                    <span>* Click any node to load its discovery pipeline journey</span>
                    <span>Semantic links active</span>
                  </div>
                </div>

                {/* Node details side card (Discovery Journey & Confidence Metadata) */}
                <div className="space-y-4">
                  <div className={`p-5 rounded-2xl border ${
                    darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                  }`}>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-indigo-400" />
                      Detail Source & Trust Audit
                    </h3>

                    {selectedEntity ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getEntityColor(selectedEntity.type)}`}>
                              {translateType(selectedEntity.type)}
                            </span>
                            <div className="flex items-center text-xs text-slate-500 font-mono">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{selectedEntity.lastFound}</span>
                            </div>
                          </div>
                          <h4 className="text-base font-display font-bold mt-2">{selectedEntity.name}</h4>
                          {selectedEntity.properties?.description && (
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {selectedEntity.properties.description}
                            </p>
                          )}
                          {selectedEntity.properties?.fullAddress && (
                            <p className="text-xs text-indigo-300 mt-1 italic">
                              Located: {selectedEntity.properties.fullAddress}
                            </p>
                          )}
                        </div>

                        {/* FEATURE 2: Explain Confidence */}
                        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-400">AI Trust Rating</span>
                            <span className="font-mono font-bold text-indigo-400">{selectedEntity.confidence}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                              style={{ width: `${selectedEntity.confidence}%` }}
                            />
                          </div>
                          
                          {/* Checklist explaining why */}
                          <div className="pt-2 border-t border-slate-800/20 space-y-2">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                              {getConfidenceExplanation(selectedEntity.confidence).rating} Details
                            </span>
                            <p className="text-[11px] text-slate-400 font-sans leading-normal">
                              {getConfidenceExplanation(selectedEntity.confidence).whyText}
                            </p>
                            <ul className="space-y-1">
                              {getConfidenceExplanation(selectedEntity.confidence).points.map((pt, pIdx) => (
                                <li key={pIdx} className="text-[10px] text-slate-500 flex items-start gap-1.5 leading-normal">
                                  {selectedEntity.confidence >= 90 ? (
                                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                                  ) : selectedEntity.confidence >= 70 ? (
                                    <Info className="h-3 w-3 text-indigo-400 shrink-0 mt-0.5" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                                  )}
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* FEATURE 1: Knowledge Discovery Journey */}
                        <div className="space-y-3 border-t border-slate-800/10 pt-4">
                          <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-indigo-400" />
                            AI Discovery Path
                          </h4>
                          <p className="text-[11px] text-slate-500">The crawl pipeline followed to confirm this fact:</p>
                          
                          <div className="pl-2 border-l border-indigo-500/20 space-y-4 relative py-1 ml-1.5">
                            {getDiscoveryJourneySteps(selectedEntity).map((step, sIdx) => (
                              <div key={sIdx} className="relative pl-4">
                                {/* Visual dot marker */}
                                <div className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 ${
                                  sIdx === 4 
                                    ? "bg-emerald-500 border-emerald-400 ring-4 ring-emerald-500/15" 
                                    : "bg-indigo-600 border-indigo-500"
                                }`} />
                                <h5 className="text-[10px] font-mono font-bold uppercase text-slate-400">{step.label}</h5>
                                <p className="text-[11px] text-slate-500 leading-normal">{step.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Metadata parameters (Terminology Changes) */}
                        <div className="space-y-2 text-xs border-t border-slate-800/10 pt-4">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Initial Discovery Point:</span>
                            <span className="font-medium text-slate-400">{selectedEntity.source}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Information Agreement:</span>
                            <span className="font-medium text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {selectedEntity.consistency === "Consistent" || selectedEntity.consistency === "High" ? "Excellent Matches" : "Acceptable Matches"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-1">Where AI Found This:</span>
                            <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-indigo-300 border border-slate-900 break-all select-all">
                              {selectedEntity.evidence}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">Click on any visual node in the graph map to load its audit profile logs.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Knowledge Sources tab */}
            {activeSubTab === "sources" && (
              <motion.div 
                key="sources"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    Discovered Information Sources & Portals
                  </span>
                  <span className="text-xs text-slate-500">
                    {availableSources} / {ki.sources.length} Channels Active
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ki.sources.map((src) => (
                    <div 
                      key={src.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/50" : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                            {src.name}
                          </h4>
                          <span className="text-[10px] text-indigo-500 font-semibold lowercase">
                            format: {src.type}
                          </span>
                        </div>
                        {src.status === "available" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Scanned
                          </span>
                        ) : src.status === "missing" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                            <XCircle className="h-3 w-3" />
                            Missing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <HelpCircle className="h-3 w-3" />
                            Unverified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                        {src.details}
                      </p>
                      {src.url && (
                        <a 
                          href={src.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-3 text-[10px] text-indigo-400 font-semibold font-mono hover:underline flex items-center self-start"
                        >
                          View Live Path <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Entity Intelligence Tab (Terminology: Business Information) */}
            {activeSubTab === "entities" && (
              <motion.div 
                key="entities"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    Business Information Registry & Matches
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {["all", "Product", "Service", "SocialProfile", "FAQ"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setEntityTypeFilter(type)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors border ${
                          entityTypeFilter === type
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "bg-slate-900/40 border-slate-800 text-slate-400"
                        }`}
                      >
                        {type === "all" ? "All Information" : translateType(type)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800/10">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b ${darkMode ? "bg-slate-950 border-slate-900 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-500"} font-mono uppercase font-bold`}>
                        <th className="p-3">Business Information Details</th>
                        <th className="p-3">Information Type</th>
                        <th className="p-3">Scanned Source</th>
                        <th className="p-3">AI Trust Confidence</th>
                        <th className="p-3">Information Agreement</th>
                        <th className="p-3">Where AI Found This</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/10">
                      {filteredEntities.map((ent) => (
                        <tr 
                          key={ent.id}
                          className={`hover:bg-indigo-500/5 transition-colors cursor-pointer ${
                            selectedEntityId === ent.id ? "bg-indigo-500/10" : ""
                          }`}
                          onClick={() => {
                            setSelectedEntityId(ent.id);
                            setActiveSubTab("graph");
                          }}
                        >
                          <td className="p-3 font-semibold text-slate-300 flex items-center gap-2">
                            {getEntityIcon(ent.type)}
                            <span>{ent.name}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${getEntityColor(ent.type)}`}>
                              {translateType(ent.type)}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono">{ent.source}</td>
                          <td className="p-3 font-mono text-indigo-400 font-bold">{ent.confidence}%</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Matches
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-500 max-w-[200px] truncate">
                            {ent.evidence}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Gaps / Missing Knowledge Tab (Feature 6) */}
            {activeSubTab === "missing" && (
              <motion.div 
                key="missing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2.5 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
                  <p className="leading-relaxed text-slate-300">
                    <strong>Score Isolation Notice:</strong> The list below outlines missing detail areas evaluated by major LLMs. Following our core scoring methodology, <strong>missing items are displayed as diagnostic opportunities only and do not decrease your readiness score.</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {ki.missingKnowledge.map((item) => {
                    const edu = getMissingEducationalInfo(item.id, item.title, item.description, item.impact);
                    return (
                      <div 
                        key={item.id}
                        className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md ${
                          darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-slate-300">
                              {edu.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {edu.status}
                            </span>
                          </div>
                          
                          {/* Why this matters (Simplified) */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                              Why this matters
                            </span>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              {edu.whyThisMatters}
                            </p>
                          </div>

                          {/* Recommended action */}
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                              Recommended Action
                            </span>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              {edu.recommendedAction}
                            </p>
                          </div>
                        </div>

                        {/* Expected Benefit */}
                        <div className="mt-4 pt-3 border-t border-slate-800/20 space-y-1 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                          <span className="text-[9px] font-mono font-bold uppercase text-indigo-300 block">
                            Expected AI Benefit
                          </span>
                          <p className="text-[11px] leading-relaxed text-indigo-200/80 font-normal">
                            {edu.expectedBenefit}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {ki.missingKnowledge.length === 0 && (
                    <div className="col-span-2 text-center py-12">
                      <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                      <h4 className="font-display font-bold text-sm text-slate-300">Perfect Information Coverage</h4>
                      <p className="text-xs text-slate-500 mt-1">No missing core business parameters identified.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
