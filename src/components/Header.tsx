/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Compass, Moon, Sun, ShieldAlert, Award, FileSpreadsheet, History, Search } from "lucide-react";
import { HistoryItem } from "../types";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  history: HistoryItem[];
  onSelectHistory: (url: string) => void;
  activeReportUrl?: string;
  onReset: () => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  history,
  onSelectHistory,
  activeReportUrl,
  onReset,
}: HeaderProps) {
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <header
      className={`border-b sticky top-0 z-50 transition-colors duration-200 ${
        darkMode ? "bg-slate-950/80 border-slate-800 text-white backdrop-blur-md" : "bg-white/80 border-slate-200 text-slate-900 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset} id="header-logo-container">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold select-none">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold tracking-tight ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                Perceptiq <span className="text-indigo-600 font-black italic">AI</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium tracking-wide -mt-0.5">
              AI Brand Perception Analyzer
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-4">
          {/* Active Scan Pill */}
          {activeReportUrl && (
            <div className={`hidden md:flex items-center space-x-2 text-xs font-mono py-1 px-2.5 rounded-full ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
            } border`}>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate max-w-[180px]">{activeReportUrl}</span>
            </div>
          )}

          {/* History Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowHistory(!showHistory)}
              id="history-toggle-btn"
              className={`p-2 rounded-lg transition-all border ${
                darkMode
                  ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
              } flex items-center space-x-1.5 text-xs font-medium`}
              title="Recent scans"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Recent Scans</span>
              {history.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-600 text-[10px] text-white">
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
                <div className={`px-4 py-2 border-b text-xs font-semibold ${darkMode ? "text-slate-400 border-slate-800" : "text-slate-500 border-slate-100"}`}>
                  Audit Scan History
                </div>
                {history.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-500">
                    No recent scans found. Enter a URL above to start!
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
                        } border-b last:border-0`}
                      >
                        <div className="truncate pr-2">
                          <p className="text-xs font-medium truncate">{item.companyName}</p>
                          <p className="text-[10px] text-slate-500 truncate">{item.url}</p>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
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
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            id="theme-toggle-btn"
            className={`p-2 rounded-lg transition-all border ${
              darkMode
                ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-amber-400"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-indigo-600"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
