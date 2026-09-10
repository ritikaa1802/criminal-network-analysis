'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import type { NodeData, EdgeData, Filters } from '@/lib/types';
import { getCytoscapeStylesheet, COSE_LAYOUT } from '@/lib/graphConfig';

export interface GraphCanvasRef {
  focusNode: (nodeId: string) => void;
  fitGraph: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  highlightNew: (nodeIds: string[], edgeIds: string[]) => void;
  clearHighlights: () => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  type: 'node' | 'edge';
  data: any;
}

interface Props {
  nodes: NodeData[];
  edges: EdgeData[];
  newNodeIds: string[];
  newEdgeIds: string[];
  filters: Filters;
  searchFocusId: string | null;
  onNodeSelect: (node: NodeData | null, position?: { x: number; y: number }) => void;
  onEdgeSelect: (edge: EdgeData | null) => void;
  onNodeExpand: (nodeId: string) => void;
}

const GraphCanvas = forwardRef<GraphCanvasRef, Props>((props, ref) => {
  const {
    nodes,
    edges,
    newNodeIds,
    newEdgeIds,
    filters,
    searchFocusId,
    onNodeSelect,
    onEdgeSelect,
    onNodeExpand,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    type: 'node',
    data: null,
  });

  // Build cytoscape elements from nodes/edges
  function buildElements(n: NodeData[], e: EdgeData[]) {
    const cyNodes = n.map((node) => ({
      group: 'nodes' as const,
      data: {
        id: node.id,
        name: node.name,
        type: node.type,
        risk: node.risk,
        confidence: node.confidence,
        sources: node.sources,
        identifiers: node.identifiers,
        expandable: node.expandable,
        connectionCount: e.filter(
          (ed) => ed.source === node.id || ed.target === node.id
        ).length,
      },
    }));

    const cyEdges = e.map((edge) => ({
      group: 'edges' as const,
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        relationship: edge.relationship,
        confidence: edge.confidence,
        risk: edge.risk,
        sourceDocument: edge.sourceDocument,
        timestamp: edge.timestamp,
        evidence: edge.evidence,
      },
    }));

    return [...cyNodes, ...cyEdges];
  }

  // Initialize Cytoscape once
  useEffect(() => {
    const container = containerRef.current;
    if (!container || cyRef.current) return;

    let cancelled = false;

    import('cytoscape').then((cytoscapeModule) => {
      if (cancelled || !containerRef.current) return;

      const cytoscape = cytoscapeModule.default;

      const cy = cytoscape({
        container,
        elements: buildElements(nodes, edges),
        style: getCytoscapeStylesheet() as any,
        layout: nodes.length > 0 ? COSE_LAYOUT : { name: 'preset' },
        wheelSensitivity: 0.3,
        minZoom: 0.2,
        maxZoom: 3,
        autoungrabify: false,
        userPanningEnabled: true,
        userZoomingEnabled: true,
      });

      cyRef.current = cy;

      // ── Hover: node ────────────────────────────────────────────────────────
      cy.on('mouseover', 'node', (evt: any) => {
        const node = evt.target;
        const nodeData = node.data();

        // Dim everything except neighbors
        cy.elements().addClass('dimmed');
        node.removeClass('dimmed').addClass('highlighted');
        node.neighborhood().removeClass('dimmed');

        // Tooltip
        const pos = node.renderedPosition();
        const container = containerRef.current!;
        const rect = container.getBoundingClientRect();

        setTooltip({
          visible: true,
          x: pos.x,
          y: pos.y - node.renderedBoundingBox().h / 2,
          type: 'node',
          data: nodeData,
        });

        container.style.cursor = 'pointer';
      });

      cy.on('mouseout', 'node', () => {
        cy.elements().removeClass('dimmed highlighted');
        setTooltip((t) => ({ ...t, visible: false }));
        if (containerRef.current) containerRef.current.style.cursor = 'default';
      });

      // ── Hover: edge ────────────────────────────────────────────────────────
      cy.on('mouseover', 'edge', (evt: any) => {
        const edge = evt.target;
        const edgeData = edge.data();

        cy.elements().addClass('dimmed');
        edge.removeClass('dimmed');
        edge.source().removeClass('dimmed').addClass('highlighted');
        edge.target().removeClass('dimmed').addClass('highlighted');

        const midpoint = edge.renderedMidpoint ? edge.renderedMidpoint() : { x: 0, y: 0 };

        setTooltip({
          visible: true,
          x: midpoint.x,
          y: midpoint.y - 20,
          type: 'edge',
          data: edgeData,
        });

        if (containerRef.current) containerRef.current.style.cursor = 'pointer';
      });

      cy.on('mouseout', 'edge', () => {
        cy.elements().removeClass('dimmed highlighted');
        setTooltip((t) => ({ ...t, visible: false }));
        if (containerRef.current) containerRef.current.style.cursor = 'default';
      });

      // ── Click: node ────────────────────────────────────────────────────────
      cy.on('tap', 'node', (evt: any) => {
        const node = evt.target;
        const nodeData: NodeData = {
          id: node.data('id'),
          name: node.data('name'),
          type: node.data('type'),
          risk: node.data('risk'),
          confidence: node.data('confidence'),
          sources: node.data('sources'),
          identifiers: node.data('identifiers'),
          expandable: node.data('expandable'),
          connectionCount: node.data('connectionCount'),
        };

        cy.elements().removeClass('dimmed highlighted');
        node.select();
        node.neighborhood().nodes().addClass('highlighted');

        const position = node.renderedPosition();
        onNodeSelect(nodeData, { x: position.x, y: position.y });
        onEdgeSelect(null);
      });

      // ── Click: edge ────────────────────────────────────────────────────────
      cy.on('tap', 'edge', (evt: any) => {
        const edge = evt.target;
        const edgeData: EdgeData = {
          id: edge.data('id'),
          source: edge.data('source'),
          target: edge.data('target'),
          relationship: edge.data('relationship'),
          confidence: edge.data('confidence'),
          risk: edge.data('risk'),
          sourceDocument: edge.data('sourceDocument'),
          timestamp: edge.data('timestamp'),
          evidence: edge.data('evidence'),
        };

        cy.elements().removeClass('dimmed highlighted');
        edge.select();
        edge.source().addClass('highlighted');
        edge.target().addClass('highlighted');

        onEdgeSelect(edgeData);
        onNodeSelect(null);
      });

      // ── Double-click: expand ───────────────────────────────────────────────
      cy.on('dbltap', 'node', (evt: any) => {
        const node = evt.target;
        const nodeId = node.data('id');
        if (node.data('expandable')) {
          onNodeExpand(nodeId);
        }
      });

      // ── Click background: deselect ─────────────────────────────────────────
      cy.on('tap', (evt: any) => {
        if (evt.target === cy) {
          cy.elements().removeClass('dimmed highlighted');
          cy.elements().deselect();
          onNodeSelect(null);
          onEdgeSelect(null);
        }
      });
    });

    return () => {
      cancelled = true;
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, []); // eslint-disable-line

  // ── Update elements when nodes/edges change ──────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const existingIds = new Set(cy.elements().map((el: any) => el.data('id')));

    cy.batch(() => {
      // Add new nodes
      nodes.forEach((node) => {
        if (!existingIds.has(node.id)) {
          cy.add({
            group: 'nodes',
            data: {
              id: node.id,
              name: node.name,
              type: node.type,
              risk: node.risk,
              confidence: node.confidence,
              sources: node.sources,
              identifiers: node.identifiers,
              expandable: node.expandable,
              connectionCount: edges.filter(
                (e) => e.source === node.id || e.target === node.id
              ).length,
            },
          });
        }
      });

      // Add new edges
      edges.forEach((edge) => {
        if (!existingIds.has(edge.id)) {
          // Ensure source and target exist
          if (cy.$id(edge.source).length > 0 && cy.$id(edge.target).length > 0) {
            cy.add({
              group: 'edges',
              data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                relationship: edge.relationship,
                confidence: edge.confidence,
                risk: edge.risk,
                sourceDocument: edge.sourceDocument,
                timestamp: edge.timestamp,
                evidence: edge.evidence,
              },
            });
          }
        }
      });
    });

    // Only re-layout if new elements were added
    const newIds = [
      ...nodes.map((n) => n.id),
      ...edges.map((e) => e.id),
    ].filter((id) => !existingIds.has(id));

    if (newIds.length > 0) {
      const newNodes = cy.nodes().filter((n: any) => newIds.includes(n.data('id')));
      if (newNodes.length > 0) {
        cy.layout(COSE_LAYOUT).run();
      }
    }
  }, [nodes, edges]); // eslint-disable-line

  // ── Apply new-highlight classes ───────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass('new-highlight');

    newNodeIds.forEach((id) => {
      cy.$id(id).addClass('new-highlight');
    });
    newEdgeIds.forEach((id) => {
      cy.$id(id).addClass('new-highlight');
    });

    // Remove highlight after 5 seconds
    if (newNodeIds.length > 0 || newEdgeIds.length > 0) {
      const timer = setTimeout(() => {
        cy.elements().removeClass('new-highlight');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newNodeIds, newEdgeIds]);

  // ── Apply filters ─────────────────────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().removeClass('filtered-out');

      // Confidence filter on edges
      cy.edges().forEach((edge: any) => {
        if (edge.data('confidence') < filters.minConfidence) {
          edge.addClass('filtered-out');
        }
      });

      // Risk filter
      if (filters.riskLevels.length < 4) {
        cy.nodes().forEach((node: any) => {
          if (!filters.riskLevels.includes(node.data('risk'))) {
            node.addClass('filtered-out');
          }
        });
        cy.edges().forEach((edge: any) => {
          if (!filters.riskLevels.includes(edge.data('risk'))) {
            edge.addClass('filtered-out');
          }
        });
      }

      // Node type filter
      if (filters.nodeTypes.length < 7) {
        cy.nodes().forEach((node: any) => {
          if (!filters.nodeTypes.includes(node.data('type'))) {
            node.addClass('filtered-out');
          }
        });
      }

      // Relationship type filter
      if (filters.relationshipTypes.length > 0) {
        cy.edges().forEach((edge: any) => {
          if (!filters.relationshipTypes.includes(edge.data('relationship'))) {
            edge.addClass('filtered-out');
          }
        });
      }
    });
  }, [filters]);

  // ── Search focus ──────────────────────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !searchFocusId) return;

    const target = cy.$id(searchFocusId);
    if (target.length === 0) return;

    cy.elements().removeClass('dimmed highlighted');
    cy.elements().deselect();

    target.select();
    target.neighborhood().nodes().addClass('highlighted');

    cy.animate({
      fit: { eles: target, padding: 120 },
      duration: 500,
      easing: 'ease-in-out',
    });
  }, [searchFocusId]);

  // ── Exposed imperative methods ────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    focusNode(nodeId: string) {
      const cy = cyRef.current;
      if (!cy) return;
      const target = cy.$id(nodeId);
      if (target.length === 0) return;
      cy.animate({ fit: { eles: target, padding: 120 }, duration: 500, easing: 'ease-in-out' });
    },
    fitGraph() {
      cyRef.current?.fit(undefined, 50);
    },
    zoomIn() {
      const cy = cyRef.current;
      if (!cy) return;
      cy.zoom({ level: cy.zoom() * 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
    },
    zoomOut() {
      const cy = cyRef.current;
      if (!cy) return;
      cy.zoom({ level: cy.zoom() / 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
    },
    resetView() {
      cyRef.current?.reset();
    },
    highlightNew(nodeIds: string[], edgeIds: string[]) {
      const cy = cyRef.current;
      if (!cy) return;
      cy.elements().removeClass('new-highlight');
      nodeIds.forEach((id) => cy.$id(id).addClass('new-highlight'));
      edgeIds.forEach((id) => cy.$id(id).addClass('new-highlight'));
    },
    clearHighlights() {
      cyRef.current?.elements().removeClass('new-highlight dimmed highlighted');
    },
  }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} className="cy-container" />

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="cy-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
        >
          {tooltip.type === 'node' ? (
            <NodeTooltip data={tooltip.data} />
          ) : (
            <EdgeTooltip data={tooltip.data} />
          )}
        </div>
      )}
    </div>
  );
});

GraphCanvas.displayName = 'GraphCanvas';

function NodeTooltip({ data }: { data: any }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{data.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Row label="Type" value={data.type} />
        <Row label="Risk" value={data.risk} highlight={data.risk === 'CRITICAL' || data.risk === 'HIGH'} />
        <Row label="Confidence" value={`${data.confidence}%`} />
        <Row label="Connections" value={data.connectionCount ?? '—'} />
      </div>
    </div>
  );
}

function EdgeTooltip({ data }: { data: any }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{data.relationship}</div>
      <Row label="Confidence" value={`${data.confidence}%`} />
      <Row label="Risk" value={data.risk} />
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
      <span style={{ color: '#9ca3af', width: 70, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, color: highlight ? '#dc2626' : '#0f172a' }}>{value}</span>
    </div>
  );
}

export default GraphCanvas;
