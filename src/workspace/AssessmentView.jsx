import React from 'react';
import Panel from '../components/Panel';
import SectionLabel from '../components/SectionLabel';
import StatusBadge from '../components/StatusBadge';

/**
 * AssessmentView
 * Displays the structured result from the Assessment Engine matching the schema:
 * {
 *   "material_assessment": string,
 *   "reuse_potential": "HIGH | MEDIUM | LOW",
 *   "recommended_pathway": "REUSE | RECYCLE | FURTHER_CHECK",
 *   "suggested_uses": string[],
 *   "reasoning": string,
 *   "confidence": "HIGH | MEDIUM | LOW",
 *   "limitations": string[]
 * }
 */
export default function AssessmentView({ assessment = null, isLoading = false, error = null }) {
  // Format pathway for display
  const displayPathway = assessment?.recommended_pathway?.replace(/_/g, ' ') || '';

  return (
    <div>
      <SectionLabel
        step="02"
        title="Recovery Assessment"
        description="Structured decision-support readout generated from batch profile."
      />

      <Panel
        title="Pathway Output"
        badge={
          isLoading ? (
            <span className="mono-label" style={{ color: 'var(--color-ink-muted)' }}>
              EVALUATING...
            </span>
          ) : assessment ? (
            <StatusBadge status={displayPathway} />
          ) : (
            <span className="mono-label" style={{ color: 'var(--color-ink-muted)' }}>
              STAGE 2 • AWAITING INPUT
            </span>
          )
        }
      >
        {/* Loading State */}
        {isLoading && (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-surface-soft)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                border: '2px solid var(--color-border-strong)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 0.75rem auto',
              }}
            />
            <span className="mono-label" style={{ display: 'block', marginBottom: '0.25rem' }}>
              ASSESSMENT IN PROGRESS
            </span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-secondary)', margin: 0 }}>
              Synthesizing material composition, dimensions, condition, and workshop constraints...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#FBF2F0',
              border: '1px solid #E4C0B8',
              borderRadius: 'var(--radius-xs)',
              color: '#8C2E2A',
              fontSize: '0.8125rem',
            }}
          >
            <strong>Assessment Error:</strong> {error}
          </div>
        )}

        {/* Structured Result Display */}
        {!isLoading && !error && assessment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Strip: Recommended Pathway + Recovery Potential + Confidence */}
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--color-surface-soft)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="mono-label">RECOMMENDED PATHWAY</span>
                <StatusBadge status={displayPathway} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.625rem', marginTop: '0.75rem' }}>
                <div style={{ border: '1px solid var(--color-border-subtle)', padding: '0.5rem', backgroundColor: 'var(--color-surface)' }}>
                  <span className="mono-label" style={{ display: 'block', fontSize: '0.6875rem' }}>
                    RECOVERY POTENTIAL
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-ink-primary)' }}>
                    {assessment.reuse_potential}
                  </span>
                </div>

                <div style={{ border: '1px solid var(--color-border-subtle)', padding: '0.5rem', backgroundColor: 'var(--color-surface)' }}>
                  <span className="mono-label" style={{ display: 'block', fontSize: '0.6875rem' }}>
                    CONFIDENCE
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-ink-primary)' }}>
                    {assessment.confidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Material Assessment */}
            <div>
              <span className="mono-label" style={{ display: 'block', marginBottom: '0.25rem' }}>
                MATERIAL ASSESSMENT
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-primary)', margin: 0, lineHeight: 1.5 }}>
                {assessment.material_assessment}
              </p>
            </div>

            {/* Why This Recommendation? */}
            <div
              style={{
                padding: '0.875rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderLeft: '3px solid var(--color-ink-primary)',
              }}
            >
              <span className="mono-label" style={{ display: 'block', marginBottom: '0.375rem' }}>
                WHY THIS RECOMMENDATION?
              </span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.55 }}>
                {assessment.reasoning}
              </p>
            </div>

            {/* Suggested Uses */}
            {Array.isArray(assessment.suggested_uses) && assessment.suggested_uses.length > 0 && (
              <div>
                <span className="mono-label" style={{ display: 'block', marginBottom: '0.375rem' }}>
                  SUGGESTED USES
                </span>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.25rem',
                    fontSize: '0.8125rem',
                    color: 'var(--color-ink-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  {assessment.suggested_uses.map((use, idx) => (
                    <li key={idx}>{use}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Limitations */}
            {Array.isArray(assessment.limitations) && assessment.limitations.length > 0 && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span className="mono-label" style={{ display: 'block', marginBottom: '0.375rem', color: 'var(--color-ink-primary)' }}>
                  LIMITATIONS
                </span>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.25rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-ink-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  {assessment.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Engine Provider Transparency Stamp */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--color-border-subtle)',
                fontSize: '0.6875rem',
                color: 'var(--color-ink-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span className="mono-label" style={{ fontSize: '0.625rem' }}>ENGINE:</span>
                <span>
                  {assessment._meta?.provider === 'gemini_api'
                    ? 'Cloud LLM (Google Gemini 2.5 Flash)'
                    : 'Local Prototype Fallback (Heuristic Decision Support)'}
                </span>
              </div>
              {assessment._meta?.provider === 'local_fallback' && (
                <span style={{ fontStyle: 'italic' }}>Non-ML Rules</span>
              )}
            </div>
          </div>
        )}

        {/* Resting state awaiting batch input */}
        {!isLoading && !error && !assessment && (
          <div
            style={{
              padding: '2rem 1.5rem',
              backgroundColor: 'var(--color-surface-soft)',
              border: '1px dashed var(--color-border-default)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'center',
            }}
          >
            <span
              className="mono-label"
              style={{
                display: 'inline-block',
                marginBottom: '0.75rem',
                border: '1px solid var(--color-border-default)',
                padding: '0.2rem 0.5rem',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              WORKSHOP DECISION MATRIX
            </span>

            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-ink-primary)',
                marginBottom: '0.5rem',
              }}
            >
              No Remnant Batch Evaluated Yet
            </h4>

            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-ink-secondary)',
                maxWidth: '420px',
                margin: '0 auto 1.5rem auto',
                lineHeight: 1.5,
              }}
            >
              Fill in the batch characteristics on the intake panel to determine whether this fabric remnant is suited
              for direct reuse, textile recycling, or requires manual workshop verification.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
                maxWidth: '480px',
                margin: '0 auto',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  padding: '0.625rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <StatusBadge status="REUSE" size="small" />
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-ink-muted)', marginTop: '0.375rem', margin: 0 }}>
                  Intact panels, pocketing, patches, crafts.
                </p>
              </div>

              <div
                style={{
                  padding: '0.625rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <StatusBadge status="RECYCLE" size="small" />
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-ink-muted)', marginTop: '0.375rem', margin: 0 }}>
                  Shredding, fiber recovery, insulation.
                </p>
              </div>

              <div
                style={{
                  padding: '0.625rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <StatusBadge status="FURTHER CHECK" size="small" />
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-ink-muted)', marginTop: '0.375rem', margin: 0 }}>
                  Burn test, blend test, or decontamination.
                </p>
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
