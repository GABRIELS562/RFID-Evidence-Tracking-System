/**
 * Client Demo Page - Impressive 3D Warehouse and Live Tracking Demo
 * Professional showcase for client presentations
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2,
  Settings, Download, Share2, Star, Award, TrendingUp, Activity,
  Package, Users, Clock, Shield, MapPin, AlertTriangle, CheckCircle,
  Eye, Layers, BarChart3, Calendar, Zap, Globe, Database, Cpu,
  Monitor, Smartphone, TabletSmartphone, MousePointer, Keyboard,
  ChevronRight, ChevronLeft, RotateCw, Home
} from 'lucide-react';
import EnhancedWarehouse3D from '../components/EnhancedWarehouse3D';
import LiveDocketTracker from '../components/LiveDocketTracker';
import WarehouseHeatmap from '../components/WarehouseHeatmap';
import DocketTimeline from '../components/DocketTimeline';
import ChainOfCustody from '../components/ChainOfCustody';

interface DemoSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  component: React.ReactNode;
  features: string[];
  stats?: { [key: string]: string | number };
  duration?: number; // seconds
}

const ClientDemo: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [demoProgress, setDemoProgress] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<'warehouse' | 'tracking' | 'timeline' | 'custody' | 'overview'>('overview');
  
  const demoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>();
  
  // Demo sections configuration
  const demoSections: DemoSection[] = [
    {
      id: 'overview',
      title: 'RFID Docket Tracking System',
      subtitle: 'Next-Generation Forensic Evidence Management',
      description: 'A comprehensive, AI-powered solution for tracking and managing forensic evidence throughout the entire chain of custody.',
      features: [
        'Real-time RFID tracking across multiple facilities',
        'Advanced 3D warehouse visualization',
        'Digital chain of custody with cryptographic signatures',
        'Predictive analytics and workflow optimization',
        'South African law enforcement compliance',
        'Multi-language support (English, Afrikaans, Zulu)',
        'Mobile field operations support',
        '99.9% uptime guarantee with enterprise scalability'
      ],
      stats: {
        'Active Dockets': '12,847',
        'Evidence Items': '94,326',
        'RFID Readers': '156',
        'Locations': '23',
        'Daily Scans': '8,934',
        'Uptime': '99.97%'
      },
      component: (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          height: '600px',
        }}>
          <EnhancedWarehouse3D 
            demoMode={true}
            enableSound={soundEnabled}
            showHeatmap={true}
            showMinimap={true}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              padding: '20px',
              flex: 1,
            }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Activity size={20} />
                Live System Status
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '12px',
              }}>
                <div style={{
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                    98.7%
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    Capacity
                  </div>
                </div>
                <div style={{
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                    247
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    Active
                  </div>
                </div>
                <div style={{
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                    23
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    In Transit
                  </div>
                </div>
                <div style={{
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                    2
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    Alerts
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              padding: '20px',
              flex: 1,
            }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <TrendingUp size={20} />
                Performance Metrics
              </h3>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Processing Speed:</span>
                  <strong style={{ color: '#10b981' }}>2.3ms avg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Read Accuracy:</span>
                  <strong style={{ color: '#10b981' }}>99.94%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Data Integrity:</span>
                  <strong style={{ color: '#10b981' }}>100%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Network Latency:</span>
                  <strong style={{ color: '#3b82f6' }}>12ms</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Battery Life:</span>
                  <strong style={{ color: '#f59e0b' }}>87%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 30,
    },
    {
      id: 'warehouse3d',
      title: '3D Warehouse Visualization',
      subtitle: 'Immersive Multi-Floor Evidence Storage',
      description: 'Navigate through a photorealistic 3D representation of your evidence storage facilities with real-time occupancy, environmental monitoring, and predictive analytics.',
      features: [
        '4-floor multi-level warehouse rendering',
        'Zone-based color coding (Evidence, Analysis, Archive, Quarantine)',
        'Real-time RFID tag movement animations',
        'Heat map overlay showing activity levels',
        'Interactive mini-map with drill-down capability',
        'Smooth 60fps animations with Level-of-Detail optimization',
        'Environmental condition monitoring per zone',
        'Predictive workflow visualization'
      ],
      stats: {
        'Storage Racks': '1,247',
        'Zones': '6',
        'Floors': '4',
        'Occupancy': '78.4%',
        'Peak Activity': '92%',
        'Environmental Alerts': '0'
      },
      component: <EnhancedWarehouse3D demoMode={true} enableSound={soundEnabled} />,
      duration: 25,
    },
    {
      id: 'livetracking',
      title: 'Live Docket Tracking',
      subtitle: 'Real-Time Evidence Journey Monitoring',
      description: 'Follow evidence through every step of the forensic process with GPS coordinates, environmental sensors, and predictive next-location algorithms.',
      features: [
        'GPS-accurate location tracking',
        'Real-time environmental monitoring (temperature, humidity)',
        'Chain of custody timeline with digital signatures',
        'Predictive analytics for next location',
        'Multi-personnel interaction tracking',
        'Alert system for unusual activity patterns',
        'Mobile field operations integration',
        'Court preparation workflow automation'
      ],
      stats: {
        'Active Tracks': '247',
        'Avg Transit Time': '3.2hrs',
        'Location Accuracy': '99.2%',
        'Prediction Accuracy': '87.4%',
        'Alert Response': '1.4min',
        'Court Readiness': '94%'
      },
      component: <LiveDocketTracker enableNotifications={true} autoRefresh={true} />,
      duration: 20,
    },
    {
      id: 'timeline',
      title: 'Interactive Timeline',
      subtitle: 'Complete Evidence Journey Visualization',
      description: 'Comprehensive timeline showing every interaction, movement, and analysis performed on evidence items with full audit capabilities.',
      features: [
        'Chronological event visualization',
        'Personnel interaction tracking',
        'Environmental condition logging',
        'Digital signature verification',
        'Evidence photo documentation',
        'Playback mode for historical analysis',
        'Export capabilities for court presentations',
        'Multi-language court report generation'
      ],
      stats: {
        'Timeline Events': '15,934',
        'Digital Signatures': '8,247',
        'Court Reports': '1,247',
        'Verification Rate': '99.8%',
        'Avg Event Detail': '15 fields',
        'Export Formats': '7'
      },
      component: <DocketTimeline docketId="LAB2024-0847" enablePlayback={true} />,
      duration: 18,
    },
    {
      id: 'custody',
      title: 'Digital Chain of Custody',
      subtitle: 'Cryptographically Secured Evidence Trail',
      description: 'Legally compliant digital chain of custody with blockchain-verified signatures, tamper-evident seals, and court-admissible documentation.',
      features: [
        'Cryptographic digital signatures (RSA-2048, ECDSA)',
        'Blockchain-based tamper evidence',
        'Biometric verification integration',
        'Legal compliance with South African law',
        'Automated court document generation',
        'Multi-witness signature support',
        'Environmental condition attestation',
        'Print-ready legal certificates'
      ],
      stats: {
        'Custody Entries': '94,326',
        'Digital Signatures': '156,824',
        'Verifications': '99.97%',
        'Legal Challenges': '0',
        'Court Acceptance': '100%',
        'Tamper Incidents': '0'
      },
      component: <ChainOfCustody docketId="LAB2024-0847" showDetails={true} />,
      duration: 22,
    }
  ];
  
  // Auto-advance demo sections
  useEffect(() => {
    if (isPlaying && autoAdvance) {
      const duration = demoSections[currentSection]?.duration || 20;
      progressRef.current = window.setInterval(() => {
        setDemoProgress(prev => {
          const next = prev + (100 / (duration * 10)); // 10 updates per second
          if (next >= 100) {
            // Auto advance to next section
            setCurrentSection(prevSection => 
              prevSection < demoSections.length - 1 ? prevSection + 1 : 0
            );
            return 0;
          }
          return next;
        });
      }, 100);
    }
    
    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [currentSection, isPlaying, autoAdvance, demoSections.length]);
  
  // Reset progress when section changes
  useEffect(() => {
    setDemoProgress(0);
  }, [currentSection]);
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      demoRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'ArrowRight':
          nextSection();
          break;
        case 'ArrowLeft':
          prevSection();
          break;
        case 'Escape':
          if (fullscreen) {
            document.exitFullscreen();
            setFullscreen(false);
          }
          break;
        case 'h':
          setShowControls(!showControls);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, fullscreen, showControls]);
  
  const nextSection = () => {
    setCurrentSection(prev => prev < demoSections.length - 1 ? prev + 1 : prev);
    setDemoProgress(0);
  };
  
  const prevSection = () => {
    setCurrentSection(prev => prev > 0 ? prev - 1 : prev);
    setDemoProgress(0);
  };
  
  const playSound = (type: 'click' | 'transition' | 'success') => {
    if (!soundEnabled) return;
    // In a real implementation, play actual sound effects
    console.log(`Playing ${type} sound`);
  };
  
  const currentDemo = demoSections[currentSection];
  
  return (
    <div
      ref={demoRef}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f172a 50%, #1e293b 100%)',
        color: 'white',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Animated background pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, transparent 40%, rgba(99, 102, 241, 0.05) 50%, transparent 60%)
        `,
        animation: 'backgroundShift 20s ease-in-out infinite alternate',
        zIndex: 0,
      }} />
      
      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '30px 40px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1600px',
          margin: '0 auto',
        }}>
          {/* Logo and title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
            }}>
              <Shield size={32} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                SAPS Forensic Lab Demo
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '4px 0 0 0',
              }}>
                Advanced RFID Evidence Tracking & Management System
              </p>
            </div>
          </div>
          
          {/* Demo navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '10px 15px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}>
            {demoSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => {
                  setCurrentSection(index);
                  setDemoProgress(0);
                  playSound('click');
                }}
                style={{
                  padding: '8px 16px',
                  background: index === currentSection 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' 
                    : 'transparent',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: index === currentSection ? '600' : '400',
                  transition: 'all 0.3s',
                  boxShadow: index === currentSection ? '0 5px 15px rgba(59, 130, 246, 0.3)' : 'none',
                }}
              >
                {section.title}
              </button>
            ))}
          </div>
          
          {/* System status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 2s infinite',
              }} />
              Live Demo
            </div>
            <div>
              <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
          width: `${demoProgress}%`,
          transition: 'width 0.1s ease',
        }} />
      </div>
      
      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '40px',
        maxWidth: '1600px',
        margin: '0 auto',
      }}>
        {/* Section header */}
        <div style={{
          marginBottom: '30px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {currentDemo.title}
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#60a5fa',
            margin: '0 0 15px 0',
            fontWeight: '500',
          }}>
            {currentDemo.subtitle}
          </p>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            {currentDemo.description}
          </p>
        </div>
        
        {/* Demo component */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glowing edges */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)',
          }} />
          
          {currentDemo.component}
        </div>
        
        {/* Features and stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
        }}>
          {/* Features */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '25px',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 20px 0',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Star size={20} color="#60a5fa" />
              Key Features
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '12px',
            }}>
              {currentDemo.features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <CheckCircle size={16} color="#10b981" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Statistics */}
          {currentDemo.stats && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '25px',
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 20px 0',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <BarChart3 size={20} color="#60a5fa" />
                Live Statistics
              </h3>
              <div style={{
                display: 'grid',
                gap: '12px',
              }}>
                {Object.entries(currentDemo.stats).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 15px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <span style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}>
                      {key}:
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#10b981',
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls overlay */}
      {showControls && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '15px 25px',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
        }}>
          <button
            onClick={() => {
              prevSection();
              playSound('click');
            }}
            disabled={currentSection === 0}
            style={{
              padding: '10px',
              background: 'transparent',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: currentSection === 0 ? 'rgba(255, 255, 255, 0.3)' : 'white',
              cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <SkipBack size={18} />
          </button>
          
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              playSound('click');
            }}
            style={{
              padding: '12px',
              background: isPlaying 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={() => {
              nextSection();
              playSound('click');
            }}
            disabled={currentSection === demoSections.length - 1}
            style={{
              padding: '10px',
              background: 'transparent',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: currentSection === demoSections.length - 1 ? 'rgba(255, 255, 255, 0.3)' : 'white',
              cursor: currentSection === demoSections.length - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <SkipForward size={18} />
          </button>
          
          <div style={{
            width: '1px',
            height: '30px',
            background: 'rgba(59, 130, 246, 0.3)',
            margin: '0 5px',
          }} />
          
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound('click');
            }}
            style={{
              padding: '8px',
              background: 'transparent',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: soundEnabled ? '#10b981' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
            }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          <button
            onClick={() => {
              setAutoAdvance(!autoAdvance);
              playSound('click');
            }}
            style={{
              padding: '8px',
              background: 'transparent',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: autoAdvance ? '#10b981' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
            }}
            title="Auto Advance"
          >
            <RotateCw size={16} />
          </button>
          
          <button
            onClick={() => {
              toggleFullscreen();
              playSound('click');
            }}
            style={{
              padding: '8px',
              background: 'transparent',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            <Maximize2 size={16} />
          </button>
          
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span>{currentSection + 1} / {demoSections.length}</span>
            <div style={{
              width: '60px',
              height: '4px',
              background: 'rgba(59, 130, 246, 0.3)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                background: '#10b981',
                width: `${demoProgress}%`,
                transition: 'width 0.1s ease',
              }} />
            </div>
          </div>
        </div>
      )}
      
      {/* Help text */}
      {showControls && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          right: '30px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '10px 15px',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1000,
        }}>
          <div>Keyboard: Space=Play/Pause • ←→=Navigate • H=Hide Controls • F=Fullscreen</div>
        </div>
      )}
      
      {/* Company watermark */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.3)',
        zIndex: 1000,
      }}>
        © 2024 SAPS Forensic Technology Division • Confidential Demo
      </div>
      
      <style>{`
        @keyframes backgroundShift {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(20px) translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ClientDemo;