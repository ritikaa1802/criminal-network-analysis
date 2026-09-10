'use client';

import { useEffect, useState, useRef } from 'react';
import { Check, Loader2, CheckCircle2 } from 'lucide-react';
import { PROCESSING_STEPS_INITIAL, PROCESSING_STEPS_ADDITIONAL } from '@/lib/mockData';

interface ProcessingResult {
  nodeCount: number;
  edgeCount: number;
  newConnections: number;
  isAdditional: boolean;
}

interface Props {
  filename: string;
  isAdditional: boolean;
  onComplete: () => void;
}

export default function ProcessingModal({ filename, isAdditional, onComplete }: Props) {
  const steps = isAdditional ? PROCESSING_STEPS_ADDITIONAL : PROCESSING_STEPS_INITIAL;
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);

  const result: ProcessingResult = isAdditional
    ? { nodeCount: 5, edgeCount: 7, newConnections: 7, isAdditional: true }
    : { nodeCount: 6, edgeCount: 7, newConnections: 0, isAdditional: false };

  useEffect(() => {
    let totalTime = 0;
    const stepTotal = steps.reduce((a, s) => a + s.durationMs, 0);

    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((step, i) => {
      const startTimer = setTimeout(() => {
        setActiveStep(i);
      }, totalTime);
      timers.push(startTimer);

      totalTime += step.durationMs;

      const doneTimer = setTimeout(() => {
        setDoneSteps((prev) => new Set([...prev, i]));
        const prog = Math.round(((i + 1) / steps.length) * 100);
        setProgress(prog);

        if (i === steps.length - 1 && !completedRef.current) {
          completedRef.current = true;
          setCompleted(true);

          setTimeout(() => {
            onComplete();
          }, 1200);
        }
      }, totalTime);
      timers.push(doneTimer);
    });

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="fade-in"
        style={{
          background: 'var(--surface-0)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 32,
          width: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 6,
            }}
          >
            {isAdditional ? 'Analyzing Additional Source' : 'Processing Source'}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
              fontFamily: 'monospace',
            }}
          >
            {filename}
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {steps.map((step, i) => {
            const isDone = doneSteps.has(i);
            const isActive = activeStep === i && !isDone;

            return (
              <div
                key={step.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                {/* Status icon */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: isDone ? '#166534' : isActive ? '#1e3a8a' : 'var(--surface-2)',
                    border: isDone
                      ? '1px solid #166534'
                      : isActive
                      ? '1px solid #1e3a8a'
                      : '1px solid var(--border)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isDone ? (
                    <Check size={11} color="white" strokeWidth={3} />
                  ) : isActive ? (
                    <Loader2
                      size={11}
                      color="white"
                      style={{ animation: 'spin 1s linear infinite' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--text-muted)',
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isDone ? 600 : isActive ? 600 : 400,
                    color: isDone
                      ? 'var(--text-primary)'
                      : isActive
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {step.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <span style={{ fontSize: 10, color: '#1d4ed8', fontWeight: 600, marginLeft: 'auto' }}>
                    Processing…
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
              fontSize: 11,
              color: 'var(--text-tertiary)',
            }}
          >
            <span>Progress</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progress}%</span>
          </div>
          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${progress}%`, transition: 'width 0.4s ease' }}
            />
          </div>
        </div>

        {/* Completion summary */}
        {completed && (
          <div
            className="fade-in"
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <CheckCircle2 size={16} color="#166534" />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#166534',
                }}
              >
                {isAdditional ? 'Network Updated' : 'Analysis Complete'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { label: 'Entities', value: result.nodeCount },
                { label: 'Relationships', value: result.edgeCount },
                ...(result.newConnections > 0
                  ? [{ label: 'New Connections', value: result.newConnections }]
                  : []),
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{ fontSize: 18, fontWeight: 700, color: '#166534' }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 10, color: '#15803d', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
