import type { NodeData, EdgeData, Source, ExpandableNeighbors, AuditEvent } from './types';

// ─── DATASET 1 — FIR_2026_001.pdf ─────────────────────────────────────────────
export const DATASET_1_NODES: NodeData[] = [
  {
    id: 'person_a',
    name: 'Person_A',
    type: 'PERSON',
    risk: 'HIGH',
    confidence: 94,
    sources: ['FIR_2026_001.pdf'],
    identifiers: ['Phone_9821', 'Vehicle_MH01AB1234'],
    expandable: true,
    isNew: false,
  },
  {
    id: 'person_b',
    name: 'Person_B',
    type: 'PERSON',
    risk: 'MEDIUM',
    confidence: 78,
    sources: ['FIR_2026_001.pdf'],
    identifiers: ['Vehicle_MH01AB1234', 'Location_X'],
    expandable: false,
    isNew: false,
  },
  {
    id: 'phone_9821',
    name: 'Phone_9821',
    type: 'PHONE',
    risk: 'HIGH',
    confidence: 92,
    sources: ['FIR_2026_001.pdf'],
    identifiers: [],
    expandable: false,
    isNew: false,
  },
  {
    id: 'vehicle_a',
    name: 'Vehicle_MH01AB1234',
    type: 'VEHICLE',
    risk: 'MEDIUM',
    confidence: 85,
    sources: ['FIR_2026_001.pdf'],
    identifiers: [],
    expandable: false,
    isNew: false,
  },
  {
    id: 'location_x',
    name: 'Location_X',
    type: 'LOCATION',
    risk: 'LOW',
    confidence: 71,
    sources: ['FIR_2026_001.pdf'],
    identifiers: [],
    expandable: false,
    isNew: false,
  },
  {
    id: 'organization_z',
    name: 'Organization_Z',
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
    source: 'person_a',
    target: 'phone_9821',
    relationship: 'COMMUNICATES_WITH',
    confidence: 94,
    risk: 'HIGH',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '12 Aug 2026, 11:22',
    evidence:
      'Multiple references in the FIR establish regular communication between Person_A and Phone_9821 during the period under investigation. Witness statements corroborate this pattern.',
    isNew: false,
  },
  {
    id: 'edge_002',
    source: 'person_a',
    target: 'person_b',
    relationship: 'ASSOCIATED_WITH',
    confidence: 82,
    risk: 'MEDIUM',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '10 Aug 2026, 09:14',
    evidence:
      'Person_A and Person_B were jointly named in the FIR as co-accused. Their association is established through co-witness testimony and physical co-location records.',
    isNew: false,
  },
  {
    id: 'edge_003',
    source: 'person_b',
    target: 'location_x',
    relationship: 'LOCATED_AT',
    confidence: 71,
    risk: 'LOW',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '09 Aug 2026, 18:45',
    evidence:
      'Person_B was reported to have been present at Location_X on multiple occasions prior to the incident. Surveillance records from the FIR support this.',
    isNew: false,
  },
  {
    id: 'edge_004',
    source: 'person_a',
    target: 'organization_z',
    relationship: 'WORKS_FOR',
    confidence: 88,
    risk: 'CRITICAL',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '08 Aug 2026, 14:30',
    evidence:
      'The FIR identifies Person_A as an operative linked to Organization_Z. Financial records and witness testimony establish an employment-linked relationship.',
    isNew: false,
  },
  {
    id: 'edge_005',
    source: 'person_b',
    target: 'vehicle_a',
    relationship: 'OWNS',
    confidence: 79,
    risk: 'MEDIUM',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '07 Aug 2026, 10:00',
    evidence:
      'Vehicle MH01AB1234 is registered to Person_B as per vehicle registration records cited in the FIR.',
    isNew: false,
  },
  {
    id: 'edge_006',
    source: 'person_a',
    target: 'location_x',
    relationship: 'TRAVELED_TO',
    confidence: 67,
    risk: 'LOW',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '11 Aug 2026, 21:10',
    evidence:
      'Person_A was observed traveling to Location_X on the night in question. CCTV evidence cited in the FIR corroborates this.',
    isNew: false,
  },
  {
    id: 'edge_007',
    source: 'vehicle_a',
    target: 'location_x',
    relationship: 'LOCATED_AT',
    confidence: 73,
    risk: 'MEDIUM',
    sourceDocument: 'FIR_2026_001.pdf',
    timestamp: '11 Aug 2026, 21:30',
    evidence:
      'Vehicle MH01AB1234 was identified at Location_X at the estimated time of the incident. Parking records and CCTV stills referenced in the FIR.',
    isNew: false,
  },
];

