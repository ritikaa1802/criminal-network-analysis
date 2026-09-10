'use client';

import { Shield, Lock, LinkIcon, FileCheck } from 'lucide-react';

export default function Header() {
  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--header-bg)',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Branding + Case */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: '#1d4ed8',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LinkIcon size={14} color="white" />
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#f9fafb',
              }}
            >
              Crimson
            </div>
          </div>
        </div>

        <div
          style={{
            width: 1,
            height: 24,
            background: '#374151',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>Case</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#f9fafb',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            CASE-2026-001
          </span>
        </div>
      </div>

      {/* Right: Security indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <StatusBadge icon={<Shield size={11} />} label="Secure Environment" />
        <StatusBadge icon={<Lock size={11} />} label="Data Anonymized" />
        <StatusBadge icon={<FileCheck size={11} />} label="Chain of Custody Verified" />
      </div>
    </header>
  );
}

function StatusBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        color: '#6b7280',
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#22c55e',
          display: 'inline-block',
          boxShadow: '0 0 0 2px rgba(34,197,94,0.2)',
        }}
      />
      <span style={{ color: '#9ca3af' }}>{icon}</span>
      <span style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}
