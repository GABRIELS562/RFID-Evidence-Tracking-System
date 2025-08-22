import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import showcase pages - we'll use the ones that exist
import RFIDTracking from './pages/RFIDTracking';
import RFIDLiveTracking from './pages/RFIDLiveTracking';
import AdvancedVisualization from './pages/AdvancedVisualization';
import StorageManagement from './pages/StorageManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

// Import mock data service
import mockAPI from './services/mockDataService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      mockAPI.getDashboardStats().then(stats => {
        setDashboardStats(stats);
        setIsLoading(false);
      });
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="loading-spinner"></div>
        <h2 style={{ color: 'white', marginTop: '20px' }}>RFID Evidence Tracking System</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Loading demonstration...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          color: 'white'
        }}>
          <div className="header-content">
            <h1>🔍 RFID Evidence Tracking System</h1>
            <p className="subtitle">Forensic Lab Management Solution - Demo Version</p>
          </div>
          <nav className="main-nav" style={{
            display: 'flex',
            gap: '20px',
            marginTop: '20px'
          }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/rfid-live" style={{ color: 'white', textDecoration: 'none' }}>Live Tracking</Link>
            <Link to="/visualization" style={{ color: 'white', textDecoration: 'none' }}>3D Visualization</Link>
            <Link to="/storage" style={{ color: 'white', textDecoration: 'none' }}>Storage</Link>
            <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics</Link>
          </nav>
        </header>

        <div className="app-banner" style={{
          background: '#f7f8fc',
          padding: '20px'
        }}>
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div className="stat-card" style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <span className="stat-value" style={{ fontSize: '2em', fontWeight: 'bold' }}>
                {dashboardStats?.totalEvidence || 0}
              </span>
              <span className="stat-label" style={{ display: 'block', color: '#666' }}>
                Total Evidence Items
              </span>
            </div>
            <div className="stat-card" style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <span className="stat-value" style={{ fontSize: '2em', fontWeight: 'bold' }}>
                {dashboardStats?.activeProcessing || 0}
              </span>
              <span className="stat-label" style={{ display: 'block', color: '#666' }}>
                Active Processing
              </span>
            </div>
            <div className="stat-card" style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <span className="stat-value" style={{ fontSize: '2em', fontWeight: 'bold' }}>
                {dashboardStats?.chainOfCustodyEvents || 0}
              </span>
              <span className="stat-label" style={{ display: 'block', color: '#666' }}>
                Chain of Custody Events
              </span>
            </div>
            <div className="stat-card" style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <span className="stat-value" style={{ fontSize: '2em', fontWeight: 'bold' }}>
                {dashboardStats?.systemUptime || '0%'}
              </span>
              <span className="stat-label" style={{ display: 'block', color: '#666' }}>
                System Uptime
              </span>
            </div>
          </div>
        </div>

        <main className="app-main" style={{ padding: '20px', minHeight: '60vh' }}>
          <Routes>
            <Route path="/" element={<DashboardHome stats={dashboardStats} />} />
            <Route path="/rfid-live" element={<RFIDLiveTracking />} />
            <Route path="/rfid" element={<RFIDTracking />} />
            <Route path="/visualization" element={<AdvancedVisualization />} />
            <Route path="/storage" element={<StorageManagement />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </main>

        <footer className="app-footer" style={{
          background: '#2d3748',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p>© 2024 RFID Evidence Tracking System - Portfolio Demonstration</p>
          <p className="disclaimer" style={{ fontSize: '0.9em', opacity: 0.8 }}>
            This is a demonstration version showcasing UI/UX capabilities. 
            No real data or sensitive information is displayed.
          </p>
        </footer>
      </div>
    </Router>
  );
};

// Simple dashboard home component
const DashboardHome: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="dashboard-home">
      <h2>System Overview</h2>
      
      <div className="feature-cards" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div className="feature-card" style={{
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>🏛️ Problem We Solve</h3>
          <p>
            Forensic laboratories handle thousands of evidence items daily. 
            Manual tracking leads to lost evidence, broken chain of custody, 
            and delayed case processing.
          </p>
        </div>
        
        <div className="feature-card" style={{
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>💡 Our Solution</h3>
          <p>
            RFID-based real-time tracking system that automatically monitors 
            evidence location, maintains chain of custody, and provides 
            instant alerts for unauthorized movements.
          </p>
        </div>
        
        <div className="feature-card" style={{
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>🎯 Key Benefits</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>100% evidence accountability</li>
            <li>Automated chain of custody</li>
            <li>Real-time location tracking</li>
            <li>Compliance with ISO 17025</li>
            <li>30% reduction in processing time</li>
          </ul>
        </div>
      </div>

      <div className="tech-stack" style={{
        marginTop: '40px',
        padding: '30px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>Technology Stack</h3>
        <div className="tech-badges" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '20px'
        }}>
          <span className="tech-badge" style={{
            background: '#667eea',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>React</span>
          <span className="tech-badge" style={{
            background: '#667eea',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>TypeScript</span>
          <span className="tech-badge" style={{
            background: '#667eea',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>Three.js</span>
          <span className="tech-badge" style={{
            background: '#667eea',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>D3.js</span>
          <span className="tech-badge" style={{
            background: '#667eea',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>RFID Integration</span>
          <span className="tech-badge" style={{
            background: '#667eea',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>Real-time WebSockets</span>
          <span className="tech-badge" style={{
            background: '#667eea',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>Node.js</span>
          <span className="tech-badge" style={{
            background: '#667eea',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>PostgreSQL</span>
        </div>
      </div>

      <div className="demo-notice" style={{
        marginTop: '40px',
        padding: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '10px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3>📱 Interactive Demo</h3>
        <p>
          Navigate through the menu to explore different features of the system. 
          All data shown is simulated for demonstration purposes.
        </p>
        <div className="demo-buttons" style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <Link to="/rfid-live" style={{
            background: 'white',
            color: '#667eea',
            padding: '10px 30px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            View Live Tracking
          </Link>
          <Link to="/visualization" style={{
            border: '2px solid white',
            color: 'white',
            padding: '10px 30px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Explore 3D Lab
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;