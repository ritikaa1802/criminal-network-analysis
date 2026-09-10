'use client';
// @ts-nocheck

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PanelLeft, X } from 'lucide-react';

import Header from '@/components/Header';
import InvestigationSummary from '@/components/InvestigationSummary';
import EmptyState from '@/components/EmptyState';
import SourcePanel from '@/components/SourcePanel';
import ProcessingModal from '@/components/ProcessingModal';
import GraphControls from '@/components/GraphControls';
import EntityPanel, { EntityPeek } from '@/components/EntityPanel';
import EvidencePanel from '@/components/EvidencePanel';
import NewConnectionsNotification from '@/components/NewConnectionsNotification';
import AuditDrawer from '@/components/AuditDrawer';
import GraphLegend from '@/components/GraphLegend';

import {
  DATASET_1_NODES,
  DATASET_1_EDGES,
  DATASET_2_NEW_NODES,
  DATASET_2_NEW_EDGES,
  EXPANDABLE_NEIGHBORS,
  buildSource,
  resolveDataset,
} from '@/lib/mockData';
import type { NodeData, EdgeData, Source, Filters, AppState, RiskLevel, NodeType } from '@/lib/types';

// GraphCanvas uses Cytoscape which is browser-only — load dynamically
const GraphCanvas = dynamic(() => import('@/components/GraphCanvas'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
      }}
    >
      Initializing graph engine…
    </div>
  ),
});

// ── Demo loader (for prototype demonstration without file dialog) ─────────
function buildDemoState() {
  const source1 = buildSource('FIR_2026_001.pdf', 1);
  return {
    nodes: DATASET_1_NODES,
    edges: DATASET_1_EDGES,
    sources: [source1],
  };
}

const DEFAULT_FILTERS: Filters = {
  minConfidence: 0,
  riskLevels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as RiskLevel[],
  nodeTypes: ['PERSON', 'PHONE', 'VEHICLE', 'LOCATION', 'ORGANIZATION', 'ACCOUNT', 'DOCUMENT'] as NodeType[],
  relationshipTypes: [],
};

