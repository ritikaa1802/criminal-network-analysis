export type NodeType = 'PERSON' | 'PHONE' | 'VEHICLE' | 'LOCATION' | 'ORGANIZATION' | 'ACCOUNT' | 'DOCUMENT';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AppState = 'EMPTY' | 'PROCESSING' | 'GRAPH_ACTIVE' | 'REPROCESSING' | 'GRAPH_UPDATED';

export interface NodeData {
  id: string;
  name: string;
  type: NodeType;
  risk: RiskLevel;
  confidence: number;
  sources: string[];
  identifiers: string[];
  connectionCount?: number;
  expandable?: boolean;
  isNew?: boolean;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  relationship: string;
  confidence: number;
  risk: RiskLevel;
  sourceDocument: string;
  timestamp: string;
  evidence: string;
  isNew?: boolean;
}

export interface Source {
  id: string;
  filename: string;
  type: 'PDF' | 'CSV' | 'XLS' | 'XLSX' | 'JPG' | 'PNG' | 'OTHER';
  uploadedAt: string;
  hash: string;
  nodeCount: number;
  edgeCount: number;
  newConnections: number;
  processingSteps?: AuditEvent[];
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done';
  durationMs: number;
}

export interface AuditEvent {
  timestamp: string;
  action: string;
}

export interface Filters {
  minConfidence: number;
  riskLevels: RiskLevel[];
  nodeTypes: NodeType[];
  relationshipTypes: string[];
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  type: 'node' | 'edge';
  data: NodeData | EdgeData | null;
}

export interface ExpandableNeighbors {
  nodes: NodeData[];
  edges: EdgeData[];
}
