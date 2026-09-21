import React, { useState } from 'react';
import Header from './components/Header';
import IntroContext from './workspace/IntroContext';
import ScrapIntakeForm from './workspace/ScrapIntakeForm';
import AssessmentView from './workspace/AssessmentView';
import SupportingReference from './components/SupportingReference';
import ResponsibleAiNotice from './components/ResponsibleAiNotice';
import SdgContext from './components/SdgContext';
import { assessScrap } from './services/assessmentService';

export default function App() {
  // Current assessment result conforming strictly to schema
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAssessScrap = async (batchData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Delegate to clean assessment service abstraction
      const result = await assessScrap(batchData);
      setAssessment(result);
    } catch (err) {
      console.error('Assessment evaluation failed:', err);
      setError(err.message || 'Unable to complete batch assessment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAssessment(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Workshop Product Header */}
      <Header />

      {/* Main Single Focused Workspace */}
      <main className="content-wrapper" style={{ flex: 1, paddingBottom: '3rem' }}>
        {/* Intro / Context Area */}
        <IntroContext />

        {/* Core Two-Stage Workspace: Input Form -> Assessment Engine -> Structured Result */}
        <div className="workspace-grid">
          <ScrapIntakeForm
            onAssessScrap={handleAssessScrap}
            onReset={handleReset}
            isLoading={isLoading}
          />
          <AssessmentView
            assessment={assessment}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Practical Workshop Supporting Information */}
        <SupportingReference />

        {/* Responsible AI & SDG Context Sections */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <ResponsibleAiNotice />
          <SdgContext />
        </div>
      </main>

      {/* Understated Workshop Stamp Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-default)',
          backgroundColor: 'var(--color-surface)',
          padding: '1.25rem 0',
        }}
      >
        <div
          className="content-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="mono-label" style={{ color: 'var(--color-ink-primary)' }}>
              TEXTILE SCRAP REUSE ADVISOR
            </span>
            <span className="mono-value" style={{ color: 'var(--color-ink-muted)' }}>
              • College Internship Prototype
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>
            Focused on Local Tailoring & Boutique Circularity • SDG 12
          </div>
        </div>
      </footer>
    </div>
  );
}
