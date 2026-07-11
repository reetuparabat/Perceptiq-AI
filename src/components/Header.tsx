/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  History, 
  Sun, 
  Moon, 
  BookOpen, 
  ChevronDown,
  Sparkles
} from "lucide-react";
import { HistoryItem } from "../types";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  history: HistoryItem[];
  onSelectHistory: (url: string) => void;
  activeReportUrl?: string;
  onReset: () => void;
  
  activeSection: "dashboard" | "docs";
  onNavigate: (section: "dashboard" | "docs") => void;
  onStartTour?: () => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  history,
  onSelectHistory,
  activeReportUrl,
  onReset,
  activeSection,
  onNavigate,
  onStartTour,
}: HeaderProps) {
  const [showHistory, setShowHistory] = React.useState(false);

  // Close menus on click outside
  React.useEffect(() => {
    const handleOutsideClick = () => {
      // Simple debounce or close helper
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <header
      className={`border-b sticky top-0 z-50 transition-colors duration-200 ${
        darkMode ? "bg-slate-950/85 border-slate-800 text-white backdrop-blur-md" : "bg-white/85 border-slate-200 text-slate-900 backdrop-blur-md shadow-sm"
      }`}
      id="header-navigation-bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo and Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none" 
          onClick={() => {
            onReset();
            onNavigate("dashboard");
          }} 
          id="header-logo-container"
          aria-label="Perceptiq AI Home"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/20">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm sm:text-base font-bold tracking-tight ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                Perceptiq <span className="text-indigo-600 font-black italic">AI</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest px-1 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[8px] text-slate-500 font-medium tracking-wide -mt-0.5">
              Enterprise Identity Platform
            </p>
          </div>
        </div>

        {/* CENTER: Navigation Links */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-bold">
          <button
            onClick={() => onNavigate("dashboard")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              activeSection === "dashboard"
                ? (darkMode ? "bg-slate-900 text-indigo-400" : "bg-slate-100 text-indigo-600")
                : (darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-950")
            }`}
          >
            Brand Scanner
          </button>
          
          <button
            onClick={() => onNavigate("docs")}
            className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === "docs"
                ? (darkMode ? "bg-slate-900 text-indigo-400" : "bg-slate-100 text-indigo-600")
                : (darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-950")
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            <span>Documentation</span>
          </button>

          {onStartTour && (
            <button
              onClick={onStartTour}
              className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                darkMode ? "text-indigo-400 hover:text-indigo-300 hover:bg-slate-900" : "text-indigo-600 hover:text-indigo-700 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-500 animate-pulse" />
              <span>Guided Tour</span>
            </button>
          )}
        </div>

        {/* RIGHT: Controls & Auth Panel */}
        <div className="flex items-center space-x-3">
          
          {/* Documentation link for mobile */}
          <button
            onClick={() => onNavigate("docs")}
            className={`p-2 rounded-lg transition-all md:hidden border ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
            title="View Documentation"
          >
            <BookOpen className="h-4 w-4" />
          </button>

          {/* Active Scan Pill (when scan is active) */}
          {activeReportUrl && activeSection === "dashboard" && (
            <div className={`hidden lg:flex items-center space-x-2 text-[10px] font-mono py-1.5 px-3 rounded-full border ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
            }`}>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate max-w-[120px]">{activeReportUrl}</span>
            </div>
          )}

          {/* Scans History Dropdown (dashboard only) */}
          {activeSection === "dashboard" && (
            <div className="relative">
              <button
                onClick={() => setShowHistory(!showHistory)}
                id="history-toggle-btn"
                className={`p-2 rounded-lg transition-all border ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600 shadow-sm"
                } flex items-center space-x-1 text-xs font-bold cursor-pointer`}
                title="Recent scans"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
                {history.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-600 text-[9px] font-mono text-white">
                    {history.length}
                  </span>
                )}
              </button>

              {showHistory && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl border ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  } overflow-hidden z-50 py-1 font-sans`}
                >
                  <div className={`px-4 py-2 border-b text-xs font-bold ${darkMode ? "text-slate-400 border-slate-800" : "text-slate-500 border-slate-100"}`}>
                    Audit Scan History
                  </div>
                  {history.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-500">
                      No recent scans found.
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectHistory(item.url);
                            setShowHistory(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-500/10 transition-colors ${
                            darkMode ? "text-slate-300 border-slate-800" : "text-slate-700 border-slate-100"
                          } border-b last:border-0 cursor-pointer`}
                        >
                          <div className="truncate pr-2">
                            <p className="text-xs font-bold truncate">{item.companyName}</p>
                            <p className="text-[9px] text-slate-500 truncate font-mono">{item.url}</p>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            typeof item.overallScore === "number"
                              ? (item.overallScore >= 80
                                ? "bg-emerald-500/10 text-emerald-400"
                                : item.overallScore >= 60
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-rose-500/10 text-rose-400")
                              : "bg-indigo-500/10 text-indigo-400"
                          }`}>
                            {item.overallScore}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            id="theme-toggle-btn"
            className={`p-2 rounded-lg transition-all border cursor-pointer ${
              darkMode
                ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-amber-400"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-indigo-600 shadow-sm"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

        </div>
      </div>
    </header>
  );
}
