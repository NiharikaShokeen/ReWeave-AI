import React from 'react';

/**
 * ResponsibleAiNotice
 * Clear, concise disclosure on advisory status, image limitations, and the necessity of human judgement.
 */
export default function ResponsibleAiNotice() {
  return (
    <div
      style={{
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--color-surface-soft)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.8125rem',
        color: 'var(--color-ink-secondary)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
        <span
          className="mono-label"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            padding: '0.125rem 0.375rem',
            color: 'var(--color-ink-primary)',
          }}
        >
          ETHICAL PROTOCOL
        </span>
        <span style={{ fontWeight: 600, color: 'var(--color-ink-primary)', fontSize: '0.875rem' }}>
          RESPONSIBLE AI & LIMITATIONS
        </span>
      </div>

      <ul
        style={{
          margin: 0,
          paddingLeft: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          lineHeight: 1.5,
          color: 'var(--color-ink-primary)',
        }}
      >
        <li>
          <strong>AI assessment is advisory:</strong> The system provides decision support for workshop sorting; it does not replace operational regulations or standards.
        </li>
        <li>
          <strong>Exact textile composition cannot be confirmed from an ordinary image:</strong> Optical photos reveal surface texture and color, not chemical blend percentages.
        </li>
        <li>
          <strong>AI can make mistakes:</strong> The model evaluates available cues, but ambiguous remnant inputs can lead to misinterpretations.
        </li>
        <li>
          <strong>Human judgement remains important:</strong> Workshop operators must perform tactile inspection and flame/burn testing before committing to large-scale reuse or recycling.
        </li>
      </ul>
    </div>
  );
}
