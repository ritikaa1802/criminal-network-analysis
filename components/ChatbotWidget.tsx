'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, MessageSquare, X, Send, ChevronDown, GripVertical } from 'lucide-react';

const SUGGESTED = [
  'Explain this connection',
  'Show high-risk entities',
  'Find new connections',
  'Summarize Person_A',
  'Which entities share sources?',
];

const MOCK_RESPONSES: Record<string, string> = {
  'Explain this connection':
    'The selected relationship was established through CDR analysis showing repeated high-frequency communication between the entities during the investigation period. Confidence is 96% based on call volume, duration patterns, and corroborating location data.',
  'Show high-risk entities':
    'There are 3 HIGH or CRITICAL risk entities in the current network: Person_A (HIGH, 94%), Organization_Z (CRITICAL, 89%), and Person_C (CRITICAL, 91%). Person_C was discovered through the CDR source and has direct links to entities already present in the network.',
  'Find new connections':
    'After analyzing CDR_2026_004.csv, 7 new relationships were discovered. The most significant is Person_C → Phone_9821 (FREQUENT_CONTACT, 89%), which links Person_C to Person_A\'s established communication network — a connection not visible from the FIR alone.',
  'Summarize Person_A':
    'Person_A is a HIGH risk entity with 94% confidence, referenced in FIR_2026_001.pdf. They have 7 known connections including Phone_9821, Person_B, Organization_Z, and Location_X. CDR analysis added Phone_7742 as a second communication channel.',
  'Which entities share sources?':
    'Person_A and Person_B both appear in FIR_2026_001.pdf and CDR_2026_004.csv. Phone_9821 appears in both FIR_2026_001.pdf (communication reference) and CDR_2026_004.csv (as a contact for Person_C), making it a critical bridge entity.',
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface Props {
  docked?: boolean;
  onClose?: () => void;
  headerMode?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ChatbotWidget({ docked = false, onClose, headerMode = false, onOpenChange }: Props) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      text: 'Connor is ready. Ask questions about this investigation or select a suggested query below.',
    },
  ]);
  const [input, setInput] = useState('');
  const messageIdRef = useRef(0);

  useEffect(() => {
    if (headerMode) onOpenChange?.(open);
  }, [headerMode, onOpenChange, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `message-${messageIdRef.current++}`, role: 'user', text };
    const response =
      MOCK_RESPONSES[text] ||
      `Analysis of "${text}" is being processed. This feature will connect to the investigation AI engine in production. The graph currently shows ${11} entities and 14 relationships.`;
    const aiMsg: Message = {
      id: `message-${messageIdRef.current++}`,
      role: 'assistant',
      text: response,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const visible = docked || open;

  if (headerMode) {
    return (
      <div style={{ position: 'relative' }}>
        <button className="connor-launcher" onClick={() => setOpen((current) => !current)} title="Open Connor AI assistant" aria-label="Open Connor AI assistant">
          <Bot size={25} />
        </button>
        {open && (
          <div style={{ position: 'fixed', top: 'var(--header-height)', right: 0, bottom: 0, width: 360, zIndex: 120, background: '#ffffff', border: '1px solid var(--panel-border)', boxShadow: 'var(--panel-shadow)' }}>
            <ChatbotWidget docked onClose={() => setOpen(false)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: docked ? 'static' : 'fixed',
        bottom: docked ? undefined : 20,
        right: docked ? undefined : 20,
        zIndex: docked ? undefined : 60,
        width: docked ? '100%' : undefined,
        height: docked ? '100%' : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: docked ? 'stretch' : 'flex-end',
        gap: docked ? 0 : 10,
      }}
    >
      {/* Chat window */}
      {visible && (
        <div
          className="fade-in elevated-panel"
          style={{
            width: docked ? '100%' : 320,
            height: docked ? '100%' : undefined,
            background: 'var(--surface-0)',
            border: '1px solid var(--panel-border)',
            borderRadius: docked ? 0 : 12,
            boxShadow: docked ? 'none' : '0 8px 40px rgba(0,0,0,0.14)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: '12px 14px',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageSquare size={11} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                  Connor AI
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>Ask about the active graph</div>
              </div>
            </div>
            <button
              onClick={() => (onClose ? onClose() : setOpen(false))}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              {docked && <GripVertical size={14} style={{ marginRight: 6, opacity: 0.6 }} />}
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              minHeight: docked ? 0 : 240,
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '8px 12px',
                    borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                    background: msg.role === 'user' ? '#eff6ff' : '#ffffff',
                    color: '#0f172a',
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested queries */}
          <div
            style={{
              padding: '8px 14px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface-1)',
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 6,
              }}
            >
              Suggested
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    padding: '3px 9px',
                    background: 'var(--surface-0)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'border-color 0.12s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-blue)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div
            style={{
              padding: '10px 14px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about this investigation…"
              style={{
                flex: 1,
                padding: '7px 10px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 12,
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'var(--text-primary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Send size={13} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      {!docked && <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'var(--text-primary)',
          border: '2px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
        title="Connor AI assistant"
      >
        {open ? (
          <ChevronDown size={18} color="white" />
        ) : (
          <MessageSquare size={18} color="#2563eb" />
        )}
      </button>}
    </div>
  );
}