export default function InvestigationDashboard() {
  // ── App state ─────────────────────────────────────────────────────────────
  const [appState, setAppState] = useState<AppState>('EMPTY');

  // ── Data state ────────────────────────────────────────────────────────────
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [newNodeIds, setNewNodeIds] = useState<string[]>([]);
  const [newEdgeIds, setNewEdgeIds] = useState<string[]>([]);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [selectedNodePosition, setSelectedNodePosition] = useState<{ x: number; y: number } | null>(null);
  const [entityDetailOpen, setEntityDetailOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<EdgeData | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchFocusId, setSearchFocusId] = useState<string | null>(null);

  // ── Processing modal ──────────────────────────────────────────────────────
  const [processingFile, setProcessingFile] = useState<{ filename: string; isAdditional: boolean } | null>(null);
  const pendingDataRef = useRef<{ nodes: NodeData[]; edges: EdgeData[]; source: Source; newNodeIds: string[]; newEdgeIds: string[] } | null>(null);

  // ── Notification + Audit ──────────────────────────────────────────────────
  const [showNewConnections, setShowNewConnections] = useState(false);
  const [auditSource, setAuditSource] = useState<Source | null>(null);
  const [leftRailOpen, setLeftRailOpen] = useState(true);
  const [rightRailOpen, setRightRailOpen] = useState(true);
  const [legendOpen, setLegendOpen] = useState(true);
  const [leftWidth, setLeftWidth] = useState(272);
  const [rightWidth, setRightWidth] = useState(340);
  const [resizing, setResizing] = useState<'left' | 'right' | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  // ── Graph ref ─────────────────────────────────────────────────────────────
  const graphRef = useRef<any>(null);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const highRiskCount = nodes.filter((n) => n.risk === 'HIGH' || n.risk === 'CRITICAL').length;

  useEffect(() => {
    const saved = window.localStorage.getItem('crimson-investigation');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        nodes?: NodeData[];
        edges?: EdgeData[];
        sources?: Source[];
      };
      if (!parsed.nodes?.length || !parsed.sources?.length) return;
      setNodes(parsed.nodes);
      setEdges(parsed.edges ?? []);
      setSources(parsed.sources);
      setAppState('GRAPH_ACTIVE');
    } catch {
      window.localStorage.removeItem('crimson-investigation');
    }
  }, []);

  useEffect(() => {
    if (!resizing) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (resizing === 'left') {
        setLeftWidth(Math.min(420, Math.max(220, event.clientX)));
      } else {
        setRightWidth(Math.min(480, Math.max(280, window.innerWidth - event.clientX)));
      }
    };
    const handlePointerUp = () => setResizing(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [resizing]);

  const handleCreate = useCallback(() => {
    window.localStorage.removeItem('crimson-investigation');
    window.location.reload();
  }, []);

  const handleSave = useCallback(() => {
    window.localStorage.setItem(
      'crimson-investigation',
      JSON.stringify({ nodes, edges, sources, savedAt: new Date().toISOString() })
    );
    setActionMessage('Investigation saved locally');
    window.setTimeout(() => setActionMessage(''), 2400);
  }, [nodes, edges, sources]);

  const handleShare = useCallback(async () => {
    const investigation = JSON.stringify({ nodes, edges, sources }, null, 2);
    const shareData = {
      title: 'Crimson Investigation',
      text: `Crimson investigation with ${nodes.length} entities and ${edges.length} relationships.\n\n${investigation}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(investigation);
        setActionMessage('Investigation data copied to clipboard');
        window.setTimeout(() => setActionMessage(''), 2400);
      }
    } catch {
      setActionMessage('Share cancelled');
      window.setTimeout(() => setActionMessage(''), 2400);
    }
  }, [nodes.length, edges.length]);

  // ── File upload handler ───────────────────────────────────────────────────
  const handleFileUpload = useCallback(
    (file: File) => {
      const isFirst = sources.length === 0;
      const { nodes: newNodes, edges: newEdges, isDataset2 } = resolveDataset(file.name, isFirst);

      if (isFirst) {
        // First upload: load dataset 1
        const source = buildSource(file.name, 1);
        pendingDataRef.current = {
          nodes: newNodes,
          edges: newEdges,
          source,
          newNodeIds: [],
          newEdgeIds: [],
        };
        setProcessingFile({ filename: file.name, isAdditional: false });
        setAppState('PROCESSING');
      } else {
        // Additional upload: merge with existing
        const existingNodeIds = new Set(nodes.map((n) => n.id));
        const existingEdgeIds = new Set(edges.map((e) => e.id));

        const mergedNodes = [...nodes];
        const addedNodeIds: string[] = [];

        newNodes.forEach((n) => {
          if (!existingNodeIds.has(n.id)) {
            mergedNodes.push(n);
            addedNodeIds.push(n.id);
          }
        });

        const mergedEdges = [...edges];
        const addedEdgeIds: string[] = [];

        newEdges.forEach((e) => {
          if (!existingEdgeIds.has(e.id)) {
            mergedEdges.push(e);
            addedEdgeIds.push(e.id);
          }
        });

        const source = buildSource(file.name, 2);
        pendingDataRef.current = {
          nodes: mergedNodes,
          edges: mergedEdges,
          source,
          newNodeIds: addedNodeIds,
          newEdgeIds: addedEdgeIds,
        };
        setProcessingFile({ filename: file.name, isAdditional: true });
        setAppState('REPROCESSING');
      }
    },
    [sources, nodes, edges]
  );

  // ── Processing complete callback ──────────────────────────────────────────
  const handleProcessingComplete = useCallback(() => {
    const pending = pendingDataRef.current;
    if (!pending) return;

    setNodes(pending.nodes);
    setEdges(pending.edges);
    setSources((prev) => [...prev, pending.source]);
    setNewNodeIds(pending.newNodeIds);
    setNewEdgeIds(pending.newEdgeIds);

    const isAdditional = pending.newNodeIds.length > 0 || pending.newEdgeIds.length > 0;

    setProcessingFile(null);
    pendingDataRef.current = null;

    if (isAdditional) {
      setAppState('GRAPH_UPDATED');
      setShowNewConnections(true);
    } else {
      setAppState('GRAPH_ACTIVE');
    }
  }, []);

  // ── Node expand (double-click) ────────────────────────────────────────────
  const handleNodeExpand = useCallback(
    (nodeId: string) => {
      const expansion = EXPANDABLE_NEIGHBORS[nodeId];
      if (!expansion) return;

      const existingNodeIds = new Set(nodes.map((n) => n.id));
      const existingEdgeIds = new Set(edges.map((e) => e.id));

      const newN = expansion.nodes.filter((n) => !existingNodeIds.has(n.id));
      const newE = expansion.edges.filter((e) => !existingEdgeIds.has(e.id));

      if (newN.length === 0 && newE.length === 0) return;

      setNodes((prev) => [...prev, ...newN]);
      setEdges((prev) => [...prev, ...newE]);
      setNewNodeIds(newN.map((n) => n.id));
      setNewEdgeIds(newE.map((e) => e.id));
    },
    [nodes, edges]
  );

  // ── View new connections ──────────────────────────────────────────────────
  const handleViewNewConnections = useCallback(() => {
    setShowNewConnections(false);
    // Highlight new nodes/edges in graph
    graphRef.current?.highlightNew(newNodeIds, newEdgeIds);
    // Focus graph to fit
    graphRef.current?.fitGraph();
  }, [newNodeIds, newEdgeIds]);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = useCallback((query: string, nodeId: string | null) => {
    setSearchFocusId(nodeId);
  }, []);

  // ── Graph controls ────────────────────────────────────────────────────────
  const handleZoomIn = useCallback(() => graphRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => graphRef.current?.zoomOut(), []);
  const handleFit = useCallback(() => graphRef.current?.fitGraph(), []);
  const handleReset = useCallback(() => graphRef.current?.resetView(), []);

  // ── Demo loader ──────────────────────────────────────────────────────────
  const loadDemo = useCallback(() => {
    const { nodes: demoNodes, edges: demoEdges, sources: demoSources } = buildDemoState();
    setNodes(demoNodes);
    setEdges(demoEdges);
    setSources(demoSources);
    setNewNodeIds([]);
    setNewEdgeIds([]);
    setAppState('GRAPH_ACTIVE');
  }, []);

  const hasGraph = appState === 'GRAPH_ACTIVE' || appState === 'GRAPH_UPDATED';

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <Header
        onCreate={handleCreate}
        onSave={handleSave}
        onShare={handleShare}
        onToggleWorkspace={() => setLeftRailOpen((open) => !open)}
        onOpenSource={() => sources[0] && setAuditSource(sources[0])}
        hasSources={sources.length > 0}
      />

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* ── Left Sidebar ──────────────────────────────────────────────────── */}
        {leftRailOpen && <div
          style={{
            width: leftWidth,
            flexShrink: 0,
            borderRight: '1px solid var(--panel-border)',
            background: '#ffffff',
            boxShadow: 'var(--panel-shadow)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 0' }}>
            <span className="label-sm" style={{ color: 'var(--text-muted)' }}>Workspace</span>
            <button className="btn-icon" onClick={() => setLeftRailOpen(false)} title="Hide workspace sidebar"><PanelLeft size={14} /></button>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {/* Summary */}
            <InvestigationSummary
              entities={nodes.length}
              relationships={edges.length}
              highRisk={highRiskCount}
              sources={sources.length}
            />

            <div className="divider" style={{ margin: '4px 0' }} />

            {/* Sources */}
            {hasGraph && (
              <>
                <SourcePanel
                  sources={sources}
                  onAddSource={handleFileUpload}
                  onViewAudit={(s) => setAuditSource(s)}
                />
                <div className="divider" style={{ margin: '4px 0' }} />
              </>
            )}

            {/* Graph controls */}
            {hasGraph && (
              <div style={{ paddingTop: 10 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: 8,
                    paddingLeft: 4,
                  }}
                >
                  Graph Controls
                </div>
                <GraphControls
                  filters={filters}
                  onFiltersChange={setFilters}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onFit={handleFit}
                  onReset={handleReset}
                  onSearch={handleSearch}
                  availableNodes={nodes.map((n) => ({ id: n.id, name: n.name }))}
                />
              </div>
            )}
          </div>
        </div>}
        {leftRailOpen && <div className="resize-handle" onPointerDown={() => setResizing('left')} />}

        {/* ── Graph / Empty Area ────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            background: '#f8fafc',
          }}
        >
          {/* Empty state */}
          {appState === 'EMPTY' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <EmptyState onUpload={handleFileUpload} />
              {/* Demo shortcut for prototype demonstration */}
              <div style={{ textAlign: 'center', paddingBottom: 20 }}>
                <button
                  onClick={loadDemo}
                  style={{
                    background: 'none',
                    border: '1px dashed var(--border-strong)',
                    borderRadius: 6,
                    padding: '6px 16px',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Load Demo Investigation
                </button>
              </div>
            </div>
          )}

          {/* Graph */}
          {hasGraph && (
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <GraphCanvas
                ref={graphRef}
                nodes={nodes}
                edges={edges}
                newNodeIds={newNodeIds}
                newEdgeIds={newEdgeIds}
                filters={filters}
                searchFocusId={searchFocusId}
                onNodeSelect={(node, position) => {
                  setSelectedNode(node);
                  setSelectedNodePosition(position ?? null);
                  setEntityDetailOpen(false);
                  if (node) setSelectedEdge(null);
                }}
                onEdgeSelect={(edge) => {
                  setSelectedEdge(edge);
                  if (edge) {
                    setSelectedNode(null);
                    setSelectedNodePosition(null);
                    setEntityDetailOpen(false);
                  }
                }}
                onNodeExpand={handleNodeExpand}
              />

              {selectedNode && selectedNodePosition && !entityDetailOpen && (
                <div style={{ position: 'absolute', left: selectedNodePosition.x, top: selectedNodePosition.y, zIndex: 24 }}>
                  <EntityPeek
                    node={selectedNode}
                    onBrief={() => setEntityDetailOpen(true)}
                    onClose={() => {
                      setSelectedNode(null);
                      setSelectedNodePosition(null);
                    }}
                  />
                </div>
              )}

              {/* Graph Legend */}
              {legendOpen && <GraphLegend onClose={() => setLegendOpen(false)} />}
              {!legendOpen && <button className="btn-secondary" style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 20 }} onClick={() => setLegendOpen(true)}>Show legend</button>}

              {/* New connections notification */}
              {showNewConnections && (
                <NewConnectionsNotification
                  newEdgeCount={newEdgeIds.length}
                  nodes={nodes}
                  onViewConnections={handleViewNewConnections}
                  onDismiss={() => setShowNewConnections(false)}
                />
              )}
            </div>
          )}

          {/* First upload (before any graph exists) */}
          {appState === 'PROCESSING' && !hasGraph && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--surface-0)',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                }}
              >
                Processing…
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Processing Modal (overlay) ───────────────────────────────────────── */}
      {processingFile && (
        <ProcessingModal
          filename={processingFile.filename}
          isAdditional={processingFile.isAdditional}
          onComplete={handleProcessingComplete}
        />
      )}

      {/* ── Audit Drawer ────────────────────────────────────────────────────── */}
      {auditSource && (
        <AuditDrawer source={auditSource} onClose={() => setAuditSource(null)} />
      )}
      {selectedNode && (
        entityDetailOpen && <div style={{ position: 'fixed', top: 'var(--header-height)', right: 6, bottom: 0, zIndex: 30, width: 'var(--panel-width)', boxShadow: '-8px 0 24px rgba(0,0,0,0.12)' }}>
          <EntityPanel node={selectedNode} onClose={() => setEntityDetailOpen(false)} onExpandNetwork={handleNodeExpand} />
        </div>
      )}
      {selectedEdge && !selectedNode && (
        <div style={{ position: 'fixed', top: 'var(--header-height)', right: 6, bottom: 0, zIndex: 30, width: 'var(--panel-width)', boxShadow: '-8px 0 24px rgba(0,0,0,0.12)' }}>
          <EvidencePanel edge={selectedEdge} nodes={nodes} onClose={() => setSelectedEdge(null)} />
        </div>
      )}
      {actionMessage && <div className="fade-in" style={{ position: 'fixed', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 120, padding: '9px 14px', borderRadius: 6, background: 'var(--text-primary)', color: 'white', fontSize: 12 }}>{actionMessage}</div>}
    </div>
  );
}
