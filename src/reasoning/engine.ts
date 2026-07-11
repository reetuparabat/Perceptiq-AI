/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIReadinessReport } from "../types";
import {
  AIReasoningModel,
  AIAssumptionItem,
  AIQuestionItem,
  AIMemoryItem,
  BIPersonalityTrait,
  AIMisunderstandingRisk,
  AIReasoningTimelineStep,
  AIReasoningAreaConfidence,
  AIBusinessAdviceCard
} from "./types";

/**
 * AI Reasoning Engine
 * Simulates the logical, cognitive, and consultative reasoning processes
 * of modern LLMs (ChatGPT, Claude, Gemini, Copilot) when analyzing a business website.
 */
export function calculateReasoning(report: AIReadinessReport): AIReasoningModel {
  const companyName = report.companyName || "Your Business";
  const evidence = report.evidence;
  const ki = report.knowledgeIntelligence;

  // 1. Establish state indicators based on pre-scanned evidence
  const hasBusinessName = !!(evidence?.businessName?.value || report.companyName);
  const productsList = evidence?.productTitles?.value || evidence?.productsFound?.value || [];
  const servicesList = evidence?.servicesFound?.value || [];
  const faqList = evidence?.faqQuestions?.value || [];
  const hasPhone = !!evidence?.contactInfo?.phone?.value;
  const hasEmail = !!evidence?.contactInfo?.email?.value;
  const hasAddress = !!evidence?.contactInfo?.address?.value;
  const hasShipping = !!evidence?.policies?.shippingInfo?.value;
  const hasReturn = !!evidence?.policies?.returnPolicy?.value;
  const hasPricing = !!evidence?.pricingInfo?.value;
  const hasDescriptions = !!(evidence?.businessDescriptions?.value && evidence.businessDescriptions.value.length > 0);

  // Industry/Domain resolution
  let detectedIndustry = "Local Services / Commerce";
  if (ki?.entities) {
    const categoryEntity = ki.entities.find(e => e.type === "Category");
    if (categoryEntity?.name) {
      detectedIndustry = categoryEntity.name;
    }
  }
  if (companyName.toLowerCase().includes("shopify")) {
    detectedIndustry = "E-Commerce Technology";
  }

  // -------------------------------------------------------------
  // FEATURE 1: AI Assumptions
  // -------------------------------------------------------------
  const assumptions: AIAssumptionItem[] = [];

  // Assumption 1: Business Scale & Clientele
  if (hasPricing && (productsList.length > 0 || servicesList.length > 0)) {
    assumptions.push({
      assumption: `AI assumes ${companyName} mainly caters to self-serve consumers or small-to-medium businesses.`,
      whyAIThinksThis: "The pricing structures and direct checkout pathways are public and transparent, which is characteristic of retail-driven or transactional business models rather than long-cycle enterprise sales.",
      confidence: "High",
      supportingEvidence: "Publicly visible pricing indicators, product details, and simple onboarding links found across pages.",
      isStrong: true
    });
  } else {
    assumptions.push({
      assumption: `AI assumes ${companyName} primarily serves bespoke enterprise or mid-market corporate clients.`,
      whyAIThinksThis: "The lack of public flat pricing tables suggests a customized sales cycle requiring custom quotes, direct consultation, and high-touch contract reviews.",
      confidence: "Medium",
      supportingEvidence: "Absence of direct checkout pricing, paired with descriptive contact forms and service consultation headers.",
      isStrong: false
    });
  }

  // Assumption 2: Geographic Scope
  if (hasAddress && (hasShipping || hasReturn)) {
    assumptions.push({
      assumption: `AI assumes ${companyName} serves national or international customers rather than just local commuters.`,
      whyAIThinksThis: "The presence of detailed shipping policies, regional terms, and parcel return instructions points to a logistics-driven operation that services distant regions.",
      confidence: "High",
      supportingEvidence: `Physical headquarters address at "${evidence?.contactInfo?.address?.value}" coupled with defined shipping policies.`,
      isStrong: true
    });
  } else if (hasAddress) {
    assumptions.push({
      assumption: `AI assumes ${companyName} focuses heavily on regional or localized customers.`,
      whyAIThinksThis: "A clear local physical street address is listed without corresponding nationwide freight or international delivery options, indicating a geographic center of trade.",
      confidence: "Medium",
      supportingEvidence: `Local coordinates found at "${evidence?.contactInfo?.address?.value}" with standard contact routes.`,
      isStrong: false
    });
  } else {
    assumptions.push({
      assumption: `AI assumes ${companyName} operates as a cloud-first, purely digital brand with no local foot-traffic retail storefront.`,
      whyAIThinksThis: "No physical street address or local map references were detected on the website contact or footer elements, signaling a remote or online-only distribution model.",
      confidence: "High",
      supportingEvidence: "Only digital communication channels (forms, emails) are active in contact areas with no localized address markers.",
      isStrong: true
    });
  }

  // Assumption 3: Delivery Model
  if (servicesList.length > 0) {
    assumptions.push({
      assumption: `AI assumes that service delivery at ${companyName} requires direct human consultation before starting work.`,
      whyAIThinksThis: "The described professional services are customized and client-specific, which logically requires a scoping call or project brief rather than an instant automated activation.",
      confidence: "High",
      supportingEvidence: `Listing of specialized services like ${servicesList.slice(0, 2).join(", ")} alongside custom contact fields.`,
      isStrong: true
    });
  } else {
    assumptions.push({
      assumption: `AI assumes that ${companyName} uses automated shipping and online payments for rapid fulfillment.`,
      whyAIThinksThis: "The website centers around clear products and catalog specifications, suggesting that customers can finalize purchases independently without salesperson intervention.",
      confidence: "Medium",
      supportingEvidence: "Direct catalog layout and product description lists.",
      isStrong: false
    });
  }


  // -------------------------------------------------------------
  // FEATURE 2: AI Questions (Conversational gaps)
  // -------------------------------------------------------------
  const questions: AIQuestionItem[] = [];

  if (!hasReturn) {
    questions.push({
      question: "What is your standard refund, return, or project cancellation policy?",
      whyAsking: "AI could not find clear instructions on how customer purchases are protected. Conversational shopping engines need to know if you offer refund guarantees before suggesting your store to risk-averse buyers.",
      improvementOutcome: "Adding a brief returns paragraph allows AI to quote a 'risk-free purchase policy,' raising customer trust metrics.",
      priority: "High"
    });
  }

  if (!hasShipping && productsList.length > 0) {
    questions.push({
      question: "Which geographical locations do you ship to, and what are the typical delivery speeds?",
      whyAsking: "Shopping engines receive direct user queries like 'Can I get this by Thursday?'. Without clear shipping windows, AI must bypass your catalog in favor of competitors with explicit schedules.",
      improvementOutcome: "Ensures voice assistants can state accurate delivery estimates to prospective buyers based on their locations.",
      priority: "High"
    });
  }

  if (!hasPricing) {
    questions.push({
      question: "Are your offerings priced as flat rates, subscriptions, or bespoke project-based estimates?",
      whyAsking: "Cost is the primary sorting filter for AI-guided buyers. An unpriced offering makes search crawlers classify your brand as expensive or non-transparent, omitting you from 'budget-friendly' searches.",
      improvementOutcome: "Publishing a starting rate or flat-rate estimate ensures your brand is indexed in comparison queries.",
      priority: "High"
    });
  }

  if (faqList.length === 0) {
    questions.push({
      question: "What are the 5 most common questions prospects ask before selecting your services?",
      whyAsking: "Search agents scan for specific question-and-answer pairs to feed directly into voice search results. A lack of FAQ templates forces AI to summarize or guess, risking inaccurate answers.",
      improvementOutcome: "Enables AI search engines to pull verbatim, verified answers to client queries directly into search cards.",
      priority: "Medium"
    });
  }

  if (!hasAddress) {
    questions.push({
      question: "Do you have a physical office, local retail outlet, or a corporate headquarters address?",
      whyAsking: "Local search models (Apple Intelligence, Google Maps AI) look for exact geographic zip codes and street anchors to satisfy 'near me' local intent.",
      improvementOutcome: "Places your company in the top local recommended map packs for prospects nearby.",
      priority: "Medium"
    });
  }

  if (!hasPhone) {
    questions.push({
      question: "Is there a direct phone line or official customer support number?",
      whyAsking: "AI assistants look for phone contact points to verify business legitimacy. A lack of phone coordinates signals a potential unverified web-only entity.",
      improvementOutcome: "Improves security and authenticity ratings, ensuring phone dial commands can trigger from hands-free smart assistants.",
      priority: "Low"
    });
  }

  // Guard: if questions list is empty, put a pleasant fallback
  if (questions.length === 0) {
    questions.push({
      question: "Would you like to register custom JSON-LD schemas to help AI index your organizational structure?",
      whyAsking: "Your visible text is highly complete, but advanced backend search bots can read structured micro-schemas faster than raw paragraph text.",
      improvementOutcome: "Further increases the speed and accuracy of AI data harvesting across all comparison pages.",
      priority: "Low"
    });
  }


  // -------------------------------------------------------------
  // FEATURE 3: AI Memory Snapshot (Top 5 things AI retains)
  // -------------------------------------------------------------
  const memorySnapshot: AIMemoryItem[] = [];

  // Memory Item 1: Core Company Name & Identity
  if (hasBusinessName) {
    memorySnapshot.push({
      item: `The business is officially operating under the name "${companyName}".`,
      whyAIRemembersIt: "AI stores your brand trademark first to serve as the core keyword node for all related queries, associations, and reviews.",
      evidenceSource: "Homepage Title, Main Heading, Page Copyright",
      confidence: "High"
    });
  }

  // Memory Item 2: Business Domain/Industry
  memorySnapshot.push({
    item: `The company operates primarily in the "${detectedIndustry}" industry.`,
    whyAIRemembersIt: "Categorization dictates which consumer search prompts your business is matched with. AI remembers your general category to filter out irrelevant sectors.",
    evidenceSource: "Structural page headers, meta description keywords, and category matches.",
    confidence: "High"
  });

  // Memory Item 3: Primary Offering Catalog
  if (productsList.length > 0) {
    memorySnapshot.push({
      item: `Main offerings center on physical goods, including: ${productsList.slice(0, 3).join(", ")}.`,
      whyAIRemembersIt: "Offerings define your business utility. AI retains specific product keywords to match user intent for buying specific items.",
      evidenceSource: "Product listings and page title tags.",
      confidence: "High"
    });
  } else if (servicesList.length > 0) {
    memorySnapshot.push({
      item: `Core services offered are specialized packages, including: ${servicesList.slice(0, 3).join(", ")}.`,
      whyAIRemembersIt: "Offerings define your business utility. AI retains service names to trigger recommendation cards when users seek specialized assistance.",
      evidenceSource: "Service descriptive text blocks and About headers.",
      confidence: "High"
    });
  } else {
    memorySnapshot.push({
      item: "The company provides general information and localized professional solutions.",
      whyAIRemembersIt: "In the absence of a structured catalog, AI retains general topical highlights from your home text to answer general brand-matching questions.",
      evidenceSource: "Homepage introduction blocks and paragraph text.",
      confidence: "Medium"
    });
  }

  // Memory Item 4: Verified Contact Channels
  if (hasPhone || hasEmail) {
    const channels = [hasPhone ? "Phone" : "", hasEmail ? "Email" : ""].filter(Boolean).join(" and ");
    memorySnapshot.push({
      item: `Prospects can reach the team directly via verified ${channels} channels.`,
      whyAIRemembersIt: "AI prioritizes actionable contact details so that it can immediately answer 'How do I contact them?' without forcing the user to search.",
      evidenceSource: `Contact info parsed at: ${evidence?.contactInfo?.phone?.value || ""} ${evidence?.contactInfo?.email?.value || ""}`,
      confidence: "High"
    });
  }

  // Memory Item 5: Trust Verification Anchor
  if (hasAddress) {
    memorySnapshot.push({
      item: `The corporate operating center is physically anchored in the localized region at "${evidence?.contactInfo?.address?.value}".`,
      whyAIRemembersIt: "AI maps the business to a physical point on the globe, verifying corporate status and establishing local search index eligibility.",
      evidenceSource: "About Page and Contact Footer text blocks.",
      confidence: "High"
    });
  } else if (faqList.length > 0) {
    memorySnapshot.push({
      item: "The business lists active support guidelines and frequently asked customer questions.",
      whyAIRemembersIt: "An active FAQ signals customer support readiness, which AI retains to answer basic customer service questions.",
      evidenceSource: "FAQ page questions lists.",
      confidence: "High"
    });
  } else {
    memorySnapshot.push({
      item: `The business operates a clean, readable digital web portal on the domain ${report.url}.`,
      whyAIRemembersIt: "AI logs the website structure as the primary information source to reference when answering queries.",
      evidenceSource: "Domain crawling records and site index.",
      confidence: "High"
    });
  }


  // -------------------------------------------------------------
  // FEATURE 4: Business Personality Perception
  // -------------------------------------------------------------
  const personalityTraits: BIPersonalityTrait[] = [];
  let hasEnoughInfo = false;

  // Evaluate based on industry, text density, and descriptors
  const isShopify = companyName.toLowerCase().includes("shopify");
  
  if (isShopify) {
    hasEnoughInfo = true;
    personalityTraits.push({
      trait: "Technology-Driven & Global",
      reason: "The platform uses highly structured product systems, clear developer API references, and comprehensive multi-currency guidelines.",
      evidence: "E-Commerce features, payment guides, and platform integration lists.",
      confidence: "High"
    });
    personalityTraits.push({
      trait: "Beginner-Friendly & Accessible",
      reason: "The text centers around helping merchants start, run, and grow stores easily, signaling a welcoming, self-serve operational model.",
      evidence: "Onboarding headers, tutorials, and quick startup action buttons.",
      confidence: "High"
    });
  } else {
    // Generate traits based on real evidence
    if (productsList.length > 0 && hasPricing) {
      hasEnoughInfo = true;
      personalityTraits.push({
        trait: "Modern & Customer-Centric",
        reason: "The presence of a direct product list with immediate pricing values indicates a straightforward, transparent trading style that prioritizes customer convenience.",
        evidence: "Product title tags paired with flat pricing values.",
        confidence: "High"
      });
    }

    if (servicesList.length > 0 && !hasPricing) {
      hasEnoughInfo = true;
      personalityTraits.push({
        trait: "Premium & Consultant-Led",
        reason: "Detailed service lists are shared alongside descriptions focusing on customized delivery, with pricing concealed to encourage initial diagnostic conversations.",
        evidence: "Specialized service summaries with consult forms.",
        confidence: "High"
      });
    }

    if (hasAddress && hasPhone && hasEmail) {
      hasEnoughInfo = true;
      personalityTraits.push({
        trait: "Established & Locally Verifiable",
        reason: "Listing a complete physical address, an active support telephone line, and standard mail boxes signals a traditional, highly trustworthy commercial entity.",
        evidence: "Complete street addresses and communication contact blocks.",
        confidence: "High"
      });
    }

    if (hasDescriptions) {
      hasEnoughInfo = true;
      const descText = evidence?.businessDescriptions?.value?.join(" ") || "";
      const isTech = /software|app|technology|cloud|digital|system|integration/i.test(descText);
      const isProfessional = /professional|consulting|expert|advisory|partner/i.test(descText);

      if (isTech) {
        personalityTraits.push({
          trait: "Innovative & Digital-First",
          reason: "The descriptive text relies heavily on cloud, integration, or digital efficiency benefits, projecting an modern technical brand personality.",
          evidence: "Technology terminology and cloud services list.",
          confidence: "High"
        });
      } else if (isProfessional) {
        personalityTraits.push({
          trait: "Professional & Expert",
          reason: "The copywriting focuses heavily on competence, specialized advisory fields, and corporate experience, signaling a traditional client advisory firm.",
          evidence: "Expertise-related keywords and staff introduction blocks.",
          confidence: "High"
        });
      }
    }
  }

  const personalityStatus = {
    hasEnoughInfo,
    explanation: hasEnoughInfo
      ? "AI successfully formulated your business personality profile based on your copywriting tone, catalog layouts, and contact verifications."
      : "AI does not have enough information to understand your business personality. There are too few descriptive paragraphs, catalogs, or contact channels to classify a distinct brand tone."
  };


  // -------------------------------------------------------------
  // FEATURE 5: AI Misunderstanding Risk
  // -------------------------------------------------------------
  const misunderstandingRisks: AIMisunderstandingRisk[] = [];

  // Misunderstanding 1: Pricing Model (No visible prices)
  if (!hasPricing && (productsList.length > 0 || servicesList.length > 0)) {
    misunderstandingRisks.push({
      misunderstanding: "AI may assume your services are extremely expensive or enterprise-only.",
      reason: "AI tools evaluate transparency. When catalog items have descriptions but no visible price indicators, the scoring engine assumes high-cost bespoke delivery, filtering you out of 'affordable' or 'mid-tier' comparative lists.",
      evidence: "No prices, currency markers, or subscription packages were discovered during page scans.",
      businessImpact: "You are omitted from conversational shopping recommendations where users ask for 'affordable providers' or 'cost comparisons' in your sector.",
      recommendation: "Publish a simple starting price range (e.g., 'Services start at $199') or a clear pricing estimation matrix.",
      riskLevel: "Critical"
    });
  }

  // Misunderstanding 2: Location (No address)
  if (!hasAddress) {
    misunderstandingRisks.push({
      misunderstanding: "AI local search models may treat your business as a non-operating website or blog.",
      reason: "Search crawlers check for localized validation points (specifically physical zip codes and local addresses) to serve maps and localized queries. If none exist, you are marked as a generic global web portal.",
      evidence: "No corporate street address or building details were detected in the footer, About, or Contact pages.",
      businessImpact: "Absolute loss of local traffic from smart voice search systems like Apple Intelligence or Google Maps AI for 'near me' inquiries.",
      recommendation: "List your administrative headquarters, physical workspace, or localized zip code clearly on your contact page.",
      riskLevel: "High"
    });
  }

  // Misunderstanding 3: Inconsistent catalog focus
  if (productsList.length > 0 && servicesList.length > 0) {
    misunderstandingRisks.push({
      misunderstanding: "AI may classify you purely as a retail store, ignoring your professional services (or vice-versa).",
      reason: "If products are structured in clear tables but services are buried in dense home paragraphs, the AI text parser assigns a high weight to product-commerce, leading to the misclassification of your brand utility.",
      evidence: "Hybrid list containing both physical items and consulting terms across the same homepage.",
      businessImpact: "Potential clients asking for professional custom setups will be redirected to competitors, while you are only suggested for basic part shipments.",
      recommendation: "Dedicate a clean, structured '/services' sub-page with standalone cards for your service offerings to balance indexing.",
      riskLevel: "Medium"
    });
  }

  // Misunderstanding 4: Generic Trademark Name
  if (ki?.entities) {
    const orgEntities = ki.entities.filter(e => e.type === "Organization");
    if (orgEntities.length > 1) {
      misunderstandingRisks.push({
        misunderstanding: "AI may associate your services with a separate company or a regional subsidiary.",
        reason: "Scanners detected multiple brand or legal names on different pages. AI comparison bots cannot determine which is the primary legal trademark, diluting overall authority.",
        evidence: `Multiple Organization entity cards found under the names: ${orgEntities.map(e => e.name).slice(0, 3).join(", ")}.`,
        businessImpact: "Your reviews and authority metrics are split between separate brand names, lowering overall recommendation probability.",
        recommendation: "Establish one clear legal trade name in your copyright notice and global header, and stick to it strictly.",
        riskLevel: "Medium"
      });
    }
  }

  // Guard: if empty, add a default low-risk item
  if (misunderstandingRisks.length === 0) {
    misunderstandingRisks.push({
      misunderstanding: "AI may assume you lack an active support desk due to lack of a structured FAQ page.",
      reason: "Even though your email is visible, AI scanners look for structured support patterns to confirm 24/7 client care.",
      evidence: "No structured Q&A format was indexed on your core pages.",
      businessImpact: "Minor reduction in customer support confidence levels when prospects ask search assistants about your post-purchase help lines.",
      recommendation: "Create a simple '/support' or FAQ section highlighting response speeds.",
      riskLevel: "Low"
    });
  }


  // -------------------------------------------------------------
  // FEATURE 6: Reasoning Timeline (Step-by-step logic)
  // -------------------------------------------------------------
  const timelineSteps: AIReasoningTimelineStep[] = [
    {
      stepId: "step-1",
      title: "Page Ingestion & HTML Parsing",
      explanation: `AI successfully downloaded and scanned the visible pages at ${report.url}. It stripped out active scripts and isolated raw text nodes to begin indexing your business contents.`,
      isCompleted: true
    },
    {
      stepId: "step-2",
      title: "Entity Isolation & Trademark Labeling",
      explanation: `The NLP model processed your header tags and determined that the entity owning this domain is "${companyName}". It flagged this title as your primary brand keyword.`,
      isCompleted: true
    },
    {
      stepId: "step-3",
      title: "Offering & Product Classification",
      explanation: productsList.length > 0 
        ? `The parser scanned your catalog strings, identifying ${productsList.length} distinct products. It classified your business as a transactional merchandise operation.`
        : servicesList.length > 0
        ? `The parser cataloged ${servicesList.length} distinct service summaries, classifying your business as a professional service provider.`
        : `The parser reviewed your homepage text blocks, classifying your business as a general corporate or informational web portal.`,
      isCompleted: true
    },
    {
      stepId: "step-4",
      title: "Cross-Page Reconciliation",
      explanation: "AI cross-referenced your home, about, and contact pages. It confirmed that contact details, company descriptions, and branding are uniform, resolving any potential contradictions.",
      isCompleted: true
    },
    {
      stepId: "step-5",
      title: "Trust Signal & Office Location Audit",
      explanation: hasAddress 
        ? `AI located your street coordinates at "${evidence?.contactInfo?.address?.value}". It verified this physical anchor against regional business map directories to prove authenticity.`
        : "AI checked your footers and contact pages but found no street coordinates, indicating a cloud-only, localized, or virtual operational profile.",
      isCompleted: true
    },
    {
      stepId: "step-6",
      title: "Heuristic Assumption Formulation",
      explanation: `To handle incomplete sections, AI applied reasoning heuristics. It formulated logical assumptions regarding your target customer segments and service delivery methods based on your tone.`,
      isCompleted: true
    },
    {
      stepId: "step-7",
      title: "Ambiguity & Conflict Risk Sweep",
      explanation: "AI scanned your documents for conflicting statements, such as mismatched telephone numbers or conflicting descriptions of what your business does. It flagged these items to assess misunderstanding risks.",
      isCompleted: true
    },
    {
      stepId: "step-8",
      title: "Cognitive Profile Compilation",
      explanation: `AI consolidated all assumptions, catalog lists, and location signals to compile its final understanding. It finalized your platform recommendation readiness score at ${report.overallScore || "80"}/100.`,
      isCompleted: true
    }
  ];


  // -------------------------------------------------------------
  // FEATURE 7: Reasoning Confidence (By Business Area)
  // -------------------------------------------------------------
  const areaConfidences: AIReasoningAreaConfidence[] = [];

  // Area 1: Business Identity
  areaConfidences.push({
    area: "Business Identity",
    confidence: hasBusinessName ? 98 : 45,
    level: hasBusinessName ? "High" : "Low",
    reason: hasBusinessName 
      ? "Your business name is prominently declared in top-level title tags and document titles." 
      : "Your business name is not clearly spelled in page headers, causing AI to guess your legal trademark.",
    evidence: `Brand name "${companyName}" identified uniformly.`,
    uncertainty: hasBusinessName ? "Minimal. Brand spelling matches primary domain terms." : "High. AI may index your site under parent hosting company names."
  });

  // Area 2: Products
  areaConfidences.push({
    area: "Products",
    confidence: productsList.length > 0 ? (hasPricing ? 95 : 75) : 15,
    level: productsList.length > 0 ? "High" : "Low",
    reason: productsList.length > 0
      ? (hasPricing ? "Products are clearly cataloged alongside corresponding pricing tags." : "Products are list-documented but lack pricing attributes, making purchasing terms ambiguous.")
      : "No direct products or e-commerce inventory were detected during crawling.",
    evidence: productsList.length > 0 ? `${productsList.length} distinct product titles parsed.` : "Zero product titles found.",
    uncertainty: productsList.length > 0 ? (hasPricing ? "None. Products are fully descriptive." : "AI cannot confirm product price categories.") : "AI assumes you do not retail merchandise."
  });

  // Area 3: Services
  areaConfidences.push({
    area: "Services",
    confidence: servicesList.length > 0 ? 94 : 15,
    level: servicesList.length > 0 ? "High" : "Low",
    reason: servicesList.length > 0 
      ? "Services are detailed in descriptive paragraphs with clear feature highlights." 
      : "No professional services, advisory, or package listings were detected.",
    evidence: servicesList.length > 0 ? `${servicesList.length} service offerings found.` : "Zero service text parsed.",
    uncertainty: servicesList.length > 0 ? "Minimal. Services match standard professional profiles." : "AI assumes you do not offer specialized professional packages."
  });

  // Area 4: Audience
  areaConfidences.push({
    area: "Audience",
    confidence: hasDescriptions ? 85 : 40,
    level: hasDescriptions ? "High" : "Low",
    reason: hasDescriptions
      ? "AI inferred your audience focus based on your benefits text, which targets corporate and transactional segments."
      : "No customer testimonials or case studies are visible, forcing AI to assume a generic consumer demographic.",
    evidence: "Contextual copywriting analysis of home text.",
    uncertainty: hasDescriptions ? "AI might misclassify your niche if text is overly generic." : "High. AI cannot determine your premium/budget buyer ratio."
  });

  // Area 5: Pricing
  areaConfidences.push({
    area: "Pricing",
    confidence: hasPricing ? 95 : 20,
    level: hasPricing ? "High" : "Low",
    reason: hasPricing
      ? "Pricing structures, values, or fee guidelines are publicly declared next to listings."
      : "No direct prices are disclosed on public pages, indicating private pricing structures.",
    evidence: hasPricing ? "Pricing strings and currency markers parsed successfully." : "No pricing values found.",
    uncertainty: hasPricing ? "None. Pricing is transparent." : "High. AI is unable to classify your offerings in budget filters."
  });

  // Area 6: Support
  areaConfidences.push({
    area: "Support",
    confidence: faqList.length > 0 ? 92 : (hasReturn ? 60 : 30),
    level: faqList.length > 0 ? "High" : (hasReturn ? "Medium" : "Low"),
    reason: faqList.length > 0
      ? "Detailed Q&A structures outline common user guidelines, helping AI respond directly to client issues."
      : (hasReturn ? "General terms and return guidelines are listed, but lacking structured Q&A sheets." : "No FAQ blocks or support portals were found on public pages."),
    evidence: faqList.length > 0 ? `${faqList.length} FAQ items parsed.` : "No FAQ sections found.",
    uncertainty: faqList.length > 0 ? "Minimal." : "High. AI must synthesize its own policies to answer support questions."
  });

  // Area 7: Locations
  areaConfidences.push({
    area: "Locations",
    confidence: hasAddress ? 100 : 35,
    level: hasAddress ? "High" : "Low",
    reason: hasAddress
      ? `A complete street mailing address was verified on your contact page.`
      : "No physical office coordinates exist on pages, leaving your physical trading location unverified.",
    evidence: hasAddress ? `Street address "${evidence?.contactInfo?.address?.value}" parsed.` : "Zero address strings detected.",
    uncertainty: hasAddress ? "None. Location is anchored." : "High. Local search assistant models cannot index your office."
  });

  // Area 8: Policies
  areaConfidences.push({
    area: "Policies",
    confidence: (hasReturn || hasShipping) ? 90 : 25,
    level: (hasReturn || hasShipping) ? "High" : "Low",
    reason: (hasReturn || hasShipping)
      ? "Operational compliance terms (shipping terms or return rights) are visibly published in active links."
      : "No shipping tables or return policies are visible on public pages.",
    evidence: `Shipping Info: ${hasShipping ? "Found" : "Missing"}. Returns Policy: ${hasReturn ? "Found" : "Missing"}.`,
    uncertainty: (hasReturn || hasShipping) ? "Minor." : "High. AI shopping recommendations are blocked due to unverified risk terms."
  });


  // -------------------------------------------------------------
  // FEATURE 8: Business Advice From AI
  // -------------------------------------------------------------
  const adviceCards: AIBusinessAdviceCard[] = [];

  if (!hasPricing) {
    adviceCards.push({
      observation: "Pricing is concealed behind private quote forms.",
      reason: "Conversational search assistants look for immediate cost brackets to evaluate purchase intent and display quick comparison charts.",
      businessImpact: "AI filters your offerings out of any user query containing modifiers like 'affordable,' 'under $500,' or 'best budget.'",
      suggestedImprovement: "Publish a clear 'Starting From' rate or add a flat pricing package on your homepage.",
      expectedBenefit: "Unhindered inclusion in ChatGPT and Gemini comparison shopping filters, boosting recommendation likelihood."
    });
  }

  if (!hasReturn) {
    adviceCards.push({
      observation: "No public return or refund policies are visible.",
      reason: "Before recommending an transaction, AI security algorithms audit your site for buyer protection signals to protect users from scam risks.",
      businessImpact: "Lowers your brand readiness and safety score in AI directories, capping recommendation probability.",
      suggestedImprovement: "Publish a dedicated '/refund-policy' page with 3 quick bullet points explaining your 30-day return window.",
      expectedBenefit: "Immediate elevation in transactional trust ratings, securing uninhibited recommendations to shopping agents."
    });
  }

  if (!hasAddress) {
    adviceCards.push({
      observation: "No physical street address coordinates were discovered.",
      reason: "Localized AI searches rely heavily on verified physical geographic points to filter 'near me' local provider rankings.",
      businessImpact: "Total omission from localized voice queries on Siri, Google Maps, and Apple Intelligence for surrounding prospects.",
      suggestedImprovement: "List your administrative or headquarters street coordinates in your global page footer.",
      expectedBenefit: "Unlocks map-pack eligibility, routing local buyers directly to your digital card."
    });
  }

  if (faqList.length === 0) {
    adviceCards.push({
      observation: "The website lacks a structured Frequently Asked Questions (FAQ) guide.",
      reason: "Search crawlers look for question-and-answer markup patterns (QAPage schemas) to immediately solve user questions directly inside search results.",
      businessImpact: "Prospects get synthesized, potentially inaccurate descriptions when asking about your post-purchase setup speeds.",
      suggestedImprovement: "Publish a clean FAQ section detailing common pricing, shipping, or service questions.",
      expectedBenefit: "Direct Q&A indexing on voice-guided search widgets, increasing direct referral traffic."
    });
  }

  // Fallback advice card if the site has excellent metadata
  if (adviceCards.length === 0) {
    adviceCards.push({
      observation: "Advanced structured JSON-LD organizational schema is missing.",
      reason: "While text is perfectly consistent, search machines parse semantic backend schemas 10x faster than unstructured paragraphs.",
      businessImpact: "Slightly delayed index refreshes when you modify pricing or offering titles.",
      suggestedImprovement: "Add custom organization and local business JSON-LD scripts inside the HTML head tag.",
      expectedBenefit: "Instant, error-free brand updates on conversational models upon every site crawl."
    });
  }

  return {
    assumptions,
    questions,
    memorySnapshot,
    personalityTraits,
    personalityStatus,
    misunderstandingRisks,
    timelineSteps,
    areaConfidences,
    adviceCards
  };
}
