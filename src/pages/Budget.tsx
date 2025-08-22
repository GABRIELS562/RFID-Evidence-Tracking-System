import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Pages.css';

interface BudgetAllocation {
  id: string;
  unitName: string;
  fiscalYear: string;
  allocatedAmount: number;
  spentAmount: number;
  status: 'on-track' | 'over-budget' | 'under-budget';
  equipmentBudget: number;
  consumablesBudget: number;
  personnelBudget: number;
}

interface ResourceRequest {
  id: string;
  date: string;
  unit: string;
  requestType: 'equipment' | 'consumables' | 'personnel' | 'training';
  description: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  priority: 'high' | 'medium' | 'low';
}

const Budget: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'allocations' | 'requests' | 'reports'>('overview');
  const [selectedUnit, setSelectedUnit] = useState<BudgetAllocation | null>(null);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  const budgetAllocations: BudgetAllocation[] = [
    {
      id: 'BUD-2024-001',
      unitName: 'Biology Unit',
      fiscalYear: 'FY 2024',
      allocatedAmount: 850000,
      spentAmount: 623000,
      status: 'on-track',
      equipmentBudget: 300000,
      consumablesBudget: 350000,
      personnelBudget: 200000
    },
    {
      id: 'BUD-2024-002',
      unitName: 'Chemistry Unit',
      fiscalYear: 'FY 2024',
      allocatedAmount: 920000,
      spentAmount: 745000,
      status: 'on-track',
      equipmentBudget: 400000,
      consumablesBudget: 320000,
      personnelBudget: 200000
    },
    {
      id: 'BUD-2024-003',
      unitName: 'Ballistics Unit',
      fiscalYear: 'FY 2024',
      allocatedAmount: 680000,
      spentAmount: 512000,
      status: 'under-budget',
      equipmentBudget: 350000,
      consumablesBudget: 180000,
      personnelBudget: 150000
    },
    {
      id: 'BUD-2024-004',
      unitName: 'Questioned Documents Unit',
      fiscalYear: 'FY 2024',
      allocatedAmount: 450000,
      spentAmount: 389000,
      status: 'on-track',
      equipmentBudget: 200000,
      consumablesBudget: 100000,
      personnelBudget: 150000
    },
    {
      id: 'BUD-2024-005',
      unitName: 'Scientific Analysis Unit',
      fiscalYear: 'FY 2024',
      allocatedAmount: 1100000,
      spentAmount: 956000,
      status: 'on-track',
      equipmentBudget: 500000,
      consumablesBudget: 400000,
      personnelBudget: 200000
    }
  ];

  const resourceRequests: ResourceRequest[] = [
    {
      id: 'REQ-2024-089',
      date: '2024-01-10',
      unit: 'Biology Unit',
      requestType: 'equipment',
      description: 'DNA Sequencer - NextGen Model X500',
      amount: 125000,
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'REQ-2024-090',
      date: '2024-01-12',
      unit: 'Chemistry Unit',
      requestType: 'consumables',
      description: 'Lab reagents and testing kits (Q1 supply)',
      amount: 45000,
      status: 'approved',
      priority: 'medium'
    },
    {
      id: 'REQ-2024-091',
      date: '2024-01-14',
      unit: 'Ballistics Unit',
      requestType: 'equipment',
      description: 'Comparison Microscope upgrade',
      amount: 75000,
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'REQ-2024-092',
      date: '2024-01-15',
      unit: 'Scientific Analysis Unit',
      requestType: 'training',
      description: 'Advanced forensic analysis certification (5 staff)',
      amount: 25000,
      status: 'approved',
      priority: 'medium'
    }
  ];

  const totalBudget = budgetAllocations.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgetAllocations.reduce((sum, b) => sum + b.spentAmount, 0);
  const budgetUtilization = (totalSpent / totalBudget * 100).toFixed(1);

  return (
    <div className="page-container billing-page" data-theme={theme.mode}>
      <div className="page-header">
        <h1>Budget & Resource Management</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">
            Export Report
          </button>
          <button className="btn btn-primary" onClick={() => setShowNewRequestModal(true)}>
            New Resource Request
          </button>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'allocations' ? 'active' : ''}`}
          onClick={() => setActiveTab('allocations')}
        >
          Unit Allocations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Resource Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Budget Reports
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="billing-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Annual Budget</h3>
              <div className="stat-value">R{totalBudget.toLocaleString()}</div>
              <div className="stat-label">FY 2024</div>
            </div>
            <div className="stat-card">
              <h3>Budget Utilized</h3>
              <div className="stat-value">R{totalSpent.toLocaleString()}</div>
              <div className="stat-label">{budgetUtilization}% of annual budget</div>
            </div>
            <div className="stat-card">
              <h3>Pending Requests</h3>
              <div className="stat-value">{resourceRequests.filter(r => r.status === 'pending').length}</div>
              <div className="stat-label">Awaiting approval</div>
            </div>
            <div className="stat-card">
              <h3>Budget Remaining</h3>
              <div className="stat-value">R{(totalBudget - totalSpent).toLocaleString()}</div>
              <div className="stat-label">Available for allocation</div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Budget by Unit</h2>
            <div className="chart-container">
              {budgetAllocations.map(allocation => (
                <div key={allocation.id} className="budget-unit-bar">
                  <div className="unit-info">
                    <span className="unit-name">{allocation.unitName}</span>
                    <span className="unit-budget">R{allocation.allocatedAmount.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${allocation.status}`}
                      style={{ width: `${(allocation.spentAmount / allocation.allocatedAmount * 100)}%` }}
                    />
                  </div>
                  <div className="unit-status">
                    <span className={`status-badge ${allocation.status}`}>
                      {allocation.status.replace('-', ' ')}
                    </span>
                    <span className="percentage">
                      {((allocation.spentAmount / allocation.allocatedAmount) * 100).toFixed(1)}% used
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'allocations' && (
        <div className="allocations-list">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Unit Name</th>
                  <th>Fiscal Year</th>
                  <th>Allocated Budget</th>
                  <th>Spent Amount</th>
                  <th>Equipment</th>
                  <th>Consumables</th>
                  <th>Personnel</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgetAllocations.map(allocation => (
                  <tr key={allocation.id}>
                    <td>{allocation.unitName}</td>
                    <td>{allocation.fiscalYear}</td>
                    <td>R{allocation.allocatedAmount.toLocaleString()}</td>
                    <td>R{allocation.spentAmount.toLocaleString()}</td>
                    <td>R{allocation.equipmentBudget.toLocaleString()}</td>
                    <td>R{allocation.consumablesBudget.toLocaleString()}</td>
                    <td>R{allocation.personnelBudget.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${allocation.status}`}>
                        {allocation.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-small"
                        onClick={() => setSelectedUnit(allocation)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="requests-list">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Date</th>
                  <th>Unit</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resourceRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.date}</td>
                    <td>{request.unit}</td>
                    <td>
                      <span className="type-badge">{request.requestType}</span>
                    </td>
                    <td>{request.description}</td>
                    <td>R{request.amount.toLocaleString()}</td>
                    <td>
                      <span className={`priority-badge ${request.priority}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${request.status}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-small">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="reports-section">
          <div className="report-options">
            <h2>Generate Budget Reports</h2>
            <div className="report-grid">
              <div className="report-card">
                <h3>Quarterly Budget Report</h3>
                <p>Comprehensive budget analysis for Q4 2023</p>
                <button className="btn btn-secondary">Generate Report</button>
              </div>
              <div className="report-card">
                <h3>Unit Expenditure Analysis</h3>
                <p>Detailed breakdown by forensic unit</p>
                <button className="btn btn-secondary">Generate Report</button>
              </div>
              <div className="report-card">
                <h3>Resource Utilization</h3>
                <p>Equipment and consumables usage patterns</p>
                <button className="btn btn-secondary">Generate Report</button>
              </div>
              <div className="report-card">
                <h3>Annual Budget Forecast</h3>
                <p>Projected budget needs for FY 2025</p>
                <button className="btn btn-secondary">Generate Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;