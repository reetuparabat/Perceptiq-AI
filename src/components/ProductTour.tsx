/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, ArrowLeft, X, Eye, ShieldCheck, Compass, HelpCircle, Network } from "lucide-react";

interface ProductTourProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
}

export default function ProductTour({ darkMode, isOpen, onClose }: ProductTourProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  // Keyboard navigation for accessibility
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
      } else if (e.key === "ArrowLeft") {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const steps: TourStep[] = [
    {
      title: "Welcome to Perceptiq AI",
      badge: "Onboarding 01/05",
      icon: <Sparkles className="h-6 w-6 text-indigo-400" />,
      description: "Perceptiq is an Explainable AI Visibility & Recommendation Intelligence Platform. It continuously audits, validates, and benchmarks how major LLMs (such as ChatGPT, Claude, Gemini, and Perplexity) discover, understand, and trust your company's online brand.",
    },
    {
      title: "AI Discovery & Scanning",
      badge: "Onboarding 02/05",
      icon: <Network className="h-6 w-6 text-blue-400" />,
      description: "Our semantic crawling engine traverses your domain to check if your structured metadata, sitemaps, and Schema.org markup are optimally configured for AI bot retrieval, ensuring your brand has maximum indexing readiness.",
    },
    {
      title: "AI Understanding & Perception",
      badge: "Onboarding 03/05",
      icon: <Eye className="h-6 w-6 text-emerald-400" />,
      description: "Through the Perception and Cognitive Reasoning dashboards, you can analyze exactly how conversational search engines synthesize your brand's core offerings and where semantic perception gaps might misrepresent your capabilities.",
    },
    {
      title: "Trust Anchors & Safety",
      badge: "Onboarding 04/05",
      icon: <ShieldCheck className="h-6 w-6 text-indigo-400" />,
      description: "AI assistants require high-verifiability signals (shipping, return policies, and certifications) before recommending you. Our Trust Profile highlights structural gaps that risk getting your brand filtered out of high-intent purchase searches.",
    },
    {
      title: "Actionable Improvement Roadmap",
      badge: "Onboarding 05/05",
      icon: <Compass className="h-6 w-6 text-amber-400" />,
      description: "Use the Improvement Center to prioritize quick wins, track remediation progress in real time, simulate scores before editing, and export an advisory brief to your executives to showcase performance growth over time.",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Mark as completed in local storage
      localStorage.setItem("perceptiq-tour-completed", "true");
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        id="product-tour-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`relative w-full max-w-lg p-6 sm:p-8 rounded-2xl border shadow-2xl ${
            darkMode 
              ? "bg-slate-900/95 border-slate-800 text-slate-100" 
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {/* Top Progress and Dismiss */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">
              {step.badge}
            </span>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                darkMode 
                  ? "border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200" 
                  : "border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800"
              }`}
              aria-label="Skip Tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Icon + Title */}
          <div className="flex items-center space-x-3.5 mb-4">
            <div className={`p-3 rounded-xl ${darkMode ? "bg-slate-950/60 border border-slate-850" : "bg-slate-50 border border-slate-100"}`}>
              {step.icon}
            </div>
            <h2 id="tour-step-title" className="text-lg sm:text-xl font-display font-black tracking-tight">
              {step.title}
            </h2>
          </div>

          {/* Description */}
          <p className={`text-xs sm:text-sm leading-relaxed mb-8 ${darkMode ? "text-slate-300" : "text-slate-600 font-medium"}`}>
            {step.description}
          </p>

          {/* Steps Progress Indicator & Actions Row */}
          <div className="flex items-center justify-between border-t pt-5 border-slate-500/10">
            {/* Step Dots */}
            <div className="flex space-x-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep 
                      ? "w-6 bg-indigo-500" 
                      : `w-1.5 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1 cursor-pointer ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center space-x-1 cursor-pointer shadow-md shadow-indigo-600/15"
              >
                <span>{currentStep === steps.length - 1 ? "Complete Tour" : "Next"}</span>
                {currentStep < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
