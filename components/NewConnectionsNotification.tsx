'use client';

import { X, ArrowDown, Zap } from 'lucide-react';
import { DATASET_2_NEW_EDGES } from '@/lib/mockData';
import type { NodeData } from '@/lib/types';

interface Props {
  newEdgeCount: number;
  nodes: NodeData[];
  onViewConnections: () => void;
  onDismiss: () => void;
}

export default function NewConnectionsNotification({
  newEdgeCount,
  nodes,
  onViewConnections,
  onDismiss,
}: Props) {
  // Show a sample new connection for the "wow" demonstration
  const sampleEdge = DATASET_2_NEW_EDGES[1]; // Person_C → Phone_9821 (the key cross-link)
  const sourceNode = nodes.find((n) => n.id === sampleEdge?.source);
  const targetNode = nodes.find((n) => n.id === sampleEdge?.target);

  return (
    <div
      className="fade-in new-pulse"
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        background: 'var(--surface-0)',
        border: '1px solid #06b6d4',
        borderRadius: 10,
        padding: '14px 18px',
        boxShadow: '0 4px 24px rgba(6, 182, 212, 0.18)',
        maxWidth: 400,
        width: 'calc(100% - 32px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: '#164e63',
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Zap size={14} color="#06b6d4" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {newEdgeCount} New Connection{newEdgeCount !== 1 ? 's' : ''} Discovered
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              Additional source analysis complete · CDR_2026_004.csv
            </div>
          </div>
        </div>
        <button className="btn-icon" onClick={onDismiss} style={{ marginTop: -2 }} title="Back to graph">
          <X size={12} />
        </button>
      </div>

      {/* Sample connection highlight */}
      {sampleEdge && sourceNode && targetNode && (
        <div
          style={{
            background: '#ecfeff',
            border: '1px solid #a5f3fc',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#0891b2',
              marginBottom: 8,
            }}
          >
            New Intelligence
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
              {sourceNode.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowDown size={12} color="#0891b2" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '2px 8px',
                  background: '#164e63',
                  color: '#06b6d4',
                  borderRadius: 10,
                }}
              >
                {sampleEdge.relationship.replace(/_/g, ' ')}
              </span>
              <ArrowDown size={12} color="#0891b2" />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
              {targetNode.name}
            </div>
          </div>
          <div
            style={{
              marginTop: 8,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 10,
              color: '#0891b2',
            }}
          >
            <span>Confidence: <strong>{sampleEdge.confidence}%</strong></span>
            <span>Source: <strong>{sampleEdge.sourceDocument}</strong></span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-primary"
          style={{
            flex: 1,
            justifyContent: 'center',
            background: '#0e7490',
            fontSize: 12,
          }}
          onClick={onViewConnections}
        >
          View New Connections
        </button>
        <button className="btn-secondary" style={{ fontSize: 12 }} onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
