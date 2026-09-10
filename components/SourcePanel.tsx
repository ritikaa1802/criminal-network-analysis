'use client';

import { useRef } from 'react';
import { FileText, FileSpreadsheet, Image, File, Plus, ChevronDown, Hash } from 'lucide-react';
import type { Source } from '@/lib/types';

interface Props {
  sources: Source[];
  onAddSource: (file: File) => void;
  onViewAudit: (source: Source) => void;
}

function getFileIcon(type: Source['type']) {
  switch (type) {
    case 'PDF':
      return <FileText size={13} color="#991b1b" />;
    case 'CSV':
    case 'XLS':
    case 'XLSX':
      return <FileSpreadsheet size={13} color="#166534" />;
    case 'JPG':
    case 'PNG':
      return <Image size={13} color="#7c3aed" />;
    default:
      return <File size={13} color="#6b7280" />;
  }
}

export default function SourcePanel({ sources, onAddSource, onViewAudit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddSource(file);
    e.target.value = '';
  };

  return (
    <div style={{ padding: '10px 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
          paddingLeft: 4,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Sources ({sources.length})
        </span>
      </div>

      {/* Source list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        {sources.map((source) => (
          <SourceItem key={source.id} source={source} onViewAudit={onViewAudit} />
        ))}
      </div>

      {/* Add Source button */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,.xls,.xlsx,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button
        className="btn-secondary"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => inputRef.current?.click()}
      >
        <Plus size={13} />
        Add Source
      </button>
    </div>
  );
}

function SourceItem({ source, onViewAudit }: { source: Source; onViewAudit: (s: Source) => void }) {
  const ext = source.filename.split('.').pop()?.toUpperCase() || 'OTHER';

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '8px 10px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onClick={() => onViewAudit(source)}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ marginTop: 1 }}>{getFileIcon(ext as Source['type'])}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {source.filename}
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--text-tertiary)',
              marginTop: 2,
              display: 'flex',
              gap: 8,
            }}
          >
            <span>{source.nodeCount} entities</span>
            <span>·</span>
            <span>{source.edgeCount} relationships</span>
          </div>
        </div>
        <ChevronDown size={11} color="var(--text-muted)" />
      </div>

      {/* Hash preview */}
      <div
        style={{
          marginTop: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: 'var(--text-muted)',
        }}
      >
        <Hash size={9} />
        <span
          style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.03em', color: '#9ca3af' }}
        >
          {source.hash.slice(0, 16)}…
        </span>
      </div>
    </div>
  );
}
