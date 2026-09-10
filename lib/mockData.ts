import type { NodeData, EdgeData, Source, ExpandableNeighbors, AuditEvent } from './types';

// ─── DATASET 1 — FIR_2026_001.pdf ─────────────────────────────────────────────
export const DATASET_1_NODES: NodeData[] = [
  {
    id: 'ramlal',
    name: 'Ramlal',
    type: 'PERSON',
    risk: 'HIGH',
    confidence: 94,
    sources: ['FIR_2026_001.pdf'],
    identifiers: ['92832983923892', 'Vehicle_UP78AB1234'],
    expandable: true,
    isNew: false,
  },
  {
    id: 'athrv',
    name: 'Athrv',
    type: 'PERSON',
    risk: 'MEDIUM',
    confidence: 78,
    sources: ['FIR_2026_001.pdf'],
    identifiers: ['Vehicle_UP78AB1234', 'Kanpur'],
    expandable: false,
    isNew: false,
  },
  {
    id: '92832983923892',
    name: '92832983923892',
    type: 'PHONE',
    risk: 'HIGH',
    confidence: 92,
    sources: ['FIR_2026_001.pdf'],
    identifiers: [],
    expandable: false,
    isNew: false,
  },
  {
    id: 'vehicle_up78ab1234',
    name: 'Vehicle_UP78AB1234',
    type: 'VEHICLE',
    risk: 'MEDIUM',
    confidence: 85,
    sources: ['FIR_2026_001.pdf'],
    identifiers: [],
    expandable: false,
    isNew: false,
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    type: 'LOCATION',
    risk: 'LOW',
    confidence: 71,
    sources: ['FIR_2026_001.pdf'],
    identifiers: [],
    expandable: false,
    isNew: false,
  },
  {
    id: 'the_syndicate',
    name: 'The Syndicate',
    type: 'ORGANIZATION',
    risk: 'CRITICAL',
    confidence: 89,
    sources: ['FIR_2026_001.pdf'],
    identifiers: [],
    expandable: true,
    isNew: false,
  },
];

export const DATASET_1_EDGES: EdgeData[] = [
  {
    id: 'edge_001',
    source: 'ramlal',
    target: '92832983923892',
    relationship: 'COMMUNICATES_WITH',
    confidence: 94,
    risk: 'HIGH',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '12 Aug 2026, 11:22',
    evidence:
      'Multiple references in the FIR establish regular communication between Ramlal and 92832983923892 during the period under investigation. Witness statements corroborate this pattern.',
    isNew: false,
  },
  {
    id: 'edge_002',
    source: 'ramlal',
    target: 'athrv',
    relationship: 'ASSOCIATED_WITH',
    confidence: 82,
    risk: 'MEDIUM',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '10 Aug 2026, 09:14',
    evidence:
      'Ramlal and Athrv were jointly named in the FIR as co-accused. Their association is established through co-witness testimony and physical co-location records.',
    isNew: false,
  },
  {
    id: 'edge_003',
    source: 'athrv',
    target: 'kanpur',
    relationship: 'LOCATED_AT',
    confidence: 71,
    risk: 'LOW',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '09 Aug 2026, 18:45',
    evidence:
      'Athrv was reported to have been present at Kanpur on multiple occasions prior to the incident. Surveillance records from the FIR support this.',
    isNew: false,
  },
  {
    id: 'edge_004',
    source: 'ramlal',
    target: 'the_syndicate',
    relationship: 'WORKS_FOR',
    confidence: 88,
    risk: 'CRITICAL',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '08 Aug 2026, 14:30',
    evidence:
      'The FIR identifies Ramlal as an operative linked to The Syndicate. Financial records and witness testimony establish an employment-linked relationship.',
    isNew: false,
  },
  {
    id: 'edge_005',
    source: 'athrv',
    target: 'vehicle_up78ab1234',
    relationship: 'OWNS',
    confidence: 79,
    risk: 'MEDIUM',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '07 Aug 2026, 10:00',
    evidence:
      'Vehicle MH01AB1234 is registered to Athrv as per vehicle registration records cited in the FIR.',
    isNew: false,
  },
  {
    id: 'edge_006',
    source: 'ramlal',
    target: 'kanpur',
    relationship: 'TRAVELED_TO',
    confidence: 67,
    risk: 'LOW',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '11 Aug 2026, 21:10',
    evidence:
      'Ramlal was observed traveling to Kanpur on the night in question. CCTV evidence cited in the FIR corroborates this.',
    isNew: false,
  },
  {
    id: 'edge_007',
    source: 'vehicle_up78ab1234',
    target: 'kanpur',
    relationship: 'LOCATED_AT',
    confidence: 73,
    risk: 'MEDIUM',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '11 Aug 2026, 21:30',
    evidence:
      'Vehicle MH01AB1234 was identified at Kanpur at the estimated time of the incident. Parking records and CCTV stills referenced in the FIR.',
    isNew: false,
  },
];

