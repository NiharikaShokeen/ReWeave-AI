import React from 'react';

/**
 * InputField
 * Tactile, accessible text input with clear label, optional hint, and optional prefix/suffix.
 */
export default function InputField({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  error,
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>
            {label}
            {required && <span style={{ color: 'var(--color-ink-muted)', marginLeft: '0.25rem' }}>*</span>}
          </span>
          {hint && <span className="form-hint">{hint}</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="form-input"
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
