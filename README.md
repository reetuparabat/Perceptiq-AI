# Perceptiq AI — AI Brand Perception Analyzer (v1.0 RC)

Perceptiq AI is an AI Brand Perception Analyzer that evaluates how conversational AI systems can understand, interpret, and evaluate publicly accessible business information using deterministic evidence-based analysis. It is designed for business leaders, brand managers, marketing executives, and digital transformation teams to diagnose, measure, and optimize their public digital presence for modern AI-driven search models, automated assistants, and conversational search platforms.

Instead of traditional keyword-focused SEO crawlers, Perceptiq AI acts as an **AI Search Audit Engine**. It performs deep diagnostic sweeps across public digital channels to trace, verify, and score a brand's discoverability and readability by large language models (LLMs).

---

## 1. System Architecture Overview

Perceptiq AI is structured as a robust, full-stack, decoupled architecture utilizing a lightweight Node.js Express server acting as the secure proxy and crawler hub, and a high-fidelity client-side dashboard powered by React, TypeScript, and Tailwind CSS.

### System Architecture Flow
```
[ User Input / Domain URL ]
             │
             ▼
┌───────────────────────────┐
│     React Client UI       │ <─── Port 3000 (Proxy Target)
└────────────┬──────────────┘
             │ (POST /api/scan)
             ▼
┌───────────────────────────┐
│   Express Backend Proxy   │ <─── Sanitizes, rate-limits & proxies requests
└────────────┬──────────────┘
             ├────────────────────────────────────────┐
             ▼                                        ▼
┌───────────────────────────┐             ┌───────────────────────────┐
│   Deterministic Crawler   │             │   Gemini 1.5 Flash SDK   │
│   (HTML/Metadata Parser)  │             │   (AI Explanation Layer)  │
└────────────┬──────────────┘             └───────────▲───────────────┘
             │                                        │ (Feeds structured
             ▼ (Structured Output)                    │  findings only)
┌───────────────────────────┐                         │
│  Scoring & Confidence Eng │ ────────────────────────┘
└───────────────────────────┘
```

### Component Hierarchy (Client Layer)
*   **App.tsx** (Global Workspace Context, App Shell, & Scan State Coordinator)
    *   **Header.tsx** (Identity Brand & Dark-Mode Toggles)
    *   **LandingScanner.tsx** (Input Portal & Multi-Stage Real-Time Progress Visualizer)
    *   **ExecutiveDashboardView.tsx** (01. Executive Overview, 02. Category Breakdown, 03. Traceability Audit, 04. Prioritized Recommendations, 05. AI Strategic Narrative, 06. Boundaries Disclosure)
    *   **EvidenceAuditor.tsx** (Granular Source Code Traceability Viewer)
    *   **VisibilityCard.tsx** (AI Assistant Persona Benchmark Simulator)
    *   **ExplainabilityCard.tsx** / **AiExplanationView.tsx** (Technical Explanations & Semantic Gap Diagnostics)
    *   **CompetitorBenchmark.tsx** (Corporate Benchmarking Indicators)
    *   **ImprovementCenter.tsx** (Active Fix Simulation Sandbox)

---

## 2. Folder Structure

```
├── .env.example              # Template for server-side environments and API secrets
├── .gitignore                # Specifies intentionally untracked files
├── index.html                # Entry HTML mount point
├── package.json              # System configuration and script dependencies
├── server.ts                 # Full-stack developer-mode server entry point
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite bundler configuration
│
├── server/                   # Backend API and Crawler Engine
│   ├── confidence.ts         # Math logic calculating evidence coverage & source flags
│   ├── crawler.ts            # High-performance HTML scraper & microdata extractor
│   ├── evidenceCollector.ts  # Verification map matching elements to trust schemas
│   ├── explanation.ts        # Corporate AI-driven Consulting Translation Proxy
│   ├── gemini.ts             # Base Gemini API Client setup and helper utilities
│   ├── routes.ts             # Express Router defining endpoint limits and endpoints
│   ├── scoring.ts            # Safe, deterministic, verifiable weight scores
│   ├── types.ts              # Global backend interface schema definitions
│   ├── utils.ts              # General internal helper libraries
│   └── validator.ts          # Input domain security validators
│
└── src/                      # High-Fidelity Client-Side Application
    ├── App.tsx               # Main container coordinate and state manager
    ├── index.css             # Unified global CSS with corporate styling guidelines
    ├── main.tsx              # React DOM entry mount
    ├── types.ts              # Client types matching backend schema
    └── components/           # Modularized UI Components
        ├── AiExplanationView.tsx
        ├── CompetitorBenchmark.tsx
        ├── EvidenceAuditor.tsx
        ├── ExecutiveDashboardView.tsx
        ├── ExecutiveReport.tsx
        ├── ExplainabilityCard.tsx
        ├── Header.tsx
        ├── ImprovementCenter.tsx
        ├── LandingScanner.tsx
        ├── ReadinessScoreCard.tsx
        └── VisibilityCard.tsx
```

