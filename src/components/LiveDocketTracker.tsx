/**
 * Live Docket Tracking Dashboard
 * Real-time tracking with timeline, map, and chain of custody visualization
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin, Clock, User, Shield, AlertTriangle, TrendingUp,
  Navigation, Activity, Package, FileText, Camera, Fingerprint,
  Truck, Building, CheckCircle, XCircle, AlertCircle, Info,
  Calendar, Hash, BarChart3, Route, ThermometerSun, Droplets,
  Wind, Battery, Wifi, WifiOff, Bell, BellOff, Eye, ChevronRight
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: 'storage' | 'lab' | 'court' | 'transit' | 'external';
  coordinates: { lat: number; lng: number };
  temperature?: number;
  humidity?: number;
  lastUpdate: Date;
}

interface DocketEvent {
  id: string;
  timestamp: Date;
  type: 'created' | 'moved' | 'scanned' | 'analyzed' | 'sealed' | 'unsealed' | 'alert';
  location: Location;
  personnel?: {
    id: string;
    name: string;
    role: string;
    badge: string;
  };
  details: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
  evidence?: {
    photos?: string[];
    signatures?: string[];
    notes?: string;
  };
}

interface DocketData {
  id: string;
  caseNumber: string;
  status: 'active' | 'in-transit' | 'stored' | 'analyzed' | 'court' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  currentLocation: Location;
  events: DocketEvent[];
  tags: string[];
  sealIntact: boolean;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  signalStrength: number;
  predictedNext?: Location;
  estimatedArrival?: Date;
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
  }>;
}

interface LiveDocketTrackerProps {
  docketId?: string;
  onEventClick?: (event: DocketEvent) => void;
  enableNotifications?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const LiveDocketTracker: React.FC<LiveDocketTrackerProps> = ({
  docketId = 'LAB2024-0847',
  onEventClick,
  enableNotifications = true,
  autoRefresh = true,
  refreshInterval = 5000,
}) => {
  const [selectedDocket, setSelectedDocket] = useState<DocketData | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DocketEvent | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'map' | 'custody' | 'analytics'>('timeline');
  const [notifications, setNotifications] = useState(enableNotifications);
  const [isTracking, setIsTracking] = useState(autoRefresh);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Generate mock docket data
  const mockDocketData: DocketData = useMemo(() => {
    const locations: Location[] = [
      { 
        id: 'LOC001', 
        name: 'Evidence Reception', 
        type: 'storage',
        coordinates: { lat: -26.2041, lng: 28.0473 },
        temperature: 21.5,
        humidity: 45,
        lastUpdate: new Date(Date.now() - 3600000 * 4)
      },
      {
        id: 'LOC002',
        name: 'Forensic Lab A',
        type: 'lab',
        coordinates: { lat: -26.2051, lng: 28.0483 },
        temperature: 22.0,
        humidity: 40,
        lastUpdate: new Date(Date.now() - 3600000 * 3)
      },
      {
        id: 'LOC003',
        name: 'Secure Storage Vault',
        type: 'storage',
        coordinates: { lat: -26.2061, lng: 28.0493 },
        temperature: 20.5,
        humidity: 42,
        lastUpdate: new Date(Date.now() - 3600000 * 2)
      },
      {
        id: 'LOC004',
        name: 'Transport Vehicle',
        type: 'transit',
        coordinates: { lat: -26.2071, lng: 28.0503 },
        temperature: 24.0,
        humidity: 50,
        lastUpdate: new Date(Date.now() - 3600000)
      },
      {
        id: 'LOC005',
        name: 'Johannesburg High Court',
        type: 'court',
        coordinates: { lat: -26.2081, lng: 28.0513 },
        temperature: 23.0,
        humidity: 48,
        lastUpdate: new Date()
      }
    ];
    
    const events: DocketEvent[] = [
      {
        id: 'EVT001',
        timestamp: new Date(Date.now() - 3600000 * 4),
        type: 'created',
        location: locations[0],
        personnel: {
          id: 'P001',
          name: 'Officer Johnson',
          role: 'Evidence Officer',
          badge: 'SAPS-2847'
        },
        details: 'Evidence logged into system',
        severity: 'info'
      },
      {
        id: 'EVT002',
        timestamp: new Date(Date.now() - 3600000 * 3.5),
        type: 'scanned',
        location: locations[0],
        personnel: {
          id: 'P002',
          name: 'Tech Williams',
          role: 'RFID Technician',
          badge: 'TECH-1923'
        },
        details: 'RFID tag attached and activated',
        severity: 'success'
      },
      {
        id: 'EVT003',
        timestamp: new Date(Date.now() - 3600000 * 3),
        type: 'moved',
        location: locations[1],
        personnel: {
          id: 'P003',
          name: 'Dr. Smith',
          role: 'Forensic Analyst',
          badge: 'LAB-0392'
        },
        details: 'Transferred to forensic laboratory for analysis',
        severity: 'info'
      },
      {
        id: 'EVT004',
        timestamp: new Date(Date.now() - 3600000 * 2.5),
        type: 'analyzed',
        location: locations[1],
        personnel: {
          id: 'P003',
          name: 'Dr. Smith',
          role: 'Forensic Analyst',
          badge: 'LAB-0392'
        },
        details: 'DNA analysis completed - results uploaded',
        severity: 'success',
        evidence: {
          photos: ['dna_result_001.jpg'],
          notes: 'Positive match found in database'
        }
      },
      {
        id: 'EVT005',
        timestamp: new Date(Date.now() - 3600000 * 2),
        type: 'sealed',
        location: locations[2],
        personnel: {
          id: 'P001',
          name: 'Officer Johnson',
          role: 'Evidence Officer',
          badge: 'SAPS-2847'
        },
        details: 'Evidence sealed for court presentation',
        severity: 'info'
      },
      {
        id: 'EVT006',
        timestamp: new Date(Date.now() - 3600000),
        type: 'moved',
        location: locations[3],
        personnel: {
          id: 'P004',
          name: 'Transport Officer Davis',
          role: 'Secure Transport',
          badge: 'TRANS-8472'
        },
        details: 'In transit to Johannesburg High Court',
        severity: 'warning'
      },
      {
        id: 'EVT007',
        timestamp: new Date(),
        type: 'scanned',
        location: locations[4],
        personnel: {
          id: 'P005',
          name: 'Court Officer Brown',
          role: 'Court Security',
          badge: 'COURT-3928'
        },
        details: 'Arrived at court - checked in for hearing',
        severity: 'success'
      }
    ];
    
    return {
      id: docketId,
      caseNumber: 'CAS 234/08/2024',
      status: 'court',
      priority: 'high',
      currentLocation: locations[4],
      events,
      tags: ['DNA Evidence', 'Murder Case', 'High Profile', 'Urgent'],
      sealIntact: true,
      temperature: 23.0,
      humidity: 48,
      batteryLevel: 87,
      signalStrength: 92,
      predictedNext: locations[2],
      estimatedArrival: new Date(Date.now() + 3600000 * 2),
      alerts: [
        {
          id: 'ALERT001',
          type: 'temperature',
          message: 'Temperature spike detected during transit',
          timestamp: new Date(Date.now() - 1800000)
        }
      ]
    };
  }, [docketId]);
  
  useEffect(() => {
    setSelectedDocket(mockDocketData);
  }, [mockDocketData]);
  
  // Auto-refresh simulation
  useEffect(() => {
    if (!isTracking || !autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate real-time updates
      setSelectedDocket(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
          humidity: prev.humidity + (Math.random() - 0.5) * 1,
          batteryLevel: Math.max(0, prev.batteryLevel - 0.1),
          signalStrength: Math.min(100, Math.max(0, prev.signalStrength + (Math.random() - 0.5) * 5))
        };
      });
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [isTracking, autoRefresh, refreshInterval]);
  
  const renderTimeline = () => {
    if (!selectedDocket) return null;
    
    return (
      <div ref={timelineRef} style={{
        padding: '20px',
        height: '100%',
        overflowY: 'auto',
      }}>
        <div style={{
          position: 'relative',
          paddingLeft: '40px',
        }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'linear-gradient(180deg, #3b82f6 0%, #6366f1 100%)',
          }} />
          
          {selectedDocket.events.map((event, index) => {
            const isLast = index === selectedDocket.events.length - 1;
            const icon = {
              created: <FileText size={16} />,
              moved: <Truck size={16} />,
              scanned: <Camera size={16} />,
              analyzed: <Activity size={16} />,
              sealed: <Shield size={16} />,
              unsealed: <Shield size={16} />,
              alert: <AlertTriangle size={16} />
            }[event.type];
            
            const color = {
              info: '#3b82f6',
              success: '#10b981',
              warning: '#f59e0b',
              error: '#ef4444'
            }[event.severity || 'info'];
            
            return (
              <div
                key={event.id}
                style={{
                  position: 'relative',
                  marginBottom: '30px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedEvent(event);
                  onEventClick?.(event);
                }}
              >
                {/* Timeline node */}
                <div style={{
                  position: 'absolute',
                  left: '-30px',
                  top: '0',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: color,
                  border: '3px solid var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: isLast ? `0 0 20px ${color}` : 'none',
                  animation: isLast ? 'pulse 2s infinite' : 'none',
                }}>
                  {icon}
                </div>
                
                {/* Event card */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '12px',
                  padding: '15px',
                  transition: 'all 0.3s',
                  ...(selectedEvent?.id === event.id ? {
                    borderColor: color,
                    boxShadow: `0 0 20px ${color}40`,
                  } : {}),
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                      }}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <Clock size={12} />
                        {event.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      background: `${color}20`,
                      color: color,
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>
                      {event.location.name}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}>
                    {event.details}
                  </div>
                  
                  {event.personnel && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                    }}>
                      <User size={12} />
                      {event.personnel.name} ({event.personnel.badge})
                    </div>
                  )}
                  
                  {event.evidence && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}>
                      {event.evidence.photos && (
                        <div style={{ marginBottom: '4px' }}>
                          📷 {event.evidence.photos.length} photo(s) attached
                        </div>
                      )}
                      {event.evidence.notes && (
                        <div>📝 {event.evidence.notes}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderMap = () => {
    if (!selectedDocket) return null;
    
    return (
      <div ref={mapRef} style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {/* Map grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
        
        {/* Journey path */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill="#3b82f6"
              />
            </marker>
          </defs>
          
          {/* Draw path between locations */}
          {selectedDocket.events.slice(0, -1).map((event, index) => {
            const nextEvent = selectedDocket.events[index + 1];
            const startX = 100 + index * 150;
            const startY = 200 + Math.sin(index) * 50;
            const endX = 100 + (index + 1) * 150;
            const endY = 200 + Math.sin(index + 1) * 50;
            
            return (
              <g key={`path-${index}`}>
                <path
                  d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 - 50} ${endX} ${endY}`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="10"
                    to="0"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            );
          })}
        </svg>
        
        {/* Location markers */}
        {selectedDocket.events.map((event, index) => {
          const x = 100 + index * 150;
          const y = 200 + Math.sin(index) * 50;
          const isCurrentLocation = index === selectedDocket.events.length - 1;
          
          return (
            <div
              key={`marker-${event.id}`}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedEvent(event)}
            >
              {/* Location pin */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50% 50% 50% 0',
                background: isCurrentLocation 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                transform: 'rotate(-45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCurrentLocation 
                  ? '0 0 30px rgba(16, 185, 129, 0.5)'
                  : '0 4px 20px rgba(0,0,0,0.3)',
                animation: isCurrentLocation ? 'pulse 2s infinite' : 'none',
              }}>
                <div style={{
                  transform: 'rotate(45deg)',
                  color: 'white',
                }}>
                  <MapPin size={20} />
                </div>
              </div>
              
              {/* Location label */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--bg-secondary)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                border: '1px solid var(--border-primary)',
              }}>
                {event.location.name}
              </div>
              
              {/* Timestamp */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}>
                {event.timestamp.toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        
        {/* Current location indicator */}
        {selectedDocket.currentLocation && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '15px',
            minWidth: '200px',
          }}>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              Current Location
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              {selectedDocket.currentLocation.name}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '11px',
            }}>
              <div>
                <ThermometerSun size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {selectedDocket.temperature.toFixed(1)}°C
              </div>
              <div>
                <Droplets size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {selectedDocket.humidity.toFixed(0)}%
              </div>
              <div>
                <Battery size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {selectedDocket.batteryLevel.toFixed(0)}%
              </div>
              <div>
                <Wifi size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {selectedDocket.signalStrength.toFixed(0)}%
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderChainOfCustody = () => {
    if (!selectedDocket) return null;
    
    return (
      <div style={{
        padding: '20px',
        height: '100%',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'grid',
          gap: '15px',
        }}>
          {selectedDocket.events.filter(e => e.personnel).map((event, index) => (
            <div
              key={event.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                padding: '15px',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '15px',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onClick={() => setSelectedEvent(event)}
            >
              {/* Personnel avatar */}
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
              }}>
                {event.personnel?.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              {/* Details */}
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}>
                  {event.personnel?.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px',
                }}>
                  {event.personnel?.role} • {event.personnel?.badge}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                }}>
                  {event.details}
                </div>
              </div>
              
              {/* Timestamp and signature */}
              <div style={{
                textAlign: 'right',
              }}>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}>
                  {event.timestamp.toLocaleString()}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  background: 'var(--bg-success)',
                  color: 'var(--text-success)',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}>
                  <Fingerprint size={12} />
                  Verified
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Seal status */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: selectedDocket.sealIntact 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
          border: `1px solid ${selectedDocket.sealIntact ? '#10b981' : '#ef4444'}`,
          borderRadius: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Shield size={20} color={selectedDocket.sealIntact ? '#10b981' : '#ef4444'} />
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: selectedDocket.sealIntact ? '#10b981' : '#ef4444',
              }}>
                Seal Status: {selectedDocket.sealIntact ? 'INTACT' : 'BROKEN'}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                marginTop: '4px',
              }}>
                Last verified: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAnalytics = () => {
    if (!selectedDocket) return null;
    
    return (
      <div style={{
        padding: '20px',
        height: '100%',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
        }}>
          {/* Metric cards */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '15px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}>
              <Clock size={16} color="#3b82f6" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Total Time in System
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              4h 32m
            </div>
          </div>
          
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '15px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}>
              <Route size={16} color="#10b981" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Locations Visited
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {selectedDocket.events.length}
            </div>
          </div>
          
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '15px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}>
              <User size={16} color="#6366f1" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Personnel Involved
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {new Set(selectedDocket.events.filter(e => e.personnel).map(e => e.personnel?.id)).size}
            </div>
          </div>
          
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '15px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}>
              <AlertTriangle size={16} color="#f59e0b" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Active Alerts
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {selectedDocket.alerts.length}
            </div>
          </div>
        </div>
        
        {/* Temperature/Humidity Chart */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '15px',
          }}>
            Environmental Conditions
          </div>
          <div style={{
            height: '200px',
            background: 'var(--bg-tertiary)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            fontSize: '12px',
          }}>
            [Temperature & Humidity Chart Placeholder]
          </div>
        </div>
        
        {/* Predicted workflow */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '15px',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <TrendingUp size={16} />
            Predicted Workflow
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              flex: 1,
              padding: '10px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'center',
            }}>
              Current: Court
            </div>
            <ChevronRight size={16} color="var(--text-secondary)" />
            <div style={{
              flex: 1,
              padding: '10px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'center',
              border: '2px dashed var(--border-primary)',
            }}>
              Next: Secure Storage
            </div>
            <ChevronRight size={16} color="var(--text-secondary)" />
            <div style={{
              flex: 1,
              padding: '10px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'center',
              opacity: 0.5,
            }}>
              Archive
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (!selectedDocket) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '600px',
        color: 'var(--text-secondary)',
      }}>
        Loading docket data...
      </div>
    );
  }
  
  return (
    <div style={{
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          {/* Docket info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '10px',
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {selectedDocket.id}
              </h2>
              <div style={{
                padding: '4px 12px',
                background: selectedDocket.priority === 'critical' 
                  ? 'rgba(239, 68, 68, 0.2)'
                  : selectedDocket.priority === 'high'
                  ? 'rgba(245, 158, 11, 0.2)'
                  : selectedDocket.priority === 'medium'
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'rgba(107, 114, 128, 0.2)',
                color: selectedDocket.priority === 'critical' 
                  ? '#ef4444'
                  : selectedDocket.priority === 'high'
                  ? '#f59e0b'
                  : selectedDocket.priority === 'medium'
                  ? '#3b82f6'
                  : '#6b7280',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}>
                {selectedDocket.priority} Priority
              </div>
              <div style={{
                padding: '4px 12px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite',
                }} />
                LIVE
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '20px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}>
              <span>
                <Hash size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {selectedDocket.caseNumber}
              </span>
              <span>
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {selectedDocket.currentLocation.name}
              </span>
              <span>
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Updated {selectedDocket.currentLocation.lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            
            {/* Tags */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '10px',
              flexWrap: 'wrap',
            }}>
              {selectedDocket.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '2px 8px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '10px',
          }}>
            <button
              onClick={() => setNotifications(!notifications)}
              style={{
                padding: '8px 12px',
                background: notifications ? 'var(--bg-primary)' : 'transparent',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
              }}
            >
              {notifications ? <Bell size={16} /> : <BellOff size={16} />}
              Notifications
            </button>
            <button
              onClick={() => setIsTracking(!isTracking)}
              style={{
                padding: '8px 12px',
                background: isTracking ? '#10b981' : '#ef4444',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              {isTracking ? <Eye size={16} /> : <Eye size={16} />}
              {isTracking ? 'Tracking' : 'Paused'}
            </button>
          </div>
        </div>
      </div>
      
      {/* View mode tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
      }}>
        {(['timeline', 'map', 'custody', 'analytics'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: '10px 20px',
              background: viewMode === mode ? 'var(--bg-primary)' : 'transparent',
              border: `1px solid ${viewMode === mode ? 'var(--border-accent)' : 'var(--border-primary)'}`,
              borderRadius: '8px',
              color: viewMode === mode ? 'var(--text-accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: viewMode === mode ? '600' : '400',
              textTransform: 'capitalize',
              transition: 'all 0.3s',
            }}
          >
            {mode === 'custody' ? 'Chain of Custody' : mode}
          </button>
        ))}
      </div>
      
      {/* Main content */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        height: '600px',
        overflow: 'hidden',
      }}>
        {viewMode === 'timeline' && renderTimeline()}
        {viewMode === 'map' && renderMap()}
        {viewMode === 'custody' && renderChainOfCustody()}
        {viewMode === 'analytics' && renderAnalytics()}
      </div>
      
      {/* Alerts */}
      {selectedDocket.alerts.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#f59e0b',
            }}>
              Active Alerts
            </span>
          </div>
          {selectedDocket.alerts.map(alert => (
            <div
              key={alert.id}
              style={{
                padding: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '6px',
                marginBottom: '8px',
                fontSize: '12px',
              }}
            >
              <strong>{alert.type}:</strong> {alert.message}
              <span style={{
                marginLeft: '10px',
                color: 'var(--text-secondary)',
                fontSize: '11px',
              }}>
                {alert.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default LiveDocketTracker;