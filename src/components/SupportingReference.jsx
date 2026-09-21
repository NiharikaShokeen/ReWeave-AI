import React from 'react';
import SectionLabel from './SectionLabel';
import Panel from './Panel';

/**
 * SupportingReference
 * Practical workshop recovery reference guide explaining the physical pathways.
 */
export default function SupportingReference() {
  const pathways = [
    {
      title: 'Direct Reuse Pathway',
      code: 'REUSE-01',
      bestFor: 'Intact remnants, clean offcuts > 15 cm, uniform grain.',
      workshopApplications: 'Garment facings, internal pockets, patchwork goods, small accessories, fabric ties.',
      criterion: 'Preserves weave integrity and embodied production energy without downcycling.',
    },
    {
      title: 'Mechanical Recycling',
      code: 'RECYC-02',
      bestFor: 'Irregular shreds, offcuts < 15 cm, mono-material pure fibers.',
      workshopApplications: 'Fraying into yarn stock, mattress stuffing, acoustic panels, industrial wiping rags.',
      criterion: 'Requires sorting by fiber family (cellulosic vs thermoplastic) to prevent processing jams.',
    },
    {
      title: 'Physical Verification',
      code: 'CHECK-03',
      bestFor: 'Unlabeled remnants, suspected elastane blends, surface stains.',
      workshopApplications: 'Workshop flame/burn test, burn residue inspection, bolt inventory cross-reference.',
      criterion: 'Avoids contaminating recycling streams or wasting high-grade scrap on low-tier applications.',
    },
  ];

  return (
    <div style={{ marginTop: '2rem' }}>
      <SectionLabel
        step="REFERENCE"
        title="Workshop Recovery Standards"
        description="Standard operating criteria for small textile workshops and tailoring units."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {pathways.map((p) => (
          <Panel key={p.code} title={p.title} badge={<span className="mono-label">{p.code}</span>}>
            <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div>
                <span className="mono-label" style={{ display: 'block', fontSize: '0.6875rem' }}>
                  Optimal Material State:
                </span>
                <span style={{ color: 'var(--color-ink-primary)' }}>{p.bestFor}</span>
              </div>
              <div>
                <span className="mono-label" style={{ display: 'block', fontSize: '0.6875rem' }}>
                  Typical Workshop Uses:
                </span>
                <span style={{ color: 'var(--color-ink-secondary)' }}>{p.workshopApplications}</span>
              </div>
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{p.criterion}</span>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
