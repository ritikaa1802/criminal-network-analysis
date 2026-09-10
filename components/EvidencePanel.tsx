'use client';

import { X, ArrowDown, FileText, Calendar, Shield } from 'lucide-react';
import type { EdgeData, NodeData } from '@/lib/types';

interface Props {
  edge: EdgeData;
  nodes: NodeData[];
  onClose: () => void;
}

export default function EvidencePanel({ edge, nodes, onClose }: Props) {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  return (
    <div
      className="slide-in-right"
      style={{
        width: 'var(--panel-width)',
        height: '100%',
        background: 'var(--surface-0)',
        borderLeft: '1px solid var(--border)',
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
          Relationship Evidence
        </span>
        <button className="btn-icon" onClick={onClose}>
          <X size={13} />
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
        {/* Relationship type */}
        <div
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}
          >
            Relationship
          </div>

          {/* Flow: A → REL → B */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <EntityChip node={sourceNode} fallback={edge.source} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <ArrowDown size={14} color="var(--text-muted)" />
              <div
                style={{
                  background: 'var(--text-primary)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {edge.relationship.replace(/_/g, ' ')}
              </div>
              <ArrowDown size={14} color="var(--text-muted)" />
            </div>
            <EntityChip node={targetNode} fallback={edge.target} />
          </div>
        </div>

        {/* Confidence & Risk */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
              {edge.confidence}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Confidence
            </div>
          </div>
          <div
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 7,
              padding: '10px 12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className={`risk-badge risk-${edge.risk.toLowerCase()}`} style={{ fontSize: 11 }}>
              {edge.risk}
            </span>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Risk
            </div>
          </div>
        </div>

        {/* Source details */}
        <div
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <MetaRow
            icon={<FileText size={13} />}
            label="Source Document"
            value={edge.sourceDocument}
            mono
          />
          <div className="divider" />
          <MetaRow
            icon={<Calendar size={13} />}
            label="Timestamp"
            value={edge.timestamp}
          />
          <div className="divider" />
          <MetaRow
            icon={<Shield size={13} />}
            label="Intelligence ID"
            value={edge.id.toUpperCase()}
            mono
          />
        </div>

        {/* Evidence snippet */}
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 8,
            }}
          >
            Evidence
          </div>
          <div
            style={{
              padding: 14,
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 13,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              borderLeft: '3px solid var(--text-primary)',
            }}
          >
            "{edge.evidence}"
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
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

function EntityChip({ node, fallback }: { node?: NodeData; fallback: string }) {
  if (!node) {
    return (
      <div
        style={{
          padding: '6px 14px',
          background: 'var(--surface-2)',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'monospace',
        }}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        background: 'var(--surface-0)',
        border: '1px solid var(--border-strong)',
        borderRadius: 7,
      }}
    >
      <span className={`type-badge type-${node.type}`} style={{ padding: '1px 5px', fontSize: 9 }}>
        {node.type}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
        {node.name}
      </span>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          marginBottom: 4,
          color: 'var(--text-muted)',
        }}
      >
        {icon}
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: mono ? 'monospace' : 'inherit',
          letterSpacing: mono ? '0.03em' : 'inherit',
        }}
      >
        {value}
      </div>
    </div>
  );
}
