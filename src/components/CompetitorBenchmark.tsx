/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Competitor } from "../types";
import { Plus, Trash2, HelpCircle, BarChart3, TrendingUp, Sparkles, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompetitorBenchmarkProps {
  darkMode: boolean;
  companyName: string;
  myScores: {
    aiReadiness: number;
    trust: number;
    content: number;
    visibility: number;
    productInfo: number;
    recommendationProbability: number;
  };
  initialCompetitors: Competitor[];
}

export default function CompetitorBenchmark({
  darkMode,
  companyName,
  myScores,
  initialCompetitors,
}: CompetitorBenchmarkProps) {
  const [competitors, setCompetitors] = React.useState<Competitor[]>(initialCompetitors);
  const [newCompName, setNewCompName] = React.useState("");
  const [expandedComp, setExpandedComp] = React.useState<string | null>(null);

  // Sync state if initialCompetitors changes
  React.useEffect(() => {
    setCompetitors(initialCompetitors);
  }, [initialCompetitors]);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const nameSeed = newCompName.length;
    const added: Competitor = {
      name: newCompName.trim(),
      aiReadiness: Math.min(96, Math.max(35, myScores.aiReadiness - 10 + (nameSeed % 20))),
      trust: Math.min(95, Math.max(30, myScores.trust - 8 + (nameSeed % 18))),
      content: Math.min(98, Math.max(35, myScores.content - 5 + (nameSeed % 12))),
      visibility: Math.min(94, Math.max(30, myScores.visibility - 12 + (nameSeed % 25))),
      productInfo: Math.min(95, Math.max(30, myScores.productInfo - 6 + (nameSeed % 15))),
      recommendationProbability: Math.min(95, Math.max(25, myScores.recommendationProbability - 15 + (nameSeed % 30))),
      strategicGap: `Competitor holds high-volume recommendation placement but lacks structured brand certifications. High opportunity exists to leapfrog their ranking by immediately deploying Product schemas.`,
    };

    setCompetitors([...competitors, added]);
    setNewCompName("");
  };

  const handleRemoveCompetitor = (name: string) => {
    setCompetitors(competitors.filter((c) => c.name !== name));
  };

  const toggleExpand = (name: string) => {
    setExpandedComp(expandedComp === name ? null : name);
  };

  // Format data for Recharts comparison bar chart with C-suite metrics labels
  const chartData = [
    {
      metric: "AI Readiness Index",
      [companyName]: myScores.aiReadiness,
      ...competitors.reduce((acc, c) => ({ ...acc, [c.name]: c.aiReadiness }), {}),
    },
    {
      metric: "Brand Verifiability",
      [companyName]: myScores.trust,
      ...competitors.reduce((acc, c) => ({ ...acc, [c.name]: c.trust }), {}),
    },
    {
      metric: "Content Richness",
      [companyName]: myScores.content,
      ...competitors.reduce((acc, c) => ({ ...acc, [c.name]: c.content }), {}),
    },
    {
      metric: "Recommendation Likelihood",
      [companyName]: myScores.visibility,
      ...competitors.reduce((acc, c) => ({ ...acc, [c.name]: c.visibility }), {}),
    },
    {
      metric: "Product Catalog Structure",
      [companyName]: myScores.productInfo,
      ...competitors.reduce((acc, c) => ({ ...acc, [c.name]: c.productInfo }), {}),
    },
  ];

  const colors = ["#4f46e5", "#06b6d4", "#eab308", "#ec4899", "#8b5cf6"];

  return (
    <div className="space-y-6" id="benchmark-module">
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-bold text-base tracking-tight">Competitor Benchmark</h3>
            <p className="text-xs text-slate-500">
              Measure conversational search vulnerability against direct market rivals.
            </p>
          </div>

          {/* Add Competitor Form */}
          <form onSubmit={handleAddCompetitor} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Competitor Name or URL"
              value={newCompName}
              onChange={(e) => setNewCompName(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-sans ${
                darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800 shadow-sm"
              }`}
              id="competitor-name-input"
            />
            <button
              type="submit"
              id="add-competitor-btn"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Recharts Bar Chart Visual */}
        <div className="h-80 w-full mb-6 font-mono text-[10px]" id="recharts-benchmark-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155/30" : "#e2e8f0"} />
              <XAxis dataKey="metric" stroke={darkMode ? "#94a3b8" : "#475569"} />
              <YAxis domain={[0, 100]} stroke={darkMode ? "#94a3b8" : "#475569"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                  borderColor: darkMode ? "#1e293b" : "#e2e8f0",
                  color: darkMode ? "#f8fafc" : "#0f172a",
                }}
              />
              <Legend />
              {/* Target Brand Bar */}
              <Bar dataKey={companyName} fill={colors[0]} radius={[4, 4, 0, 0]} />
              {/* Competitor Bars */}
              {competitors.map((comp, idx) => (
                <Bar
                  key={comp.name}
                  dataKey={comp.name}
                  fill={colors[(idx + 1) % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Competitor Grid Breakdown Details */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-slate-500 font-bold uppercase tracking-wider text-[10px] ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                <th className="py-2.5">Company Name</th>
                <th className="py-2.5 text-center">AI Readiness Index</th>
                <th className="py-2.5 text-center">Brand Verifiability</th>
                <th className="py-2.5 text-center">Content Richness</th>
                <th className="py-2.5 text-center">Product Catalog Structure</th>
                <th className="py-2.5 text-center">Win Probability</th>
                <th className="py-2.5 text-right">Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10">
              {/* Your Brand Row */}
              <tr className="font-semibold text-indigo-500 bg-indigo-500/5">
                <td className="py-3 px-2 flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                  <span>{companyName} (You)</span>
                </td>
                <td className="py-3 text-center font-mono font-bold">{myScores.aiReadiness}</td>
                <td className="py-3 text-center font-mono font-bold">{myScores.trust}</td>
                <td className="py-3 text-center font-mono font-bold">{myScores.content}</td>
                <td className="py-3 text-center font-mono font-bold">{myScores.productInfo}</td>
                <td className="py-3 text-center font-mono text-emerald-500 font-bold">{myScores.recommendationProbability}%</td>
                <td className="py-3 pr-2 text-right text-slate-400 font-mono text-[10px]">Primary Brand</td>
              </tr>

              {/* Competitor Rows */}
              {competitors.map((comp, idx) => {
                const isExpanded = expandedComp === comp.name;
                return (
                  <React.Fragment key={comp.name}>
                    <tr 
                      className={`hover:bg-slate-500/5 transition-colors cursor-pointer ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                      onClick={() => toggleExpand(comp.name)}
                    >
                      <td className="py-3 px-2 flex items-center space-x-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: colors[(idx + 1) % colors.length] }}
                        ></span>
                        <span className="font-semibold truncate max-w-[120px]">{comp.name}</span>
                      </td>
                      <td className="py-3 text-center font-mono">{comp.aiReadiness}</td>
                      <td className="py-3 text-center font-mono">{comp.trust}</td>
                      <td className="py-3 text-center font-mono">{comp.content}</td>
                      <td className="py-3 text-center font-mono">{comp.productInfo}</td>
                      <td className="py-3 text-center font-mono font-bold text-slate-400">{comp.recommendationProbability}%</td>
                      <td className="py-3 pr-2 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(comp.name);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 p-1 rounded font-mono text-[10px] uppercase font-bold"
                          >
                            {isExpanded ? "Close" : "Strategy"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCompetitor(comp.name);
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                            title="Remove competitor"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Strategy Insights Block */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className={`p-4 ${darkMode ? "bg-slate-950/40" : "bg-slate-50"} border-l-2 border-indigo-500`}>
                          <div className="space-y-2.5 text-xs">
                            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                              <Sparkles className="h-4 w-4" />
                              <span className="font-display">Comparative Strategic Vulnerability Commentary</span>
                            </div>
                            <p className={`leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                              {comp.strategicGap || "Competitor has robust keyword representations but exhibits sparse catalog schema. Prioritizing immediate structured product markup deploy yields high-certainty return opportunities."}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5 font-mono text-[11px]">
                              <div>
                                <span className="font-bold text-emerald-500 uppercase block mb-0.5">Where We Are Stronger:</span>
                                <span className="text-slate-400">Conversational context density and SSL response latencies.</span>
                              </div>
                              <div>
                                <span className="font-bold text-rose-400 uppercase block mb-0.5">Where Competitor Leads:</span>
                                <span className="text-slate-400">Structural data coverage on retail comparison listings.</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
