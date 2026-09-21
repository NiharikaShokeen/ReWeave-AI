import React from 'react';

/**
 * SdgContext
 * Clear SDG alignment stating Primary SDG 12 and Secondary SDG 13 (indirect).
 */
export default function SdgContext() {
  return (
    <div
      style={{
        padding: '1rem 1.25rem',
        border: '1px solid var(--color-border-subtle)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span className="mono-label" style={{ color: 'var(--color-ink-primary)' }}>
          SUSTAINABILITY ALIGNMENT
        </span>
        <span className="mono-value" style={{ fontSize: '0.75rem' }}>
          UN SUSTAINABLE DEVELOPMENT GOALS
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* PRIMARY SDG */}
        <div style={{ borderLeft: '3px solid #3E6346', paddingLeft: '0.75rem' }}>
          <span className="mono-label" style={{ display: 'block', fontSize: '0.6875rem', color: '#27412C' }}>
            PRIMARY SDG
          </span>
          <h4 style={{ margin: '0.25rem 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink-primary)' }}>
            SDG 12 – Responsible Consumption and Production
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.45 }}>
            Supports Target 12.5: Substantially reduce waste generation through prevention, reduction, recycling, and reuse in small-scale garment production.
          </p>
        </div>

        {/* SECONDARY SDG */}
        <div style={{ borderLeft: '3px solid var(--color-border-default)', paddingLeft: '0.75rem' }}>
          <span className="mono-label" style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--color-ink-muted)' }}>
            SECONDARY SDG
          </span>
          <h4 style={{ margin: '0.25rem 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink-secondary)' }}>
            SDG 13 – Climate Action (indirect contribution)
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.45 }}>
            Indirect potential reduction in lifecycle carbon intensity by diverting post-cutting remnants from municipal incineration and landfill.
          </p>
        </div>
      </div>
    </div>
  );
}