// ─── DATASET 2 — CDR_2026_004.csv ─────────────────────────────────────────────
export const DATASET_2_NEW_NODES: NodeData[] = [
  {
    id: 'person_c',
    name: 'Person_C',
    type: 'PERSON',
    risk: 'CRITICAL',
    confidence: 91,
    sources: ['CDR_2026_004.csv'],
    identifiers: ['Phone_7742', 'Phone_3319', 'Account_5521'],
    expandable: true,
    isNew: true,
  },
  {
    id: 'phone_7742',
    name: 'Phone_7742',
    type: 'PHONE',
    risk: 'HIGH',
    confidence: 88,
    sources: ['CDR_2026_004.csv'],
    identifiers: [],
    expandable: false,
    isNew: true,
  },
  {
    id: 'phone_3319',
    name: 'Phone_3319',
    type: 'PHONE',
    risk: 'MEDIUM',
    confidence: 76,
    sources: ['CDR_2026_004.csv'],
    identifiers: [],
    expandable: false,
    isNew: true,
  },
  {
    id: 'account_5521',
    name: 'Account_5521',
    type: 'ACCOUNT',
    risk: 'HIGH',
    confidence: 83,
    sources: ['CDR_2026_004.csv'],
    identifiers: [],
    expandable: false,
    isNew: true,
  },
  {
    id: 'location_y',
    name: 'Location_Y',
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
    source: 'person_a',
    target: 'phone_7742',
    relationship: 'COMMUNICATES_WITH',
    confidence: 96,
    risk: 'HIGH',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '14 Aug 2026, 21:43',
    evidence:
      'CDR analysis reveals 47 calls and 112 SMS messages exchanged between Person_A and Phone_7742 across a 6-day period. Call durations suggest operational coordination.',
    isNew: true,
  },
  {
    id: 'edge_009',
    source: 'person_c',
    target: 'phone_9821',
    relationship: 'FREQUENT_CONTACT',
    confidence: 89,
    risk: 'CRITICAL',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '13 Aug 2026, 19:12',
    evidence:
      'CDR data links Person_C to Phone_9821 — the same phone already associated with Person_A. This cross-link establishes a previously unknown operational connection between Person_C and the core network.',
    isNew: true,
  },
  {
    id: 'edge_010',
    source: 'person_c',
    target: 'phone_7742',
    relationship: 'FREQUENT_CONTACT',
    confidence: 91,
    risk: 'CRITICAL',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '14 Aug 2026, 22:01',
    evidence:
      'Person_C and Phone_7742 show mutual high-frequency contact in the CDR dataset, coinciding with peak periods of Person_A\'s communication activity.',
    isNew: true,
  },
  {
    id: 'edge_011',
    source: 'person_c',
    target: 'account_5521',
    relationship: 'OWNS',
    confidence: 84,
    risk: 'HIGH',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '01 Aug 2026, 08:00',
    evidence:
      'Account_5521 is linked to Person_C via transaction metadata extracted from the CDR dataset annotation layer. The account shows irregular transaction patterns.',
    isNew: true,
  },
  {
    id: 'edge_012',
    source: 'account_5521',
    target: 'organization_z',
    relationship: 'TRANSFERRED_TO',
    confidence: 79,
    risk: 'CRITICAL',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '03 Aug 2026, 15:22',
    evidence:
      'Financial metadata in the CDR dataset identifies repeated fund transfers from Account_5521 to accounts associated with Organization_Z — establishing a financial link to the organization already present in the investigation network.',
    isNew: true,
  },
  {
    id: 'edge_013',
    source: 'person_b',
    target: 'phone_3319',
    relationship: 'COMMUNICATES_WITH',
    confidence: 76,
    risk: 'MEDIUM',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '12 Aug 2026, 08:47',
    evidence:
      'CDR data shows Person_B in regular contact with Phone_3319. The frequency and timing of communication aligns with incident-period activity.',
    isNew: true,
  },
  {
    id: 'edge_014',
    source: 'person_c',
    target: 'location_y',
    relationship: 'LOCATED_AT',
    confidence: 86,
    risk: 'HIGH',
    sourceDocument: 'CDR_2026_004.csv',
    timestamp: '14 Aug 2026, 20:55',
    evidence:
      'Cell tower triangulation in the CDR places Person_C at Location_Y during the critical window. Location_Y is a previously unidentified site in this investigation.',
    isNew: true,
  },
];

