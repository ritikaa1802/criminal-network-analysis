'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, ChevronDown, ChevronUp } from 'lucide-react';

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

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      text: 'AI Investigation Assistant is ready. Ask questions about this investigation or select a suggested query below.',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const response =
      MOCK_RESPONSES[text] ||
      `Analysis of "${text}" is being processed. This feature will connect to the investigation AI engine in production. The graph currently shows ${11} entities and 14 relationships.`;
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: response,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }}
    >
      {/* Chat window */}
      {open && (
        <div
          className="fade-in"
          style={{
            width: 320,
            background: 'var(--surface-0)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--header-bg)',
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
                  background: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageSquare size={11} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f9fafb' }}>
                  AI Investigation Assistant
                </div>
                <div style={{ fontSize: 10, color: '#6b7280' }}>Placeholder · Production pending</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              height: 240,
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
                    background:
                      msg.role === 'user' ? 'var(--text-primary)' : 'var(--surface-2)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-secondary)',
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
      <button
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
        title="AI Investigation Assistant"
      >
        {open ? (
          <ChevronDown size={18} color="white" />
        ) : (
          <MessageSquare size={18} color="white" />
        )}
      </button>
    </div>
  );
}
