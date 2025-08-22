import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Pages.css';
import { logger } from '../utils/browserLogger';
import { 
  Scan, Search, Package, Archive, AlertCircle, Clock, MapPin, 
  Wifi, WifiOff, Battery, Radio, CheckCircle, XCircle, RefreshCw, 
  ClipboardList, User, Navigation, ChevronRight, BellRing, Zap, 
  Activity, FileSearch, LogIn, LogOut
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactElement;
  color: string;
  action: () => void;
}

interface PendingTask {
  id: string;
  type: 'retrieval' | 'storage' | 'audit' | 'transfer';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  location: string;
  dueTime: Date;
  status: 'pending' | 'in_progress' | 'completed';
}

interface OfflineData {
  scans: Array<{
    tagId: string;
    timestamp: Date;
    location: string | { lat: number; lng: number } | null;
    action: string;
  }>;
  tasks: PendingTask[];
  lastSync: Date;
}

const MobileFieldOps: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  
  // State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<PendingTask | null>(null);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    scans: [],
    tasks: [],
    lastSync: new Date()
  });

  // Mobile-specific state
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<GeolocationPosition | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(100);

  useEffect(() => {
    loadUserData();
    loadPendingTasks();
    checkOfflineData();
    requestLocationPermission();
    monitorBattery();
    
    // Monitor online/offline status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.data);
      }
    } catch (error) {
      logger.error('Error loading user data:', error);
    }
  };

  const loadPendingTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/mobile/tasks/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPendingTasks(data.data);
        // Cache for offline
        localStorage.setItem('mobile_tasks', JSON.stringify(data.data));
      }
    } catch (error) {
      // Load from cache if offline
      const cached = localStorage.getItem('mobile_tasks');
      if (cached) {
        setPendingTasks(JSON.parse(cached));
      }
    }
  };

  const checkOfflineData = () => {
    const stored = localStorage.getItem('offline_data');
    if (stored) {
      setOfflineData(JSON.parse(stored));
    }
  };

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setGpsLocation(position),
        (error) => {
          // Provide fallback location for demo (Johannesburg, South Africa)
          console.log('Using fallback location for demo mode');
          setGpsLocation({
            coords: {
              latitude: -26.2041,
              longitude: 28.0473,
              accuracy: 100,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null
            },
            timestamp: Date.now()
          } as GeolocationPosition);
        },
        { enableHighAccuracy: true }
      );
      
      // Watch position for real-time updates
      navigator.geolocation.watchPosition(
        (position) => setGpsLocation(position),
        (error) => {
          // Silently handle location watch errors in demo mode
          console.log('Location watch not available, using static location');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const monitorBattery = async () => {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      setBatteryLevel(Math.round(battery.level * 100));
      
      battery.addEventListener('levelchange', () => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  };

  const handleOnline = () => {
    setOfflineMode(false);
    syncOfflineData();
  };

  const handleOffline = () => {
    setOfflineMode(true);
  };

  const syncOfflineData = async () => {
    if (offlineData.scans.length === 0) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/mobile/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offlineData)
      });
      
      if (response.ok) {
        // Clear offline data after successful sync
        setOfflineData({
          scans: [],
          tasks: [],
          lastSync: new Date()
        });
        localStorage.removeItem('offline_data');
      }
    } catch (error) {
      logger.error('Sync failed:', error);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setScanResult(null);
    
    try {
      // Simulate RFID scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock scan result
      const mockTagId = `TAG${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const scanData = {
        tagId: mockTagId,
        timestamp: new Date(),
        location: gpsLocation ? {
          lat: gpsLocation.coords.latitude,
          lng: gpsLocation.coords.longitude
        } : null,
        signalStrength: Math.floor(Math.random() * 100)
      };
      
      if (offlineMode) {
        // Store offline
        const updatedOfflineData = {
          ...offlineData,
          scans: [...offlineData.scans, {
            ...scanData,
            action: 'scan',
            location: scanData.location || 'offline'
          }]
        };
        setOfflineData(updatedOfflineData);
        localStorage.setItem('offline_data', JSON.stringify(updatedOfflineData));
        
        setScanResult({
          success: true,
          data: scanData,
          offline: true
        });
      } else {
        // Send to server
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/rfid/scan', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(scanData)
        });
        
        if (response.ok) {
          setScanResult({
            success: true,
            data: scanData
          });
          
          // Add to recent scans
          setRecentScans(prev => [scanData, ...prev].slice(0, 10));
        } else {
          throw new Error('Scan failed');
        }
      }
    } catch (error) {
      setScanResult({
        success: false,
        error: 'Scan failed. Please try again.'
      });
    } finally {
      setScanning(false);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/mobile/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setPendingTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (error) {
      logger.error('Error completing task:', error);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'scan',
      title: 'Quick Scan',
      icon: <Radio size={32} />,
      color: theme.colors.primary,
      action: handleScan
    },
    {
      id: 'search',
      title: 'Find Docket',
      icon: <FileSearch size={32} />,
      color: theme.colors.info,
      action: () => logger.info('Search')
    },
    {
      id: 'checkin',
      title: 'Check In',
      icon: <LogIn size={32} />,
      color: theme.colors.success,
      action: () => logger.info('Check in')
    },
    {
      id: 'checkout',
      title: 'Check Out',
      icon: <LogOut size={32} />,
      color: theme.colors.warning,
      action: () => logger.info('Check out')
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return theme.colors.error;
      case 'high': return theme.colors.warning;
      case 'medium': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
  };

  const getBatteryIcon = () => {
    return <Battery className="battery-icon" style={{ 
      fill: batteryLevel > 40 ? 'currentColor' : '#ef4444',
      width: '20px',
      height: '20px'
    }} />;
  };

  // Apply inline styles for immediate visual improvement
  const cardStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '600',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="mobile-container" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Mobile Header */}
      <div className="mobile-header" style={cardStyle}>
        <div className="header-top">
          <h1 className="mobile-title" style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>Field Operations</h1>
          <div className="status-indicators" style={{ display: 'flex', gap: '15px', color: 'white' }}>
            {offlineMode && (
              <span className="offline-indicator" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <WifiOff size={16} /> Offline
              </span>
            )}
            <span className="battery-indicator" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {getBatteryIcon()} {batteryLevel}%
            </span>
          </div>
        </div>
        
        {currentUser && (
          <div className="user-info-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px', color: 'white' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={16} /> {currentUser.full_name}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={16} /> {currentUser.department}
            </span>
            {gpsLocation && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Navigation size={16} /> Location Active
              </span>
            )}
          </div>
        )}
      </div>

      {/* Offline Mode Banner */}
      {offlineMode && (
        <div className="alert alert-warning" style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <strong>Offline Mode</strong> - {offlineData.scans.length} scans pending sync
          <button 
            className="btn btn-sm btn-outline"
            onClick={syncOfflineData}
            style={{ 
              marginLeft: '1rem',
              background: 'white',
              color: '#f59e0b',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sync Now
          </button>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="quick-actions-section" style={{ marginBottom: '30px' }}>
        <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '15px' }}>Quick Actions</h2>
        <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          {quickActions.map(action => (
            <button
              key={action.id}
              className="quick-action-btn"
              onClick={action.action}
              style={{ 
                background: 'white',
                border: `2px solid ${action.color}`,
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <span className="action-icon" style={{ 
                color: action.color,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {action.icon}
              </span>
              <span className="action-title" style={{ fontWeight: '600', fontSize: '0.9rem' }}>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scanner Section */}
      <div className="scanner-section" style={{ marginBottom: '30px' }}>
        <div className="scanner-card" style={{
          background: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px' }}>RFID Scanner</h3>
          <div className="scanner-display" style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '20px',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {scanning ? (
              <div className="scanning-animation">
                <Radio size={48} color="#2563eb" style={{ animation: 'pulse 2s infinite' }} />
                <p style={{ marginTop: '10px', color: '#64748b' }}>Scanning...</p>
              </div>
            ) : scanResult ? (
              <div className={`scan-result ${scanResult.success ? 'success' : 'error'}`}>
                {scanResult.success ? (
                  <>
                    <CheckCircle size={48} color="#10b981" style={{ marginBottom: '10px' }} />
                    <p style={{ fontWeight: '600' }}>Tag: {scanResult.data?.tagId}</p>
                    {scanResult.offline && <p className="offline-note" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Saved for sync</p>}
                  </>
                ) : (
                  <>
                    <XCircle size={48} color="#ef4444" style={{ marginBottom: '10px' }} />
                    <p style={{ color: '#ef4444' }}>{scanResult.error}</p>
                  </>
                )}
              </div>
            ) : (
              <div className="scanner-ready">
                <Radio size={48} color="#2563eb" style={{ marginBottom: '10px' }} />
                <p style={{ color: '#64748b' }}>Ready to scan</p>
              </div>
            )}
          </div>
          <button 
            className="btn btn-primary btn-large"
            onClick={handleScan}
            disabled={scanning}
            style={{
              ...buttonStyle,
              width: '100%',
              opacity: scanning ? 0.7 : 1,
              cursor: scanning ? 'not-allowed' : 'pointer'
            }}
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="tasks-section" style={{ marginBottom: '30px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Pending Tasks ({pendingTasks.length})</h2>
          <button 
            className="btn btn-sm btn-outline" 
            onClick={loadPendingTasks} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              background: 'white',
              border: '2px solid #2563eb',
              color: '#2563eb',
              borderRadius: '6px',
              padding: '8px 16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
        
        <div className="task-list">
          {pendingTasks.length === 0 ? (
            <div className="empty-state" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <ClipboardList size={48} color="#94a3b8" style={{ marginBottom: '10px' }} />
              <p style={{ color: '#94a3b8' }}>No pending tasks</p>
            </div>
          ) : (
            pendingTasks.map(task => (
              <div 
                key={task.id}
                className="task-card"
                onClick={() => setSelectedTask(task)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '15px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="task-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span 
                    className="task-priority"
                    style={{ 
                      color: getPriorityColor(task.priority),
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="task-type" style={{ 
                    background: '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}>{task.type}</span>
                </div>
                <h4 className="task-title" style={{ marginBottom: '10px', fontWeight: '600' }}>{task.title}</h4>
                <div className="task-details" style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} /> {task.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {new Date(task.dueTime).toLocaleTimeString()}
                  </span>
                </div>
                {task.status === 'in_progress' && (
                  <div className="task-progress" style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>In Progress...</div>
                )}
                <div className="task-actions" style={{ marginTop: '15px' }}>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      completeTask(task.id);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Scans */}
      <div className="recent-scans-section" style={{
        background: 'white',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px' }}>Recent Scans</h2>
        <div className="scan-history">
          {recentScans.length === 0 ? (
            <p className="no-scans" style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No recent scans</p>
          ) : (
            recentScans.map((scan, idx) => (
              <div key={idx} className="scan-item" style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span className="scan-tag" style={{ fontWeight: '600' }}>{scan.tagId}</span>
                <span className="scan-time" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {new Date(scan.timestamp).toLocaleTimeString()}
                </span>
                {scan.location && (
                  <span className="scan-location" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.9rem' }}>
                    <MapPin size={12} /> Scanned
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button for Quick Scan */}
      <button
        className="fab"
        onClick={handleScan}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        <Radio size={28} />
      </button>
    </div>
  );
};

export default MobileFieldOps;