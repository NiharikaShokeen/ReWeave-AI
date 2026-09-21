import React from 'react';

/**
 * Panel
 * Clean workshop surface with crisp borders, subtle tactile shading, and no excessive rounding.
 */
export default function Panel({ children, title, subtitle, badge, action, style = {}, className = '' }) {
  return (
    <section
      className={`panel ${className}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-panel)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...style,
      }}
    >
      {(title || badge || action) && (
        <header
          style={{
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h3
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-ink-primary)',
                  margin: 0,
                }}
              >
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', marginTop: '0.125rem', margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </header>
      )}
      <div style={{ padding: '1.25rem' }}>
        {children}
      </div>
    </section>
  );
}
