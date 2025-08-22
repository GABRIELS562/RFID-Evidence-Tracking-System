/**
 * Docket Timeline Component
 * Interactive timeline visualization for docket journey and events
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Clock, MapPin, User, Package, Truck, Building, Camera, FileText,
  AlertTriangle, Shield, Activity, CheckCircle, XCircle, Info,
  Play, Pause, SkipBack, SkipForward, Calendar, Filter, Search,
  Download, Maximize2, RotateCcw, ChevronLeft, ChevronRight,
  Thermometer, Droplets, Battery, Wifi, Hash, Star, Flag
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  type: 'created' | 'moved' | 'scanned' | 'analyzed' | 'sealed' | 'unsealed' | 'alert' | 'milestone';
  location: {
    id: string;
    name: string;
    coordinates?: { lat: number; lng: number };
    floor?: number;
    zone?: string;
  };
  personnel?: {
    id: string;
    name: string;
    role: string;
    badge: string;
    signature?: string;
  };
  evidence?: {
    photos?: string[];
    documents?: string[];
    signatures?: string[];
    notes?: string;
  };
  environmental?: {
    temperature?: number;
    humidity?: number;
    pressure?: number;
  };
  status: 'completed' | 'in_progress' | 'pending' | 'failed' | 'cancelled';
  severity: 'info' | 'success' | 'warning' | 'error' | 'critical';
  duration?: number; // in minutes
  nextPredicted?: Date;
  tags?: string[];
}

interface DocketTimelineProps {
  docketId: string;
  events?: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
  onEventEdit?: (event: TimelineEvent) => void;
  showMilestones?: boolean;
  showPredictions?: boolean;
  enablePlayback?: boolean;
  playbackSpeed?: number;
  timeRange?: 'hour' | 'day' | 'week' | 'month' | 'all';
  groupBy?: 'none' | 'date' | 'location' | 'personnel' | 'type';
  orientation?: 'horizontal' | 'vertical';
  compactMode?: boolean;
}

const DocketTimeline: React.FC<DocketTimelineProps> = ({
  docketId,
  events = [],
  onEventClick,
  onEventEdit,
  showMilestones = true,
  showPredictions = true,
  enablePlayback = true,
  playbackSpeed = 1,
  timeRange = 'all',
  groupBy = 'none',
  orientation = 'vertical',
  compactMode = false,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [compactModeState, setCompactModeState] = useState(compactMode);
  const [orientationState, setOrientationState] = useState<'horizontal' | 'vertical'>(orientation);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<number>();
  
  // Generate mock timeline events if none provided
  const mockEvents: TimelineEvent[] = useMemo(() => {
    if (events.length > 0) return events;
    
    const now = new Date();
    return [
      {
        id: 'EVT001',
        timestamp: new Date(now.getTime() - 4 * 3600000),
        title: 'Evidence Collected',
        description: 'Physical evidence collected from crime scene and logged into system',
        type: 'created',
        location: {
          id: 'LOC001',
          name: 'Crime Scene - Hillbrow',
          coordinates: { lat: -26.1833, lng: 28.0500 },
          zone: 'field'
        },
        personnel: {
          id: 'P001',
          name: 'Officer Johnson',
          role: 'Investigating Officer',
          badge: 'SAPS-2847'
        },
        status: 'completed',
        severity: 'info',
        tags: ['collection', 'crime-scene', 'initial'],
        environmental: {
          temperature: 18.5,
          humidity: 65,
          pressure: 1013
        }
      },
      {
        id: 'EVT002',
        timestamp: new Date(now.getTime() - 3.8 * 3600000),
        title: 'RFID Tag Attached',
        description: 'RFID tracking tag attached and activated for continuous monitoring',
        type: 'scanned',
        location: {
          id: 'LOC002',
          name: 'Evidence Reception',
          floor: 0,
          zone: 'reception'
        },
        personnel: {
          id: 'P002',
          name: 'Tech Williams',
          role: 'RFID Technician',
          badge: 'TECH-1923'
        },
        status: 'completed',
        severity: 'success',
        tags: ['rfid', 'tracking', 'technology'],
        duration: 15
      },
      {
        id: 'EVT003',
        timestamp: new Date(now.getTime() - 3.5 * 3600000),
        title: 'Initial Assessment',
        description: 'Preliminary examination completed, evidence categorized and prioritized',
        type: 'analyzed',
        location: {
          id: 'LOC003',
          name: 'Assessment Lab',
          floor: 1,
          zone: 'analysis'
        },
        personnel: {
          id: 'P003',
          name: 'Dr. Sarah Smith',
          role: 'Forensic Examiner',
          badge: 'LAB-0392'
        },
        status: 'completed',
        severity: 'success',
        duration: 45,
        evidence: {
          photos: ['assessment_001.jpg', 'assessment_002.jpg'],
          notes: 'Blood samples and fabric fibers identified for further analysis',
        },
        tags: ['assessment', 'categorization', 'priority']
      },
      {
        id: 'EVT004',
        timestamp: new Date(now.getTime() - 3 * 3600000),
        title: 'Chain of Custody Transfer',
        description: 'Evidence transferred to specialized forensic laboratory',
        type: 'moved',
        location: {
          id: 'LOC004',
          name: 'Forensic Laboratory A',
          floor: 1,
          zone: 'analysis'
        },
        personnel: {
          id: 'P003',
          name: 'Dr. Sarah Smith',
          role: 'Forensic Examiner',
          badge: 'LAB-0392'
        },
        status: 'completed',
        severity: 'info',
        tags: ['transfer', 'custody', 'laboratory'],
        duration: 20
      },
      {
        id: 'EVT005',
        timestamp: new Date(now.getTime() - 2.5 * 3600000),
        title: 'DNA Analysis Started',
        description: 'Comprehensive DNA analysis initiated on blood samples',
        type: 'analyzed',
        location: {
          id: 'LOC004',
          name: 'Forensic Laboratory A',
          floor: 1,
          zone: 'analysis'
        },
        personnel: {
          id: 'P004',
          name: 'Dr. Michael Chen',
          role: 'DNA Analyst',
          badge: 'DNA-5841'
        },
        status: 'in_progress',
        severity: 'info',
        tags: ['dna', 'analysis', 'in-progress'],
        nextPredicted: new Date(now.getTime() + 2 * 3600000)
      },
      {
        id: 'EVT006',
        timestamp: new Date(now.getTime() - 2 * 3600000),
        title: 'Temperature Alert',
        description: 'Storage temperature exceeded acceptable range during transport',
        type: 'alert',
        location: {
          id: 'LOC005',
          name: 'Transport Vehicle Alpha-7',
          zone: 'transport'
        },
        personnel: {
          id: 'P005',
          name: 'Driver Martinez',
          role: 'Secure Transport',
          badge: 'TRANS-3947'
        },
        status: 'completed',
        severity: 'warning',
        environmental: {
          temperature: 28.5,
          humidity: 45
        },
        tags: ['alert', 'temperature', 'transport']
      },
      {
        id: 'EVT007',
        timestamp: new Date(now.getTime() - 1.5 * 3600000),
        title: 'Secure Storage',
        description: 'Evidence secured in climate-controlled vault pending analysis results',
        type: 'moved',
        location: {
          id: 'LOC006',
          name: 'Secure Vault B-12',
          floor: 2,
          zone: 'storage'
        },
        personnel: {
          id: 'P006',
          name: 'Security Officer Davis',
          role: 'Vault Security',
          badge: 'SEC-7123'
        },
        status: 'completed',
        severity: 'success',
        duration: 10,
        environmental: {
          temperature: 20.0,
          humidity: 40
        },
        tags: ['storage', 'secure', 'vault']
      },
      {
        id: 'EVT008',
        timestamp: new Date(now.getTime() - 1 * 3600000),
        title: 'Evidence Sealed',
        description: 'Evidence container sealed with tamper-evident security seal',
        type: 'sealed',
        location: {
          id: 'LOC006',
          name: 'Secure Vault B-12',
          floor: 2,
          zone: 'storage'
        },
        personnel: {
          id: 'P006',
          name: 'Security Officer Davis',
          role: 'Vault Security',
          badge: 'SEC-7123'
        },
        status: 'completed',
        severity: 'success',
        evidence: {
          signatures: ['digital_seal_2024_08_18.sig']
        },
        tags: ['sealed', 'security', 'tamper-proof']
      },
      {
        id: 'MILESTONE001',
        timestamp: new Date(now.getTime() - 0.5 * 3600000),
        title: 'Case Milestone: Analysis Complete',
        description: 'All scheduled forensic analyses have been completed successfully',
        type: 'milestone',
        location: {
          id: 'LOC007',
          name: 'Case Management System',
          zone: 'digital'
        },
        status: 'completed',
        severity: 'success',
        tags: ['milestone', 'analysis', 'complete']
      },
      {
        id: 'PRED001',
        timestamp: new Date(now.getTime() + 2 * 3600000),
        title: 'Predicted: Court Preparation',
        description: 'Evidence expected to be prepared for court presentation',
        type: 'moved',
        location: {
          id: 'LOC008',
          name: 'Court Prep Area',
          floor: 0,
          zone: 'court-prep'
        },
        status: 'pending',
        severity: 'info',
        tags: ['predicted', 'court', 'preparation']
      }
    ];
  }, [events]);
  
  // Filter and process events
  const processedEvents = useMemo(() => {
    let filtered = mockEvents;
    
    // Apply text filter
    if (filter) {
      const searchLower = filter.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.name.toLowerCase().includes(searchLower) ||
        event.personnel?.name.toLowerCase().includes(searchLower) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply type filter
    if (selectedTypes.size > 0) {
      filtered = filtered.filter(event => selectedTypes.has(event.type));
    }
    
    // Apply time range filter
    if (timeRange !== 'all') {
      const now = currentTime;
      const ranges = {
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        month: 2592000000
      };
      const cutoff = new Date(now.getTime() - ranges[timeRange]);
      filtered = filtered.filter(event => event.timestamp >= cutoff || event.status === 'pending');
    }
    
    // Sort by timestamp
    return filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [mockEvents, filter, selectedTypes, timeRange, currentTime]);
  
  // Playback functionality
  useEffect(() => {
    if (isPlaying && enablePlayback) {
      playbackRef.current = window.setInterval(() => {
        setPlaybackPosition(prev => {
          const next = prev + playbackSpeed;
          return next >= processedEvents.length ? 0 : next;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
    }
    
    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
    };
  }, [isPlaying, enablePlayback, playbackSpeed, processedEvents.length]);
  
  const getEventIcon = (type: string, status: string) => {
    const icons = {
      created: <FileText size={16} />,
      moved: <Truck size={16} />,
      scanned: <Camera size={16} />,
      analyzed: <Activity size={16} />,
      sealed: <Shield size={16} />,
      unsealed: <Shield size={16} />,
      alert: <AlertTriangle size={16} />,
      milestone: <Flag size={16} />
    };
    
    return icons[type as keyof typeof icons] || <Package size={16} />;
  };
  
  const getEventColor = (severity: string, status: string) => {
    if (status === 'pending') return '#6b7280';
    
    const colors = {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      critical: '#dc2626'
    };
    
    return colors[severity as keyof typeof colors] || '#6b7280';
  };
  
  const renderEvent = (event: TimelineEvent, index: number) => {
    const isSelected = selectedEvent?.id === event.id;
    const isPlaybackActive = enablePlayback && index <= playbackPosition;
    const isPending = event.status === 'pending';
    const color = getEventColor(event.severity, event.status);
    const icon = getEventIcon(event.type, event.status);
    
    const eventStyle = orientationState === 'horizontal' 
      ? {
          minWidth: '300px',
          marginRight: '20px',
        }
      : {
          marginBottom: '20px',
        };
    
    return (
      <div
        key={event.id}
        style={{
          position: 'relative',
          ...eventStyle,
          opacity: isPending ? 0.7 : isPlaybackActive || !enablePlayback ? 1 : 0.3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        {/* Timeline node */}
        <div
          style={{
            position: 'absolute',
            left: orientationState === 'horizontal' ? '0' : '-10px',
            top: orientationState === 'horizontal' ? '-10px' : '20px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: color,
            border: '3px solid var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 2,
            boxShadow: isSelected ? `0 0 20px ${color}` : '0 2px 10px rgba(0,0,0,0.3)',
            animation: isPlaybackActive && isPlaying ? 'pulse 2s infinite' : 'none',
            ...(isPending ? {
              border: `3px dashed ${color}`,
              background: 'transparent',
            } : {}),
          }}
        >
          {React.cloneElement(icon, { size: 12 })}
        </div>
        
        {/* Event card */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: `1px solid ${isSelected ? color : 'var(--border-primary)'}`,
            borderRadius: '12px',
            padding: compactModeState ? '10px' : '15px',
            marginLeft: orientationState === 'horizontal' ? '0' : '20px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: isSelected ? `0 0 20px ${color}40` : '0 2px 10px rgba(0,0,0,0.1)',
            ...(isPending ? {
              borderStyle: 'dashed',
              background: 'var(--bg-tertiary)',
            } : {}),
          }}
          onClick={() => {
            setSelectedEvent(event);
            onEventClick?.(event);
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: compactModeState ? '6px' : '10px',
          }}>
            <div>
              <div style={{
                fontSize: compactModeState ? '13px' : '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '2px',
              }}>
                {event.title}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Clock size={10} />
                {isPending ? 'Predicted: ' : ''}{event.timestamp.toLocaleString()}
              </div>
            </div>
            
            {/* Status badge */}
            <div style={{
              padding: '2px 6px',
              background: `${color}20`,
              color: color,
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              {event.status}
            </div>
          </div>
          
          {/* Description */}
          {!compactModeState && (
            <div style={{
              fontSize: '12px',
              color: 'var(--text-primary)',
              marginBottom: '10px',
              lineHeight: '1.4',
            }}>
              {event.description}
            </div>
          )}
          
          {/* Location and Personnel */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: compactModeState ? '1fr' : '1fr 1fr',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
          }}>
            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={10} />
                <span>{event.location.name}</span>
                {event.location.floor !== undefined && (
                  <span style={{ opacity: 0.7 }}>F{event.location.floor}</span>
                )}
              </div>
            )}
            
            {event.personnel && !compactModeState && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={10} />
                <span>{event.personnel.name}</span>
              </div>
            )}
          </div>
          
          {/* Environmental data */}
          {event.environmental && showDetails && !compactModeState && (
            <div style={{
              marginTop: '8px',
              padding: '6px 8px',
              background: 'var(--bg-tertiary)',
              borderRadius: '6px',
              fontSize: '10px',
              display: 'flex',
              gap: '10px',
            }}>
              {event.environmental.temperature && (
                <span>
                  <Thermometer size={10} style={{ display: 'inline', marginRight: '2px' }} />
                  {event.environmental.temperature}°C
                </span>
              )}
              {event.environmental.humidity && (
                <span>
                  <Droplets size={10} style={{ display: 'inline', marginRight: '2px' }} />
                  {event.environmental.humidity}%
                </span>
              )}
            </div>
          )}
          
          {/* Tags */}
          {event.tags && showDetails && !compactModeState && (
            <div style={{
              marginTop: '8px',
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
            }}>
              {event.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '2px 6px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '3px',
                    fontSize: '9px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Duration indicator */}
          {event.duration && showDetails && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '9px',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}>
              <Clock size={8} />
              {event.duration}m
            </div>
          )}
        </div>
        
        {/* Connection line to next event */}
        {orientationState === 'vertical' && index < processedEvents.length - 1 && (
          <div style={{
            position: 'absolute',
            left: '-1px',
            top: '40px',
            bottom: '-20px',
            width: '2px',
            background: `linear-gradient(180deg, ${color} 0%, var(--border-primary) 50%, var(--border-primary) 100%)`,
            zIndex: 1,
          }} />
        )}
        
        {orientationState === 'horizontal' && index < processedEvents.length - 1 && (
          <div style={{
            position: 'absolute',
            top: '-1px',
            right: '-20px',
            width: '20px',
            height: '2px',
            background: `linear-gradient(90deg, ${color} 0%, var(--border-primary) 100%)`,
            zIndex: 1,
          }} />
        )}
      </div>
    );
  };
  
  const renderControls = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px 20px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-primary)',
      borderRadius: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    }}>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Search size={16} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder="Search events..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '6px 10px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            width: '150px',
          }}
        />
      </div>
      
      {/* Time range */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Calendar size={16} color="var(--text-secondary)" />
        <select
          value={timeRange}
          onChange={(e) => setFilter(e.target.value as any)}
          style={{
            padding: '6px 10px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--text-primary)',
          }}
        >
          <option value="all">All Time</option>
          <option value="hour">Last Hour</option>
          <option value="day">Last Day</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
      </div>
      
      {/* Playback controls */}
      {enablePlayback && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            onClick={() => setPlaybackPosition(0)}
            style={{
              padding: '6px',
              background: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '6px',
              background: isPlaying ? '#ef4444' : '#10b981',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setPlaybackPosition(processedEvents.length)}
            style={{
              padding: '6px',
              background: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <SkipForward size={14} />
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {playbackPosition}/{processedEvents.length}
          </span>
        </div>
      )}
      
      {/* Toggle controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '6px 10px',
            background: showDetails ? 'var(--bg-primary)' : 'transparent',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          Details
        </button>
        <button
          onClick={() => setCompactModeState(!compactModeState)}
          style={{
            padding: '6px 10px',
            background: compactModeState ? 'var(--bg-primary)' : 'transparent',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          Compact
        </button>
        <button
          onClick={() => setOrientationState(orientationState === 'vertical' ? 'horizontal' : 'vertical')}
          style={{
            padding: '6px',
            background: 'transparent',
            border: '1px solid var(--border-primary)',
            borderRadius: '4px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title="Toggle Orientation"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
  
  const renderStats = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginBottom: '20px',
    }}>
      <div style={{
        padding: '12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          {processedEvents.length}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Total Events
        </div>
      </div>
      <div style={{
        padding: '12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
          {processedEvents.filter(e => e.status === 'completed').length}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Completed
        </div>
      </div>
      <div style={{
        padding: '12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
          {processedEvents.filter(e => e.status === 'in_progress').length}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          In Progress
        </div>
      </div>
      <div style={{
        padding: '12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b7280' }}>
          {processedEvents.filter(e => e.status === 'pending').length}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Pending
        </div>
      </div>
    </div>
  );
  
  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
          }}>
            Docket Timeline
          </h2>
          <div style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Hash size={14} />
            {docketId}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
            }}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>
      
      {/* Statistics */}
      {renderStats()}
      
      {/* Controls */}
      {renderControls()}
      
      {/* Timeline */}
      <div
        ref={timelineRef}
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '30px 20px',
          minHeight: '400px',
          position: 'relative',
          overflowX: orientationState === 'horizontal' ? 'auto' : 'visible',
          overflowY: orientationState === 'vertical' ? 'auto' : 'visible',
          maxHeight: '800px',
        }}
      >
        {processedEvents.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}>
            No events match the current filters
          </div>
        ) : (
          <div style={{
            display: orientationState === 'horizontal' ? 'flex' : 'block',
            alignItems: orientationState === 'horizontal' ? 'flex-start' : 'stretch',
            position: 'relative',
          }}>
            {/* Main timeline line */}
            {orientationState === 'vertical' && (
              <div style={{
                position: 'absolute',
                left: '9px',
                top: '0',
                bottom: '0',
                width: '2px',
                background: 'linear-gradient(180deg, var(--border-primary) 0%, var(--border-secondary) 100%)',
              }} />
            )}
            
            {processedEvents.map((event, index) => renderEvent(event, index))}
          </div>
        )}
      </div>
      
      {/* Selected event details */}
      {selectedEvent && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '15px',
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Event Details
            </h3>
            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                padding: '4px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
                {selectedEvent.title}
              </h4>
              <p style={{
                margin: '0 0 15px 0',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: '1.5',
              }}>
                {selectedEvent.description}
              </p>
              
              {selectedEvent.evidence?.notes && (
                <div style={{
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                }}>
                  <strong>Notes:</strong> {selectedEvent.evidence.notes}
                </div>
              )}
            </div>
            
            <div>
              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                  Location & Personnel
                </h5>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '6px' }} />
                    {selectedEvent.location.name}
                  </div>
                  {selectedEvent.personnel && (
                    <div style={{ marginBottom: '4px' }}>
                      <User size={12} style={{ display: 'inline', marginRight: '6px' }} />
                      {selectedEvent.personnel.name} ({selectedEvent.personnel.badge})
                    </div>
                  )}
                  <div>
                    <Clock size={12} style={{ display: 'inline', marginRight: '6px' }} />
                    {selectedEvent.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {selectedEvent.environmental && (
                <div>
                  <h5 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                    Environmental Conditions
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                    gap: '8px',
                    fontSize: '12px',
                  }}>
                    {selectedEvent.environmental.temperature && (
                      <div style={{
                        padding: '6px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        textAlign: 'center',
                      }}>
                        <Thermometer size={14} style={{ display: 'block', margin: '0 auto 4px' }} />
                        {selectedEvent.environmental.temperature}°C
                      </div>
                    )}
                    {selectedEvent.environmental.humidity && (
                      <div style={{
                        padding: '6px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        textAlign: 'center',
                      }}>
                        <Droplets size={14} style={{ display: 'block', margin: '0 auto 4px' }} />
                        {selectedEvent.environmental.humidity}%
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default DocketTimeline;