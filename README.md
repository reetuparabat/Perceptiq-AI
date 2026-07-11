# Perceptiq AI

Perceptiq AI is a simple, modern tool that checks how well AI search engines (like ChatGPT, Gemini, and Perplexity) can understand and find your business website. It scans your site, highlights where search engines might get confused, and gives you clear, step-by-step instructions to improve your brand's AI search visibility.

---

## 💡 What is Perceptiq AI?

When people search for your business using AI search tools or smart assistants, these systems crawl the web to find answers. If your website has missing metadata, confusing pricing, or hard-to-find contact info, the AI might give incorrect answers or leave your brand out of the recommendations entirely.

Perceptiq AI scans your website to find these exact gaps and gives you an actionable score with practical recommendations to fix them.

---

## 🌟 Key Features

### 🌐 AI Intelligence & Advice
*   **Executive Summaries**: Translates technical web scans into easy-to-read business reports using Gemini AI.
*   **Gaps & Diagnostics**: Flags missing information on your site that AI search engines look for.

### 🛠️ Interactive Fix Sandbox
*   **Live Preview Simulator**: Toggle simulated fixes (like adding a Privacy Policy or structured FAQ) to instantly see how your score would improve.
*   **Priority Roadmap**: Lists what to fix first, with simple technical instructions for each task.

### 🔍 Verification & Evidence
*   **Traceable Evidence**: Shows the exact HTML code and text found on your site, proving why a specific score was given.
*   **Strict Scoring**: Scores are based strictly on real evidence found on your site—no guessing or fluctuating numbers.

### 📊 Competitive Intelligence
*   **Side-by-Side Benchmark**: See how your website compares with your competitors across AI readiness dimensions.
*   **Market Trends**: Visualizes where competitors are doing better so you can capture missing search traffic.

---

## ⚙️ How It Works

1. **Enter URL**: Type in your business website address on the homepage.
2. **Scan**: The crawler reads your website's pages, headers, links, and structured metadata.
3. **Score**: The scoring engine calculates your rating based purely on what it successfully found on your site.
4. **Translate**: Gemini AI writes a clear, non-technical explanation of the results and highlights key improvements.
5. **Explore**: Drill down into detailed dashboards to simulate improvements, audit code evidence, and compare with competitors.

---

## 🛠️ Technology Stack

*   **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Recharts (for charts), and Motion (for clean animations).
*   **Backend**: Node.js, Express, and esbuild (for fast production bundling).
*   **AI Engine**: Google Gen AI SDK (`gemini-3.5-flash`) with automatic, high-fidelity offline fallbacks.

---

## 📁 Project Structure

*   `server/` — Scraper, scoring logic, AI prompt templates, and API endpoints.
*   `src/` — Visual dashboards, interactive chart widgets, and user controls.
*   `server.ts` — Full-stack entry point.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Settings
Create a `.env` file in the root folder:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If you do not provide a Gemini key, the app will automatically use its offline smart backup to generate high-quality recommendations.)*

### 3. Run the App
To start the app in development mode:
```bash
npm run dev
```
Then open **`http://localhost:3000`** in your browser.

To build and run in production:
```bash
npm run build
npm start
```

---

## 📜 Our Product Philosophy

*   **Evidence First**: Every score must be backed by real, found evidence on the website.
*   **Transparency**: No arbitrary or fluctuating scores.
*   **Explainability**: Helping you understand *why* your site scored the way it did is more important than just showing a high number.

---

## Evidence-First Analysis

Perceptiq AI operates on a strict, evidence-based approach to ensure transparency and integrity across all reports and recommendations.

### Core Principles

*   **Public Access Only**: Perceptiq AI only analyzes publicly accessible business information.
*   **Verified Evidence**: Every score, insight, recommendation, and explanation is generated solely from verified public evidence collected during the live scan.
*   **No Speculation**: The platform never invents, estimates, or fabricates missing business information.
*   **No Access, No Report**: If a website blocks automated access (for example, through bot protection, restricted public access, or firewalls), Perceptiq AI does not generate a report because sufficient evidence cannot be verified.
*   **Sufficient Information Threshold**: If a website does not contain enough publicly available business information to produce a reliable analysis, the platform terminates the scan instead of presenting unreliable or artificial scores.
*   **Transparency First**: Honest, evidence-based data representation is always preferred over speculative estimation. If there is no evidence, there is no report.

> Perceptiq AI is designed to prioritize accuracy and explainability over completeness. When sufficient verified public information cannot be collected, the platform informs the user rather than generating speculative results.

### Why This Matters

This strict policy ensures that our assessments are trustworthy, highly accurate, and directly actionable. By avoiding assumptions or simulated fillings, we prevent misleading business evaluations and build confidence in AI-driven search auditing, fully aligning with modern explainable AI (XAI) principles.

---

## Analysis Disclaimer

Perceptiq AI evaluates only publicly accessible business information. If a website restricts automated access or does not provide enough verifiable public information, the platform will not generate an analysis. This ensures that all insights, scores, and recommendations remain evidence-based, transparent, and explainable.

---

## ⚖️ License

Distributed under the **MIT License**.
