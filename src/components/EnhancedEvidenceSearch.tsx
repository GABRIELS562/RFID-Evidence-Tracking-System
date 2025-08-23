import React, { useState, useContext, useMemo, useCallback } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

interface EvidenceItem {
  id: string;
  caseNumber: string;
  description: string;
  location: string;
  status: 'checked-in' | 'in-transit' | 'in-lab' | 'in-court' | 'disposed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastScanned: Date;
  temperature?: number;
  humidity?: number;
  tags: string[];
  officer: string;
  chainStatus: 'verified' | 'pending' | 'broken';
}

interface EnhancedEvidenceSearchProps {
  evidence: EvidenceItem[];
  onEvidenceSelect?: (evidence: EvidenceItem) => void;
  onBulkAction?: (selectedIds: string[], action: string) => void;
}

export const EnhancedEvidenceSearch: React.FC<EnhancedEvidenceSearchProps> = ({
  evidence,
  onEvidenceSelect,
  onBulkAction
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [chainFilter, setChainFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'lastScanned' | 'priority' | 'caseNumber'>('lastScanned');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced filters
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [temperatureAlert, setTemperatureAlert] = useState(false);
  const [humidityAlert, setHumidityAlert] = useState(false);

  // Filter and search logic
  const filteredEvidence = useMemo(() => {
    let filtered = evidence.filter(item => {
      // Text search
      const searchMatch = searchQuery === '' || 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.officer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by status
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      
      // Filter by priority
      const priorityMatch = priorityFilter === 'all' || item.priority === priorityFilter;
      
      // Filter by location
      const locationMatch = locationFilter === 'all' || item.location === locationFilter;
      
      // Filter by chain status
      const chainMatch = chainFilter === 'all' || item.chainStatus === chainFilter;

      // Date filter
      let dateMatch = true;
      if (dateFilter !== 'all') {
        const now = new Date();
        const itemDate = new Date(item.lastScanned);
        switch (dateFilter) {
          case 'today':
            dateMatch = itemDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateMatch = itemDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateMatch = itemDate >= monthAgo;
            break;
        }
      }

      // Environmental alerts
      const tempMatch = !temperatureAlert || 
        (item.temperature !== undefined && (item.temperature < 2 || item.temperature > 8));
      const humidMatch = !humidityAlert || 
        (item.humidity !== undefined && (item.humidity < 30 || item.humidity > 70));

      return searchMatch && statusMatch && priorityMatch && locationMatch && 
             chainMatch && dateMatch && tempMatch && humidMatch;
    });

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'lastScanned':
          comparison = new Date(b.lastScanned).getTime() - new Date(a.lastScanned).getTime();
          break;
        case 'priority':
          const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'caseNumber':
          comparison = a.caseNumber.localeCompare(b.caseNumber);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [evidence, searchQuery, statusFilter, priorityFilter, locationFilter, chainFilter, 
      sortBy, sortOrder, dateFilter, temperatureAlert, humidityAlert]);

  // Get unique values for filters
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(evidence.map(item => item.location)));
  }, [evidence]);

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredEvidence.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEvidence.map(item => item.id)));
    }
  }, [filteredEvidence, selectedIds]);

  const handleSelectItem = useCallback((id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }, [selectedIds]);

  // Bulk actions
  const handleBulkAction = useCallback((action: string) => {
    if (onBulkAction && selectedIds.size > 0) {
      onBulkAction(Array.from(selectedIds), action);
      setSelectedIds(new Set());
    }
  }, [onBulkAction, selectedIds]);

  // Quick stats
  const stats = useMemo(() => {
    const total = filteredEvidence.length;
    const critical = filteredEvidence.filter(item => item.priority === 'critical').length;
    const high = filteredEvidence.filter(item => item.priority === 'high').length;
    const broken = filteredEvidence.filter(item => item.chainStatus === 'broken').length;
    const pending = filteredEvidence.filter(item => item.chainStatus === 'pending').length;
    
    return { total, critical, high, broken, pending };
  }, [filteredEvidence]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in': return '#3b82f6';
      case 'in-transit': return '#f59e0b';
      case 'in-lab': return '#8b5cf6';
      case 'in-court': return '#ec4899';
      case 'disposed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getChainColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'broken': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="enhanced-evidence-search" style={{ padding: '24px' }}>
      {/* Search Bar */}
      <div className="evidence-search-bar" style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.95))'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '24px',
        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        {/* Top Row - Search and View Toggle */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by ID, case number, description, location, officer, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: `2px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                borderRadius: '16px',
                fontSize: '14px',
                background: theme === 'dark' ? '#334155' : 'white',
                color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                transition: 'all 0.2s ease'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              opacity: 0.6
            }}>
              🔍
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              style={{
                background: theme === 'dark' ? '#475569' : '#f1f5f9',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: theme === 'dark' ? '#e2e8f0' : '#475569',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{viewMode === 'table' ? '📋' : '🗂️'}</span>
              {viewMode === 'table' ? 'Table View' : 'Card View'}
            </button>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              style={{
                background: showAdvancedFilters ? '#667eea' : (theme === 'dark' ? '#475569' : '#f1f5f9'),
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                cursor: 'pointer',
                color: showAdvancedFilters ? 'white' : (theme === 'dark' ? '#e2e8f0' : '#475569'),
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>⚙️</span>
              Advanced
            </button>
          </div>
        </div>

        {/* Basic Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: showAdvancedFilters ? '20px' : '0'
        }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
            style={{
              padding: '10px 12px',
              border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
              borderRadius: '12px',
              fontSize: '14px',
              background: theme === 'dark' ? '#334155' : 'white',
              color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Status</option>
            <option value="checked-in">Checked In</option>
            <option value="in-transit">In Transit</option>
            <option value="in-lab">In Lab</option>
            <option value="in-court">In Court</option>
            <option value="disposed">Disposed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
            style={{
              padding: '10px 12px',
              border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
              borderRadius: '12px',
              fontSize: '14px',
              background: theme === 'dark' ? '#334155' : 'white',
              color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="filter-select"
            style={{
              padding: '10px 12px',
              border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
              borderRadius: '12px',
              fontSize: '14px',
              background: theme === 'dark' ? '#334155' : 'white',
              color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select
            value={chainFilter}
            onChange={(e) => setChainFilter(e.target.value)}
            className="filter-select"
            style={{
              padding: '10px 12px',
              border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
              borderRadius: '12px',
              fontSize: '14px',
              background: theme === 'dark' ? '#334155' : 'white',
              color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Chain Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="broken">Broken</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div style={{
            background: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              alignItems: 'center'
            }}>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="filter-select"
                style={{
                  padding: '10px 12px',
                  border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  background: theme === 'dark' ? '#334155' : 'white',
                  color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: theme === 'dark' ? '#e2e8f0' : '#475569'
              }}>
                <input
                  type="checkbox"
                  checked={temperatureAlert}
                  onChange={(e) => setTemperatureAlert(e.target.checked)}
                  style={{ accentColor: '#667eea' }}
                />
                🌡️ Temperature Alerts
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: theme === 'dark' ? '#e2e8f0' : '#475569'
              }}>
                <input
                  type="checkbox"
                  checked={humidityAlert}
                  onChange={(e) => setHumidityAlert(e.target.checked)}
                  style={{ accentColor: '#667eea' }}
                />
                💧 Humidity Alerts
              </label>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setLocationFilter('all');
                  setChainFilter('all');
                  setDateFilter('all');
                  setTemperatureAlert(false);
                  setHumidityAlert(false);
                  setSelectedIds(new Set());
                }}
                className="clear-filters"
                style={{
                  background: 'transparent',
                  border: `1px solid ${theme === 'dark' ? '#64748b' : '#94a3b8'}`,
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Stats and Sort */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: theme === 'dark' ? '#e2e8f0' : '#475569'
            }}>
              {stats.total} items found
            </div>
            {stats.critical > 0 && (
              <div style={{
                background: '#dc2626',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                🚨 {stats.critical} Critical
              </div>
            )}
            {stats.broken > 0 && (
              <div style={{
                background: '#ef4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ⚠️ {stats.broken} Broken Chain
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              style={{
                padding: '8px 12px',
                border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                borderRadius: '12px',
                fontSize: '14px',
                background: theme === 'dark' ? '#334155' : 'white',
                color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                cursor: 'pointer'
              }}
            >
              <option value="lastScanned-desc">Latest First</option>
              <option value="lastScanned-asc">Oldest First</option>
              <option value="priority-desc">High Priority First</option>
              <option value="priority-asc">Low Priority First</option>
              <option value="caseNumber-asc">Case Number A-Z</option>
              <option value="caseNumber-desc">Case Number Z-A</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: theme === 'dark' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: theme === 'dark' ? '#e2e8f0' : '#475569'
            }}>
              {selectedIds.size} items selected
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleBulkAction('export')}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Export
              </button>
              <button
                onClick={() => handleBulkAction('update-status')}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Update Status
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                style={{
                  background: 'transparent',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  border: `1px solid ${theme === 'dark' ? '#64748b' : '#94a3b8'}`,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="evidence-results">
        {viewMode === 'table' ? (
          <div className="data-table-container" style={{
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9))'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '24px',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            overflowX: 'auto'
          }}>
            <table className="data-table" style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 8px'
            }}>
              <thead>
                <tr>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: '16px 0 0 16px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredEvidence.length && filteredEvidence.length > 0}
                      onChange={handleSelectAll}
                      style={{ accentColor: 'white' }}
                    />
                  </th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Evidence ID</th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Case</th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Description</th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Location</th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Status</th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Priority</th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Chain</th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Environment</th>
                  <th style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: '0 16px 16px 0'
                  }}>Last Scan</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvidence.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onEvidenceSelect?.(item)}
                    className={`priority-${item.priority}`}
                    style={{
                      background: theme === 'dark' 
                        ? item.priority === 'critical' ? 'linear-gradient(135deg, #450a0a, #1e293b)' :
                          item.priority === 'high' ? 'linear-gradient(135deg, #451a03, #1e293b)' :
                          'linear-gradient(135deg, #1e293b, #334155)'
                        : item.priority === 'critical' ? 'linear-gradient(135deg, #fef2f2, #ffffff)' :
                          item.priority === 'high' ? 'linear-gradient(135deg, #fffbeb, #ffffff)' :
                          'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderRadius: '16px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      borderLeft: item.priority === 'critical' ? '4px solid #dc2626' :
                                   item.priority === 'high' ? '3px solid #ea580c' :
                                   item.priority === 'medium' ? '2px solid #ca8a04' :
                                   '1px solid #16a34a'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <td style={{ 
                      padding: '16px 12px',
                      borderRadius: '16px 0 0 16px'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectItem(item.id);
                        }}
                        style={{ accentColor: '#667eea' }}
                      />
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div className="evidence-id-cell" style={{
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                        background: theme === 'dark' ? 'linear-gradient(135deg, #374151, #475569)' : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        display: 'inline-block',
                        fontSize: '13px'
                      }}>
                        {item.id}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px 12px',
                      color: theme === 'dark' ? '#cbd5e1' : '#475569',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {item.caseNumber}
                    </td>
                    <td style={{ 
                      padding: '16px 12px',
                      color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontSize: '14px',
                      maxWidth: '200px'
                    }}>
                      {item.description}
                    </td>
                    <td style={{ 
                      padding: '16px 12px',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b',
                      fontSize: '14px'
                    }}>
                      {item.location}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={`status-badge ${item.status}`} style={{
                        background: getStatusColor(item.status),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{
                        background: getPriorityColor(item.priority),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}>
                        {item.priority}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{
                        background: getChainColor(item.chainStatus),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}>
                        {item.chainStatus}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '16px 12px',
                      fontSize: '12px'
                    }}>
                      <div className="env-data" style={{
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'column'
                      }}>
                        {item.temperature !== undefined && (
                          <span className={`env-indicator ${
                            item.temperature < 2 || item.temperature > 8 ? 'critical' : 'normal'
                          }`}>
                            🌡️ {item.temperature}°C
                          </span>
                        )}
                        {item.humidity !== undefined && (
                          <span className={`env-indicator ${
                            item.humidity < 30 || item.humidity > 70 ? 'warning' : 'normal'
                          }`}>
                            💧 {item.humidity}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px 12px',
                      borderRadius: '0 16px 16px 0',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {new Date(item.lastScanned).toLocaleDateString()}<br />
                      {new Date(item.lastScanned).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Card View
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {filteredEvidence.map((item) => (
              <div
                key={item.id}
                onClick={() => onEvidenceSelect?.(item)}
                className={`evidence-card priority-${item.priority}`}
                style={{
                  background: theme === 'dark' 
                    ? item.priority === 'critical' ? 'linear-gradient(135deg, #450a0a, #1e293b)' :
                      item.priority === 'high' ? 'linear-gradient(135deg, #451a03, #1e293b)' :
                      'linear-gradient(135deg, #1e293b, #334155)'
                    : item.priority === 'critical' ? 'linear-gradient(135deg, #fef2f2, #ffffff)' :
                      item.priority === 'high' ? 'linear-gradient(135deg, #fffbeb, #ffffff)' :
                      'white',
                  borderRadius: '20px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectItem(item.id);
                    }}
                    style={{ accentColor: '#667eea' }}
                  />
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: getChainColor(item.chainStatus),
                    boxShadow: '0 0 0 2px white'
                  }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div className="evidence-id-cell" style={{
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                    background: theme === 'dark' ? 'linear-gradient(135deg, #374151, #475569)' : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                    padding: '6px 16px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}>
                    {item.id}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: theme === 'dark' ? '#94a3b8' : '#64748b',
                    fontWeight: '600'
                  }}>
                    Case: {item.caseNumber}
                  </div>
                </div>

                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {item.description}
                </h4>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <span style={{
                    background: getStatusColor(item.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {item.status.replace('-', ' ')}
                  </span>
                  <span style={{
                    background: getPriorityColor(item.priority),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {item.priority}
                  </span>
                  <span style={{
                    background: getChainColor(item.chainStatus),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {item.chainStatus}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  fontSize: '12px',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b'
                }}>
                  <div>
                    <div style={{ marginBottom: '4px' }}>📍 {item.location}</div>
                    <div style={{ marginBottom: '4px' }}>👤 {item.officer}</div>
                    {(item.temperature !== undefined || item.humidity !== undefined) && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {item.temperature !== undefined && (
                          <span>🌡️ {item.temperature}°C</span>
                        )}
                        {item.humidity !== undefined && (
                          <span>💧 {item.humidity}%</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>Last Scan:</div>
                    <div style={{ fontWeight: '600' }}>
                      {new Date(item.lastScanned).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '11px' }}>
                      {new Date(item.lastScanned).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredEvidence.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: theme === 'dark' ? '#94a3b8' : '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              marginBottom: '8px',
              color: theme === 'dark' ? '#e2e8f0' : '#374151'
            }}>
              No evidence found
            </h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};