// ─── DATASET 2 — CDR_2026_004.csv ─────────────────────────────────────────────
export const DATASET_2_NEW_NODES: NodeData[] = [
  {
    id: 'prashant',
    name: 'Prashant',
    type: 'PERSON',
    risk: 'CRITICAL',
    confidence: 91,
    sources: ['CDR_2026_004.csv'],
    identifiers: ['9922334455', '9145678901', 'SBI_1029384756'],
    expandable: true,
    isNew: true,
  },
  {
    id: '9922334455',
    name: '9922334455',
    type: 'PHONE',
    risk: 'HIGH',
    confidence: 88,
    sources: ['CDR_2026_004.csv'],
    identifiers: [],
    expandable: false,
    isNew: true,
  },
  {
    id: '9145678901',
    name: '9145678901',
    type: 'PHONE',
    risk: 'MEDIUM',
    confidence: 76,
    sources: ['CDR_2026_004.csv'],
    identifiers: [],
    expandable: false,
    isNew: true,
  },
  {
    id: 'sbi_1029384756',
    name: 'SBI_1029384756',
    type: 'ACCOUNT',
    risk: 'HIGH',
    confidence: 83,
    sources: ['CDR_2026_004.csv'],
    identifiers: [],
    expandable: false,
    isNew: true,
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    type: 'LOCATION',
    risk: 'HIGH',
    confidence: 86,
    sources: ['CDR_2026_004.csv'],
    identifiers: [],
    expandable: false,
    isNew: true,
  },
];

export const DATASET_2_NEW_EDGES: EdgeData[] = [
  {
    id: 'edge_008',
    source: 'ramlal',
    target: '9922334455',
    relationship: 'COMMUNICATES_WITH',
    confidence: 96,
    risk: 'HIGH',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '14 Aug 2026, 21:43',
    evidence:
      'CDR analysis reveals 47 calls and 112 SMS messages exchanged between Ramlal and 9922334455 across a 6-day period. Call durations suggest operational coordination.',
    isNew: true,
  },
  {
    id: 'edge_009',
    source: 'prashant',
    target: '92832983923892',
    relationship: 'FREQUENT_CONTACT',
    confidence: 89,
    risk: 'CRITICAL',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '13 Aug 2026, 19:12',
    evidence:
      'CDR data links Prashant to 92832983923892 — the same phone already associated with Ramlal. This cross-link establishes a previously unknown operational connection between Prashant and the core network.',
    isNew: true,
  },
  {
    id: 'edge_010',
    source: 'prashant',
    target: '9922334455',
    relationship: 'FREQUENT_CONTACT',
    confidence: 91,
    risk: 'CRITICAL',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '14 Aug 2026, 22:01',
    evidence:
      'Prashant and 9922334455 show mutual high-frequency contact in the CDR dataset, coinciding with peak periods of Ramlal\'s communication activity.',
    isNew: true,
  },
  {
    id: 'edge_011',
    source: 'prashant',
    target: 'sbi_1029384756',
    relationship: 'OWNS',
    confidence: 84,
    risk: 'HIGH',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '01 Aug 2026, 08:00',
    evidence:
      'SBI_1029384756 is linked to Prashant via transaction metadata extracted from the CDR dataset annotation layer. The account shows irregular transaction patterns.',
    isNew: true,
  },
  {
    id: 'edge_012',
    source: 'sbi_1029384756',
    target: 'the_syndicate',
    relationship: 'TRANSFERRED_TO',
    confidence: 79,
    risk: 'CRITICAL',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '03 Aug 2026, 15:22',
    evidence:
      'Financial metadata in the CDR dataset identifies repeated fund transfers from SBI_1029384756 to accounts associated with The Syndicate — establishing a financial link to the organization already present in the investigation network.',
    isNew: true,
  },
  {
    id: 'edge_013',
    source: 'athrv',
    target: '9145678901',
    relationship: 'COMMUNICATES_WITH',
    confidence: 76,
    risk: 'MEDIUM',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '12 Aug 2026, 08:47',
    evidence:
      'CDR data shows Athrv in regular contact with 9145678901. The frequency and timing of communication aligns with incident-period activity.',
    isNew: true,
  },
  {
    id: 'edge_014',
    source: 'prashant',
    target: 'lucknow',
    relationship: 'LOCATED_AT',
    confidence: 86,
    risk: 'HIGH',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '14 Aug 2026, 20:55',
    evidence:
      'Cell tower triangulation in the CDR places Prashant at Lucknow during the critical window. Lucknow is a previously unidentified site in this investigation.',
    isNew: true,
  },
];

