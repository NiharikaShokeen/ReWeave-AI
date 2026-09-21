import React from 'react';

/**
 * SelectField
 * Workshop dropdown with structured options, hints, and clean borders.
 */
export default function SelectField({
  id,
  label,
  hint,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error,
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className="form-label">
          <span>
            {label}
            {required && <span style={{ color: 'var(--color-ink-muted)', marginLeft: '0.25rem' }}>*</span>}
          </span>
          {hint && <span className="form-hint">{hint}</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="form-select"
        style={error ? { borderColor: '#A23B38' } : {}}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#A23B38', marginTop: '0.25rem' }}>
          {error}
        </span>
      )}
    </div>
  );
}
