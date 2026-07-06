/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Maps a numeric score to a likelihood tier for recommendations.
 */
export function getLikelihood(score: number): string {
  if (score >= 80) return "High";
  if (score >= 65) return "Medium";
  if (score >= 45) return "Low";
  return "Critical";
}

/**
 * Cleans and normalizes a domain name from a URL or raw input.
 */
export function getCleanDomain(targetUrl: string): string {
  try {
    const cleaned = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    return cleaned || targetUrl;
  } catch {
    return targetUrl;
  }
}
