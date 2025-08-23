import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import './styles/enhanced.css';

// Import ThemeProvider and context
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';

// Import enhanced components
import EvidenceTrackingDashboard from './components/EvidenceTrackingDashboard';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent, StatCard } from './components/ui/EnhancedCard';
import LoadingScreen from './components/LoadingScreen';
import NotificationSystem from './components/NotificationSystem';

// Import showcase pages - we'll use the ones that exist
import RFIDTracking from './pages/RFIDTracking';
import RFIDLiveTracking from './pages/RFIDLiveTracking';
import AdvancedVisualization from './pages/AdvancedVisualization';
import StorageManagement from './pages/StorageManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

// Import mock data service
import mockAPI from './services/mockDataService';

const AppContent: React.FC = () => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  const toggleTheme = context?.toggleTheme || (() => {});
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
    return <LoadingScreen />;
  }

  return (
      <Router>
        <NotificationSystem />
        <div className={`app ${theme}`} style={{
          minHeight: '100vh',
          background: theme === 'dark' ? '#0f172a' : '#f8fafc',
          transition: 'all 0.3s ease'
        }}>
          <div className="animated-bg" />
          <header className="app-header glass-card" style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
            backdropFilter: 'blur(10px)',
            padding: '24px',
            color: 'white',
            borderRadius: 0,
            position: 'relative',
            overflow: 'hidden'
          }}>
          <div className="header-content" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '8px',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>RFID-ETS Evidence Management System</h1>
              <p className="subtitle" style={{
                fontSize: '1.125rem',
                opacity: 0.95
              }}>Forensic Laboratory Information Management System - ISO 17025 Compliant</p>
            </div>
            <button
              onClick={toggleTheme}
              className="btn-primary"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid white',
                padding: '10px 20px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '1.125rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
          </div>
          <nav className="main-nav" style={{
            display: 'flex',
            gap: '8px',
            marginTop: '24px',
            flexWrap: 'wrap'
          }}>
            {[
              { path: '/', label: 'Dashboard', icon: 'DASH' },
              { path: '/evidence-tracking', label: 'Evidence Management', icon: 'EVID' },
              { path: '/rfid-live', label: 'Live Monitoring', icon: 'LIVE' },
              { path: '/visualization', label: 'Laboratory View', icon: '3D' },
              { path: '/storage', label: 'Storage Units', icon: 'STOR' },
              { path: '/analytics', label: 'Analytics', icon: 'ANLZ' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-link"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  padding: '2px 6px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px'
                }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </header>

        <div className="app-banner" style={{
          padding: '32px 24px',
          background: 'transparent'
        }}>
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <StatCard 
              title="Total Evidence Items" 
              value={dashboardStats?.totalEvidence || '1,247'}
              change={12.5}
              icon="ITEMS"
              color="primary"
            />
            <StatCard 
              title="Active Processing" 
              value={dashboardStats?.activeProcessing || '387'}
              change={-5.2}
              icon="PROC"
              color="warning"
            />
            <StatCard 
              title="Chain Verified" 
              value={dashboardStats?.chainOfCustodyEvents || '98.7%'}
              change={2.1}
              icon="VRFD"
              color="success"
            />
            <StatCard 
              title="System Uptime" 
              value={dashboardStats?.systemUptime || '99.9%'}
              change={0.1}
              icon="UPTIME"
              color="success"
            />
          </div>
        </div>

        <main className="app-main fade-in" style={{ 
          padding: '0 24px 24px',
          minHeight: '60vh'
        }}>
          <Routes>
            <Route path="/" element={<DashboardHome stats={dashboardStats} />} />
            <Route path="/evidence-tracking" element={<EvidenceTrackingDashboard />} />
            <Route path="/rfid-live" element={<RFIDLiveTracking />} />
            <Route path="/rfid" element={<RFIDTracking />} />
            <Route path="/visualization" element={<AdvancedVisualization />} />
            <Route path="/storage" element={<StorageManagement />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </main>

        <footer className="app-footer glass-card" style={{
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))'
            : 'linear-gradient(135deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.95))',
          color: 'white',
          padding: '32px',
          textAlign: 'center',
          borderRadius: 0,
          marginTop: '48px'
        }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
            © 2024 RFID Evidence Tracking System - Professional Showcase
          </p>
          <p className="disclaimer" style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            Advanced demonstration showcasing enterprise-grade evidence tracking capabilities.
            All data is simulated for demonstration purposes.
          </p>
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{ opacity: 0.8 }}>✓ ISO 17025 Compliant</span>
            <span style={{ opacity: 0.8 }}>✓ Secure Chain of Custody</span>
            <span style={{ opacity: 0.8 }}>✓ Real-time Analytics</span>
            <span style={{ opacity: 0.8 }}>✓ Cloud-Ready Architecture</span>
          </div>
        </footer>
      </div>
    </Router>
  );
};

