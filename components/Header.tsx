'use client';

import { LinkIcon, Plus, Save, Share2 } from 'lucide-react';
import ChatbotWidget from '@/components/ChatbotWidget';

interface Props {
  onCreate: () => void;
  onSave: () => void;
  onShare: () => void;
}

export default function Header({ onCreate, onSave, onShare }: Props) {
  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--header-bg)',
        borderBottom: '1px solid #1e3a8a',
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
              background: '#2563eb',
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
                color: '#ffffff',
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
            background: '#1e3a8a',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Case</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            CASE-2026-001
          </span>
        </div>
      </div>

      {/* Right: Workspace actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="header-action header-action-blue header-action-create" onClick={onCreate} title="Create a new investigation">
          <Plus size={14} />
          <span>Create</span>
        </button>
        <button className="header-action header-action-dark" onClick={onSave} title="Save investigation locally">
          <Save size={14} />
          <span>Save</span>
        </button>
        <button className="header-action header-action-dark" onClick={onShare} title="Share investigation">
          <Share2 size={14} />
          <span>Share</span>
        </button>
        <ChatbotWidget headerMode />
      </div>
    </header>
  );
}
