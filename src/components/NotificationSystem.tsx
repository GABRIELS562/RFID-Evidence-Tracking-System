import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  actionRequired?: boolean;
}

export const NotificationSystem: React.FC = () => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Temperature Alert',
        message: 'Cold Storage Unit 3 temperature rising above threshold',
        timestamp: new Date(),
        priority: 'high',
        actionRequired: true
      },
      {
        id: '2',
        type: 'success',
        title: 'Evidence Verified',
        message: 'Chain of custody verified for EVD-2024-001',
        timestamp: new Date(),
        priority: 'medium'
      },
      {
        id: '3',
        type: 'info',
        title: 'RFID Scan Complete',
        message: '247 items successfully scanned in Zone A',
        timestamp: new Date(),
        priority: 'low'
      }
    ];

    const interval = setInterval(() => {
      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      const newNotification = {
        ...randomNotification,
        id: Date.now().toString(),
        timestamp: new Date()
      };
      
      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    return (
      <div style={{
        background: getTypeColor(type),
        color: 'white',
        fontSize: '11px',
        fontWeight: '700',
        padding: '2px 6px',
        borderRadius: '4px',
        textAlign: 'center',
        minWidth: '40px'
      }}>
        {type === 'success' ? 'OK' :
         type === 'warning' ? 'WARN' :
         type === 'error' ? 'ALERT' :
         type === 'info' ? 'INFO' : 'SYS'}
      </div>
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    const colors: { [key: string]: string } = {
      low: '#10b981',
      medium: '#3b82f6',
      high: '#f59e0b',
      critical: '#ef4444'
    };

    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        background: colors[priority],
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {priority}
      </span>
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const visibleNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '24px',
      width: '380px',
      maxHeight: '80vh',
      zIndex: 9000,
    }}>
      {/* Header */}
      <div style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px 16px 0 0',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ef4444',
            animation: 'pulse 2s infinite',
          }} />
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
            margin: 0,
          }}>
            System Notifications
          </h3>
        </div>
        <span style={{
          background: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: '600',
        }}>
          {notifications.length} Active
        </span>
      </div>

      {/* Notifications Container */}
      <div style={{
        background: theme === 'dark' 
          ? 'rgba(30, 41, 59, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '0 0 16px 16px',
        maxHeight: '400px',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}>
        {visibleNotifications.length === 0 ? (
          <div style={{
            padding: '32px',
            textAlign: 'center',
            color: theme === 'dark' ? '#94a3b8' : '#64748b',
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700',
              marginBottom: '8px', 
              display: 'block',
              color: theme === 'dark' ? '#64748b' : '#94a3b8'
            }}>STATUS</div>
            No active notifications
          </div>
        ) : (
          visibleNotifications.map((notification, index) => (
            <div
              key={notification.id}
              style={{
                padding: '16px 20px',
                borderBottom: index < visibleNotifications.length - 1 
                  ? `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                  : 'none',
                position: 'relative',
                animation: 'slideInRight 0.3s ease-out',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Notification Content */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Icon */}
                <div style={{
                  fontSize: '1.5rem',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {getIcon(notification.type)}
                </div>
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px',
                  }}>
                    <h4 style={{
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                      margin: 0,
                    }}>
                      {notification.title}
                    </h4>
                    {getPriorityBadge(notification.priority)}
                  </div>
                  
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                    margin: '4px 0',
                    lineHeight: '1.4',
                  }}>
                    {notification.message}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: theme === 'dark' ? '#94a3b8' : '#94a3b8',
                    }}>
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                    
                    {notification.actionRequired && (
                      <button style={{
                        background: getTypeColor(notification.type),
                        color: 'white',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}>
                        Take Action
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Dismiss Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: theme === 'dark' ? '#64748b' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    padding: 0,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme === 'dark' ? '#64748b' : '#94a3b8';
                  }}
                >
                  ×
                </button>
              </div>
              
              {/* Side Border for Type */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                background: getTypeColor(notification.type),
                borderRadius: '0 0 0 0',
              }} />
            </div>
          ))
        )}
        
        {/* Show More/Less Button */}
        {notifications.length > 3 && (
          <div style={{
            padding: '12px',
            textAlign: 'center',
            borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
          }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#667eea',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme === 'dark' 
                  ? 'rgba(102, 126, 234, 0.1)'
                  : 'rgba(102, 126, 234, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {showAll ? 'Show Less' : `Show ${notifications.length - 3} More`}
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationSystem;