import React from 'react';

/**
 * StatusBadge
 * Understated, semantic label indicating recovery pathway or state.
 * Designed with natural textile/earth tones without neon gradients or glowing pills.
 */
export default function StatusBadge({ status, size = 'normal', variant }) {
  const normStatus = (status || '').toUpperCase();

  // Determine styling based on explicit variant or status keyword
  let bg = 'var(--color-surface-soft)';
  let ink = 'var(--color-ink-secondary)';
  let border = 'var(--color-border-default)';

  if (variant === 'reuse' || normStatus.includes('REUSE')) {
    bg = 'var(--color-reuse-bg)';
    ink = 'var(--color-reuse-ink)';
    border = 'var(--color-reuse-border)';
  } else if (variant === 'recycle' || normStatus.includes('RECYCLE')) {
    bg = 'var(--color-recycle-bg)';
    ink = 'var(--color-recycle-ink)';
    border = 'var(--color-recycle-border)';
  } else if (variant === 'check' || normStatus.includes('CHECK') || normStatus.includes('ASSESSMENT')) {
    bg = 'var(--color-check-bg)';
    ink = 'var(--color-check-ink)';
    border = 'var(--color-check-border)';
  }

  const isSmall = size === 'small';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: isSmall ? '0.125rem 0.375rem' : '0.25rem 0.625rem',
        fontSize: isSmall ? '0.6875rem' : '0.75rem',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        backgroundColor: bg,
        color: ink,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-xs)',
        lineHeight: 1.2,
      }}
    >
      {status}
    </span>
  );
}
