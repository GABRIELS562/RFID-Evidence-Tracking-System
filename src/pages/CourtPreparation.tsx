import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Pages.css';

interface CourtCase {
  id: string;
  labNumber: string;
  casNumber: string;
  courtDate: string;
  courtName: string;
  prosecutor: string;
  investigatingOfficer: string;
  status: 'pending' | 'prepared' | 'submitted' | 'completed';
  exhibits: Exhibit[];
  witnesses: Expert[];
}

interface Exhibit {
  id: string;
  description: string;
  labNumber: string;
  sealed: boolean;
  photographed: boolean;
  chainOfCustodyVerified: boolean;
}

interface Expert {
  name: string;
  qualification: string;
  reportReady: boolean;
  availableForCourt: boolean;
}

const CourtPreparation: React.FC = () => {
  const { theme } = useTheme();
  const [cases, setCases] = useState<CourtCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<CourtCase | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'preparation' | 'submitted'>('upcoming');

  useEffect(() => {
    // Load mock court cases
    setCases([
      {
        id: '1',
        labNumber: '12337/25',
        casNumber: '2109/06/25',
        courtDate: '2025-08-25',
        courtName: 'Cape Town High Court',
        prosecutor: 'Adv. Sarah Johnson',
        investigatingOfficer: 'Det. James Mitchell',
        status: 'pending',
        exhibits: [
          { id: '1', description: 'DNA Sample - Blood', labNumber: '12337/25', sealed: true, photographed: true, chainOfCustodyVerified: true },
          { id: '2', description: 'Firearm - 9mm Pistol', labNumber: '12338/25', sealed: true, photographed: false, chainOfCustodyVerified: true },
        ],
        witnesses: [
          { name: 'Dr. Patricia Ndaba', qualification: 'PhD Forensic Biology', reportReady: true, availableForCourt: true },
          { name: 'Steven Mokwena', qualification: 'MSc Ballistics', reportReady: false, availableForCourt: true },
        ]
      }
    ]);
  }, []);

  const generateCourtBundle = () => {
    alert('Generating court bundle with all exhibits, reports, and chain of custody documentation...');
  };

  const generateSection212Affidavit = () => {
    alert('Generating Section 212 Affidavit for court submission...');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Court Preparation</h1>
        <p className="page-subtitle">Prepare evidence and documentation for court proceedings</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          ⚖️ Upcoming Cases
        </button>
        <button
          className={`tab-btn ${activeTab === 'preparation' ? 'active' : ''}`}
          onClick={() => setActiveTab('preparation')}
        >
          📋 In Preparation
        </button>
        <button
          className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          ✅ Submitted
        </button>
      </div>

      {/* Upcoming Cases */}
      {activeTab === 'upcoming' && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-details">
                <div className="stat-value">12</div>
                <div className="stat-label">Cases This Week</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-details">
                <div className="stat-value">3</div>
                <div className="stat-label">Urgent Preparations</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <div className="stat-value">45</div>
                <div className="stat-label">Exhibits Required</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <div className="stat-value">8</div>
                <div className="stat-label">Expert Witnesses</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Upcoming Court Cases</h2>
              <button className="btn btn-primary" onClick={generateCourtBundle}>
                Generate Court Bundle
              </button>
            </div>
            <div className="card-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lab Number</th>
                    <th>CAS Number</th>
                    <th>Court Date</th>
                    <th>Court</th>
                    <th>Prosecutor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(courtCase => (
                    <tr key={courtCase.id}>
                      <td className="mono">{courtCase.labNumber}</td>
                      <td>{courtCase.casNumber}</td>
                      <td>{new Date(courtCase.courtDate).toLocaleDateString()}</td>
                      <td>{courtCase.courtName}</td>
                      <td>{courtCase.prosecutor}</td>
                      <td>
                        <span className={`status-badge ${courtCase.status}`}>
                          {courtCase.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedCase(courtCase)}
                        >
                          Prepare
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Selected Case Details */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Court Preparation - Lab {selectedCase.labNumber}</h2>
              <button className="close-btn" onClick={() => setSelectedCase(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="preparation-checklist">
                <h3>📋 Preparation Checklist</h3>
                
                <div className="checklist-section">
                  <h4>Evidence & Exhibits</h4>
                  {selectedCase.exhibits.map(exhibit => (
                    <div key={exhibit.id} className="checklist-item">
                      <input type="checkbox" checked={exhibit.sealed} readOnly />
                      <span>Sealed and Secured</span>
                      <input type="checkbox" checked={exhibit.photographed} readOnly />
                      <span>Photographed</span>
                      <input type="checkbox" checked={exhibit.chainOfCustodyVerified} readOnly />
                      <span>Chain of Custody Verified</span>
                      <div className="exhibit-desc">{exhibit.description}</div>
                    </div>
                  ))}
                </div>

                <div className="checklist-section">
                  <h4>Expert Witnesses</h4>
                  {selectedCase.witnesses.map((witness, idx) => (
                    <div key={idx} className="checklist-item">
                      <input type="checkbox" checked={witness.reportReady} readOnly />
                      <span>Report Ready</span>
                      <input type="checkbox" checked={witness.availableForCourt} readOnly />
                      <span>Available for Court</span>
                      <div className="witness-info">
                        {witness.name} - {witness.qualification}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checklist-section">
                  <h4>Documentation</h4>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>Chain of Custody Report Generated</span>
                  </div>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>Analysis Reports Compiled</span>
                  </div>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>Section 212 Affidavit Prepared</span>
                  </div>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>Exhibit List Finalized</span>
                  </div>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>Prosecutor Briefing Document</span>
                  </div>
                </div>

                <div className="checklist-section">
                  <h4>Compliance & Quality</h4>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>ISO 17025 Compliance Verified</span>
                  </div>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>SANAS Accreditation Current</span>
                  </div>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>Quality Review Completed</span>
                  </div>
                  <div className="checklist-item">
                    <input type="checkbox" />
                    <span>Legal Review Completed</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedCase(null)}>
                Cancel
              </button>
              <button className="btn btn-warning" onClick={generateSection212Affidavit}>
                Generate Section 212
              </button>
              <button className="btn btn-primary" onClick={generateCourtBundle}>
                Generate Court Bundle
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .preparation-checklist {
          padding: 1rem;
        }
        
        .checklist-section {
          margin-bottom: 2rem;
        }
        
        .checklist-section h4 {
          color: ${theme.colors.primary};
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid ${theme.colors.border};
        }
        
        .checklist-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          background: ${theme.colors.backgroundElevated};
          border-radius: 4px;
        }
        
        .checklist-item input[type="checkbox"] {
          width: 20px;
          height: 20px;
        }
        
        .exhibit-desc,
        .witness-info {
          margin-left: auto;
          font-weight: 600;
          color: ${theme.colors.textPrimary};
        }
        
        .modal {
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default CourtPreparation;