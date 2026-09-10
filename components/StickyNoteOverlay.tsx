'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { StickyNote, X, GripVertical } from 'lucide-react';

export interface StickyNoteData {
  id: string;
  entityId: string;
  text: string;
  color: 'yellow' | 'pink' | 'blue' | 'green';
  createdAt: string;
  offsetX?: number;
  offsetY?: number;
}

interface Props {
  notes: StickyNoteData[];
  graphRef: React.RefObject<any>;
  onDeleteNote: (noteId: string) => void;
  onClickNote: (entityId: string) => void;
  onUpdateNoteOffset: (noteId: string, offsetX: number, offsetY: number) => void;
}

const NOTE_COLORS: Record<string, { bg: string; border: string; headerBg: string; line: string }> = {
  yellow: { bg: '#fef9e7', border: '#f59e0b', headerBg: '#fef3c7', line: '#f59e0b' },
  pink: { bg: '#fdf2f8', border: '#ec4899', headerBg: '#fce7f3', line: '#ec4899' },
  blue: { bg: '#eff6ff', border: '#3b82f6', headerBg: '#dbeafe', line: '#3b82f6' },
  green: { bg: '#f0fdf4', border: '#22c55e', headerBg: '#dcfce7', line: '#22c55e' },
};

const DEFAULT_OFFSET_X = 80;
const DEFAULT_OFFSET_Y = -30;
const NOTE_STACK_GAP = 10;
const NOTE_ESTIMATED_HEIGHT = 90;

export default function StickyNoteOverlay({
  notes,
  graphRef,
  onDeleteNote,
  onClickNote,
  onUpdateNoteOffset,
}: Props) {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [zoom, setZoom] = useState<number>(1);
  const [dragging, setDragging] = useState<{
    noteId: string;
    startMouseX: number;
    startMouseY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Poll Cytoscape for entity positions using requestAnimationFrame
  useEffect(() => {
    if (notes.length === 0) return;

    const updatePositions = () => {
      if (!graphRef.current?.getNodePositions) {
        rafRef.current = requestAnimationFrame(updatePositions);
        return;
      }

      const entityIds = [...new Set(notes.map((n) => n.entityId))];
      const newPositions = graphRef.current.getNodePositions(entityIds);
      setPositions(newPositions);
      if (graphRef.current.getZoom) {
        setZoom(graphRef.current.getZoom());
      }
      rafRef.current = requestAnimationFrame(updatePositions);
    };

    rafRef.current = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(rafRef.current);
  }, [notes, graphRef]);

  // Handle drag
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, noteId: string, currentOffsetX: number, currentOffsetY: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging({
        noteId,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startOffsetX: currentOffsetX,
        startOffsetY: currentOffsetY,
      });
    },
    []
  );

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - dragging.startMouseX;
      const dy = e.clientY - dragging.startMouseY;
      onUpdateNoteOffset(
        dragging.noteId,
        dragging.startOffsetX + dx,
        dragging.startOffsetY + dy
      );
    };

    const handlePointerUp = () => {
      setDragging(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, onUpdateNoteOffset]);

  if (notes.length === 0) return null;

  // Build per-entity index so notes on the same entity stack vertically
  const entityNoteIndex: Record<string, number> = {};
  const noteIndexMap: Record<string, number> = {};
  for (const note of notes) {
    const idx = entityNoteIndex[note.entityId] ?? 0;
    noteIndexMap[note.id] = idx;
    entityNoteIndex[note.entityId] = idx + 1;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 22,
        overflow: 'hidden',
      }}
    >
      {/* Note cards */}
      {notes.map((note) => {
        const entityPos = positions[note.entityId];
        if (!entityPos) return null;

        // If user has manually dragged the note, use their offset directly.
        // Otherwise auto-stack: each subsequent note for the same entity shifts down.
        const stackIndex = noteIndexMap[note.id] ?? 0;
        const isZoomedOut = zoom < 0.5;

        const offsetX = note.offsetX ?? DEFAULT_OFFSET_X;
        const offsetY = note.offsetY != null
          ? note.offsetY
          : DEFAULT_OFFSET_Y + stackIndex * (NOTE_ESTIMATED_HEIGHT + NOTE_STACK_GAP);

        let noteX, noteY;
        if (isZoomedOut) {
          // When zoomed out, cluster dots tightly near the top-right of the parent node
          const dotOffsetX = 20 + stackIndex * 16;
          const dotOffsetY = -20;
          noteX = entityPos.x + dotOffsetX;
          noteY = entityPos.y + dotOffsetY;
        } else {
          noteX = entityPos.x + offsetX;
          noteY = entityPos.y + offsetY;
        }

        const colors = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;

        if (isZoomedOut) {
          return (
            <div
              key={note.id}
              style={{
                position: 'absolute',
                left: noteX,
                top: noteY,
                width: 14,
                height: 14,
                background: colors.border,
                border: '2px solid white',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                pointerEvents: 'auto',
                cursor: 'pointer',
                transition: dragging?.noteId === note.id ? 'none' : 'left 0.06s, top 0.06s',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickNote(note.entityId);
              }}
              title={note.text}
            />
          );
        }

        return (
          <div
            key={note.id}
            className="saved-sticky-note"
            style={{
              position: 'absolute',
              left: noteX,
              top: noteY,
              width: 180,
              maxHeight: 160,
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '3px 3px 8px 3px',
              boxShadow: '2px 3px 10px rgba(15, 23, 42, 0.12)',
              pointerEvents: 'auto',
              cursor: 'default',
              transform: 'rotate(-0.5deg)',
              userSelect: dragging?.noteId === note.id ? 'none' : 'auto',
              transition: dragging?.noteId === note.id ? 'none' : 'left 0.06s, top 0.06s',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClickNote(note.entityId);
            }}
          >
            {/* Header with drag handle and close */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 6px 3px 6px',
                background: colors.headerBg,
                borderBottom: `1px solid ${colors.border}33`,
                borderRadius: '3px 3px 0 0',
                gap: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  cursor: 'grab',
                  color: '#64748b',
                  flexShrink: 0,
                }}
                onPointerDown={(e) => handlePointerDown(e, note.id, offsetX, offsetY)}
              >
                <GripVertical size={10} />
              </div>
              <StickyNote size={10} style={{ color: '#64748b', flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#64748b',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Note
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                title="Delete note"
                style={{
                  border: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 1,
                  borderRadius: 3,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                }}
              >
                <X size={12} />
              </button>
            </div>

            {/* Note content */}
            <div
              style={{
                padding: '6px 8px 8px 8px',
                fontSize: 11,
                lineHeight: 1.45,
                color: '#1e293b',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: 120,
                overflowY: 'auto',
              }}
            >
              {note.text || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Empty note</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
