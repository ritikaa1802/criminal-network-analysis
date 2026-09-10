import type { NodeType, RiskLevel } from './types';

export const NODE_COLORS: Record<NodeType, string> = {
  PERSON: '#1e3a8a',
  PHONE: '#0369a1',
  VEHICLE: '#166534',
  LOCATION: '#6d28d9',
  ORGANIZATION: '#92400e',
  ACCOUNT: '#991b1b',
  DOCUMENT: '#155e75',
};

export const NODE_SHAPES: Record<NodeType, string> = {
  PERSON: 'ellipse',
  PHONE: 'roundrectangle',
  VEHICLE: 'diamond',
  LOCATION: 'pentagon',
  ORGANIZATION: 'hexagon',
  ACCOUNT: 'octagon',
  DOCUMENT: 'rectangle',
};

export const RISK_BORDER_COLORS: Record<RiskLevel, string> = {
  CRITICAL: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#ca8a04',
  LOW: '#6b7280',
};

export const RISK_BORDER_WIDTHS: Record<RiskLevel, number> = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
};

export const RISK_EDGE_COLORS: Record<RiskLevel, string> = {
  CRITICAL: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#ca8a04',
  LOW: '#9ca3af',
};

export const NEW_HIGHLIGHT_COLOR = '#06b6d4'; // cyan

export function getCytoscapeStylesheet() {
  const styles: any[] = [
    // ── Base node ─────────────────────────────────────────────────────────────
    {
      selector: 'node',
      style: {
        'background-color': '#1e3a8a',
        'border-color': '#1e3a8a',
        'border-width': 2,
        color: '#ffffff',
        'font-family': 'Inter, system-ui, sans-serif',
        'font-size': '11px',
        'font-weight': '600',
        label: 'data(name)',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '90px',
        width: 90,
        height: 90,
        'overlay-padding': '6px',
        'z-index': 10,
        'transition-property': 'background-color, border-color, border-width, opacity',
        'transition-duration': '200ms',
      },
    },

    // ── Node types ─────────────────────────────────────────────────────────────
    ...Object.entries(NODE_COLORS).map(([type, color]) => ({
      selector: `node[type="${type}"]`,
      style: {
        'background-color': color,
        'border-color': color,
        shape: NODE_SHAPES[type as NodeType],
      },
    })),

    // ── Risk-based border width ────────────────────────────────────────────────
    ...Object.entries(RISK_BORDER_WIDTHS).map(([risk, width]) => ({
      selector: `node[risk="${risk}"]`,
      style: { 'border-width': width },
    })),

    // ── Risk-based border color ────────────────────────────────────────────────
    ...Object.entries(RISK_BORDER_COLORS).map(([risk, color]) => ({
      selector: `node[risk="${risk}"]`,
      style: { 'border-color': color },
    })),

    // ── New node highlight ─────────────────────────────────────────────────────
    {
      selector: 'node.new-highlight',
      style: {
        'border-color': NEW_HIGHLIGHT_COLOR,
        'border-width': 5,
        'background-color': '#164e63',
      },
    },

    // ── Dimmed node ───────────────────────────────────────────────────────────
    {
      selector: 'node.dimmed',
      style: { opacity: 0.15 },
    },

    // ── Selected node ─────────────────────────────────────────────────────────
    {
      selector: 'node:selected',
      style: {
        'border-color': '#f59e0b',
        'border-width': 5,
        'background-color': '#78350f',
        'z-index': 20,
      },
    },

    // ── Highlighted node (neighbor of hovered/selected) ───────────────────────
    {
      selector: 'node.highlighted',
      style: { 'border-width': 4, 'z-index': 15 },
    },

    // ── Base edge ─────────────────────────────────────────────────────────────
    {
      selector: 'edge',
      style: {
        width: 2,
        'line-color': '#9ca3af',
        'target-arrow-color': '#9ca3af',
        'target-arrow-shape': 'triangle',
        'arrow-scale': 1.2,
        'curve-style': 'bezier',
        label: 'data(relationship)',
        'font-family': 'Inter, system-ui, sans-serif',
        'font-size': '9px',
        'font-weight': '500',
        color: '#374151',
        'text-rotation': 'autorotate',
        'text-margin-y': -8,
        'text-background-color': '#ffffff',
        'text-background-opacity': 0.85,
        'text-background-padding': '2px',
        'overlay-padding': '4px',
        'transition-property': 'line-color, target-arrow-color, width, opacity',
        'transition-duration': '200ms',
      },
    },

    // ── Edge risk colors ──────────────────────────────────────────────────────
    ...Object.entries(RISK_EDGE_COLORS).map(([risk, color]) => ({
      selector: `edge[risk="${risk}"]`,
      style: {
        'line-color': color,
        'target-arrow-color': color,
      },
    })),

    // ── Edge confidence → width ───────────────────────────────────────────────
    { selector: 'edge[confidence >= 90]', style: { width: 3 } },
    { selector: 'edge[confidence >= 80][confidence < 90]', style: { width: 2.5 } },
    { selector: 'edge[confidence >= 70][confidence < 80]', style: { width: 2 } },
    { selector: 'edge[confidence < 70]', style: { width: 1.5, 'line-style': 'dashed' } },

    // ── New edge highlight ─────────────────────────────────────────────────────
    {
      selector: 'edge.new-highlight',
      style: {
        'line-color': NEW_HIGHLIGHT_COLOR,
        'target-arrow-color': NEW_HIGHLIGHT_COLOR,
        width: 4,
      },
    },

    // ── Dimmed edge ───────────────────────────────────────────────────────────
    {
      selector: 'edge.dimmed',
      style: { opacity: 0.08 },
    },

    // ── Selected edge ─────────────────────────────────────────────────────────
    {
      selector: 'edge:selected',
      style: {
        'line-color': '#f59e0b',
        'target-arrow-color': '#f59e0b',
        width: 4,
        'z-index': 20,
      },
    },

    // ── Hidden elements (via filter) ──────────────────────────────────────────
    {
      selector: '.filtered-out',
      style: { display: 'none' },
    },
  ];

  return styles;
}

export const COSE_LAYOUT = {
  name: 'cose',
  animate: true,
  animationDuration: 800,
  animationEasing: 'ease-out',
  refresh: 20,
  fit: true,
  padding: 50,
  randomize: false,
  componentSpacing: 120,
  nodeRepulsion: () => 800000,
  nodeOverlap: 20,
  idealEdgeLength: () => 160,
  edgeElasticity: () => 100,
  nestingFactor: 5,
  gravity: 60,
  numIter: 1200,
  initialTemp: 300,
  coolingFactor: 0.95,
  minTemp: 1.0,
};
