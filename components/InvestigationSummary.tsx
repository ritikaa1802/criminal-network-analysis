'use client';

import { Users, GitBranch, AlertTriangle, FileText } from 'lucide-react';

interface Props {
  entities: number;
  relationships: number;
  highRisk: number;
  sources: number;
}

export default function InvestigationSummary({ entities, relationships, highRisk, sources }: Props) {
  const stats = [
    { label: 'Entities', value: entities, icon: <Users size={13} />, color: '#1e3a8a' },
    { label: 'Relationships', value: relationships, icon: <GitBranch size={13} />, color: '#0369a1' },
    { label: 'High Risk', value: highRisk, icon: <AlertTriangle size={13} />, color: '#dc2626' },
    { label: 'Sources', value: sources, icon: <FileText size={13} />, color: '#6d28d9' },
  ];

  return (
    <div style={{ padding: '12px 0' }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 8,
          paddingLeft: 4,
        }}
      >
        Investigation Summary
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 7,
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginBottom: 4,
                color: s.color,
              }}
            >
              {s.icon}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}
              >
                {s.label}
              </span>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