// ─── EXPANDABLE NEIGHBORS ─────────────────────────────────────────────────────
export const EXPANDABLE_NEIGHBORS: Record<string, ExpandableNeighbors> = {
  ramlal: {
    nodes: [
      {
        id: 'ramesh',
        name: 'Ramesh',
        type: 'PERSON',
        risk: 'MEDIUM',
        confidence: 65,
        sources: ['FIR_2026_001.pdf'],
        identifiers: [],
        expandable: false,
        isNew: true,
      },
      {
        id: 'doc_fir',
        name: 'FIR_120_2026',
        type: 'DOCUMENT',
        risk: 'LOW',
        confidence: 71,
        sources: ['FIR_2026_001.pdf'],
        identifiers: [],
        expandable: false,
        isNew: true,
      },
    ],
    edges: [
      {
        id: 'edge_exp_001',
        source: 'ramlal',
        target: 'ramesh',
        relationship: 'ASSOCIATED_WITH',
        confidence: 65,
        risk: 'MEDIUM',
        sourceDocument: 'FIR_2026_001.pdf',
        timestamp: '08 Aug 2026, 11:00',
        evidence: 'Ramesh was present at the scene and has provided testimony linking them to Ramlal.',
        isNew: true,
      },
      {
        id: 'edge_exp_002',
        source: 'ramlal',
        target: 'doc_fir',
        relationship: 'REFERENCED_IN',
        confidence: 71,
        risk: 'LOW',
        sourceDocument: 'FIR_2026_001.pdf',
        timestamp: '08 Aug 2026, 09:00',
        evidence: 'Ramlal is directly named and referenced throughout the FIR document as a primary subject.',
        isNew: true,
      },
    ],
  },
  prashant: {
    nodes: [
      {
        id: 'suresh',
        name: 'Suresh',
        type: 'PERSON',
        risk: 'HIGH',
        confidence: 74,
        sources: ['CDR_2026_004.csv'],
        identifiers: [],
        expandable: false,
        isNew: true,
      },
      {
        id: 'bank_acct_9',
        name: 'HDFC_9988776655',
        type: 'ACCOUNT',
        risk: 'MEDIUM',
        confidence: 68,
        sources: ['CDR_2026_004.csv'],
        identifiers: [],
        expandable: false,
        isNew: true,
      },
    ],
    edges: [
      {
        id: 'edge_exp_003',
        source: 'prashant',
        target: 'suresh',
        relationship: 'CONNECTED_TO',
        confidence: 74,
        risk: 'HIGH',
        sourceDocument: 'CDR_2026_004.csv',
        timestamp: '15 Aug 2026, 07:30',
        evidence: 'Suresh appears in the CDR call records of Prashant as a recurring contact during the incident period.',
        isNew: true,
      },
      {
        id: 'edge_exp_004',
        source: 'prashant',
        target: 'bank_acct_9',
        relationship: 'OWNS',
        confidence: 68,
        risk: 'MEDIUM',
        sourceDocument: 'CDR_2026_004.csv',
        timestamp: '01 Aug 2026, 00:00',
        evidence: 'HDFC_9988776655 is identified as a secondary financial instrument associated with Prashant via CDR metadata.',
        isNew: true,
      },
    ],
  },
  the_syndicate: {
    nodes: [
      {
        id: 'delhi',
        name: 'Delhi',
        type: 'LOCATION',
        risk: 'HIGH',
        confidence: 83,
        sources: ['FIR_2026_001.pdf'],
        identifiers: [],
        expandable: false,
        isNew: true,
      },
    ],
    edges: [
      {
        id: 'edge_exp_005',
        source: 'the_syndicate',
        target: 'delhi',
        relationship: 'LOCATED_AT',
        confidence: 83,
        risk: 'HIGH',
        sourceDocument: 'FIR_2026_001.pdf',
        timestamp: '05 Aug 2026, 12:00',
        evidence: 'Delhi is identified as the operational headquarters of The Syndicate based on intelligence cited in the FIR.',
        isNew: true,
      },
    ],
  },
};