---

## 3. Technology Stack

*   **Runtime Environment**: Node.js (v18+)
*   **Framework**: React 18 with Vite Bundler
*   **Programming Language**: TypeScript (with strict non-nullable checks)
*   **Styling**: Tailwind CSS (Optimized, responsive utility framework)
*   **Iconography**: Lucide React
*   **AI Engine**: Google Gen AI SDK (`@google/genai`)
*   **Development Tools**: `tsx` (TypeScript Execution tool), `esbuild` (Production Bundle Compiler)

---

## 4. Engineering Philosophies

### Scoring Philosophy (Deterministic Scoring)
Traditional tools rely on arbitrary, volatile black-box search engines. Perceptiq AI calculates scores **deterministically** based entirely on explicit, verified business credentials found directly within the website's crawler index. 
Every category (AI Understanding, Business Presence, Website Reliability, Business Trust, Customer Support) has standard weights. If a piece of evidence is missing, the category score scales down in an auditable, mathematical ratio. This guarantees that scores are reproducible and completely free of speculation.

### Evidence Philosophy (Traceability Audit)
An intelligence audit is useless without verifiable proof. Every item in our database is strictly categorized:
1.  **Verified (Success/Found)**: Located, parsed, and logged at an explicit page path with proof of source content.
2.  **Missing (Not Found/Failed)**: Explicitly crawled but returned no trace of relevant structural data or semantic content.
3.  **Unknown**: Outside the boundaries of the crawl limit or diagnostic configuration. This is treated as unverified rather than a system failure.

### Confidence Philosophy (Coverage Ratio)
We separate **Readiness** from **Confidence**. A brand might have an optimal structured profile, but if it is backed by extremely limited or single-page crawls, the confidence is low. 
The Confidence Index is computed as a factor of evidence coverage, source path diversity, and the completeness ratio of trust signals.

### AI Explanation Philosophy (The McKinsey Standard)
The Gemini API is integrated **not** to speculate, invent scores, or make unsupported claims, but to translate raw, technical findings into clear, executive business insights. 
*   **Absolute Compliance Constraint**: Expected improvements from recommended actions *never* contain simulated percentages, rankings, or arbitrary financial metrics (e.g., "Will increase revenue by 20%"). Instead, they utilize conservative, evidence-based advisory language (e.g., "May improve recommendation consistency across AI search engines").
*   **Clear Disclaimers**: It is clearly declared that the strategic narrative is an AI-generated synthesis based solely on collected public indicators.

---

## 5. Installation & Setup Guide

### Environment Variables
Define a `.env` file in the root directory. You can copy `.env.example` as a template:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If `GEMINI_API_KEY` is not provided, the system gracefully disables the executive AI explanation panel while keeping 100% of the deterministic scoring, confidence metrics, and auditing dashboards fully functional.*

### Running Locally (Development Mode)
To install dependencies and start the local development server:

```bash
# 1. Install project dependencies
npm install

# 2. Run the full-stack development environment
npm run dev
```
The application will boot a unified server on `http://localhost:3000`.

### Building and Running in Production
The application compiles both client and server assets into a self-contained, optimized build inside the `dist/` folder:

```bash
# 1. Compile client assets and bundle backend TypeScript using esbuild
npm run build

# 2. Start the production-ready compiled CommonJS server
npm run start
```

---

## 6. Known Limitations & Roadmap

### Known Limitations
*   **Public Access Only**: The crawling engine only scans publicly visible, unauthenticated HTML. Private enterprise systems, backend operational catalogs, or gated subscriber zones remain out-of-scope.
*   **Javascript-Heavy Hydration**: Some extremely modern Single-Page Applications that hydrate 100% of their content client-side via complex asynchronous framework chains may return lower initial index rates.

### Future Roadmap (Version 1.1)
*   **Multi-Domain Comparisons**: Side-by-side comparative readiness reports for multiple competitor domains.
*   **Recursive Deep Sweeps**: Deeper crawling structures down to 5+ path layers for large-scale enterprise websites.
*   **Structured Metadata Exporter**: Single-click copyable JSON-LD and microdata snippets custom-tailored to resolve the exact gaps identified in the priority improvements view.
