import React from 'react';

/**
 * IntroContext
 * Calm, material-oriented introductory context for workshop operators.
 */
export default function IntroContext() {
  return (
    <div
      style={{
        padding: '1.25rem 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <span className="mono-label" style={{ display: 'block', marginBottom: '0.375rem' }}>
            OPERATIONAL DIRECTIVE
          </span>
          <p
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--color-ink-primary)',
              letterSpacing: '-0.01em',
              marginBottom: '0.375rem',
            }}
          >
            Assess remnant batches. Determine the highest-value circular recovery pathway.
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-ink-secondary)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Boutiques and tailoring units generate diverse fabric cut-offs daily. Enter observable batch
            characteristics to evaluate whether materials are suited for direct reuse, mechanical recycling, or
            require further physical verification before sorting.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div>
            <span className="mono-label" style={{ display: 'block', fontSize: '0.6875rem' }}>
              PRIMARY MODES
            </span>
            <span className="mono-value" style={{ fontWeight: 600 }}>
              Reuse • Recycle • Check
            </span>
          </div>
          <div>
            <span className="mono-label" style={{ display: 'block', fontSize: '0.6875rem' }}>
              RELIANCE
            </span>
            <span className="mono-value" style={{ fontWeight: 600 }}>
              Observable Traits
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
