import React, { useRef } from 'react';

/**
 * ImageUpload
 * Optional workshop remnant image attachment.
 * Explicitly communicates uncertainty (photographs cannot prove exact fiber composition).
 */
export default function ImageUpload({ image, onImageChange, onImageRemove }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image mime type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageChange({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type,
        dataUrl: event.target?.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageChange({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type,
        dataUrl: event.target?.result,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <div className="form-label">
        <span>
          Batch Photograph
          <span className="mono-label" style={{ marginLeft: '0.5rem', fontWeight: 400 }}>
            (OPTIONAL)
          </span>
        </span>
        <span className="form-hint">Visual reference</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {!image ? (
        <div
          className="image-dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-ink-primary)' }}>
              Attach remnant photo (click or drag file)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>
              PNG, JPG, or WebP • Up to 5 MB
            </span>
          </div>
        </div>
      ) : (
        <div className="image-preview-card">
          <img
            src={image.dataUrl}
            alt="Scrap preview"
            className="image-preview-thumb"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--color-ink-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {image.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', marginTop: '0.125rem' }}>
              {image.sizeKb} KB • Attached
            </div>
          </div>
          <button
            type="button"
            onClick={onImageRemove}
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Uncertainty limitation caption */}
      <p style={{ fontSize: '0.71875rem', color: 'var(--color-ink-muted)', marginTop: '0.375rem', margin: '0.375rem 0 0 0', lineHeight: 1.4 }}>
        <strong>Visual reference limitation:</strong> Provides supplementary texture and pattern context.
        Visual appearance alone cannot confirm exact chemical fiber composition or blend ratios.
      </p>
    </div>
  );
}
