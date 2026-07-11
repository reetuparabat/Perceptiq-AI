/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompetitivePosition, PerformanceClassification } from "../types";

export class CompetitiveUtils {
  /**
   * Maps competitive positions (Better, Similar, Needs Improvement) to tailwind color styles
   */
  public static getStatusColor(status: CompetitivePosition, isDark: boolean): {
    bg: string;
    text: string;
    border: string;
    indicator: string;
  } {
    switch (status) {
      case "Better":
        return {
          bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
          text: isDark ? "text-emerald-400" : "text-emerald-700",
          border: isDark ? "border-emerald-500/20" : "border-emerald-200",
          indicator: "bg-emerald-500",
        };
      case "Similar":
        return {
          bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
          text: isDark ? "text-amber-400" : "text-amber-700",
          border: isDark ? "border-amber-500/20" : "border-amber-200",
          indicator: "bg-amber-500",
        };
      case "Needs Improvement":
        return {
          bg: isDark ? "bg-rose-500/10" : "bg-rose-50",
          text: isDark ? "text-rose-400" : "text-rose-700",
          border: isDark ? "border-rose-500/20" : "border-rose-200",
          indicator: "bg-rose-500",
        };
      default:
        return {
          bg: isDark ? "bg-slate-500/10" : "bg-slate-50",
          text: isDark ? "text-slate-400" : "text-slate-700",
          border: isDark ? "border-slate-500/20" : "border-slate-200",
          indicator: "bg-slate-500",
        };
    }
  }

  /**
   * Maps performance classification (Leading, Strong, Average, Developing) to color themes
   */
  public static getClassificationStyle(classification: PerformanceClassification, isDark: boolean): {
    badgeBg: string;
    text: string;
    border: string;
  } {
    switch (classification) {
      case "Leading":
        return {
          badgeBg: isDark ? "bg-indigo-500/10" : "bg-indigo-50",
          text: isDark ? "text-indigo-400" : "text-indigo-700",
          border: isDark ? "border-indigo-500/20" : "border-indigo-200",
        };
      case "Strong":
        return {
          badgeBg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
          text: isDark ? "text-emerald-400" : "text-emerald-700",
          border: isDark ? "border-emerald-500/20" : "border-emerald-200",
        };
      case "Average":
        return {
          badgeBg: isDark ? "bg-amber-500/10" : "bg-amber-50",
          text: isDark ? "text-amber-400" : "text-amber-700",
          border: isDark ? "border-amber-500/20" : "border-amber-200",
        };
      case "Developing":
        return {
          badgeBg: isDark ? "bg-rose-500/10" : "bg-rose-50",
          text: isDark ? "text-rose-400" : "text-rose-700",
          border: isDark ? "border-rose-500/20" : "border-rose-200",
        };
    }
  }
}