// Enhanced dashboard home component
const DashboardHome: React.FC<{ stats: any }> = ({ stats }) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  
  return (
    <div className="dashboard-home fade-in">
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '32px'
      }}>System Overview</h2>
      
      <div className="feature-cards" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginTop: '32px'
      }}>
        <EnhancedCard variant="glass" hover animated>
          <EnhancedCardContent>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
            }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ef4444',
                display: 'inline-block',
                animation: 'pulse 2s infinite'
              }}>ISSUE</span>
              Laboratory Challenge
            </h3>
            <p style={{
              lineHeight: '1.8',
              color: theme === 'dark' ? '#cbd5e1' : '#475569',
              fontSize: '1.0625rem'
            }}>
              Forensic laboratories handle thousands of evidence items daily. 
              Manual tracking leads to <strong style={{ color: '#ef4444' }}>lost evidence</strong>, 
              <strong style={{ color: '#ef4444' }}> broken chain of custody</strong>, 
              and <strong style={{ color: '#ef4444' }}>delayed case processing</strong>.
            </p>
          </EnhancedCardContent>
        </EnhancedCard>
        
        <EnhancedCard variant="glass" hover animated>
          <EnhancedCardContent>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
            }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#10b981',
                display: 'inline-block',
                animation: 'pulse 2s infinite'
              }}>SOLUTION</span>
              Technical Approach
            </h3>
            <p style={{
              lineHeight: '1.8',
              color: theme === 'dark' ? '#cbd5e1' : '#475569',
              fontSize: '1.0625rem'
            }}>
              <strong style={{ color: '#667eea' }}>RFID-based real-time tracking</strong> system that 
              automatically monitors evidence location, maintains 
              <strong style={{ color: '#667eea' }}> chain of custody</strong>, and provides 
              <strong style={{ color: '#667eea' }}> instant alerts</strong> for unauthorized movements.
            </p>
          </EnhancedCardContent>
        </EnhancedCard>
        
        <EnhancedCard variant="glass" hover animated>
          <EnhancedCardContent>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
            }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#667eea',
                display: 'inline-block',
                animation: 'pulse 2s infinite'
              }}>BENEFITS</span>
              Performance Metrics
            </h3>
            <ul style={{ 
              paddingLeft: '24px',
              lineHeight: '2',
              color: theme === 'dark' ? '#cbd5e1' : '#475569',
              fontSize: '1.0625rem'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#10b981' }}>✓</strong> 100% evidence accountability
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#10b981' }}>✓</strong> Automated chain of custody
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#10b981' }}>✓</strong> Real-time location tracking
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#10b981' }}>✓</strong> Compliance with ISO 17025
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#10b981' }}>✓</strong> 30% reduction in processing time
              </li>
            </ul>
          </EnhancedCardContent>
        </EnhancedCard>
      </div>

      <EnhancedCard variant="gradient" style={{ marginTop: '48px' }}>
        <EnhancedCardContent>
          <h3 style={{
            fontSize: '1.75rem',
            marginBottom: '24px',
            color: 'white',
            fontWeight: '700'
          }}>TECH Technology Infrastructure</h3>
          <div className="tech-badges" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {[
              { name: 'React 18', icon: 'R18' },
              { name: 'TypeScript', icon: 'TS' },
              { name: 'Three.js', icon: '3JS' },
              { name: 'D3.js', icon: 'D3' },
              { name: 'RFID Integration', icon: 'RFID' },
              { name: 'WebSockets', icon: 'WS' },
              { name: 'Node.js', icon: 'NODE' },
              { name: 'PostgreSQL', icon: 'PSQL' }
            ].map((tech, index) => (
              <span 
                key={tech.name}
                className="tech-badge" 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <span>{tech.icon}</span>
                <span>{tech.name}</span>
              </span>
            ))}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard 
        variant="neumorphic" 
        style={{ 
          marginTop: '48px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }} />
        <EnhancedCardContent style={{ position: 'relative', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '2rem',
            color: 'white',
            marginBottom: '16px',
            fontWeight: '700',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>Advanced Evidence Management Platform</h3>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Professional evidence tracking system designed for accredited forensic laboratories.
            All features comply with ISO 17025 and chain of custody requirements.
          </p>
          <div className="demo-buttons" style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/evidence-tracking" 
              className="btn-primary"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                padding: '14px 32px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.0625rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                background: 'rgba(255, 255, 255, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>MGMT</span>
              Evidence Management
            </Link>
            <Link 
              to="/rfid-live" 
              style={{
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.0625rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                background: 'rgba(255, 255, 255, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>LIVE</span>
              Real-time Monitoring
            </Link>
            <Link 
              to="/visualization" 
              style={{
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.0625rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                background: 'rgba(255, 255, 255, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>3D</span>
              Laboratory Visualization
            </Link>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;