// ─── EXPANDABLE NEIGHBORS ─────────────────────────────────────────────────────
export const EXPANDABLE_NEIGHBORS: Record<string, ExpandableNeighbors> = {
  person_a: {
    nodes: [
      {
        id: 'witness_001',
        name: 'Witness_001',
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
        name: 'Document_FIR',
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
        source: 'person_a',
        target: 'witness_001',
        relationship: 'ASSOCIATED_WITH',
        confidence: 65,
        risk: 'MEDIUM',
        sourceDocument: 'FIR_2026_001.pdf',
        timestamp: '08 Aug 2026, 11:00',
        evidence: 'Witness_001 was present at the scene and has provided testimony linking them to Person_A.',
        isNew: true,
      },
      {
        id: 'edge_exp_002',
        source: 'person_a',
        target: 'doc_fir',
        relationship: 'REFERENCED_IN',
        confidence: 71,
        risk: 'LOW',
        sourceDocument: 'FIR_2026_001.pdf',
        timestamp: '08 Aug 2026, 09:00',
        evidence: 'Person_A is directly named and referenced throughout the FIR document as a primary subject.',
        isNew: true,
      },
    ],
  },
  person_c: {
    nodes: [
      {
        id: 'contact_x01',
        name: 'Contact_X01',
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
        name: 'Account_9934',
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
        source: 'person_c',
        target: 'contact_x01',
        relationship: 'CONNECTED_TO',
        confidence: 74,
        risk: 'HIGH',
        sourceDocument: 'CDR_2026_004.csv',
        timestamp: '15 Aug 2026, 07:30',
        evidence: 'Contact_X01 appears in the CDR call records of Person_C as a recurring contact during the incident period.',
        isNew: true,
      },
      {
        id: 'edge_exp_004',
        source: 'person_c',
        target: 'bank_acct_9',
        relationship: 'OWNS',
        confidence: 68,
        risk: 'MEDIUM',
        sourceDocument: 'CDR_2026_004.csv',
        timestamp: '01 Aug 2026, 00:00',
        evidence: 'Account_9934 is identified as a secondary financial instrument associated with Person_C via CDR metadata.',
        isNew: true,
      },
    ],
  },
  organization_z: {
    nodes: [
      {
        id: 'location_hq',
        name: 'Location_HQ',
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
        source: 'organization_z',
        target: 'location_hq',
        relationship: 'LOCATED_AT',
        confidence: 83,
        risk: 'HIGH',
        sourceDocument: 'FIR_2026_001.pdf',
        timestamp: '05 Aug 2026, 12:00',
        evidence: 'Location_HQ is identified as the operational headquarters of Organization_Z based on intelligence cited in the FIR.',
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
