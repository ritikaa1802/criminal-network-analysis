'use client';

import { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Filters, NodeType, RiskLevel } from '@/lib/types';
import { ALL_RELATIONSHIP_TYPES } from '@/lib/mockData';

const ALL_NODE_TYPES: NodeType[] = ['PERSON', 'PHONE', 'VEHICLE', 'LOCATION', 'ORGANIZATION', 'ACCOUNT', 'DOCUMENT'];
const ALL_RISK_LEVELS: RiskLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const RISK_COLORS: Record<RiskLevel, string> = {
  CRITICAL: '#dc2626',
  HIGH: '#dc2626',
  MEDIUM: '#d97706',
  LOW: '#16a34a',
};

interface Props {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onReset: () => void;
  onSearch: (query: string, nodeId: string | null) => void;
  availableNodes: { id: string; name: string }[];
}

export default function GraphControls({
  filters,
  onFiltersChange,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  onSearch,
  availableNodes,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [noResult, setNoResult] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setNoResult(false);

    if (!q.trim()) {
      setSearchResult(null);
      onSearch('', null);
      return;
    }

    const match = availableNodes.find(
      (n) =>
        n.name.toLowerCase().includes(q.toLowerCase()) ||
        n.id.toLowerCase().includes(q.toLowerCase())
    );

    if (match) {
      setSearchResult(match.id);
      onSearch(q, match.id);
    } else {
      setSearchResult(null);
      setNoResult(true);
      onSearch(q, null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
    setNoResult(false);
    onSearch('', null);
  };

  const toggleRisk = (risk: RiskLevel) => {
    const next = filters.riskLevels.includes(risk)
      ? filters.riskLevels.filter((r) => r !== risk)
      : [...filters.riskLevels, risk];
    onFiltersChange({ ...filters, riskLevels: next.length === 0 ? ALL_RISK_LEVELS : next });
  };

  const toggleNodeType = (type: NodeType) => {
    const next = filters.nodeTypes.includes(type)
      ? filters.nodeTypes.filter((t) => t !== type)
      : [...filters.nodeTypes, type];
    onFiltersChange({ ...filters, nodeTypes: next.length === 0 ? ALL_NODE_TYPES : next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search
          size={13}
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          className="search-input"
          placeholder="Search entities…"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 2,
              color: 'var(--text-muted)',
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Search feedback */}
      {noResult && searchQuery && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>
          No matching entity found.
        </div>
      )}
      {searchResult && (
        <div style={{ fontSize: 11, color: '#15803d', textAlign: 'center', padding: '4px 0' }}>
          ✓ Entity found and focused
        </div>
      )}

      {/* Zoom controls */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
        <button className="btn-icon" onClick={onZoomIn} title="Zoom in">
          <ZoomIn size={13} />
        </button>
        <button className="btn-icon" onClick={onZoomOut} title="Zoom out">
          <ZoomOut size={13} />
        </button>
        <button className="btn-icon" onClick={onFit} title="Fit graph">
          <Maximize2 size={13} />
        </button>
        <button className="btn-icon" onClick={onReset} title="Reset view">
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Filters toggle */}
      <button
        className="btn-ghost"
        style={{
          width: '100%',
          justifyContent: 'space-between',
          padding: '7px 10px',
          border: '1px solid var(--border)',
          borderRadius: 6,
          background: filtersOpen ? 'var(--surface-2)' : 'transparent',
        }}
        onClick={() => setFiltersOpen((o) => !o)}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <SlidersHorizontal size={12} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>Filters</span>
        </span>
        {filtersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {filtersOpen && (
        <div
          className="fade-in"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 7,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Confidence slider */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
                fontSize: 11,
                color: 'var(--text-tertiary)',
              }}
            >
              <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
                Min Confidence
              </span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {filters.minConfidence}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={99}
              value={filters.minConfidence}
              onChange={(e) =>
                onFiltersChange({ ...filters, minConfidence: Number(e.target.value) })
              }
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 9,
                color: 'var(--text-muted)',
                marginTop: 2,
              }}
            >
              <span>0%</span>
              <span>99%</span>
            </div>
          </div>

          {/* Risk filter */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 6,
              }}
            >
              Risk Level
            </div>
            {ALL_RISK_LEVELS.map((risk) => (
              <label key={risk} className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={filters.riskLevels.includes(risk)}
                  onChange={() => toggleRisk(risk)}
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: RISK_COLORS[risk],
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span>
                  {risk.charAt(0) + risk.slice(1).toLowerCase()}
                </span>
              </label>
            ))}
          </div>

          {/* Node type filter */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 6,
              }}
            >
              Entity Type
            </div>
            {ALL_NODE_TYPES.map((type) => (
              <label key={type} className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={filters.nodeTypes.includes(type)}
                  onChange={() => toggleNodeType(type)}
                />
                <span>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </span>
              </label>
            ))}
          </div>

          {/* Reset filters */}
          <button
            className="btn-ghost"
            style={{ fontSize: 11, color: '#2563eb', padding: '4px 0' }}
            onClick={() =>
              onFiltersChange({
                minConfidence: 0,
                riskLevels: ALL_RISK_LEVELS,
                nodeTypes: ALL_NODE_TYPES,
                relationshipTypes: [],
              })
            }
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
