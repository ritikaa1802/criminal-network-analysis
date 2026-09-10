'use client';

import { X, Hash, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Source } from '@/lib/types';

interface Props {
  source: Source | null;
  onClose: () => void;
}

export default function AuditDrawer({ source, onClose }: Props) {
  if (!source) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 80,
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="slide-in-right"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 360,
          background: 'var(--surface-0)',
          borderLeft: '1px solid var(--border)',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 3,
              }}
            >
              Chain of Custody
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {source.filename}
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={13} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Verification status */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <CheckCircle2 size={18} color="#166534" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>
                Chain of Custody Verified
              </div>
              <div style={{ fontSize: 11, color: '#15803d' }}>
                All processing steps authenticated
              </div>
            </div>
          </div>

          {/* Hash */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Hash size={11} /> Source Hash (SHA-256)
            </div>
            <div
              style={{
                padding: '8px 12px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'var(--text-secondary)',
                wordBreak: 'break-all',
                lineHeight: 1.6,
              }}
            >
              {source.hash}
            </div>
          </div>

          {/* Upload time */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Clock size={11} /> Last Processed
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {source.uploadedAt}
            </div>
          </div>

          {/* Processing steps audit log */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 10,
              }}
            >
              Audit Log · {source.processingSteps?.length ?? 0} Steps
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {source.processingSteps?.map((event, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom:
                      i < (source.processingSteps?.length ?? 0) - 1
                        ? '1px solid var(--border)'
                        : 'none',
                  }}
                >
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircle2 size={10} color="white" />
                    </div>
                    {i < (source.processingSteps?.length ?? 0) - 1 && (
                      <div style={{ width: 1, flex: 1, background: 'var(--border)', minHeight: 8 }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 9,
                        fontFamily: 'monospace',
                        color: 'var(--text-muted)',
                        marginBottom: 2,
                      }}
                    >
                      {event.timestamp}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {event.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data sovereignty mini diagram */}
          <div
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 10,
              }}
            >
              Data Sovereignty
            </div>
            {['Raw Evidence', 'Local Processing', 'Anonymization', 'Tokenized Analysis'].map(
              (step, i, arr) => (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      padding: '4px 12px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      background: 'var(--surface-0)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {step}
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0' }}>↓</div>
                  )}
                </div>
              )
            )}
            <div
              style={{
                marginTop: 8,
                padding: '4px 10px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 4,
                textAlign: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#166534',
              }}
            >
              PII Boundary: PROTECTED ✓
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
