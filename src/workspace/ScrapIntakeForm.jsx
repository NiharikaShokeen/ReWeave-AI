import React, { useState } from 'react';
import Panel from '../components/Panel';
import SectionLabel from '../components/SectionLabel';
import SelectField from '../components/SelectField';
import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';

/**
 * ScrapIntakeForm
 * Form: "Assess a scrap batch"
 * Groups: Material, Physical Form, Condition & Context
 * Sensible validation with support for incomplete data & unknown fibers.
 */
export default function ScrapIntakeForm({ onAssessScrap, onReset, isLoading = false }) {
  const [formData, setFormData] = useState({
    // Material
    fabricType: '',
    color: '',
    // Physical Form
    scrapSize: '',
    form: '',
    quantityAmount: '',
    quantityUnit: 'kg',
    // Condition & Context
    condition: '',
    description: '',
    image: null,
  });

  const [validationError, setValidationError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Exact fabric types requested
  const fabricTypeOptions = [
    { value: '', label: 'Select fabric type (or Unknown)...' },
    { value: 'Cotton', label: 'Cotton' },
    { value: 'Polyester', label: 'Polyester' },
    { value: 'Denim', label: 'Denim' },
    { value: 'Wool', label: 'Wool' },
    { value: 'Synthetic', label: 'Synthetic' },
    { value: 'Blend', label: 'Blend' },
    { value: 'Unknown', label: 'Unknown' },
  ];

  // Exact scrap sizes requested
  const scrapSizeOptions = [
    { value: '', label: 'Select scrap size...' },
    { value: 'Large pieces', label: 'Large pieces' },
    { value: 'Medium pieces', label: 'Medium pieces' },
    { value: 'Small pieces', label: 'Small pieces' },
    { value: 'Very small/offcuts', label: 'Very small/offcuts' },
    { value: 'Mixed', label: 'Mixed' },
  ];

  // Exact physical forms requested
  const formOptions = [
    { value: '', label: 'Select form structure...' },
    { value: 'Larger fabric pieces', label: 'Larger fabric pieces' },
    { value: 'Strips', label: 'Strips' },
    { value: 'Small pieces', label: 'Small pieces' },
    { value: 'Mixed scraps', label: 'Mixed scraps' },
  ];

  // Exact conditions requested
  const conditionOptions = [
    { value: '', label: 'Select batch condition...' },
    { value: 'Clean and dry', label: 'Clean and dry' },
    { value: 'Slightly worn', label: 'Slightly worn' },
    { value: 'Damaged', label: 'Damaged' },
    { value: 'Wet', label: 'Wet' },
    { value: 'Dirty/contaminated', label: 'Dirty/contaminated' },
    { value: 'Unknown', label: 'Unknown' },
  ];

  const commonColors = ['Natural / Ecru', 'Indigo / Denim', 'Black / Charcoal', 'White', 'Mixed Colors'];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user types
    if (validationError) setValidationError('');
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleColorChip = (chipColor) => {
    if (formData.color === chipColor) {
      handleChange('color', '');
    } else {
      handleChange('color', chipColor);
    }
  };

  const handleReset = () => {
    setFormData({
      fabricType: '',
      color: '',
      scrapSize: '',
      form: '',
      quantityAmount: '',
      quantityUnit: 'kg',
      condition: '',
      description: '',
      image: null,
    });
    setValidationError('');
    setFieldErrors({});
    if (onReset) onReset();
  };

  // 3 simple demo presets that populate the existing form fields
  const handleLoadDemo = (demoIndex) => {
    setValidationError('');
    setFieldErrors({});

    if (demoIndex === 1) {
      // 1. Clean cotton, 3kg, medium/large, clean → generally REUSE
      setFormData({
        fabricType: 'Cotton',
        color: 'Natural / Ecru',
        scrapSize: 'Large pieces',
        form: 'Larger fabric pieces',
        quantityAmount: '3',
        quantityUnit: 'kg',
        condition: 'Clean and dry',
        description: 'Clean cutting room remnants from tailored cotton shirts. Intact rectangular panels, unwashed, no stains.',
        image: null,
      });
    } else if (demoIndex === 2) {
      // 2. Unknown mixed very-small scraps, 5kg, clean → generally RECYCLE/FURTHER CHECK
      setFormData({
        fabricType: 'Unknown',
        color: 'Mixed Colors',
        scrapSize: 'Very small/offcuts',
        form: 'Mixed scraps',
        quantityAmount: '5',
        quantityUnit: 'kg',
        condition: 'Clean and dry',
        description: 'Unsorted bin of assorted small cutting clippings and edge trimmings. Clean and dry, but mixed unknown fibers.',
        image: null,
      });
    } else if (demoIndex === 3) {
      // 3. Unknown small damaged/contaminated scraps, 2kg → generally FURTHER CHECK/RECYCLE
      setFormData({
        fabricType: 'Unknown',
        color: 'Mixed Colors',
        scrapSize: 'Small pieces',
        form: 'Mixed scraps',
        quantityAmount: '2',
        quantityUnit: 'kg',
        condition: 'Dirty/contaminated',
        description: 'Sweepings from cutting floor with visible machine oil spots and dust. Frayed irregular pieces.',
        image: null,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sensible client-side validation
    // Check if form is completely blank
    const hasAnyField =
      formData.fabricType ||
      formData.color.trim() ||
      formData.scrapSize ||
      formData.form ||
      formData.quantityAmount.trim() ||
      formData.condition ||
      formData.description.trim() ||
      formData.image;

    if (!hasAnyField) {
      setValidationError('Please enter at least one scrap detail (e.g. fabric type, scrap size, or description) to assess this batch.');
      return;
    }

    // Validate quantity amount if provided
    const newFieldErrors = {};
    if (formData.quantityAmount.trim()) {
      const parsed = parseFloat(formData.quantityAmount);
      if (isNaN(parsed) || parsed <= 0) {
        newFieldErrors.quantityAmount = 'Please enter a positive numeric quantity (e.g. 3)';
      }
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // Prepare normalized batch payload
    const batchData = {
      id: `BATCH-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      material: {
        fabricType: formData.fabricType || 'Unspecified',
        color: formData.color.trim() || 'Unspecified',
      },
      physicalForm: {
        scrapSize: formData.scrapSize || 'Unspecified',
        form: formData.form || 'Unspecified',
        quantity: formData.quantityAmount.trim()
          ? `${formData.quantityAmount.trim()} ${formData.quantityUnit}`
          : 'Unspecified',
      },
      condition: {
        status: formData.condition || 'Unspecified',
        description: formData.description.trim() || 'No additional workshop notes provided',
      },
      image: formData.image
        ? {
            name: formData.image.name,
            sizeKb: formData.image.sizeKb,
            type: formData.image.type,
            dataUrl: formData.image.dataUrl,
          }
        : null,
      meta: {
        isUnknownFabric: formData.fabricType === 'Unknown',
        isIncomplete:
          !formData.fabricType ||
          !formData.scrapSize ||
          !formData.form ||
          !formData.condition,
      },
    };

    if (onAssessScrap) {
      onAssessScrap(batchData);
    }
  };

  const isFormEmpty =
    !formData.fabricType &&
    !formData.color &&
    !formData.scrapSize &&
    !formData.form &&
    !formData.quantityAmount &&
    !formData.condition &&
    !formData.description &&
    !formData.image;

  return (
    <div>
      <SectionLabel
        step="01"
        title="Assess a Scrap Batch"
        description="Enter observable batch attributes. Unknown or partial data is allowed."
      />

      <Panel
        title="Batch Input Form"
        badge={<span className="mono-label" style={{ color: 'var(--color-ink-muted)' }}>INTAKE</span>}
      >
        {/* Quick Demo Cases Selector (Fills Form Only - Evaluated by same engine) */}
        <div
          style={{
            padding: '0.625rem 0.75rem',
            backgroundColor: 'var(--color-surface-soft)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span className="mono-label" style={{ fontSize: '0.6875rem' }}>
              DEMO PRESETS (FILLS FORM)
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-ink-muted)' }}>
              Click preset, then click Assess Scrap
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            <button
              type="button"
              className="tag-chip"
              onClick={() => handleLoadDemo(1)}
              title="Populates: Clean cotton, 3kg, large pieces, clean"
            >
              1. Clean Cotton (3kg, Large, Clean)
            </button>
            <button
              type="button"
              className="tag-chip"
              onClick={() => handleLoadDemo(2)}
              title="Populates: Unknown mixed, 5kg, very small offcuts, clean"
            >
              2. Unknown Mixed (5kg, Very Small, Clean)
            </button>
            <button
              type="button"
              className="tag-chip"
              onClick={() => handleLoadDemo(3)}
              title="Populates: Unknown, 2kg, small, dirty/contaminated"
            >
              3. Contaminated Mix (2kg, Small, Dirty)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {validationError && (
            <div className="validation-notice" role="alert">
              <strong>Notice:</strong> {validationError}
            </div>
          )}

          {/* GROUP 1: MATERIAL */}
          <div className="form-subgroup">
            <div className="form-subgroup-header">
              <span className="form-subgroup-title">Material Profile</span>
              <span className="mono-label" style={{ fontSize: '0.6875rem' }}>Fiber & Shade</span>
            </div>

            <SelectField
              id="fabric-type"
              label="Fabric Type"
              hint="Observable composition"
              value={formData.fabricType}
              onChange={(e) => handleChange('fabricType', e.target.value)}
              options={fabricTypeOptions}
            />

            <div className="form-group">
              <label htmlFor="color-input" className="form-label">
                <span>Color</span>
                <span className="form-hint">Dye or shade</span>
              </label>
              <input
                id="color-input"
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="e.g. Natural ecru, Indigo blue, Mixed cuts..."
                className="form-input"
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.375rem' }}>
                {commonColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`tag-chip ${formData.color === c ? 'active' : ''}`}
                    onClick={() => handleColorChip(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GROUP 2: PHYSICAL FORM */}
          <div className="form-subgroup">
            <div className="form-subgroup-header">
              <span className="form-subgroup-title">Physical Form & Volume</span>
              <span className="mono-label" style={{ fontSize: '0.6875rem' }}>Dimensions & Mass</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <SelectField
                id="scrap-size"
                label="Scrap Size"
                hint="Dominant cut size"
                value={formData.scrapSize}
                onChange={(e) => handleChange('scrapSize', e.target.value)}
                options={scrapSizeOptions}
              />

              <SelectField
                id="form-structure"
                label="Form"
                hint="Piece geometry"
                value={formData.form}
                onChange={(e) => handleChange('form', e.target.value)}
                options={formOptions}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity-amount" className="form-label">
                <span>Quantity</span>
                <span className="form-hint">e.g. 3 kg</span>
              </label>
              <div className="quantity-composite">
                <input
                  id="quantity-amount"
                  type="number"
                  step="any"
                  min="0"
                  value={formData.quantityAmount}
                  onChange={(e) => handleChange('quantityAmount', e.target.value)}
                  placeholder="3"
                  className="form-input"
                  style={fieldErrors.quantityAmount ? { borderColor: '#A23B38' } : {}}
                />
                <select
                  value={formData.quantityUnit}
                  onChange={(e) => handleChange('quantityUnit', e.target.value)}
                  className="form-select"
                  aria-label="Quantity unit"
                >
                  <option value="kg">kg</option>
                  <option value="meters">meters</option>
                  <option value="pieces">pieces</option>
                  <option value="bags">bags / bins</option>
                </select>
              </div>
              {fieldErrors.quantityAmount && (
                <span style={{ fontSize: '0.75rem', color: '#A23B38', marginTop: '0.25rem' }}>
                  {fieldErrors.quantityAmount}
                </span>
              )}
            </div>
          </div>

          {/* GROUP 3: CONDITION & CONTEXT */}
          <div className="form-subgroup">
            <div className="form-subgroup-header">
              <span className="form-subgroup-title">Condition & Context</span>
              <span className="mono-label" style={{ fontSize: '0.6875rem' }}>Integrity & Notes</span>
            </div>

            <SelectField
              id="condition"
              label="Condition"
              hint="Surface cleanliness"
              value={formData.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
              options={conditionOptions}
            />

            <TextAreaField
              id="description"
              label="Description"
              hint="Workshop notes"
              placeholder="Anything useful about the scraps — stains, mixed fabrics, labels, unusual material, etc."
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />

            <ImageUpload
              image={formData.image}
              onImageChange={(img) => handleChange('image', img)}
              onImageRemove={() => handleChange('image', null)}
            />
          </div>

          {/* FORM ACTIONS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border-subtle)',
              marginTop: '1.25rem',
              gap: '0.75rem',
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isFormEmpty || isLoading}
            >
              Clear Form
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Evaluating Batch...' : 'Assess scrap'}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
