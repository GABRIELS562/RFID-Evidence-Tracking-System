import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const LoadingScreen: React.FC = () => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    { step: 0, message: 'Initializing secure connection...', icon: 'SECURE' },
    { step: 1, message: 'Authenticating forensic systems...', icon: 'AUTH' },
    { step: 2, message: 'Loading evidence database...', icon: 'DATA' },
    { step: 3, message: 'Establishing RFID connections...', icon: 'RFID' },
    { step: 4, message: 'Verifying chain of custody...', icon: 'CHAIN' },
    { step: 5, message: 'Preparing management system...', icon: 'READY' }
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 1;
        }
        return prev;
      });
    }, 40);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Enhanced Animated Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'backgroundMove 20s linear infinite'
      }} />

      {/* Professional Forensic Scanner */}
      <div style={{
        position: 'relative',
        width: '240px',
        height: '240px',
        marginBottom: '48px',
        zIndex: 2
      }}>
        {/* Outer Security Ring */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '220px',
          height: '220px',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'rotate360 30s linear infinite'
        }} />
        
        {/* Main Scanner Ring */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '180px',
          height: '180px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          borderTop: '3px solid rgba(255, 255, 255, 0.8)',
          animation: 'rotate360 3s linear infinite'
        }} />
        
        {/* Enhanced Scanning Waves */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80px',
          height: '80px',
          border: '2px solid rgba(102, 126, 234, 0.8)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'scanWave 3s ease-out infinite',
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80px',
          height: '80px',
          border: '2px solid rgba(139, 92, 246, 0.6)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'scanWave 3s ease-out infinite 0.8s',
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80px',
          height: '80px',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'scanWave 3s ease-out infinite 1.6s',
        }} />
        
        {/* Enhanced Center Icon */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          animation: 'pulse 2s ease-in-out infinite',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '700',
            color: 'white',
            textAlign: 'center'
          }}>
            {loadingSteps[loadingStep]?.icon || 'RFID'}
          </div>
        </div>
        
        {/* Advanced Scanner Lines */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '160px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.9), transparent)',
          transform: 'translate(-50%, -50%)',
          animation: 'rotate360 4s linear infinite',
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '140px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.7), transparent)',
          transform: 'translate(-50%, -50%) rotate(90deg)',
          animation: 'rotate360 6s linear infinite reverse',
        }} />
      </div>
      
      {/* Professional Loading Text */}
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        zIndex: 2
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '12px',
          textShadow: '0 2px 15px rgba(0, 0, 0, 0.3)',
          background: 'linear-gradient(135deg, #ffffff, #e0e7ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          FORENSIC EVIDENCE MANAGEMENT SYSTEM
        </h1>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '1.25rem',
          marginBottom: '8px',
          fontWeight: '600',
          letterSpacing: '0.025em'
        }}>
          RFID Evidence Tracking System
        </p>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1rem',
          marginBottom: '40px',
          fontWeight: '500'
        }}>
          ISO 17025 Compliant • Secure Chain of Custody • Real-time Monitoring
        </p>
        
        {/* Dynamic Loading Message */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '20px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'fadeInOut 0.5s ease-in-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '20px',
              animation: 'pulse 1s infinite'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                {loadingSteps[loadingStep]?.icon}
              </div>
            </span>
            <span style={{
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              {loadingSteps[loadingStep]?.message}
            </span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Progress Bar */}
      <div style={{
        width: '400px',
        maxWidth: '80vw',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        overflow: 'hidden',
        height: '8px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 2
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #8b5cf6)',
          borderRadius: '12px',
          transition: 'width 0.3s ease-out',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            animation: 'shimmer 2s infinite'
          }} />
        </div>
      </div>
      
      {/* Progress Percentage */}
      <div style={{
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '16px',
        fontFamily: 'monospace',
        zIndex: 2
      }}>
        {progress}% Complete
      </div>
      
      {/* Security Indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        flexWrap: 'wrap',
        marginTop: '24px',
        zIndex: 2
      }}>
        {[
          { icon: 'ENC', label: 'Encrypted', active: loadingStep >= 0 },
          { icon: 'VRFY', label: 'Verified', active: loadingStep >= 2 },
          { icon: 'CONN', label: 'Connected', active: loadingStep >= 4 },
          { icon: 'SEC', label: 'Secure', active: loadingStep >= 5 }
        ].map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: item.active ? 1 : 0.4,
            transition: 'opacity 0.5s ease'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: item.active 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
                : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              border: item.active ? '2px solid #10b981' : '2px solid rgba(255, 255, 255, 0.3)',
              animation: item.active ? 'pulse 2s infinite' : 'none'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: item.active ? 'white' : 'rgba(255, 255, 255, 0.6)'
              }}>
                {item.icon}
              </div>
            </div>
            <span style={{
              color: item.active ? 'white' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scanWave {
          0% {
            width: 80px;
            height: 80px;
            opacity: 0.8;
          }
          100% {
            width: 240px;
            height: 240px;
            opacity: 0;
          }
        }
        
        @keyframes rotate360 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes backgroundMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.05); 
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;