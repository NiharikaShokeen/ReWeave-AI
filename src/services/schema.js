/**
 * Assessment Output Schema Definition & Validator
 *
 * Required Schema:
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

export const ALLOWED_REUSE_POTENTIAL = ['HIGH', 'MEDIUM', 'LOW'];
export const ALLOWED_PATHWAYS = ['REUSE', 'RECYCLE', 'FURTHER_CHECK'];
export const ALLOWED_CONFIDENCE = ['HIGH', 'MEDIUM', 'LOW'];

/**
 * Validates and normalizes an assessment object against the exact required schema.
 * Ensures no missing fields or invalid enum values can leak through.
 */
export function validateAndNormalizeAssessment(raw, provider = 'unknown') {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Assessment payload must be a non-null object');
  }

  // 1. material_assessment (string)
  const material_assessment =
    typeof raw.material_assessment === 'string' && raw.material_assessment.trim()
      ? raw.material_assessment.trim()
      : 'Material physical characteristics recorded from workshop intake.';

  // 2. reuse_potential ("HIGH" | "MEDIUM" | "LOW")
  let reuse_potential = String(raw.reuse_potential || '').toUpperCase().trim();
  if (!ALLOWED_REUSE_POTENTIAL.includes(reuse_potential)) {
    reuse_potential = 'MEDIUM';
  }

  // 3. recommended_pathway ("REUSE" | "RECYCLE" | "FURTHER_CHECK")
  let recommended_pathway = String(raw.recommended_pathway || '').toUpperCase().trim().replace(/[\s-]/g, '_');
  if (!ALLOWED_PATHWAYS.includes(recommended_pathway)) {
    if (recommended_pathway.includes('REUSE')) recommended_pathway = 'REUSE';
    else if (recommended_pathway.includes('RECYC')) recommended_pathway = 'RECYCLE';
    else recommended_pathway = 'FURTHER_CHECK';
  }

  // 4. suggested_uses (array of strings)
  const suggested_uses = Array.isArray(raw.suggested_uses)
    ? raw.suggested_uses.filter((item) => typeof item === 'string' && item.trim().length > 0).map((s) => s.trim())
    : [];

  // 5. reasoning (string)
  const reasoning =
    typeof raw.reasoning === 'string' && raw.reasoning.trim()
      ? raw.reasoning.trim()
      : 'Assessment determined from evaluation of fiber type, piece size, physical condition, and workshop observations.';

  // 6. confidence ("HIGH" | "MEDIUM" | "LOW")
  let confidence = String(raw.confidence || '').toUpperCase().trim();
  if (!ALLOWED_CONFIDENCE.includes(confidence)) {
    confidence = 'MEDIUM';
  }

  // 7. limitations (array of strings)
  const limitations = Array.isArray(raw.limitations)
    ? raw.limitations.filter((item) => typeof item === 'string' && item.trim().length > 0).map((s) => s.trim())
    : [
        'Visual and surface cues cannot definitively certify exact fiber chemistry or blend percentages.',
      ];

  return {
    material_assessment,
    reuse_potential,
    recommended_pathway,
    suggested_uses,
    reasoning,
    confidence,
    limitations,
    // Metadata strictly partitioned under _meta
    _meta: {
      provider,
      timestamp: new Date().toISOString(),
    },
  };
}
