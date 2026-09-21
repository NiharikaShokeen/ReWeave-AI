import React from 'react';

/**
 * SectionLabel
 * Understated editorial label with index marker and title.
 */
export default function SectionLabel({ step, title, description, action }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem' }}>
          {step && (
            <span className="mono-label" style={{ color: 'var(--color-ink-muted)' }}>
              [{step}]
            </span>
          )}
          <h2 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-ink-primary)' }}>
            {title}
          </h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
          {description}
        </p>
      )}
    </div>
  );
}
