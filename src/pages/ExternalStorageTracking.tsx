import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Pages.css';

interface StorageBox {
  boxId: string;
  boxBarcode: string;
  provider: string;
  status: 'preparing' | 'ready_for_pickup' | 'in_transit' | 'at_storage' | 'retrieval_requested' | 'returning';
  docketCount: number;
  dockets: DocketItem[];
  utilizationPercent: number;
  dateOut?: string;
  dateReturn?: string;
  pickupTime?: string;
  deliveryTime?: string;
  location: string;
  invoiceAmount?: number;
  verifiedAmount?: number;
}

interface DocketItem {
  labNumber: string;
  casNumber: string;
  description: string;
  addedBy: string;
  addedTime: string;
  rfidTag: string;
  sealed: boolean;
}

interface RetrievalRequest {
  id: string;
  labNumber: string;
  casNumber: string;
  boxId: string;
  requestedBy: string;
  requestDate: string;
  urgency: 'routine' | 'urgent' | 'court';
  status: 'pending' | 'located' | 'retrieved' | 'delivered';
  estimatedReturn: string;
  provider: string;
}

interface StorageProvider {
  name: string;
  contractNumber: string;
  monthlySpend: number;
  boxesStored: number;
  averageUtilization: number;
  lastAudit: string;
  invoiceDiscrepancies: number;
}

