import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

// Enhanced Chain of Custody Timeline Component
export interface ChainEvent {
  id: string;
  timestamp: Date;
  action: string;
  officer: string;
  location: string;
  status: 'verified' | 'pending' | 'broken';
  notes?: string;
  signature?: string;
}

interface ChainOfCustodyTimelineProps {
  events: ChainEvent[];
  evidenceId: string;
  onAddEvent?: () => void;
}

export const ChainOfCustodyTimeline: React.FC<ChainOfCustodyTimelineProps> = ({
  events,
  evidenceId,
  onAddEvent
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';

  return (
    <div className="chain-timeline-container" style={{
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9))'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
      backdropFilter: 'blur(12px)',
      borderRadius: '24px',
      padding: '32px',
      border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 8px 0'
          }}>
            Chain of Custody
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: theme === 'dark' ? '#94a3b8' : '#64748b',
            margin: 0,
            fontWeight: '500'
          }}>
            Evidence ID: <span style={{ 
              fontFamily: 'monospace', 
              fontWeight: '700',
              color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
            }}>{evidenceId}</span>
          </p>
        </div>
        {onAddEvent && (
          <button
            onClick={onAddEvent}
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.875rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📝</span>
            Add Event
          </button>
        )}
      </div>

      <div className="chain-timeline" style={{
        position: 'relative',
        paddingLeft: '40px'
      }}>
        <div style={{
          position: 'absolute',
          left: '15px',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'linear-gradient(to bottom, #667eea, #764ba2)',
          borderRadius: '2px'
        }} />
        
        {events.map((event, index) => (
          <div 
            key={event.id}
            className={`chain-event ${event.status}`}
            style={{
              position: 'relative',
              paddingBottom: '32px',
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div style={{
              position: 'absolute',
              left: '-32px',
              top: '8px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: event.status === 'verified' ? '#10b981' : 
                         event.status === 'pending' ? '#f59e0b' : '#ef4444',
              border: '3px solid white',
              boxShadow: `0 0 0 3px ${
                event.status === 'verified' ? 'rgba(16, 185, 129, 0.3)' :
                event.status === 'pending' ? 'rgba(245, 158, 11, 0.3)' :
                'rgba(239, 68, 68, 0.3)'
              }, 0 2px 4px rgba(0, 0, 0, 0.1)`,
              animation: event.status === 'pending' ? 'pulse 2s infinite' :
                        event.status === 'broken' ? 'shake 2s infinite' : 'none'
            }} />
            
            <div className="chain-event-content" style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, #1e293b, #334155)'
                : 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                  margin: 0
                }}>
                  {event.action}
                </h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: theme === 'dark' ? '#94a3b8' : '#64748b',
                    fontWeight: '500'
                  }}>
                    {event.timestamp.toLocaleString()}
                  </span>
                  <span className={`status-badge ${event.status}`} style={{
                    fontSize: '0.625rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {event.status}
                  </span>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '16px',
                alignItems: 'start'
              }}>
                <div>
                  <div className="chain-officer" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#4338ca',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    <span>👤</span>
                    {event.officer}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: theme === 'dark' ? '#94a3b8' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>📍</span>
                    {event.location}
                  </div>
                </div>
                
                {event.notes && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: theme === 'dark' ? '#cbd5e1' : '#475569',
                    lineHeight: '1.5',
                    fontStyle: 'italic'
                  }}>
                    "{event.notes}"
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Evidence Priority Alert Component
interface PriorityAlertProps {
  priority: 'critical' | 'high' | 'medium' | 'low';
  count: number;
  onClick?: () => void;
}

