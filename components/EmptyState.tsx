'use client';

import { Upload, Network } from 'lucide-react';
import { useRef } from 'react';

interface Props {
  onUpload: (file: File) => void;
}

export default function EmptyState({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = '';
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-2)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          maxWidth: 420,
          textAlign: 'center',
          padding: 48,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: 'var(--surface-2)',
            border: '2px dashed var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Network size={32} />
        </div>

        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 8,
              letterSpacing: '-0.01em',
            }}
          >
            No Investigation Data
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-tertiary)',
              lineHeight: 1.6,
            }}
          >
            Upload a source document to begin network analysis. Supported formats: PDF, CSV, XLS,
            XLSX, JPG, PNG.
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv,.xls,.xlsx,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <button className="btn-primary" onClick={() => inputRef.current?.click()}>
          <Upload size={14} />
          Upload Source
        </button>

        <div
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border)',
            paddingTop: 16,
            width: '100%',
          }}
        >
          Upload a source to build a network graph and begin your investigation.
        </div>
      </div>
    </div>
  );
}
