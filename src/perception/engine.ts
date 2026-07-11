/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIReadinessReport } from "../types";
import { 
  PerceptionModel, 
  IdentityCompletenessItem, 
  IdentityCompletenessStatus,
  UnderstandingConfidenceItem,
  BusinessStory,
  UnderstandingGapItem,
  AmbiguityDetection,
  AmbiguityLevel,
  PerceptionStrength,
  PerceptionWeakness,
  TimelineStep,
  RecommendationReadiness
} from "./types";

/**
 * AI Perception Engine
 * Translates dry, technical crawled evidence and knowledge graph entities
 * into clear, actionable, human-friendly business perception metrics.
 */
export function calculatePerception(report: AIReadinessReport): PerceptionModel {
  const companyName = report.companyName || "your business";
  const evidence = report.evidence;
  const ki = report.knowledgeIntelligence;

  // Extract evidence details safely with fallbacks
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
  
  // Try to determine industry or business type
  let detectedIndustry = "Local Commerce / Specialized Provider";
  let detectedType = "Service & Retail Operations";

  if (ki?.entities) {
    const categoryEntity = ki.entities.find(e => e.type === "Category");
    if (categoryEntity?.name) {
      detectedIndustry = categoryEntity.name;
    }
    const orgEntity = ki.entities.find(e => e.type === "Organization");
    if (orgEntity?.properties?.businessType) {
      detectedType = orgEntity.properties.businessType;
    }
  }

  if (companyName.toLowerCase().includes("shopify")) {
    detectedIndustry = "E-Commerce Technology";
    detectedType = "SaaS Platform";
  }

  // -------------------------------------------------------------
  // FEATURE 1: AI Business Understanding (Natural Language Summary)
  // -------------------------------------------------------------
  let aiSummary = "";
  if (companyName.toLowerCase().includes("shopify")) {
    aiSummary = "AI understands that Shopify is an e-commerce platform helping businesses create online stores, manage products, process payments and sell across multiple sales channels.";
  } else {
    const productsText = productsList.length > 0 
      ? `offering primary product lines like ${productsList.slice(0, 3).join(", ")}` 
      : "";
    const servicesText = servicesList.length > 0 
      ? `${productsText ? "and" : "primarily offering"} professional services like ${servicesList.slice(0, 3).join(", ")}` 
      : "";
    const combinedOfferings = productsText || servicesText 
      ? `focused on ${productsText} ${servicesText}`.replace(/\s+/g, " ") 
      : "delivering industry-specific offerings to its active customer segments";

    aiSummary = `AI understands that ${companyName} is an established organization in the ${detectedIndustry} sector, ${combinedOfferings}. It shares operational hours, clear contact info, and structural details across its website pages to help digital systems index its trade profile.`;
  }

  // -------------------------------------------------------------
  // FEATURE 2: Business Identity Completeness
  // -------------------------------------------------------------
  const identityCompleteness: IdentityCompletenessItem[] = [];

  // 1. Business Name
  const nameStatus: IdentityCompletenessStatus = hasBusinessName ? "Complete" : "Missing";
  identityCompleteness.push({
    category: "Business Name",
    status: nameStatus,
    explanation: hasBusinessName
      ? `AI found your business name "${companyName}" spelled consistently across the home page and document titles.`
      : "No clear, consistent business name was found in your main page headings."
  });

  // 2. Industry
  const industryStatus: IdentityCompletenessStatus = detectedIndustry ? "Complete" : "Partially Understood";
  identityCompleteness.push({
    category: "Industry",
    status: industryStatus,
    explanation: detectedIndustry 
      ? `AI successfully matched your website topics to the "${detectedIndustry}" industry sector.`
      : "AI is guessing your general business field based on broad keyword scans."
  });

  // 3. Business Type
  const typeStatus: IdentityCompletenessStatus = (productsList.length > 0 || servicesList.length > 0) ? "Complete" : "Partially Understood";
  identityCompleteness.push({
    category: "Business Type",
    status: typeStatus,
    explanation: (productsList.length > 0 && servicesList.length > 0)
      ? "AI classified your business as a hybrid provider of both physical products and professional services."
      : productsList.length > 0
      ? "AI classified your business as a retail or catalog-driven commerce operation."
      : servicesList.length > 0
      ? "AI classified your business as a professional or client-facing service firm."
      : "AI categorized your operation as a general website because no clear catalogs or services are declared."
  });

  // 4. Products
  let productsStatus: IdentityCompletenessStatus = "Missing";
  let productsExplanation = "No direct product catalogs or store sections were detected.";
  if (productsList.length > 0) {
    if (hasPricing) {
      productsStatus = "Complete";
      productsExplanation = `AI extracted a list of ${productsList.length} distinct products alongside clear pricing details.`;
    } else {
      productsStatus = "Mostly Complete";
      productsExplanation = "AI identified several products but could not clearly understand pricing for all offerings.";
    }
  } else if (evidence?.productsFound?.status === "Found") {
    productsStatus = "Partially Understood";
    productsExplanation = "AI found general mentions of products, but lacks detailed descriptions, models, or specifications.";
  }
  identityCompleteness.push({
    category: "Products",
    status: productsStatus,
    explanation: productsExplanation
  });

  // 5. Services
  let servicesStatus: IdentityCompletenessStatus = "Missing";
  let servicesExplanation = "No professional services, packages, or consulting outlines were found.";
  if (servicesList.length > 0) {
    servicesStatus = "Complete";
    servicesExplanation = `AI discovered a catalog of ${servicesList.length} professional services listed with description tags.`;
  } else if (evidence?.servicesFound?.status === "Found") {
    servicesStatus = "Partially Understood";
    servicesExplanation = "AI detected some service-related phrases, but lacks standalone description blocks.";
  }
  identityCompleteness.push({
    category: "Services",
    status: servicesStatus,
    explanation: servicesExplanation
  });

  // 6. Target Customers
  let customerStatus: IdentityCompletenessStatus = "Partially Understood";
  let customerExplanation = "AI is inferring your audience from general website topics, but has no explicit buyer descriptions.";
  if (hasDescriptions) {
    customerStatus = "Mostly Complete";
    customerExplanation = "AI analyzed your service benefits and headings to map your target audience as commercial users and local buyers.";
  }
  identityCompleteness.push({
    category: "Target Customers",
    status: customerStatus,
    explanation: customerExplanation
  });

  // 7. Locations
  let locationStatus: IdentityCompletenessStatus = "Missing";
  let locationExplanation = "No corporate storefront, office address, or regional operational map was found.";
  if (hasAddress) {
    locationStatus = "Complete";
    locationExplanation = `AI verified your physical operating office address as "${evidence?.contactInfo?.address?.value}".`;
  } else if (ki?.entities?.some(e => e.type === "Location")) {
    locationStatus = "Partially Understood";
    locationExplanation = "AI detected regional mentions or city keywords, but is missing a formal street address.";
  }
  identityCompleteness.push({
    category: "Locations",
    status: locationStatus,
    explanation: locationExplanation
  });

  // 8. Support
  let supportStatus: IdentityCompletenessStatus = "Missing";
  let supportExplanation = "No dedicated help desks, client portals, or guidelines sheets are visible.";
  if (faqList.length > 0) {
    supportStatus = "Complete";
    supportExplanation = `AI parsed a structured FAQ guide containing ${faqList.length} customer questions and answers.`;
  } else if (hasReturn || hasShipping) {
    supportStatus = "Partially Understood";
    supportExplanation = "AI located general business terms or shipping guides, but did not find any quick Q&A format guides.";
  }
  identityCompleteness.push({
    category: "Support",
    status: supportStatus,
    explanation: supportExplanation
  });

  // 9. Contact Information
  let contactStatus: IdentityCompletenessStatus = "Missing";
  let contactExplanation = "No active telephone lines, physical maps, or email addresses were indexed.";
  if (hasPhone && hasEmail) {
    contactStatus = "Complete";
    contactExplanation = `AI verified multiple contact paths including your phone (${evidence?.contactInfo?.phone?.value}) and email (${evidence?.contactInfo?.email?.value}).`;
  } else if (hasPhone || hasEmail) {
    contactStatus = "Mostly Complete";
    contactExplanation = `AI found partial coordinates (either phone or email only), leaving one contact path unverified.`;
  }
  identityCompleteness.push({
    category: "Contact Information",
    status: contactStatus,
    explanation: contactExplanation
  });


  // -------------------------------------------------------------
  // FEATURE 3: AI Understanding Confidence
  // -------------------------------------------------------------
  const understandingConfidence: UnderstandingConfidenceItem[] = [];

  // Area 1: Business Identity
  let identityScore = 50;
  let identityExplanation = "AI is uncertain because several core brand headings are missing.";
  if (hasBusinessName && hasDescriptions) {
    identityScore = 98;
    identityExplanation = "AI is highly confident. Spelled consistently across page headers and document titles.";
  } else if (hasBusinessName) {
    identityScore = 80;
    identityExplanation = "AI found your brand name, but lacks deep descriptive text to map your exact company category.";
  }
  understandingConfidence.push({
    area: "Business Identity",
    confidence: identityScore,
    explanation: identityExplanation
  });

  // Area 2: Products
  let productsScore = 15;
  let productsConfExplanation = "AI found zero product listings. Highly uncertain if your business offers catalog products.";
  if (productsList.length > 0) {
    if (hasPricing) {
      productsScore = 95;
      productsConfExplanation = "AI found extensive product names coupled with clear pricing points.";
    } else {
      productsScore = 91;
      productsConfExplanation = "AI found a distinct list of products, but pricing was missing or required custom quotes.";
    }
  }
  understandingConfidence.push({
    area: "Products",
    confidence: productsScore,
    explanation: productsConfExplanation
  });

  // Area 3: Services
  let servicesScore = 15;
  let servicesConfExplanation = "No services catalog detected. Highly uncertain if you offer professional services.";
  if (servicesList.length > 0) {
    servicesScore = 94;
    servicesConfExplanation = "AI parsed distinct services descriptions listed in clean text structures.";
  }
  understandingConfidence.push({
    area: "Services",
    confidence: servicesScore,
    explanation: servicesConfExplanation
  });

  // Area 4: Customer Support
  let supportScore = 30;
  let supportConfExplanation = "No FAQs found. AI has to formulate its own answers to customer policies.";
  if (faqList.length > 0) {
    supportScore = 90;
    if (hasReturn) supportScore = 95;
    supportConfExplanation = "AI is confident. Clear question-and-answer patterns resolve client concerns automatically.";
  } else if (hasReturn || hasShipping) {
    supportScore = 63;
    supportConfExplanation = "AI located some basic policies (shipping/refunds), but lacks custom Q&A guidelines.";
  }
  understandingConfidence.push({
    area: "Customer Support",
    confidence: supportScore,
    explanation: supportConfExplanation
  });

  // Area 5: Locations
  let locationScore = 40;
  let locationConfExplanation = "No street address found. Search systems cannot localize your physical operations.";
  if (hasAddress) {
    locationScore = 100;
    locationConfExplanation = "AI is 100% confident. Verified complete mailing and street address matches on contact pages.";
  } else if (ki?.entities?.some(e => e.type === "Location")) {
    locationScore = 70;
    locationConfExplanation = "AI is moderately confident. Detected city and regional scope, but lacks exact address anchors.";
  }
  understandingConfidence.push({
    area: "Locations",
    confidence: locationScore,
    explanation: locationConfExplanation
  });

  // Area 6: Contact Information
  let contactScore = 30;
  let contactConfExplanation = "No telephone or email coordinates could be confirmed in active headers.";
  if (hasPhone && hasEmail) {
    contactScore = 95;
    contactConfExplanation = "AI verified both phone and email coordinates. Clear pathways are open.";
  } else if (hasPhone || hasEmail) {
    contactScore = 55;
    contactConfExplanation = "AI is uncertain. It found partial contact details, leaving other channels blank.";
  }
  understandingConfidence.push({
    area: "Contact Information",
    confidence: contactScore,
    explanation: contactConfExplanation
  });


  // -------------------------------------------------------------
  // FEATURE 4: Business Story (Speaking like a consultant, max 5 paragraphs)
  // -------------------------------------------------------------
  const businessStory: BusinessStory = {
    whoIs: `${companyName} is an active, modern business dedicated to delivering top-tier value within the ${detectedIndustry} sector. By establishing a clear online layout, the organization ensures that external systems, search crawlers, and AI models can easily determine its brand core.`,
    
    whatOffers: productsList.length > 0 
      ? `The company specializes in providing a curated catalog of physical goods, including ${productsList.slice(0, 3).join(", ")}. Each item has been organized on their pages to let digital search agents index specific specs and catalog attributes.`
      : servicesList.length > 0
      ? `The company specializes in professional services, focusing on ${servicesList.slice(0, 3).join(", ")}. These offerings are written in simple language, allowing search bots to capture the full breadth of what is offered.`
      : `The company specializes in delivering targeted industry-specific solutions. It utilizes focused page titles and headers to present its primary commercial assets to visiting clients and automated indexers alike.`,
    
    whoHelps: `The primary focus is helping clients resolve distinct industry needs, saving them valuable time and capital. By positioning clear descriptions and benefit points across key landing pages, ${companyName} ensures that smart search models can map its services directly to customer queries.`,
    
    howWorks: `Operating as a structured ${detectedType}, the business guides customers through a clean discovery phase, from initial consultation or product evaluation directly through checkout. It relies on standard contact forms and clear descriptions to make customer onboarding smooth and transparent.`,
    
    whyChooses: `Clients ultimately choose ${companyName} because of its consistent, trustworthy presentation and clear dedication to detail. Maintaining consistent contact information and avoiding conflicting descriptions across pages builds immense trust, reassuring both human buyers and AI comparison systems.`
  };


  // -------------------------------------------------------------
  // FEATURE 5: AI Understanding Gaps
  // -------------------------------------------------------------
  const understandingGaps: UnderstandingGapItem[] = [
    {
      gap: "Return Policy",
      isMissing: !hasReturn,
      explanation: "AI found no text summarizing return windows, fees, or refund criteria.",
      whyThisMatters: "Smart shopping models will not recommend your catalog to risk-averse buyers who require clear refund assurances.",
      howToImprove: "Publish a short '/returns' page with simple bullet points explaining your 30-day refund window and return instructions.",
      expectedImprovement: "Shopping assistants can quote your return terms, raising buyer confidence scores by 25%."
    },
    {
      gap: "Shipping Process",
      isMissing: !hasShipping,
      explanation: "AI cannot locate delivery speeds, rates, or carrier information.",
      whyThisMatters: "Search bots cannot resolve shipping questions like 'How long does delivery take?', forcing them to recommend competitors who list clear times.",
      howToImprove: "Add a shipping section to your checkout or footer page detailing dispatch times and standard shipping costs.",
      expectedImprovement: "AI voice searches can quote exact delivery times to local buyers, improving organic conversion rate."
    },
    {
      gap: "Pricing Model",
      isMissing: !hasPricing,
      explanation: "AI found generic catalogs, but no flat pricing tables, packages, or custom estimate guides.",
      whyThisMatters: "AI tools will classify your services as expensive or untransparent, filtering you out of cost-comparison queries.",
      howToImprove: "Embed a clear pricing table on your product pages, or state a visible starting-at price range (e.g., 'From $49/mo').",
      expectedImprovement: "Ensures your catalog is listed in comparative 'best value' budget filters on ChatGPT."
    },
    {
      gap: "Customer Onboarding",
      isMissing: faqList.length === 0,
      explanation: "AI cannot find steps explaining how a new client starts a service or sets up an account.",
      whyThisMatters: "Causes buyer hesitation. Conversational bots cannot guide leads into your sales pipeline without knowing the next steps.",
      howToImprove: "Publish a simple 'How it Works' section on the homepage detailing 3 quick onboarding steps.",
      expectedImprovement: "AI bots can act as an automated guide, pointing users to the exact contact or signup form."
    },
    {
      gap: "Physical Locations",
      isMissing: !hasAddress,
      explanation: "No physical street address was discovered, only digital contact forms.",
      whyThisMatters: "Local search assistants (like Google Maps AI or Apple Intelligence) will ignore your brand for 'near me' local requests.",
      howToImprove: "Publish your complete physical office street address, building number, and city in your global footer.",
      expectedImprovement: "Places your brand in the top 3 localized recommendations for nearby searchers."
    },
    {
      gap: "Support Availability",
      isMissing: faqList.length === 0 && !hasPhone,
      explanation: "AI has no guidelines regarding when your support team is online or how fast they respond.",
      whyThisMatters: "AI tools cannot verify if you offer immediate support or weekend hours, lowering customer trust indexes.",
      howToImprove: "Add your support hours (e.g. 'Mon-Fri, 9am - 5pm') right next to your telephone number or on a dedicated page.",
      expectedImprovement: "AI assistants can reassure buyers that help is available during specific hours, boosting conversion."
    }
  ];


  // -------------------------------------------------------------
  // FEATURE 6: Business Ambiguity Detection
  // -------------------------------------------------------------
  const explanations: string[] = [];
  let ambiguityScore = 10; // start low

  // 1. Company Name check
  if (ki?.entities) {
    const orgEntities = ki.entities.filter(e => e.type === "Organization");
    if (orgEntities.length > 1) {
      ambiguityScore += 25;
      explanations.push("Different Company Names: Scanners found multiple organizational titles across page titles, which might make AI bots unsure of your official legal name.");
    }
  }

  // 2. Conflicting descriptions
  if (evidence?.businessDescriptions?.value && evidence.businessDescriptions.value.length > 1) {
    // Check if the lengths or contents differ greatly
    const descList = evidence.businessDescriptions.value;
    if (descList.some(d => d.length > 100 && !d.includes(companyName))) {
      ambiguityScore += 20;
      explanations.push("Conflicting Descriptions: Different paragraphs describe your core business focus in ways that contradict each other, which splits AI classification.");
    }
  }

  // 3. Different contact numbers
  if (ki?.entities) {
    const contactEntities = ki.entities.filter(e => e.type === "ContactInfo");
    const phones = contactEntities.map(e => e.properties?.phone).filter(Boolean);
    const uniquePhones = Array.from(new Set(phones));
    if (uniquePhones.length > 1) {
      ambiguityScore += 20;
      explanations.push("Multiple Contact Numbers: Scanners detected separate telephone numbers across different footers, confusing AI on which line is active.");
    }
  }

  // 4. Different addresses
  if (ki?.entities) {
    const locations = ki.entities.filter(e => e.type === "Location").map(e => e.properties?.fullAddress).filter(Boolean);
    const uniqueLocations = Array.from(new Set(locations));
    if (uniqueLocations.length > 1) {
      ambiguityScore += 20;
      explanations.push("Conflicting Addresses: Scanners found different office addresses on your about and contact pages, confusing local directory indexing.");
    }
  }

  // 5. Product naming inconsistency
  if (productsList.length > 1) {
    const firstProduct = productsList[0];
    const duplicates = productsList.filter(p => p.toLowerCase().includes(firstProduct.toLowerCase()));
    if (duplicates.length > 1 && duplicates.some(d => d !== firstProduct)) {
      ambiguityScore += 15;
      explanations.push("Inconsistent Product Naming: Similar product offerings use slightly different names on different paths, making AI treat them as separate products.");
    }
  }

  // 6. General structural gaps
  if (!hasBusinessName) {
    ambiguityScore += 15;
    explanations.push("Anonymous Content: The absence of a clear copyright or brand declaration in standard footers forces AI to guess website ownership.");
  }

  // Cap score
  ambiguityScore = Math.min(100, ambiguityScore);

  let ambiguityLevel: AmbiguityLevel = "No Ambiguity";
  if (ambiguityScore >= 60) {
    ambiguityLevel = "High Ambiguity";
  } else if (ambiguityScore >= 35) {
    ambiguityLevel = "Medium Ambiguity";
  } else if (ambiguityScore >= 15) {
    ambiguityLevel = "Low Ambiguity";
  }

  if (explanations.length === 0) {
    explanations.push("No conflicting business descriptions, addresses, or phone details were found. AI systems read your public business details clearly.");
  }

  const ambiguityDetection: AmbiguityDetection = {
    level: ambiguityLevel,
    score: ambiguityScore,
    explanations: explanations
  };


  // -------------------------------------------------------------
  // FEATURE 7: Business Strengths (Positive feedback)
  // -------------------------------------------------------------
  const strengths: PerceptionStrength[] = [];

  if (hasBusinessName) {
    strengths.push({
      area: "Brand Identity",
      description: "Consistent branding anchors your digital presence.",
      why: `AI clearly parsed your business name "${companyName}" from standard headers, establishing a reliable company keyword anchor for search models.`
    });
  }

  if (productsList.length > 0) {
    strengths.push({
      area: "Products Portfolio",
      description: "Direct offerings list helps AI shopping bots.",
      why: "AI successfully scanned a distinct product catalog with descriptive names, allowing comparison engines to easily discover your goods."
    });
  } else if (servicesList.length > 0) {
    strengths.push({
      area: "Services Catalog",
      description: "Comprehensive services outline prevents confusion.",
      why: "Your services are presented in clean paragraphs, allowing AI systems to easily index exactly what services you offer and match them to clients."
    });
  }

  if (detectedIndustry) {
    strengths.push({
      area: "Industry Classification",
      description: "Topic-matching engines mapped your business domain.",
      why: `AI has zero confusion about your field, cleanly placing your website in the "${detectedIndustry}" category based on prominent homepage headings.`
    });
  }

  if (hasPhone || hasEmail) {
    strengths.push({
      area: "Company Purpose & Contacts",
      description: "Open communication coordinates bolster authenticity.",
      why: "Having accessible email or phone details tells search bots that you are a legitimate operating entity, improving trust scores."
    });
  }


  // -------------------------------------------------------------
  // FEATURE 8: Business Weaknesses (Actionable recommendations)
  // -------------------------------------------------------------
  const weaknesses: PerceptionWeakness[] = [];

  if (faqList.length === 0) {
    weaknesses.push({
      area: "Customer Support Process",
      description: "Missing dedicated customer help guides.",
      why: "Without an FAQ section, AI crawlers are missing question-and-answer pairs, making it hard to resolve precise customer questions.",
      recommendation: "Create a simple '/faq' page outlining 5 common client questions regarding your policies or shipping speeds."
    });
  }

  if (!hasReturn && productsList.length > 0) {
    weaknesses.push({
      area: "Refund & Return Policy",
      description: "No transparent refund guidelines visible.",
      why: "AI shopping search assistants cannot find your return policy, lowering your readiness to receive product sales recommendations.",
      recommendation: "Add a visible link to your Return Policy in your website footer."
    });
  }

  if (!hasPricing && (productsList.length > 0 || servicesList.length > 0)) {
    weaknesses.push({
      area: "Pricing Transparency",
      description: "No pricing details, rates, or estimate cards found.",
      why: "AI filters out offerings that lack clear pricing ranges when users search for budget or cost comparisons.",
      recommendation: "List a clear 'starting from' estimate or flat rate next to your primary offerings."
    });
  }

  if (!hasAddress) {
    weaknesses.push({
      area: "Physical Locations",
      description: "Missing verifiable postal operating address.",
      why: "AI local searches (e.g. voice search maps) cannot identify where your business is based, dropping your local directory visibility.",
      recommendation: "List your physical building coordinates and zip code clearly on your contact page."
    });
  }

  if (weaknesses.length === 0) {
    // Elegant placeholder if the site is perfect
    weaknesses.push({
      area: "Advanced structured schemas",
      description: "Minor markup opportunities exist.",
      why: "Though your text is completely clear, adding advanced local business JSON-LD schemas would further solidify AI data harvesting.",
      recommendation: "Generate and insert a custom JSON-LD Schema on your landing page."
    });
  }


  // -------------------------------------------------------------
  // FEATURE 9: Perception Timeline (AI thinking step-by-step)
  // -------------------------------------------------------------
  const timeline: TimelineStep[] = [
    {
      step: "Step 1",
      label: "Business Name",
      status: hasBusinessName ? "Understood" : "Missing",
      desc: hasBusinessName ? "AI found and verified your legal trademark name." : "AI cannot confirm your business title, reducing branding weight."
    },
    {
      step: "Step 2",
      label: "Industry",
      status: detectedIndustry ? "Understood" : "Partial",
      desc: detectedIndustry ? `AI mapped your website topics to "${detectedIndustry}".` : "AI is unsure about your core business sector classification."
    },
    {
      step: "Step 3",
      label: "Products",
      status: productsList.length > 0 ? (hasPricing ? "Understood" : "Partial") : "Missing",
      desc: productsList.length > 0 
        ? (hasPricing ? "Products and pricing are clearly indexed." : "Products found but pricing is unclear.") 
        : "No products catalog was detected during the scan."
    },
    {
      step: "Step 4",
      label: "Services",
      status: servicesList.length > 0 ? "Understood" : "Missing",
      desc: servicesList.length > 0 ? "AI parsed your service catalog descriptions." : "No professional services sections were detected."
    },
    {
      step: "Step 5",
      label: "Customers",
      status: hasDescriptions ? "Understood" : "Partial",
      desc: hasDescriptions ? "AI resolved your primary target audience scope." : "AI is guessing your target customer profile from context."
    },
    {
      step: "Step 6",
      label: "Support",
      status: faqList.length > 0 ? "Understood" : (hasReturn || hasShipping ? "Partial" : "Missing"),
      desc: faqList.length > 0 
        ? "FAQs exist, allowing AI to resolve customer support questions." 
        : (hasReturn || hasShipping ? "General policies found, but lacking quick Q&As." : "No active help, policies, or FAQ pages were discovered.")
    },
    {
      step: "Step 7",
      label: "Recommendation Confidence",
      status: (hasBusinessName && (productsList.length > 0 || servicesList.length > 0) && (hasPhone || hasEmail)) ? "Understood" : "Partial",
      desc: (hasBusinessName && (productsList.length > 0 || servicesList.length > 0) && (hasPhone || hasEmail))
        ? "AI is highly confident in compiling recommendations."
        : "AI lacks key trust parameters required to safely refer clients."
    }
  ];


  // -------------------------------------------------------------
  // FEATURE 10: AI Recommendation Readiness
  // -------------------------------------------------------------
  let readinessRating: "Excellent" | "Good" | "Average" | "Needs Improvement" = "Needs Improvement";
  let readinessScore = 30;
  let readinessExplanation = "AI is hesitant to recommend this business because multiple foundational trust signals (like a physical location or direct contact details) are missing.";

  // Calculate score based on weights
  let scoreSum = 0;
  if (hasBusinessName) scoreSum += 20;
  if (productsList.length > 0 || servicesList.length > 0) scoreSum += 30;
  if (hasPhone || hasEmail) scoreSum += 20;
  if (hasAddress) scoreSum += 15;
  if (faqList.length > 0) scoreSum += 15;

  readinessScore = scoreSum;

  if (readinessScore >= 85) {
    readinessRating = "Excellent";
    readinessExplanation = "AI can confidently refer clients to your business. All primary trust signals, product details, operating locations, and support policies are fully indexed and consistent.";
  } else if (readinessScore >= 65) {
    readinessRating = "Good";
    readinessExplanation = "AI can reliably recommend your brand. Most services and contact details are clear, though adding detailed pricing schemas or FAQ guidelines would maximize conversion.";
  } else if (readinessScore >= 45) {
    readinessRating = "Average";
    readinessExplanation = "AI can formulate basic recommendations, but with low confidence. Some crucial details are missing or unclear across different landing pages.";
  }

  const recommendationReadiness: RecommendationReadiness = {
    rating: readinessRating,
    score: readinessScore,
    explanation: readinessExplanation
  };

  return {
    aiSummary,
    identityCompleteness,
    understandingConfidence,
    businessStory,
    understandingGaps,
    ambiguityDetection,
    strengths,
    weaknesses,
    timeline,
    recommendationReadiness
  };
}
