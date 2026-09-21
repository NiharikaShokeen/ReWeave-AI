import React from 'react';

/**
 * Button
 * Workshop action control with primary, secondary, and subtle variants.
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  style = {},
}) {
  const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClass} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
