import React from 'react';

/**
 * Header
 * Clean, tactile header band designed like a workshop material specification header.
 */
export default function Header() {
  return (
    <header className="workshop-header-band">
      <div className="content-wrapper" style={{ padding: '1rem 1.25rem' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {/* Top metadata strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="mono-label">FACILITY CONTEXT:</span>
              <span className="mono-value">Tailoring Units • Boutiques • Garment Workshops</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#4A5D4E',
                  display: 'inline-block',
                }}
              />
              <span className="mono-label" style={{ color: 'var(--color-ink-primary)' }}>
                LOCAL READY
              </span>
            </div>
          </div>

          {/* Main Title Stamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-primary)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Textile Scrap Reuse Advisor
              </h1>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-ink-secondary)',
                  marginTop: '0.25rem',
                  margin: 0,
                }}
              >
                First-level circular recovery guidance for post-production fabric remnants
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="mono-label" style={{ border: '1px solid var(--color-border-default)', padding: '0.2rem 0.4rem' }}>
                SDG 12 TARGET
              </span>
              <span className="mono-label" style={{ border: '1px solid var(--color-border-default)', padding: '0.2rem 0.4rem' }}>
                CIRCULAR RECOVERY
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
