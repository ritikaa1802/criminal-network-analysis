'use client';

import { useState } from 'react';
import { StickyNote, X } from 'lucide-react';

type NoteColor = 'yellow' | 'pink' | 'blue' | 'green';

interface Props {
  entityId: string;
  entityName: string;
  onSave: (text: string, color: NoteColor) => void;
  onCancel: () => void;
}

const COLOR_OPTIONS: { key: NoteColor; bg: string; label: string }[] = [
  { key: 'yellow', bg: '#fbbf24', label: 'Yellow' },
  { key: 'pink', bg: '#f472b6', label: 'Pink' },
  { key: 'blue', bg: '#60a5fa', label: 'Blue' },
  { key: 'green', bg: '#4ade80', label: 'Green' },
];

const COLOR_BG: Record<NoteColor, string> = {
  yellow: '#fef9e7',
  pink: '#fdf2f8',
  blue: '#eff6ff',
  green: '#f0fdf4',
};

export default function StickyNoteEditor({ entityId, entityName, onSave, onCancel }: Props) {
  const [text, setText] = useState('');
  const [color, setColor] = useState<NoteColor>('yellow');

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim(), color);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onCancel}
    >
      <div
        className="fade-in"
        style={{
          width: 360,
          background: COLOR_BG[color],
          border: '1px solid var(--panel-border)',
          borderRadius: 10,
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.18)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 14px',
            borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <StickyNote size={14} style={{ color: '#92400e' }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              Add Note
            </span>
          </div>
          <button
            className="btn-icon"
            onClick={onCancel}
            title="Cancel"
            style={{ width: 24, height: 24 }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Entity label */}
        <div
          style={{
            padding: '8px 14px 0',
            fontSize: 11,
            color: '#64748b',
          }}
        >
          Annotating: <strong style={{ color: '#1e293b' }}>{entityName}</strong>
        </div>

        {/* Text area */}
        <div style={{ padding: '10px 14px' }}>
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your investigator note…"
            style={{
              width: '100%',
              minHeight: 100,
              maxHeight: 200,
              resize: 'vertical',
              padding: 10,
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(15, 23, 42, 0.12)',
              borderRadius: 7,
              color: '#1e293b',
              font: 'inherit',
              fontSize: 13,
              lineHeight: 1.5,
              outline: 'none',
            }}
            onFocus={(e) => {
              (e.target as HTMLElement).style.borderColor = '#3b82f6';
              (e.target as HTMLElement).style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.12)';
            }}
            onBlur={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(15, 23, 42, 0.12)';
              (e.target as HTMLElement).style.boxShadow = 'none';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSave();
              }
              if (e.key === 'Escape') {
                onCancel();
              }
            }}
          />
        </div>

        {/* Footer with color picker + actions */}
        <div
          style={{
            padding: '6px 14px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Color:</span>
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setColor(opt.key)}
                aria-label={`Use ${opt.label} color`}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: color === opt.key ? '2px solid #1e293b' : '1px solid rgba(15, 23, 42, 0.2)',
                  background: opt.bg,
                  cursor: 'pointer',
                  outline: 'none',
                  transform: color === opt.key ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.15s, border 0.15s',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onCancel}
              style={{
                padding: '6px 14px',
                border: '1px solid rgba(15, 23, 42, 0.15)',
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.6)',
                color: '#475569',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: 6,
                background: text.trim() ? '#1e293b' : '#94a3b8',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
            >
              Save Note
            </button>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div
          style={{
            padding: '0 14px 10px',
            fontSize: 10,
            color: '#94a3b8',
            textAlign: 'right',
          }}
        >
          ⌘/Ctrl + Enter to save · Esc to cancel
        </div>
      </div>
    </div>
  );
}
