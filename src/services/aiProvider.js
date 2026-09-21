/**
 * Real AI Provider (Google Gemini API)
 *
 * Configured via environment variables:
 * - VITE_GEMINI_API_KEY
 * - GEMINI_API_KEY
 *
 * Adheres strictly to Responsible AI principles:
 * - Valid JSON schema compliance
 * - No invented facts or fake statistics
 * - Explicit uncertainty handling
 * - No definitive fiber composition claims from photos
 */

import { validateAndNormalizeAssessment } from './schema.js';

export function getApiKey() {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  }
  return '';
}

export function isAiConfigured() {
  const key = getApiKey();
  return Boolean(key && key.trim().length > 0);
}

export async function evaluateWithAi(batchInput) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('LLM API key is not configured.');
  }

  // Model selection (gemini-2.5-flash or fallback to gemini-1.5-flash)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // Construct structured prompt
  const systemInstruction = `You are the evaluation engine for the Textile Scrap Reuse Advisor, a specialized circular economy decision-support tool for small tailoring units, boutiques, and local garment workshops.

Your role is to assess textile remnants based strictly on provided observable characteristics and assign the highest-value responsible recovery pathway.

OUTPUT SPECIFICATION:
You MUST respond with a single, raw JSON object strictly adhering to this schema:
{
  "material_assessment": "string describing the material physical state, dimensions, and condition",
  "reuse_potential": "HIGH" | "MEDIUM" | "LOW",
  "recommended_pathway": "REUSE" | "RECYCLE" | "FURTHER_CHECK",
  "suggested_uses": ["practical, specific workshop actions/products"],
  "reasoning": "clear explanation integrating material, size, condition, and workshop constraints",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "limitations": ["explicit uncertainties, testing requirements, or processing risks"]
}

STRICT RESPONSIBLE AI RULES:
1. NEVER claim definitive fiber purity (e.g., "This is definitely 100% cotton"). Ordinary photographs and visual descriptions cannot prove chemical fiber composition or blend ratios.
2. If material is unknown or evidence is insufficient, assign "FURTHER_CHECK" and set confidence to "LOW" or "MEDIUM".
3. Do NOT force a recommendation when evidence is lacking.
4. Dirty, wet, or contaminated scraps must NOT be recommended for direct reuse without pre-treatment.
5. Large clean remnants favor "REUSE" (preserving embodied energy). Small clean mono-material scraps favor "RECYCLE". Blended small scraps favor "FURTHER_CHECK".
6. DO NOT invent or fabricate environmental savings, metrics, or carbon numbers.
7. Return ONLY valid JSON. Do not include introductory text or markdown formatting outside the JSON.`;

  const inputSummary = JSON.stringify({
    fabricType: batchInput.material?.fabricType || batchInput.fabricType || 'Unspecified',
    color: batchInput.material?.color || batchInput.color || 'Unspecified',
    scrapSize: batchInput.physicalForm?.scrapSize || batchInput.scrapSize || 'Unspecified',
    form: batchInput.physicalForm?.form || batchInput.form || 'Unspecified',
    quantity: batchInput.physicalForm?.quantity || batchInput.quantity || 'Unspecified',
    condition: batchInput.condition?.status || batchInput.condition || 'Unspecified',
    workshopDescription: batchInput.condition?.description || batchInput.description || 'None',
  });

  const promptText = `${systemInstruction}\n\nEVALUATE THIS TEXTILE BATCH:\n${inputSummary}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: promptText }],
    },
  ];

  // Multimodal image attachment if available
  if (batchInput.image?.dataUrl) {
    const dataUrl = batchInput.image.dataUrl;
    const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      contents[0].parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const resultData = await response.json();
  const rawText = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Empty response received from LLM provider.');
  }

  // Clean and parse JSON
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  const parsed = JSON.parse(cleaned);
  return validateAndNormalizeAssessment(parsed, 'gemini_api');
}