// ─── SOURCE METADATA ──────────────────────────────────────────────────────────
export function buildSource(filename: string, datasetIndex: number): Source {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const ext = filename.split('.').pop()?.toUpperCase() || 'OTHER';

  const auditEvents: AuditEvent[] = [
    { timestamp: `${timeStr}:00`, action: 'Source uploaded and hash generated' },
    { timestamp: `${timeStr}:01`, action: 'SHA-256 integrity verified' },
    { timestamp: `${timeStr}:02`, action: 'OCR / document parsing initiated' },
    { timestamp: `${timeStr}:03`, action: 'Entity extraction completed' },
    { timestamp: `${timeStr}:04`, action: 'Relationship analysis completed' },
    { timestamp: `${timeStr}:05`, action: 'Graph network updated successfully' },
  ];

  if (datasetIndex === 1) {
    return {
      id: `source_${Date.now()}`,
      filename,
      type: ext as Source['type'],
      uploadedAt: '10 Sep 2026, 12:41',
      hash: '8f3a9e2b1c4d7f0a3b5e8c1d4f7a0b2e4c7d9f1a3b5e7c9d1f3a5b7c9d1f3a',
      nodeCount: DATASET_1_NODES.length,
      edgeCount: DATASET_1_EDGES.length,
      newConnections: 0,
      processingSteps: auditEvents,
    };
  } else {
    return {
      id: `source_${Date.now()}`,
      filename,
      type: ext as Source['type'],
      uploadedAt: '10 Sep 2026, 13:02',
      hash: '3c7d9f1a5b8e2c4f7a0b3d6e9c2f5a8b1d4e7c0f3a6b9d2e5f8c1a4b7d0e3f',
      nodeCount: DATASET_2_NEW_NODES.length,
      edgeCount: DATASET_2_NEW_EDGES.length,
      newConnections: DATASET_2_NEW_EDGES.length,
      processingSteps: auditEvents,
    };
  }
}

// ─── FALLBACK DATASET (any other file) ───────────────────────────────────────
export const FALLBACK_NODES: NodeData[] = DATASET_1_NODES;
export const FALLBACK_EDGES: EdgeData[] = DATASET_1_EDGES;

// ─── FILENAME → DATASET MAPPING ──────────────────────────────────────────────
export function resolveDataset(filename: string, isFirstUpload: boolean): {
  nodes: NodeData[];
  edges: EdgeData[];
  isDataset2: boolean;
} {
  const lower = filename.toLowerCase();
  const isCDR = lower.includes('cdr') || lower.includes('.csv') || lower.includes('.xls');

  if (!isFirstUpload || isCDR) {
    return { nodes: DATASET_2_NEW_NODES, edges: DATASET_2_NEW_EDGES, isDataset2: true };
  }

  // Any first upload gets Dataset 1
  return { nodes: DATASET_1_NODES, edges: DATASET_1_EDGES, isDataset2: false };
}

// ─── PROCESSING STEPS ─────────────────────────────────────────────────────────
export const PROCESSING_STEPS_INITIAL = [
  { id: 'upload', label: 'Source Uploaded', durationMs: 400 },
  { id: 'ocr', label: 'OCR / Document Processing', durationMs: 900 },
  { id: 'entity_detect', label: 'Entity Detection', durationMs: 1100 },
  { id: 'entity_resolve', label: 'Entity Resolution', durationMs: 800 },
  { id: 'rel_extract', label: 'Relationship Extraction', durationMs: 1000 },
  { id: 'network', label: 'Building Network', durationMs: 700 },
  { id: 'done', label: 'Analysis Complete', durationMs: 300 },
];

export const PROCESSING_STEPS_ADDITIONAL = [
  { id: 'upload', label: 'Source Uploaded', durationMs: 300 },
  { id: 'doc', label: 'Document Processing', durationMs: 600 },
  { id: 'match', label: 'Matching Existing Entities', durationMs: 900 },
  { id: 'new_entities', label: 'Identifying New Entities', durationMs: 700 },
  { id: 'new_rels', label: 'Discovering New Relationships', durationMs: 900 },
  { id: 'update', label: 'Updating Investigation Network', durationMs: 600 },
  { id: 'done', label: 'Network Updated', durationMs: 200 },
];

export const ALL_RELATIONSHIP_TYPES = [
  'COMMUNICATES_WITH',
  'ASSOCIATED_WITH',
  'LOCATED_AT',
  'OWNS',
  'WORKS_FOR',
  'TRAVELED_TO',
  'FREQUENT_CONTACT',
  'TRANSFERRED_TO',
  'CONNECTED_TO',
  'REFERENCED_IN',
];