const ExternalStorageTracking: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'outgoing' | 'tracking' | 'retrieval' | 'billing'>('outgoing');
  const [boxes, setBoxes] = useState<StorageBox[]>([]);
  const [selectedBox, setSelectedBox] = useState<StorageBox | null>(null);
  const [retrievalRequests, setRetrievalRequests] = useState<RetrievalRequest[]>([]);
  const [providers, setProviders] = useState<StorageProvider[]>([]);
  const [scanMode, setScanMode] = useState(false);
  const [currentScan, setCurrentScan] = useState('');

  useEffect(() => {
    // Load mock data
    setProviders([
      {
        name: 'Docufile Cape Town',
        contractNumber: 'WC-GOV-2023-456',
        monthlySpend: 245000,
        boxesStored: 4875,
        averageUtilization: 38,
        lastAudit: '2025-07-15',
        invoiceDiscrepancies: 127
      },
      {
        name: 'Iron Mountain',
        contractNumber: 'WC-GOV-2024-123',
        monthlySpend: 87000,
        boxesStored: 1250,
        averageUtilization: 72,
        lastAudit: '2025-08-01',
        invoiceDiscrepancies: 12
      }
    ]);

    setBoxes([
      {
        boxId: 'BOX-2025-001',
        boxBarcode: 'DF-789456123',
        provider: 'Docufile Cape Town',
        status: 'preparing',
        docketCount: 12,
        dockets: [
          {
            labNumber: '12337/25',
            casNumber: '025/03/2025',
            description: 'DNA Evidence - Blood samples',
            addedBy: 'Dr. Patricia Ndaba',
            addedTime: '2025-08-18 09:15',
            rfidTag: 'RFID-001-234567',
            sealed: true
          },
          {
            labNumber: '12338/25',
            casNumber: '026/03/2025',
            description: 'Ballistics - Spent casings',
            addedBy: 'Steven Mokwena',
            addedTime: '2025-08-18 09:45',
            rfidTag: 'RFID-002-234568',
            sealed: true
          }
        ],
        utilizationPercent: 75,
        location: 'Packing Station A',
        invoiceAmount: 40
      },
      {
        boxId: 'BOX-2025-002',
        boxBarcode: 'DF-789456124',
        provider: 'Docufile Cape Town',
        status: 'at_storage',
        docketCount: 18,
        dockets: [],
        utilizationPercent: 95,
        dateOut: '2025-08-10',
        deliveryTime: '2025-08-10 14:30',
        location: 'Docufile Shelf 14-B-223',
        invoiceAmount: 40,
        verifiedAmount: 40
      },
      {
        boxId: 'BOX-2025-003',
        boxBarcode: 'DF-789456125',
        provider: 'Docufile Cape Town',
        status: 'retrieval_requested',
        docketCount: 15,
        dockets: [],
        utilizationPercent: 82,
        dateOut: '2025-07-20',
        location: 'Docufile Shelf 09-A-156',
        invoiceAmount: 40,
        verifiedAmount: 40
      }
    ]);

    setRetrievalRequests([
      {
        id: 'RET-001',
        labNumber: '11234/25',
        casNumber: '890/02/2025',
        boxId: 'BOX-2025-003',
        requestedBy: 'Det. James Mitchell',
        requestDate: '2025-08-18 08:00',
        urgency: 'court',
        status: 'located',
        estimatedReturn: '2025-08-18 16:00',
        provider: 'Docufile Cape Town'
      }
    ]);
  }, []);

  const addDocketToBox = () => {
    if (!currentScan) {
      alert('Please scan RFID tag first');
      return;
    }
    
    alert(`Docket ${currentScan} added to box. Chain of custody maintained.`);
    setCurrentScan('');
  };

  const calculateSavings = () => {
    const totalBoxes = providers.reduce((sum, p) => sum + p.boxesStored, 0);
    const avgUtilization = providers.reduce((sum, p) => sum + p.averageUtilization, 0) / providers.length;
    const potentialReduction = Math.floor(totalBoxes * (1 - avgUtilization / 100));
    const monthlySavings = potentialReduction * 40;
    
    return {
      currentBoxes: totalBoxes,
      optimizedBoxes: totalBoxes - potentialReduction,
      boxReduction: potentialReduction,
      monthlySavings,
      annualSavings: monthlySavings * 12
    };
  };

  const savings = calculateSavings();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">External Storage Tracking</h1>
        <p className="page-subtitle">Track evidence movement to Docufile and other external storage providers</p>
      </div>

      {/* Key Metrics Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Boxes at External Storage</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {providers.reduce((sum, p) => sum + p.boxesStored, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Across {providers.length} providers</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Average Box Utilization</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {providers.length > 0 ? Math.round(providers.reduce((sum, p) => sum + p.averageUtilization, 0) / providers.length) : 0}%
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, color: '#fbbf24' }}>⚠️ 62% wasted space</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Monthly Storage Cost</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              R{providers.reduce((sum, p) => sum + p.monthlySpend, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>R{(providers.reduce((sum, p) => sum + p.monthlySpend, 0) * 12).toLocaleString()}/year</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Potential Savings</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              R{savings.monthlySavings.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Per month with optimization</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('outgoing')}
        >
          📦 Pack & Send
        </button>
        <button
          className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          🚚 In Transit / Storage
        </button>
        <button
          className={`tab-btn ${activeTab === 'retrieval' ? 'active' : ''}`}
          onClick={() => setActiveTab('retrieval')}
        >
          📥 Retrieval
        </button>
        <button
          className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          💰 Billing Verification
        </button>
      </div>

      {/* Pack & Send Tab */}
      {activeTab === 'outgoing' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h2>Prepare Box for External Storage</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setScanMode(!scanMode)}
              >
                {scanMode ? '✓ Stop Scanning' : '📡 Start RFID Scan'}
              </button>
            </div>
            <div className="card-body">
              {scanMode && (
                <div style={{
                  background: theme.colors.backgroundElevated,
                  padding: '2rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                  border: `2px solid ${theme.colors.primary}`
                }}>
                  <h3 style={{ color: theme.colors.primary, marginBottom: '1rem' }}>
                    📡 RFID Scanner Active
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Scan or enter RFID/Lab Number..."
                      value={currentScan}
                      onChange={(e) => setCurrentScan(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: `1px solid ${theme.colors.border}`,
                        background: theme.colors.background,
                        color: theme.colors.textPrimary,
                        fontSize: '1.125rem'
                      }}
                      autoFocus
                    />
                    <button className="btn btn-primary" onClick={addDocketToBox}>
                      Add to Box
                    </button>
                  </div>
                  <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: theme.colors.textSecondary }}>
                    Position docket near RFID reader or manually enter Lab Number
                  </div>
                </div>
              )}

              {/* Current Box Being Packed */}
              {boxes.length > 0 && (
              <div style={{
                background: theme.colors.backgroundElevated,
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3>Current Box: {boxes[0].boxId}</h3>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: boxes[0].utilizationPercent >= 80 ? '#10b981' : '#f59e0b',
                    color: 'white',
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}>
                    {boxes[0].utilizationPercent}% Full
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Box Utilization</span>
                    <span>{boxes[0].docketCount} dockets</span>
                  </div>
                  <div style={{
                    height: '30px',
                    background: theme.colors.border,
                    borderRadius: '15px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${boxes[0].utilizationPercent}%`,
                      background: boxes[0].utilizationPercent >= 80 ? 
                        'linear-gradient(90deg, #10b981, #059669)' : 
                        'linear-gradient(90deg, #f59e0b, #d97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {boxes[0].utilizationPercent < 80 && '⚠️ Under-utilized'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '0.75rem' }}>Dockets in Box:</h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {boxes[0].dockets.map((docket, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        background: theme.colors.background,
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600' }}>Lab: {docket.labNumber}</div>
                          <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>
                            CAS: {docket.casNumber} | {docket.description}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: theme.colors.textDisabled }}>
                            Added by {docket.addedBy} at {docket.addedTime}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {docket.sealed && (
                            <span style={{
                              background: '#10b981',
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            }}>
                              ✓ Sealed
                            </span>
                          )}
                          <button className="btn btn-sm btn-outline" style={{ color: theme.colors.error }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }}>
                    Print Box Label
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    Close & Seal Box
                  </button>
                  <button className="btn btn-success" style={{ flex: 1 }}>
                    Ready for Pickup
                  </button>
                </div>
              </div>
              )}

              {/* Pickup Schedule */}
              <div className="card">
                <div className="card-header">
                  <h3>Today's Pickup Schedule</h3>
                </div>
                <div className="card-body">
                  <div style={{
                    padding: '1rem',
                    background: theme.colors.backgroundElevated,
                    borderRadius: '8px',
                    borderLeft: '4px solid #10b981'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>Docufile Cape Town</div>
                        <div style={{ color: theme.colors.textSecondary }}>Driver: John Smith | Vehicle: CAA 123-456</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: theme.colors.primary }}>14:00 - 15:00</div>
                        <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>8 boxes ready</div>
                      </div>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                      Generate Pickup Manifest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In Transit / Storage Tab */}
      {activeTab === 'tracking' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h2>Boxes in Transit & Storage</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.background,
                  color: theme.colors.textPrimary
                }}>
                  <option>All Providers</option>
                  <option>Docufile Cape Town</option>
                  <option>Iron Mountain</option>
                </select>
                <button className="btn btn-primary">
                  🔍 Audit Storage
                </button>
              </div>
            </div>
            <div className="card-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Box ID</th>
                    <th>Provider</th>
                    <th>Status</th>
                    <th>Dockets</th>
                    <th>Utilization</th>
                    <th>Location</th>
                    <th>Date Out</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {boxes.filter(b => b.status !== 'preparing').map(box => (
                    <tr key={box.boxId}>
                      <td className="mono">{box.boxId}</td>
                      <td>{box.provider}</td>
                      <td>
                        <span className={`status-badge ${box.status}`}>
                          {box.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>{box.docketCount}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '60px',
                            height: '8px',
                            background: theme.colors.border,
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${box.utilizationPercent}%`,
                              height: '100%',
                              background: box.utilizationPercent >= 80 ? '#10b981' : '#f59e0b'
                            }} />
                          </div>
                          <span style={{
                            fontSize: '0.875rem',
                            color: box.utilizationPercent >= 80 ? '#10b981' : '#f59e0b'
                          }}>
                            {box.utilizationPercent}%
                          </span>
                        </div>
                      </td>
                      <td>{box.location}</td>
                      <td>{box.dateOut || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedBox(box)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Storage Optimization Alert */}
          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>
              ⚠️ Storage Optimization Opportunity
            </h3>
            <div style={{ color: '#78350f' }}>
              <p>Analysis of your {savings.currentBoxes.toLocaleString()} boxes at external storage shows:</p>
              <ul style={{ margin: '1rem 0' }}>
                <li>Average utilization is only {providers.length > 0 ? Math.round(providers.reduce((sum, p) => sum + p.averageUtilization, 0) / providers.length) : 0}%</li>
                <li>You could reduce to {savings.optimizedBoxes.toLocaleString()} boxes with proper packing</li>
                <li>Potential savings: R{savings.monthlySavings.toLocaleString()}/month (R{savings.annualSavings.toLocaleString()}/year)</li>
              </ul>
              <button className="btn btn-warning" style={{ marginTop: '1rem' }}>
                Generate Consolidation Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retrieval Tab */}
      {activeTab === 'retrieval' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h2>Evidence Retrieval from External Storage</h2>
              <button className="btn btn-primary">
                ➕ New Retrieval Request
              </button>
            </div>
            <div className="card-body">
              {/* Quick Search */}
              <div style={{
                background: theme.colors.backgroundElevated,
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>Quick Evidence Locator</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Enter Lab Number or CAS Number..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: `1px solid ${theme.colors.border}`,
                      background: theme.colors.background,
                      color: theme.colors.textPrimary
                    }}
                  />
                  <button className="btn btn-primary">
                    🔍 Locate Evidence
                  </button>
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: theme.colors.background,
                  borderRadius: '4px',
                  display: 'none' // Would show when found
                }}>
                  <div style={{ color: '#10b981', fontWeight: '600' }}>✓ Evidence Located</div>
                  <div>Box: BOX-2025-003 | Location: Docufile Shelf 09-A-156</div>
                  <div>Retrieval Time: 2-4 hours (routine) | 30 min (urgent +R500)</div>
                </div>
              </div>

              {/* Active Retrievals */}
              <h3 style={{ marginBottom: '1rem' }}>Active Retrieval Requests</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {retrievalRequests.map(request => (
                  <div key={request.id} style={{
                    padding: '1.5rem',
                    background: theme.colors.backgroundElevated,
                    borderRadius: '8px',
                    borderLeft: request.urgency === 'court' ? '4px solid #ef4444' : '4px solid #3b82f6'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                          Lab: {request.labNumber}
                        </div>
                        <div style={{ color: theme.colors.textSecondary }}>
                          CAS: {request.casNumber} | Box: {request.boxId}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {request.urgency === 'court' && (
                          <span style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}>
                            ⚖️ COURT URGENT
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Requested By</div>
                        <div>{request.requestedBy}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Provider</div>
                        <div>{request.provider}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Est. Return</div>
                        <div>{request.estimatedReturn}</div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: theme.colors.background,
                      borderRadius: '4px'
                    }}>
                      <div style={{ textAlign: 'center', opacity: request.status === 'pending' ? 1 : 0.4 }}>
                        <div style={{ fontSize: '1.5rem' }}>📋</div>
                        <div style={{ fontSize: '0.75rem' }}>Requested</div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          flex: 1, 
                          height: '2px', 
                          background: request.status !== 'pending' ? '#10b981' : theme.colors.border 
                        }} />
                      </div>
                      <div style={{ textAlign: 'center', opacity: ['located', 'retrieved', 'delivered'].includes(request.status) ? 1 : 0.4 }}>
                        <div style={{ fontSize: '1.5rem' }}>📍</div>
                        <div style={{ fontSize: '0.75rem' }}>Located</div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          flex: 1, 
                          height: '2px', 
                          background: ['retrieved', 'delivered'].includes(request.status) ? '#10b981' : theme.colors.border 
                        }} />
                      </div>
                      <div style={{ textAlign: 'center', opacity: ['retrieved', 'delivered'].includes(request.status) ? 1 : 0.4 }}>
                        <div style={{ fontSize: '1.5rem' }}>🚚</div>
                        <div style={{ fontSize: '0.75rem' }}>Retrieved</div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          flex: 1, 
                          height: '2px', 
                          background: request.status === 'delivered' ? '#10b981' : theme.colors.border 
                        }} />
                      </div>
                      <div style={{ textAlign: 'center', opacity: request.status === 'delivered' ? 1 : 0.4 }}>
                        <div style={{ fontSize: '1.5rem' }}>✅</div>
                        <div style={{ fontSize: '0.75rem' }}>Delivered</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Verification Tab */}
      {activeTab === 'billing' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h2>Storage Provider Billing Verification</h2>
              <button className="btn btn-primary">
                📊 Generate Audit Report
              </button>
            </div>
            <div className="card-body">
              {providers.map(provider => (
                <div key={provider.name} style={{
                  padding: '1.5rem',
                  background: theme.colors.backgroundElevated,
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{provider.name}</h3>
                      <div style={{ color: theme.colors.textSecondary }}>
                        Contract: {provider.contractNumber}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        R{provider.monthlySpend.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>
                        per month
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Boxes Stored</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{provider.boxesStored.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Avg Utilization</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600', color: provider.averageUtilization < 50 ? '#ef4444' : '#10b981' }}>
                        {provider.averageUtilization}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Last Audit</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{provider.lastAudit}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Discrepancies</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600', color: provider.invoiceDiscrepancies > 0 ? '#ef4444' : '#10b981' }}>
                        {provider.invoiceDiscrepancies}
                      </div>
                    </div>
                  </div>

                  {provider.invoiceDiscrepancies > 0 && (
                    <div style={{
                      padding: '1rem',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ color: '#991b1b', fontWeight: '600', marginBottom: '0.5rem' }}>
                        ⚠️ Invoice Discrepancies Found
                      </div>
                      <div style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>
                        {provider.invoiceDiscrepancies} boxes billed but not verified in storage.
                        Potential overcharge: R{(provider.invoiceDiscrepancies * 40).toLocaleString()}/month
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary">
                      View Invoice History
                    </button>
                    <button className="btn btn-primary">
                      Verify Current Invoice
                    </button>
                    <button className="btn btn-outline">
                      Schedule Audit
                    </button>
                  </div>
                </div>
              ))}

              {/* Cost Optimization Summary */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '8px',
                marginTop: '2rem'
              }}>
                <h3 style={{ marginBottom: '1.5rem' }}>💰 Cost Optimization Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h4>Current State</h4>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                      <li>{savings.currentBoxes.toLocaleString()} boxes in storage</li>
                      <li>38% average utilization</li>
                      <li>R{providers.reduce((sum, p) => sum + p.monthlySpend, 0).toLocaleString()}/month cost</li>
                      <li>127 billing discrepancies</li>
                    </ul>
                  </div>
                  <div>
                    <h4>With Optimization</h4>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                      <li>{savings.optimizedBoxes.toLocaleString()} boxes needed</li>
                      <li>85% target utilization</li>
                      <li>R{(providers.reduce((sum, p) => sum + p.monthlySpend, 0) - savings.monthlySavings).toLocaleString()}/month cost</li>
                      <li>0 billing discrepancies</li>
                    </ul>
                  </div>
                </div>
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  Annual Savings Potential: R{savings.annualSavings.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalStorageTracking;