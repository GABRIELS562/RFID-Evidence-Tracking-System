import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import io, { Socket } from 'socket.io-client';
import './Pages.css';
import { logger } from '../utils/browserLogger';
import { buildApiUrl, WS_URL } from '../config/api';
import TopViewWarehouse from '../components/TopViewWarehouse';
import Enhanced3DView from '../components/Simple3DView';
import ForensicLab3D from '../components/ForensicLab3D';
import ForensicLab2D from '../components/ForensicLab2D';

interface TrackingSession {
  sessionId: string;
  docketId: number;
  docketCode?: string;
  tagId: string;
  startTime: Date;
  lastSeen: Date;
  currentLocation: string;
  path: Array<{
    location: string;
    timestamp: Date;
    signalStrength: number;
  }>;
  status: string;
  alerts: any[];
}

interface RFIDAlert {
  id: string;
  type: string;
  severity: string;
  tagId: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface LiveTag {
  tagId: string;
  location: string;
  signalStrength: number;
  lastSeen: Date;
  coordinates?: { x: number; y: number; z: number };
}

const RFIDLiveTracking: React.FC = () => {
  const { theme } = useTheme();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // State
  const [activeSessions, setActiveSessions] = useState<TrackingSession[]>([]);
  const [alerts, setAlerts] = useState<RFIDAlert[]>([]);
  const [liveTags, setLiveTags] = useState<Map<string, LiveTag>>(new Map());
  const [selectedSession, setSelectedSession] = useState<TrackingSession | null>(null);
  const [searchTag, setSearchTag] = useState('');
  const [tracking, setTracking] = useState(false);
  
  // Map visualization
  const [mapView, setMapView] = useState<'forensic-2d' | 'forensic-3d' | 'warehouse-2d' | 'warehouse-3d'>('forensic-2d');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 500, y: 300 });

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io(WS_URL, {
      auth: {
        token: localStorage.getItem('authToken')
      }
    });

    newSocket.on('connect', () => {
      logger.info('Connected to RFID tracking server');
      setConnected(true);
      
      // Subscribe to channels
      newSocket.emit('subscribe:rfid', { locationId: 'all' });
      newSocket.emit('subscribe:tracking', {});
      newSocket.emit('subscribe:alerts', {});
    });

    newSocket.on('disconnect', () => {
      logger.info('Disconnected from RFID tracking server');
      setConnected(false);
    });

    // Handle RFID updates
    newSocket.on('rfid_update', (data: any) => {
      handleRFIDUpdate(data);
    });

    setSocket(newSocket);

    // Load initial data
    loadActiveSessions();
    loadRecentAlerts();

    return () => {
      newSocket.close();
    };
  }, []);

  const handleRFIDUpdate = (data: any) => {
    switch (data.type) {
      case 'location_update':
        updateTagLocation(data);
        break;
      case 'session_started':
        setActiveSessions(prev => [...prev, data.session]);
        break;
      case 'session_ended':
        setActiveSessions(prev => prev.filter(s => s.sessionId !== data.sessionId));
        break;
      case 'new_alert':
        setAlerts(prev => [data.alert, ...prev].slice(0, 50));
        playAlertSound(data.alert.severity);
        break;
      case 'alert_acknowledged':
        setAlerts(prev => prev.map(a => 
          a.id === data.alertId ? { ...a, acknowledged: true } : a
        ));
        break;
    }
  };

  const updateTagLocation = (data: any) => {
    setLiveTags(prev => {
      const updated = new Map(prev);
      updated.set(data.tagId, {
        tagId: data.tagId,
        location: data.location,
        signalStrength: data.signalStrength || 100,
        lastSeen: new Date(data.timestamp),
        coordinates: data.coordinates
      });
      return updated;
    });

    // Update session if tracking
    if (selectedSession && selectedSession.tagId === data.tagId) {
      setSelectedSession(prev => ({
        ...prev!,
        currentLocation: data.location,
        lastSeen: new Date(data.timestamp),
        path: [...prev!.path, {
          location: data.location,
          timestamp: new Date(data.timestamp),
          signalStrength: data.signalStrength || 100
        }]
      }));
    }
  };

  const loadActiveSessions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl('/api/rfid/tracking/sessions/active'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setActiveSessions(data.data);
      }
    } catch (error) {
      logger.error('Error loading active sessions:', error);
    }
  };

  const loadRecentAlerts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl('/api/rfid/alerts/recent'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      logger.error('Error loading alerts:', error);
    }
  };

  const startTracking = async () => {
    if (!searchTag) return;

    setTracking(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl('/api/rfid/tracking/start'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tagId: searchTag })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedSession(data.session);
        socket?.emit('subscribe:tracking', { sessionId: data.session.sessionId });
      }
    } catch (error) {
      logger.error('Error starting tracking:', error);
    } finally {
      setTracking(false);
    }
  };

  const stopTracking = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(buildApiUrl(`/api/rfid/tracking/stop/${sessionId}`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setSelectedSession(null);
      socket?.emit('unsubscribe:tracking', { sessionId });
    } catch (error) {
      logger.error('Error stopping tracking:', error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(buildApiUrl(`/api/rfid/alerts/${alertId}/acknowledge`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      logger.error('Error acknowledging alert:', error);
    }
  };

  const playAlertSound = (severity: string) => {
    // Play different sounds based on severity
    const audio = new Audio(`/sounds/alert-${severity}.mp3`);
    audio.play().catch(e => logger.info('Could not play alert sound'));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa500';
      case 'low': return '#4ecdc4';
      default: return theme.colors.textSecondary;
    }
  };

  const getSignalIcon = (strength: number) => {
    if (strength > 80) return '📶';
    if (strength > 60) return '📶';
    if (strength > 40) return '📶';
    if (strength > 20) return '📶';
    return '📵';
  };

  // Enhanced map visualization with 2D/3D views for both Forensic Lab and Warehouse
  const renderEnhancedMap = () => {
    switch (mapView) {
      case 'forensic-2d':
        return <ForensicLab2D />;
      case 'forensic-3d':
        return <ForensicLab3D />;
      case 'warehouse-2d':
        return <TopViewWarehouse />;
      case 'warehouse-3d':
        return <Enhanced3DView />;
      default:
        return <ForensicLab2D />;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">RFID Live Tracking</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          <span className="live-indicator">
            <span className="pulse"></span>
            LIVE
          </span>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div className="search-controls">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Enter RFID tag or docket code to track..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="search-input large"
              />
              <button 
                className="btn btn-primary"
                onClick={startTracking}
                disabled={!searchTag || tracking}
              >
                {tracking ? 'Starting...' : '📡 Start Tracking'}
              </button>
              {selectedSession && (
                <button 
                  className="btn btn-danger"
                  onClick={() => stopTracking(selectedSession.sessionId)}
                >
                  ⏹ Stop Tracking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Enhanced Map View */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <h2>SAPS Forensic Laboratory - Live Tracking</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, marginRight: '8px' }}>
                View Mode:
              </span>
              
              {/* Forensic Lab Views */}
              <div style={{ display: 'flex', gap: '4px', border: `1px solid ${theme.colors.border}`, borderRadius: '8px', padding: '2px' }}>
                <button 
                  className={`btn btn-sm ${mapView === 'forensic-2d' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setMapView('forensic-2d')}
                  style={{
                    background: mapView === 'forensic-2d' ? 'linear-gradient(135deg, #ff4444, #cc0000)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: mapView === 'forensic-2d' ? '0 2px 8px rgba(255, 68, 68, 0.3)' : 'none'
                  }}
                >
                  📐 Forensic 2D
                </button>
                <button 
                  className={`btn btn-sm ${mapView === 'forensic-3d' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setMapView('forensic-3d')}
                  style={{
                    background: mapView === 'forensic-3d' ? 'linear-gradient(135deg, #ff4444, #cc0000)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: mapView === 'forensic-3d' ? '0 2px 8px rgba(255, 68, 68, 0.3)' : 'none'
                  }}
                >
                  🧪 Forensic 3D
                </button>
              </div>
              
              {/* Warehouse Views */}
              <div style={{ display: 'flex', gap: '4px', border: `1px solid ${theme.colors.border}`, borderRadius: '8px', padding: '2px' }}>
                <button 
                  className={`btn btn-sm ${mapView === 'warehouse-2d' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setMapView('warehouse-2d')}
                  style={{
                    background: mapView === 'warehouse-2d' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: mapView === 'warehouse-2d' ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  📦 Warehouse 2D
                </button>
                <button 
                  className={`btn btn-sm ${mapView === 'warehouse-3d' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setMapView('warehouse-3d')}
                  style={{
                    background: mapView === 'warehouse-3d' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: mapView === 'warehouse-3d' ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  🏢 Warehouse 3D
                </button>
              </div>
            </div>
          </div>
          <div className="card-body" ref={mapRef} style={{ padding: '0', overflow: 'hidden' }}>
            {renderEnhancedMap()}
          </div>
        </div>

        {/* Active Tracking Sessions */}
        <div className="card">
          <div className="card-header">
            <h2>Active Sessions ({activeSessions.length})</h2>
          </div>
          <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {activeSessions.length === 0 ? (
              <p>No active tracking sessions</p>
            ) : (
              <div className="session-list">
                {activeSessions.map(session => (
                  <div 
                    key={session.sessionId}
                    className={`session-item ${selectedSession?.sessionId === session.sessionId ? 'selected' : ''}`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="session-header">
                      <span className="session-tag">{session.tagId.slice(-8)}</span>
                      <span className={`session-status ${session.status}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="session-details">
                      <div>📍 {session.currentLocation}</div>
                      <div>⏱ {new Date(session.lastSeen).toLocaleTimeString()}</div>
                      {session.alerts && session.alerts.length > 0 && (
                        <div className="session-alerts">
                          ⚠️ {session.alerts.length} alerts
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Session Details */}
      {selectedSession && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h2>Tracking Details: {selectedSession.tagId}</h2>
          </div>
          <div className="card-body">
            <div className="tracking-details">
              <div className="detail-item">
                <span className="detail-label">Session ID:</span>
                <span className="detail-value">{selectedSession.sessionId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Started:</span>
                <span className="detail-value">
                  {new Date(selectedSession.startTime).toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Location:</span>
                <span className="detail-value">{selectedSession.currentLocation}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Path Length:</span>
                <span className="detail-value">{selectedSession.path.length} points</span>
              </div>
            </div>

            {/* Movement History */}
            <h3>Movement History</h3>
            <div className="timeline" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {selectedSession.path.slice(-10).reverse().map((point, idx) => (
                <div key={idx} className="timeline-item">
                  <span className="time">{new Date(point.timestamp).toLocaleTimeString()}</span>
                  <span className="event">{point.location}</span>
                  <span className="signal">{getSignalIcon(point.signalStrength)} {point.signalStrength}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts Panel */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h2>Recent Alerts</h2>
          <span className="alert-count">
            {alerts.filter(a => !a.acknowledged).length} unacknowledged
          </span>
        </div>
        <div className="card-body">
          <div className="alerts-list">
            {alerts.length === 0 ? (
              <p>No recent alerts</p>
            ) : (
              alerts.slice(0, 10).map(alert => (
                <div 
                  key={alert.id}
                  className={`alert-item ${alert.acknowledged ? 'acknowledged' : ''}`}
                >
                  <div className="alert-header">
                    <span 
                      className="alert-severity"
                      style={{ color: getSeverityColor(alert.severity) }}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-footer">
                    <span className="alert-tag">Tag: {alert.tagId ? alert.tagId.slice(-8) : 'N/A'}</span>
                    {!alert.acknowledged && (
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        ✓ Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .connection-status {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .connection-status.connected {
          color: ${theme.colors.success};
        }
        
        .connection-status.disconnected {
          color: ${theme.colors.error};
        }
        
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: ${theme.colors.error};
          font-weight: bold;
        }
        
        .pulse {
          width: 10px;
          height: 10px;
          background: ${theme.colors.error};
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
          }
        }
        
        .map-legend {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          padding: 0.5rem;
          background: ${theme.colors.backgroundElevated};
          border-radius: 4px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .legend-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .session-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .session-item {
          padding: 0.75rem;
          border: 1px solid ${theme.colors.border};
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .session-item:hover {
          border-color: ${theme.colors.primary};
          background: ${theme.colors.hover};
        }
        
        .session-item.selected {
          border-color: ${theme.colors.primary};
          background: ${theme.colors.primaryLight}10;
        }
        
        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .session-tag {
          font-weight: 600;
          font-family: monospace;
        }
        
        .session-status {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          background: ${theme.colors.backgroundElevated};
        }
        
        .session-status.tracking {
          background: ${theme.colors.info};
          color: white;
        }
        
        .session-status.located {
          background: ${theme.colors.success};
          color: white;
        }
        
        .session-details {
          font-size: 0.875rem;
          color: ${theme.colors.textSecondary};
        }
        
        .session-alerts {
          color: ${theme.colors.warning};
          font-weight: 500;
          margin-top: 0.25rem;
        }
        
        .tracking-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .detail-label {
          font-size: 0.875rem;
          color: ${theme.colors.textSecondary};
        }
        
        .detail-value {
          font-weight: 500;
        }
        
        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .alert-item {
          padding: 0.75rem;
          border: 1px solid ${theme.colors.border};
          border-radius: 6px;
          transition: opacity 0.2s;
        }
        
        .alert-item.acknowledged {
          opacity: 0.6;
        }
        
        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .alert-severity {
          font-weight: bold;
          font-size: 0.75rem;
        }
        
        .alert-time {
          font-size: 0.75rem;
          color: ${theme.colors.textSecondary};
        }
        
        .alert-message {
          margin-bottom: 0.5rem;
        }
        
        .alert-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }
        
        .alert-tag {
          color: ${theme.colors.textSecondary};
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default RFIDLiveTracking;