export const PriorityAlert: React.FC<PriorityAlertProps> = ({
  priority,
  count,
  onClick
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';

  const getConfig = () => {
    switch (priority) {
      case 'critical':
        return {
          color: '#dc2626',
          icon: '🚨',
          label: 'Critical Evidence',
          animation: 'criticalAlert 1s ease-in-out infinite'
        };
      case 'high':
        return {
          color: '#ea580c',
          icon: '⚠️',
          label: 'High Priority',
          animation: 'highPriorityPulse 2s ease-in-out infinite'
        };
      case 'medium':
        return {
          color: '#ca8a04',
          icon: '📋',
          label: 'Medium Priority',
          animation: 'none'
        };
      case 'low':
        return {
          color: '#16a34a',
          icon: '📝',
          label: 'Low Priority',
          animation: 'none'
        };
    }
  };

  const config = getConfig();

  if (count === 0) return null;

  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
        color: 'white',
        padding: '16px 20px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: `0 4px 12px ${config.color}40`,
        animation: config.animation,
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.boxShadow = `0 6px 20px ${config.color}60`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${config.color}40`;
        }
      }}
    >
      <div style={{
        fontSize: '2rem',
        animation: priority === 'critical' ? 'pulse 1s infinite' : 'none'
      }}>
        {config.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: '800',
          marginBottom: '4px'
        }}>
          {count} {config.label}
        </div>
        <div style={{
          fontSize: '0.875rem',
          opacity: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '600'
        }}>
          Requires Attention
        </div>
      </div>
      {onClick && (
        <div style={{
          fontSize: '1.5rem',
          opacity: 0.8
        }}>
          →
        </div>
      )}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        animation: 'pulse 3s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

// Enhanced Environmental Monitoring Component
interface EnvironmentalData {
  temperature: number;
  humidity: number;
  timestamp: Date;
  location: string;
  status: 'optimal' | 'warning' | 'critical';
}

interface EnvironmentalMonitorProps {
  data: EnvironmentalData[];
  title: string;
}

export const EnvironmentalMonitor: React.FC<EnvironmentalMonitorProps> = ({
  data,
  title
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return 'ℹ️';
    }
  };

  return (
    <div style={{
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9))'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
      backdropFilter: 'blur(12px)',
      borderRadius: '24px',
      padding: '24px',
      border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '700',
        color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
        margin: '0 0 20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🌡️</span>
        {title}
      </h3>

      <div style={{
        display: 'grid',
        gap: '16px'
      }}>
        {data.map((reading, index) => (
          <div key={index} style={{
            background: theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                fontSize: '1.5rem'
              }}>
                {getStatusIcon(reading.status)}
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  fontWeight: '500'
                }}>
                  {reading.location}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: theme === 'dark' ? '#64748b' : '#94a3b8'
                }}>
                  {reading.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div className="env-indicator" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                background: `${getStatusColor(reading.status)}20`,
                color: getStatusColor(reading.status)
              }}>
                <span>🌡️</span>
                {reading.temperature}°C
              </div>
              
              <div className="env-indicator" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                background: `${getStatusColor(reading.status)}20`,
                color: getStatusColor(reading.status)
              }}>
                <span>💧</span>
                {reading.humidity}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Quick Actions Panel
interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  type?: 'primary' | 'secondary' | 'critical' | 'emergency';
  badge?: number;
}

interface QuickActionsPanelProps {
  actions: QuickAction[];
  title?: string;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  actions,
  title = "Quick Actions"
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';

  const getActionStyle = (type: QuickAction['type']) => {
    switch (type) {
      case 'critical':
        return {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          animation: 'criticalPulse 2s ease-in-out infinite'
        };
      case 'emergency':
        return {
          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
          color: 'white',
          animation: 'emergencyPulse 1.5s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)'
        };
      case 'secondary':
        return {
          background: theme === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          color: theme === 'dark' ? '#e2e8f0' : '#475569',
          border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        };
      default:
        return {
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white'
        };
    }
  };

  return (
    <div style={{
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9))'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
      backdropFilter: 'blur(12px)',
      borderRadius: '24px',
      padding: '24px',
      border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '700',
        color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
        margin: '0 0 20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>⚡</span>
        {title}
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px'
      }}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            style={{
              ...getActionStyle(action.type),
              border: 'none',
              borderRadius: '16px',
              padding: '16px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              minHeight: '80px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '4px'
            }}>
              {action.icon}
            </div>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              {action.label}
            </span>
            {action.badge && action.badge > 0 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}>
                {action.badge > 99 ? '99+' : action.badge}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};