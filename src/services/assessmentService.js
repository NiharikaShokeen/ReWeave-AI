/**
 * Assessment Service
 *
 * Facade separating the frontend UI from the underlying evaluation engines.
 * Workflow:
 *   UI -> assessmentService.assessScrap(input) -> [AI Provider (if key present) OR Fallback Provider]
 */

import { isAiConfigured, evaluateWithAi } from './aiProvider.js';
import { evaluateWithFallback } from './fallbackProvider.js';
import { validateAndNormalizeAssessment } from './schema.js';

/**
 * Returns metadata about the active assessment engine.
 */
export function getActiveEngineStatus() {
  const hasAi = isAiConfigured();
  return {
    isAiConfigured: hasAi,
    engineName: hasAi ? 'Gemini 2.5 Flash' : 'Local Heuristic Engine',
    engineType: hasAi ? 'CLOUD_LLM' : 'LOCAL_FALLBACK',
    description: hasAi
      ? 'Connected to Google Gemini API for multimodal reasoning.'
      : 'Prototype fallback rules engine (non-ML) for offline/keyless evaluation.',
  };
}

/**
 * Primary assessment evaluation function.
 *
 * Evaluates the input batch and guarantees a response strictly matching the schema:
 * {
 *   "material_assessment": string,
 *   "reuse_potential": "HIGH" | "MEDIUM" | "LOW",
 *   "recommended_pathway": "REUSE" | "RECYCLE" | "FURTHER_CHECK",
 *   "suggested_uses": string[],
 *   "reasoning": string,
 *   "confidence": "HIGH" | "MEDIUM" | "LOW",
 *   "limitations": string[]
 * }
 */
export async function assessScrap(batchInput) {
  if (!batchInput) {
    throw new Error('Batch input is required for assessment.');
  }

  // 1. If LLM is configured, attempt real AI evaluation
  if (isAiConfigured()) {
    try {
      console.info('[AssessmentService] Evaluating with Gemini API...');
      const result = await evaluateWithAi(batchInput);
      return validateAndNormalizeAssessment(result, 'gemini_api');
    } catch (err) {
      console.warn(
        '[AssessmentService] AI API call failed or encountered error. Gracefully falling back to local engine:',
        err.message
      );
      // Graceful fallback to local heuristic engine on network/key error
      const fallbackResult = evaluateWithFallback(batchInput);
      return {
        ...fallbackResult,
        _meta: {
          ...fallbackResult._meta,
          provider: 'local_fallback',
          fallbackReason: `API error: ${err.message}`,
        },
      };
    }
  }

  // 2. Otherwise, use clearly labelled local heuristic fallback
  // (Deterministic evaluation, NOT machine learning)
  console.info('[AssessmentService] No API key detected. Evaluating with local fallback engine...');
  const fallbackResult = evaluateWithFallback(batchInput);
  return validateAndNormalizeAssessment(fallbackResult, 'local_fallback');
}
