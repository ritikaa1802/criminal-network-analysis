'use client';

import { X, User, Phone, Car, MapPin, Building2, CreditCard, FileText, ChevronRight, Maximize2 } from 'lucide-react';
import type { NodeData, NodeType } from '@/lib/types';
import { NODE_COLORS } from '@/lib/graphConfig';

const TYPE_ICONS: Record<NodeType, React.ReactNode> = {
  PERSON: <User size={14} />,
  PHONE: <Phone size={14} />,
  VEHICLE: <Car size={14} />,
  LOCATION: <MapPin size={14} />,
  ORGANIZATION: <Building2 size={14} />,
  ACCOUNT: <CreditCard size={14} />,
  DOCUMENT: <FileText size={14} />,
};

interface Props {
  node: NodeData;
  onClose: () => void;
  onExpandNetwork: (nodeId: string) => void;
}

export default function EntityPanel({ node, onClose, onExpandNetwork }: Props) {
  const color = NODE_COLORS[node.type];

  return (
    <div
      className="slide-in-right elevated-panel"
      style={{
        width: 'var(--panel-width)',
        height: '100%',
        background: 'var(--surface-0)',
        borderLeft: '1px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Entity Intelligence
        </span>
        <button className="btn-icon" onClick={onClose} title="Back to graph">
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Entity header */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}
            >
              {TYPE_ICONS[node.type]}
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}
              >
                {node.name}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className={`type-badge type-${node.type}`}>{node.type}</span>
            <span className={`risk-badge risk-${node.risk.toLowerCase()}`}>
              {node.risk} RISK
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 6,
            }}
          >
            Confidence
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="confidence-bar" style={{ flex: 1 }}>
              <div
                className="confidence-fill"
                style={{ width: `${node.confidence}%` }}
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', minWidth: 36 }}>
              {node.confidence}%
            </span>
          </div>
        </div>

        {/* Connections */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          <StatBox label="Connections" value={node.connectionCount ?? '—'} />
          <StatBox label="Sources" value={node.sources.length} />
        </div>

        {/* Identifiers */}
        {node.identifiers.length > 0 && (
          <Section title="Known Identifiers">
            {node.identifiers.map((id) => (
              <div
                key={id}
                style={{
                  padding: '7px 10px',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontFamily: 'monospace',
                }}
              >
                {id}
              </div>
            ))}
          </Section>
        )}

        {/* Sources */}
        <Section title="Evidence Sources">
          {node.sources.map((src) => (
            <div
              key={src}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 10px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 6,
              }}
            >
              <FileText size={12} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                {src}
              </span>
            </div>
          ))}
        </Section>

        {/* Expandable hint */}
        {node.expandable && (
          <div
            style={{
              padding: '10px 12px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 7,
              fontSize: 11,
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>⬡</span>
            <span>Double-click this node to expand its network.</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {node.expandable && (
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onExpandNetwork(node.id)}
          >
            <Maximize2 size={13} />
            Expand Network
          </button>
        )}
        <button
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onClose}
        >
          Close Panel
        </button>
      </div>
    </div>
  );
}

export function EntityPeek({
  node,
  onBrief,
  onClose,
}: {
  node: NodeData;
  onBrief: () => void;
  onClose: () => void;
}) {
  const color = NODE_COLORS[node.type];

  return (
    <div
      className="fade-in elevated-panel"
      style={{
        position: 'absolute',
        width: 220,
        padding: 12,
        transform: 'translate(18px, -50%)',
        background: '#ffffff',
        border: '1px solid var(--panel-border)',
        borderRadius: 8,
        boxShadow: 'var(--panel-shadow)',
        zIndex: 25,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, display: 'grid', placeItems: 'center', background: color, color: '#ffffff', flexShrink: 0 }}>
          {TYPE_ICONS[node.type]}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
            <strong style={{ fontSize: 12, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</strong>
            <button className="btn-icon" onClick={onClose} title="Dismiss entity brief" style={{ width: 20, height: 20 }}>
              <X size={12} />
            </button>
          </div>
          <div style={{ marginTop: 4, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            <span className={`type-badge type-${node.type}`} style={{ fontSize: 8 }}>{node.type}</span>
            <span className={`risk-badge risk-${node.risk.toLowerCase()}`} style={{ fontSize: 8 }}>{node.risk}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, margin: '10px 0', fontSize: 10, color: 'var(--text-secondary)' }}>
        <span>Confidence <strong style={{ color: 'var(--text-primary)' }}>{node.confidence}%</strong></span>
        <span>Links <strong style={{ color: 'var(--text-primary)' }}>{node.connectionCount ?? 0}</strong></span>
      </div>
      <button className="btn-secondary" onClick={onBrief} style={{ width: '100%', justifyContent: 'center', padding: '6px 10px', fontSize: 11 }}>
        Brief
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {children}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '10px 12px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginTop: 3,
        }}
      >
        {label}
      </div>
    </div>
  );
}
