import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Pages.css';

interface SavingsMetric {
  category: string;
  currentCost: number;
  projectedCost: number;
  savings: number;
  savingsPercent: number;
  description: string;
}

const CostSavingsCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState<SavingsMetric[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [roiMonths, setRoiMonths] = useState(0);
  
  useEffect(() => {
    calculateSavings();
  }, []);

  const calculateSavings = () => {
    const savingsData: SavingsMetric[] = [
      {
        category: 'Evidence Loss Prevention',
        currentCost: 450000, // Annual cost of lost evidence
        projectedCost: 15000, // With RFID tracking
        savings: 435000,
        savingsPercent: 96.7,
        description: 'Reduction in lost or misplaced evidence through RFID tracking'
      },
      {
        category: 'Manual Process Reduction',
        currentCost: 1200000, // Staff time on manual tracking
        projectedCost: 240000, // Automated processes
        savings: 960000,
        savingsPercent: 80,
        description: '80% reduction in time spent on manual evidence logging and tracking'
      },
      {
        category: 'Court Case Delays',
        currentCost: 800000, // Cost of delays due to missing evidence
        projectedCost: 80000,
        savings: 720000,
        savingsPercent: 90,
        description: 'Faster evidence retrieval reduces court postponements'
      },
      {
        category: 'Compliance Penalties',
        currentCost: 350000, // ISO 17025 non-compliance risks
        projectedCost: 0,
        savings: 350000,
        savingsPercent: 100,
        description: 'Automated compliance tracking eliminates accreditation risks'
      },
      {
        category: 'Paper & Storage',
        currentCost: 180000, // Physical paperwork and storage
        projectedCost: 36000,
        savings: 144000,
        savingsPercent: 80,
        description: 'Digital documentation reduces paper and physical storage needs'
      },
      {
        category: 'Overtime Costs',
        currentCost: 420000, // Staff overtime for backlogs
        projectedCost: 84000,
        savings: 336000,
        savingsPercent: 80,
        description: 'Efficiency gains reduce overtime requirements'
      },
      {
        category: 'Training & Errors',
        currentCost: 250000, // Training and error correction
        projectedCost: 50000,
        savings: 200000,
        savingsPercent: 80,
        description: 'Intuitive system reduces training time and human errors'
      }
    ];

    setMetrics(savingsData);
    const total = savingsData.reduce((sum, metric) => sum + metric.savings, 0);
    setTotalSavings(total);
    
    // Calculate ROI period (system cost ~R1.5M)
    const systemCost = 1500000;
    const monthlySavings = total / 12;
    setRoiMonths(Math.ceil(systemCost / monthlySavings));
  };

  const formatCurrency = (amount: number) => {
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Cost Savings Analysis</h1>
        <p className="page-subtitle">ForensiTrack RFID Evidence Management System - Return on Investment</p>
      </div>

      {/* Executive Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Annual Savings</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{formatCurrency(totalSavings)}</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Per Year</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Return on Investment</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{roiMonths} Months</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Payback Period</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>5-Year Total Savings</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{formatCurrency(totalSavings * 5)}</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Projected</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Efficiency Gain</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>82%</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Average Improvement</div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="card">
        <div className="card-header">
          <h2>Cost Savings Breakdown</h2>
          <button className="btn btn-primary" onClick={() => window.print()}>
            📊 Export Report
          </button>
        </div>
        <div className="card-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Current Annual Cost</th>
                <th>With ForensiTrack</th>
                <th>Annual Savings</th>
                <th>Reduction</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, idx) => (
                <tr key={idx}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600' }}>{metric.category}</div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>
                        {metric.description}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: theme.colors.error }}>{formatCurrency(metric.currentCost)}</td>
                  <td style={{ color: theme.colors.success }}>{formatCurrency(metric.projectedCost)}</td>
                  <td style={{ fontWeight: '600', color: theme.colors.primary }}>
                    {formatCurrency(metric.savings)}
                  </td>
                  <td>
                    <div style={{
                      background: `linear-gradient(90deg, ${theme.colors.success} ${metric.savingsPercent}%, ${theme.colors.backgroundElevated} ${metric.savingsPercent}%)`,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      {metric.savingsPercent}%
                    </div>
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', fontSize: '1.125rem', background: theme.colors.backgroundElevated }}>
                <td>TOTAL</td>
                <td style={{ color: theme.colors.error }}>
                  {formatCurrency(metrics.reduce((sum, m) => sum + m.currentCost, 0))}
                </td>
                <td style={{ color: theme.colors.success }}>
                  {formatCurrency(metrics.reduce((sum, m) => sum + m.projectedCost, 0))}
                </td>
                <td style={{ color: theme.colors.primary }}>{formatCurrency(totalSavings)}</td>
                <td>
                  {Math.round((totalSavings / metrics.reduce((sum, m) => sum + m.currentCost, 0)) * 100)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Benefits */}
      <div className="card">
        <div className="card-header">
          <h2>Additional Non-Monetary Benefits</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: theme.colors.backgroundElevated, borderRadius: '8px' }}>
              <h3 style={{ color: theme.colors.primary, marginBottom: '0.5rem' }}>⚖️ Improved Justice Delivery</h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Faster case resolution</li>
                <li>Higher conviction rates</li>
                <li>Reduced case backlogs</li>
                <li>Better victim support</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: theme.colors.backgroundElevated, borderRadius: '8px' }}>
              <h3 style={{ color: theme.colors.primary, marginBottom: '0.5rem' }}>🏆 Enhanced Reputation</h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>SANAS accreditation maintained</li>
                <li>International best practices</li>
                <li>Public trust increased</li>
                <li>Professional recognition</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: theme.colors.backgroundElevated, borderRadius: '8px' }}>
              <h3 style={{ color: theme.colors.primary, marginBottom: '0.5rem' }}>👥 Staff Satisfaction</h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Reduced workload stress</li>
                <li>Focus on core forensics work</li>
                <li>Professional development</li>
                <li>Modern work environment</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: theme.colors.backgroundElevated, borderRadius: '8px' }}>
              <h3 style={{ color: theme.colors.primary, marginBottom: '0.5rem' }}>📊 Data-Driven Decisions</h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Real-time analytics</li>
                <li>Performance metrics</li>
                <li>Resource optimization</li>
                <li>Predictive planning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Timeline */}
      <div className="card">
        <div className="card-header">
          <h2>Implementation & Savings Timeline</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto' }}>
            {[
              { month: 'Month 1-2', phase: 'Setup & Training', savings: 0 },
              { month: 'Month 3-4', phase: 'Pilot Deployment', savings: 50000 },
              { month: 'Month 5-6', phase: 'Full Rollout', savings: 150000 },
              { month: 'Month 7-12', phase: 'Optimization', savings: 600000 },
              { month: 'Year 2', phase: 'Full Benefits', savings: totalSavings },
              { month: 'Year 3-5', phase: 'Sustained Savings', savings: totalSavings * 3 }
            ].map((phase, idx) => (
              <div key={idx} style={{
                minWidth: '150px',
                padding: '1rem',
                background: theme.colors.backgroundElevated,
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontWeight: '600', color: theme.colors.primary }}>{phase.month}</div>
                <div style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>{phase.phase}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.colors.success }}>
                  {formatCurrency(phase.savings)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSavingsCalculator;