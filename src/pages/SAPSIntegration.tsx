import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Pages.css';

interface SAPSCase {
  casNumber: string;
  stationCode: string;
  stationName: string;
  investigatingOfficer: string;
  ioContact: string;
  dateOpened: string;
  status: 'active' | 'pending_court' | 'closed' | 'cold_case';
  offenseCode: string;
  offenseDescription: string;
  labRequests: LabRequest[];
}

interface LabRequest {
  labNumber: string;
  requestType: string;
  priority: 'routine' | 'urgent' | 'critical';
  dateRequested: string;
  expectedCompletion: string;
  status: 'received' | 'in_progress' | 'completed' | 'court_ready';
}

const SAPSIntegration: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'lookup' | 'sync' | 'requests' | 'reports'>('lookup');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<SAPSCase | null>(null);
  const [cases, setCases] = useState<SAPSCase[]>([]);
  const [syncStatus, setSyncStatus] = useState({
    lastSync: '2025-08-18 08:15:00',
    nextSync: '2025-08-18 09:15:00',
    status: 'connected',
    pendingUpdates: 12,
    failedUpdates: 0
  });

  useEffect(() => {
    // Load mock SAPS cases
    setCases([
      {
        casNumber: '025/03/2025',
        stationCode: 'WC001',
        stationName: 'Muizenberg SAPS',
        investigatingOfficer: 'Det. Capt. J. van der Merwe',
        ioContact: '021-555-0100',
        dateOpened: '2025-03-15',
        status: 'active',
        offenseCode: '117',
        offenseDescription: 'Murder',
        labRequests: [
          {
            labNumber: '12337/25',
            requestType: 'DNA Analysis',
            priority: 'urgent',
            dateRequested: '2025-03-16',
            expectedCompletion: '2025-03-23',
            status: 'court_ready'
          },
          {
            labNumber: '12338/25',
            requestType: 'Ballistics',
            priority: 'urgent',
            dateRequested: '2025-03-16',
            expectedCompletion: '2025-03-25',
            status: 'in_progress'
          }
        ]
      },
      {
        casNumber: '148/05/2025',
        stationCode: 'WC014',
        stationName: 'Camps Bay SAPS',
        investigatingOfficer: 'Det. Sgt. M. Nkosi',
        ioContact: '021-555-0114',
        dateOpened: '2025-05-20',
        status: 'pending_court',
        offenseCode: '459',
        offenseDescription: 'Robbery with Aggravating Circumstances',
        labRequests: [
          {
            labNumber: '14521/25',
            requestType: 'Fingerprint Analysis',
            priority: 'routine',
            dateRequested: '2025-05-21',
            expectedCompletion: '2025-06-01',
            status: 'completed'
          }
        ]
      }
    ]);
  }, []);

  const handleCaseLookup = () => {
    const foundCase = cases.find(c => 
      c.casNumber.includes(searchQuery) || 
      c.labRequests.some(lr => lr.labNumber.includes(searchQuery))
    );
    if (foundCase) {
      setSelectedCase(foundCase);
    } else {
      alert('Case not found in SAPS database');
    }
  };

  const syncWithSAPS = () => {
    setSyncStatus(prev => ({ ...prev, status: 'syncing' }));
    setTimeout(() => {
      setSyncStatus(prev => ({
        ...prev,
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        pendingUpdates: 0
      }));
      alert('Successfully synchronized with SAPS CAS system');
    }, 2000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">SAPS Integration Portal</h1>
        <p className="page-subtitle">South African Police Service Case Management System Integration</p>
      </div>

      {/* Connection Status Banner */}
      <div style={{
        background: syncStatus.status === 'connected' ? 
          'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
          'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'white',
            animation: syncStatus.status === 'syncing' ? 'pulse 2s infinite' : 'none'
          }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>SAPS CAS Connection Status: {syncStatus.status.toUpperCase()}</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              Last Sync: {syncStatus.lastSync} | Next: {syncStatus.nextSync}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{syncStatus.pendingUpdates}</div>
            <div style={{ fontSize: '0.75rem' }}>Pending Updates</div>
          </div>
          <button 
            className="btn"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={syncWithSAPS}
          >
            Sync Now
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'lookup' ? 'active' : ''}`}
          onClick={() => setActiveTab('lookup')}
        >
          🔍 Case Lookup
        </button>
        <button
          className={`tab-btn ${activeTab === 'sync' ? 'active' : ''}`}
          onClick={() => setActiveTab('sync')}
        >
          🔄 Sync Status
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📋 Lab Requests
        </button>
        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📊 Reports to SAPS
        </button>
      </div>

      {/* Case Lookup Tab */}
      {activeTab === 'lookup' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h2>SAPS Case Lookup</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                  type="text"
                  placeholder="Enter CAS Number or Lab Number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.background,
                    color: theme.colors.textPrimary
                  }}
                />
                <button className="btn btn-primary" onClick={handleCaseLookup}>
                  Search SAPS Database
                </button>
              </div>

              {selectedCase && (
                <div style={{
                  background: theme.colors.backgroundElevated,
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <h3 style={{ marginBottom: '1rem', color: theme.colors.primary }}>
                    CAS: {selectedCase.casNumber}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Police Station</div>
                      <div style={{ fontWeight: '600' }}>{selectedCase.stationName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Investigating Officer</div>
                      <div style={{ fontWeight: '600' }}>{selectedCase.investigatingOfficer}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>IO Contact</div>
                      <div style={{ fontWeight: '600' }}>{selectedCase.ioContact}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Date Opened</div>
                      <div style={{ fontWeight: '600' }}>{selectedCase.dateOpened}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Offense</div>
                      <div style={{ fontWeight: '600' }}>{selectedCase.offenseDescription}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Status</div>
                      <span className={`status-badge ${selectedCase.status}`}>
                        {selectedCase.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: '1rem' }}>Lab Requests</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Lab Number</th>
                        <th>Request Type</th>
                        <th>Priority</th>
                        <th>Date Requested</th>
                        <th>Expected Completion</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCase.labRequests.map((request, idx) => (
                        <tr key={idx}>
                          <td className="mono">{request.labNumber}</td>
                          <td>{request.requestType}</td>
                          <td>
                            <span className={`priority-badge ${request.priority}`}>
                              {request.priority.toUpperCase()}
                            </span>
                          </td>
                          <td>{request.dateRequested}</td>
                          <td>{request.expectedCompletion}</td>
                          <td>
                            <span className={`status-badge ${request.status}`}>
                              {request.status === 'court_ready' ? '⚖️ COURT READY' : request.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary">
                      Update SAPS with Lab Results
                    </button>
                    <button className="btn btn-secondary">
                      Generate IO Report
                    </button>
                    <button className="btn btn-secondary">
                      Download Case File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sync Status Tab */}
      {activeTab === 'sync' && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-details">
                <div className="stat-value">247</div>
                <div className="stat-label">Cases Synced Today</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📤</div>
              <div className="stat-details">
                <div className="stat-value">89</div>
                <div className="stat-label">Results Sent to SAPS</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📥</div>
              <div className="stat-details">
                <div className="stat-value">156</div>
                <div className="stat-label">New Requests Received</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-details">
                <div className="stat-value">{syncStatus.failedUpdates}</div>
                <div className="stat-label">Failed Syncs</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Integration Logs</h2>
            </div>
            <div className="card-body">
              <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', background: theme.colors.background, padding: '1rem', borderRadius: '4px' }}>
                <div>[2025-08-18 08:15:00] ✅ Successful sync with SAPS CAS</div>
                <div>[2025-08-18 08:14:45] 📥 Received 12 new case requests</div>
                <div>[2025-08-18 08:14:30] 📤 Uploaded 8 completed lab results</div>
                <div>[2025-08-18 08:00:00] ✅ Scheduled sync completed</div>
                <div>[2025-08-18 07:45:00] ⚖️ Court ready notification sent for CAS 025/03/2025</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .priority-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .priority-badge.urgent {
          background: #fef3c7;
          color: #92400e;
        }
        
        .priority-badge.critical {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .priority-badge.routine {
          background: #e0e7ff;
          color: #3730a3;
        }
      `}</style>
    </div>
  );
};

export default SAPSIntegration;