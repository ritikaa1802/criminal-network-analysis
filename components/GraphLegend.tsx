'use client';

import { useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import { NODE_COLORS } from '@/lib/graphConfig';
import type { NodeType } from '@/lib/types';

const SHAPE_ICONS: Record<NodeType, string> = {
  PERSON: '●',
  PHONE: '▬',
  VEHICLE: '◆',
  LOCATION: '⬠',
  ORGANIZATION: '⬡',
  ACCOUNT: '⬟',
  DOCUMENT: '▪',
};

const RISK_ITEMS = [
  { label: 'Critical', color: '#dc2626', border: '3px solid #dc2626' },
  { label: 'High', color: '#dc2626', border: '3px solid #dc2626' },
  { label: 'Medium', color: '#d97706', border: '2px solid #d97706' },
  { label: 'Low', color: '#94a3b8', border: '2px solid #94a3b8' },
];

const NODE_TYPES: NodeType[] = [
  'PERSON',
  'PHONE',
  'VEHICLE',
  'LOCATION',
  'ORGANIZATION',
  'ACCOUNT',
  'DOCUMENT',
];

interface Props {
  onClose?: () => void;
}

export default function GraphLegend({ onClose }: Props) {
  const [position, setPosition] = useState({ x: 16, y: 16 });

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const initial = position;

    const handleMove = (moveEvent: PointerEvent) => {
      setPosition({
        x: Math.max(8, initial.x + moveEvent.clientX - startX),
        y: Math.max(8, initial.y - moveEvent.clientY + startY),
      });
    };
    const handleEnd = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);
  };

  return (
    <div
      onPointerDown={handleDragStart}
      style={{
        position: 'absolute',
        bottom: position.y,
        left: position.x,
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 12,
        zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        minWidth: 160,
        cursor: 'grab',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 8,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <GripVertical size={12} />
          Legend
        </span>
        {onClose && (
          <button className="btn-icon" onClick={onClose} title="Hide legend">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Entity Types */}
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 5,
          marginTop: 2,
        }}
      >
        Entity Types
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {NODE_TYPES.map((type) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span
              style={{
                fontSize: 11,
                color: NODE_COLORS[type],
                lineHeight: 1,
              }}
            >
              {SHAPE_ICONS[type]}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="divider" style={{ marginBottom: 8 }} />

      {/* Risk Levels */}
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 5,
        }}
      >
        Risk Level (Border)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        {RISK_ITEMS.map((r) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div
              style={{
                width: 16,
                height: 10,
                borderRadius: 3,
                background: 'transparent',
                border: r.border,
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="divider" style={{ marginBottom: 8 }} />

      {/* New connection */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div
          style={{
            width: 16,
            height: 10,
            borderRadius: 3,
            background: 'transparent',
            border: '3px solid #2563eb',
          }}
        />
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
          New Discovery
        </span>
      </div>
    </div>
  );
}
