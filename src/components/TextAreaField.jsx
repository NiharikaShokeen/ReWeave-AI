import React from 'react';

/**
 * TextAreaField
 * Multi-line input for workshop notes, observations, or burn-test results.
 */
export default function TextAreaField({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  error,
}) {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={areaId} className="form-label">
          <span>
            {label}
            {required && <span style={{ color: 'var(--color-ink-muted)', marginLeft: '0.25rem' }}>*</span>}
          </span>
          {hint && <span className="form-hint">{hint}</span>}
        </label>
      )}
      <textarea
        id={areaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className="form-textarea"
        style={error ? { borderColor: '#A23B38' } : {}}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#A23B38', marginTop: '0.25rem' }}>
          {error}
        </span>
      )}
    </div>
  );
}
