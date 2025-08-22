/**
 * Enhanced 3D Warehouse Visualization Component
 * Professional forensic lab warehouse with multiple floors, zones, and real-time tracking
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Package, Tag, Activity, AlertCircle, RotateCw, ZoomIn, ZoomOut, 
  Layers, Map, Navigation, Maximize2, Volume2, VolumeX, Download,
  Search, Filter, Eye, EyeOff, Play, Pause, Clock, TrendingUp,
  Truck, Shield, Thermometer, Droplets, ChevronUp, ChevronDown
} from 'lucide-react';

// Zone color mappings for different areas
const ZONE_COLORS = {
  evidence: { primary: '#3b82f6', secondary: '#2563eb', glow: 'rgba(59, 130, 246, 0.5)' },
  analysis: { primary: '#10b981', secondary: '#059669', glow: 'rgba(16, 185, 129, 0.5)' },
  archive: { primary: '#6366f1', secondary: '#4f46e5', glow: 'rgba(99, 102, 241, 0.5)' },
  quarantine: { primary: '#ef4444', secondary: '#dc2626', glow: 'rgba(239, 68, 68, 0.5)' },
  transit: { primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245, 158, 11, 0.5)' },
  secure: { primary: '#8b5cf6', secondary: '#7c3aed', glow: 'rgba(139, 92, 246, 0.5)' }
};

interface RackProps {
  id: string;
  x: number;
  y: number;
  z: number;
  floor: number;
  zone: keyof typeof ZONE_COLORS;
  occupied: number; // 0-100 percentage
  items: Array<{ id: string; label: string; status: string }>;
  selected: boolean;
  heatLevel: number; // 0-100 activity level
  onClick: () => void;
}

const Rack3D: React.FC<RackProps> = ({ 
  id, x, y, z, floor, zone, occupied, items, selected, heatLevel, onClick 
}) => {
  const [hovered, setHovered] = useState(false);
  const colors = ZONE_COLORS[zone];
  
  // Calculate rack height based on floor
  const rackHeight = 120;
  const floorOffset = floor * 150;
  
  // Heat map color interpolation
  const heatColor = useMemo(() => {
    const heat = heatLevel / 100;
    const r = Math.floor(255 * heat);
    const g = Math.floor(255 * (1 - heat));
    return `rgb(${r}, ${g}, 100)`;
  }, [heatLevel]);
  
  return (
    <div
      className="rack-3d"
      style={{
        transform: `translate3d(${x * 100}px, ${-y * rackHeight - floorOffset}px, ${z * 100}px)`,
        transformStyle: 'preserve-3d',
        position: 'absolute',
        width: '80px',
        height: `${rackHeight}px`,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: selected ? 'brightness(1.3)' : 'brightness(1)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rack shelves (4 levels) */}
      {[0, 1, 2, 3].map((shelf) => {
        const shelfOccupied = occupied > (shelf * 25);
        const shelfY = shelf * 30;
        
        return (
          <div key={`shelf-${shelf}`}>
            {/* Front face */}
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '25px',
              bottom: `${shelfY}px`,
              background: shelfOccupied
                ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                : 'rgba(55, 65, 81, 0.3)',
              border: `1px solid ${hovered ? colors.glow : 'rgba(59, 130, 246, 0.2)'}`,
              transform: 'translateZ(40px)',
              boxShadow: hovered ? `0 0 20px ${colors.glow}` : 'none',
              opacity: shelfOccupied ? 0.9 + (heatLevel / 1000) : 0.4,
            }}>
              {shelfOccupied && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60%',
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${heatColor}, transparent)`,
                  animation: heatLevel > 50 ? 'pulse 1s infinite' : 'none',
                }} />
              )}
            </div>
            
            {/* Back face */}
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '25px',
              bottom: `${shelfY}px`,
              background: shelfOccupied
                ? `linear-gradient(135deg, ${colors.secondary} 0%, #1e293b 100%)`
                : 'rgba(55, 65, 81, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              transform: 'rotateY(180deg) translateZ(40px)',
            }} />
            
            {/* Side faces */}
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '25px',
              bottom: `${shelfY}px`,
              background: shelfOccupied
                ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%)`
                : 'rgba(55, 65, 81, 0.25)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              transform: 'rotateY(90deg) translateZ(40px)',
            }} />
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '25px',
              bottom: `${shelfY}px`,
              background: shelfOccupied
                ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%)`
                : 'rgba(55, 65, 81, 0.25)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              transform: 'rotateY(-90deg) translateZ(40px)',
            }} />
          </div>
        );
      })}
      
      {/* Rack frame */}
      {['0', '80'].map((xPos) => (
        ['0', '80'].map((zPos) => (
          <div
            key={`pole-${xPos}-${zPos}`}
            style={{
              position: 'absolute',
              width: '4px',
              height: `${rackHeight}px`,
              background: 'linear-gradient(180deg, #475569 0%, #334155 100%)',
              transform: `translate3d(${parseInt(xPos) - 2}px, 0, ${parseInt(zPos) - 40}px)`,
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
          />
        ))
      ))}
      
      {/* Floating label and info */}
      {(hovered || selected) && (
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          whiteSpace: 'nowrap',
          zIndex: 10000,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.glow}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 20px ${colors.glow}`,
        }}>
          <div style={{ fontWeight: 600, marginBottom: '4px', color: colors.primary }}>
            {id} - {zone.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '10px' }}>
            <span>Capacity: {occupied}%</span>
            <span>Items: {items.length}</span>
            <span>Activity: {heatLevel}%</span>
          </div>
          {items.length > 0 && (
            <div style={{ marginTop: '4px', fontSize: '9px', opacity: 0.8 }}>
              Latest: {items[0].label}
            </div>
          )}
        </div>
      )}
      
      {/* Activity indicator */}
      {heatLevel > 70 && (
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: heatColor,
          boxShadow: `0 0 20px ${heatColor}`,
          animation: 'pulse 1s infinite',
        }} />
      )}
    </div>
  );
};

interface MovingItemProps {
  id: string;
  startPos: [number, number, number];
  endPos: [number, number, number];
  progress: number;
  type: 'docket' | 'evidence' | 'robot';
}

const MovingItem: React.FC<MovingItemProps> = ({ id, startPos, endPos, progress, type }) => {
  const currentPos = useMemo(() => {
    return [
      startPos[0] + (endPos[0] - startPos[0]) * progress,
      startPos[1] + (endPos[1] - startPos[1]) * progress,
      startPos[2] + (endPos[2] - startPos[2]) * progress,
    ];
  }, [startPos, endPos, progress]);
  
  const icon = type === 'robot' ? '🤖' : type === 'evidence' ? '📦' : '📋';
  const color = type === 'robot' ? '#f59e0b' : type === 'evidence' ? '#3b82f6' : '#10b981';
  
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate3d(${currentPos[0] * 100}px, ${-currentPos[1] * 120}px, ${currentPos[2] * 100}px)`,
        width: '30px',
        height: '30px',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'float 2s ease-in-out infinite',
        filter: `drop-shadow(0 0 10px ${color})`,
      }}
    >
      {icon}
      <div style={{
        position: 'absolute',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        animation: 'pulse 2s infinite',
      }} />
    </div>
  );
};

interface EnhancedWarehouse3DProps {
  onRackClick?: (rackId: string) => void;
  showHeatmap?: boolean;
  showMinimap?: boolean;
  enableSound?: boolean;
  demoMode?: boolean;
}

const EnhancedWarehouse3D: React.FC<EnhancedWarehouse3DProps> = ({
  onRackClick,
  showHeatmap = true,
  showMinimap = true,
  enableSound = false,
  demoMode = false,
}) => {
  const [rotationX, setRotationX] = useState(-25);
  const [rotationY, setRotationY] = useState(45);
  const [zoom, setZoom] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRack, setSelectedRack] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'top' | 'side'>('3d');
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isPlaying, setIsPlaying] = useState(demoMode);
  const [movingItems, setMovingItems] = useState<MovingItemProps[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  // Generate warehouse structure
  const warehouseData = useMemo(() => {
    const floors = 4;
    const racksPerFloor = [];
    const zones: Array<keyof typeof ZONE_COLORS> = ['evidence', 'analysis', 'archive', 'quarantine', 'transit', 'secure'];
    
    for (let floor = 0; floor < floors; floor++) {
      const floorRacks = [];
      for (let x = 0; x < 8; x++) {
        for (let z = 0; z < 6; z++) {
          // Create aisles
          if (x % 3 === 1) continue;
          
          const zone = zones[Math.floor((x + z) / 3) % zones.length];
          const occupied = Math.floor(Math.random() * 100);
          const heatLevel = Math.floor(Math.random() * 100);
          const items = [];
          
          if (occupied > 30) {
            for (let i = 0; i < Math.floor(occupied / 20); i++) {
              items.push({
                id: `ITEM-${floor}-${x}-${z}-${i}`,
                label: `LAB${Math.floor(Math.random() * 9000) + 1000}/25`,
                status: 'stored'
              });
            }
          }
          
          floorRacks.push({
            id: `RACK-F${floor}-${x}-${z}`,
            x: x - 4,
            y: 0,
            z: z - 3,
            floor,
            zone,
            occupied,
            items,
            heatLevel,
          });
        }
      }
      racksPerFloor.push(floorRacks);
    }
    
    return racksPerFloor;
  }, []);
  
  // Handle mouse wheel with non-passive listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => Math.max(0.3, Math.min(2, prev - e.deltaY * 0.0005)));
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);
  
  // Demo mode animation
  useEffect(() => {
    if (isPlaying && demoMode) {
      const animate = () => {
        // Rotate warehouse slowly
        setRotationY(prev => (prev + 0.5) % 360);
        
        // Add random moving items
        if (Math.random() > 0.95) {
          const types: Array<'docket' | 'evidence' | 'robot'> = ['docket', 'evidence', 'robot'];
          const newItem: MovingItemProps = {
            id: `MOVE-${Date.now()}`,
            startPos: [Math.random() * 6 - 3, 0, Math.random() * 4 - 2],
            endPos: [Math.random() * 6 - 3, Math.random() * 3, Math.random() * 4 - 2],
            progress: 0,
            type: types[Math.floor(Math.random() * types.length)]
          };
          setMovingItems(prev => [...prev.slice(-5), newItem]);
        }
        
        // Update moving items progress
        setMovingItems(prev => prev.map(item => ({
          ...item,
          progress: Math.min(1, item.progress + 0.02)
        })).filter(item => item.progress < 1));
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, demoMode]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(-90, Math.min(0, prev - deltaY * 0.5)));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch(e.key.toLowerCase()) {
      case 'w': setRotationX(prev => Math.min(0, prev + 5)); break;
      case 's': setRotationX(prev => Math.max(-90, prev - 5)); break;
      case 'a': setRotationY(prev => prev - 5); break;
      case 'd': setRotationY(prev => prev + 5); break;
      case '+': 
      case '=': setZoom(prev => Math.min(2, prev + 0.1)); break;
      case '-': setZoom(prev => Math.max(0.3, prev - 0.1)); break;
      case 'r': resetView(); break;
      case 'f': toggleFullscreen(); break;
      case 'g': setShowGrid(prev => !prev); break;
      case 'l': setShowLabels(prev => !prev); break;
      case ' ': 
        e.preventDefault();
        setIsPlaying(prev => !prev); 
        break;
    }
  }, []);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const resetView = () => {
    setRotationX(-25);
    setRotationY(45);
    setZoom(0.8);
    setSelectedFloor(null);
    setSelectedRack(null);
    setViewMode('3d');
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  const exportView = () => {
    // In a real implementation, this would use html2canvas or similar
    console.log('Exporting 3D view...');
  };
  
  const playSound = (type: 'scan' | 'alert' | 'move') => {
    if (!soundEnabled) return;
    // In a real implementation, play actual sound effects
    console.log(`Playing ${type} sound`);
  };
  
  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '800px',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #0f172a 50%, #1e293b 100%)',
        border: '2px solid var(--border-primary, #334155)',
        borderRadius: 'var(--radius-xl, 16px)',
        position: 'relative',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Animated background grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
        `,
        backgroundSize: '50px 50px, 50px 50px, 100% 100%',
        opacity: showGrid ? 0.5 : 0,
        animation: 'gridMove 20s linear infinite',
        transition: 'opacity 0.3s',
      }} />
      
      {/* 3D Scene Container */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${zoom})`,
        transformStyle: 'preserve-3d',
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Multiple floors */}
          {warehouseData.map((floorRacks, floorIndex) => (
            <div key={`floor-${floorIndex}`} style={{
              transformStyle: 'preserve-3d',
              opacity: selectedFloor === null || selectedFloor === floorIndex ? 1 : 0.3,
              transition: 'opacity 0.3s',
            }}>
              {/* Floor plane */}
              <div style={{
                position: 'absolute',
                width: '800px',
                height: '600px',
                transform: `rotateX(90deg) translateZ(${-floorIndex * 150 - 10}px) translate(-400px, -300px)`,
                background: `linear-gradient(135deg, 
                  rgba(30, 41, 59, ${floorIndex === 0 ? 0.9 : 0.4}) 0%, 
                  rgba(15, 23, 42, ${floorIndex === 0 ? 0.9 : 0.4}) 100%)`,
                border: '2px solid rgba(59, 130, 246, 0.2)',
                boxShadow: `0 0 50px rgba(59, 130, 246, 0.1), inset 0 0 100px rgba(0,0,0,0.5)`,
              }}>
                {/* Floor grid */}
                {showGrid && Array.from({ length: 9 }, (_, i) => (
                  <React.Fragment key={`floor-grid-${i}`}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: `${i * 100}px`,
                      width: '1px',
                      height: '600px',
                      background: 'rgba(59, 130, 246, 0.1)',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: `${i * 75}px`,
                      left: 0,
                      width: '800px',
                      height: '1px',
                      background: 'rgba(59, 130, 246, 0.1)',
                    }} />
                  </React.Fragment>
                ))}
                
                {/* Floor label */}
                {showLabels && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}>
                    FLOOR {floorIndex + 1}
                  </div>
                )}
              </div>
              
              {/* Racks on this floor */}
              {floorRacks.map((rack) => (
                <Rack3D
                  key={rack.id}
                  {...rack}
                  selected={selectedRack === rack.id}
                  onClick={() => {
                    setSelectedRack(rack.id);
                    onRackClick?.(rack.id);
                    playSound('scan');
                  }}
                />
              ))}
            </div>
          ))}
          
          {/* Moving items */}
          {movingItems.map((item) => (
            <MovingItem key={item.id} {...item} />
          ))}
          
          {/* Entry/Exit gates */}
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '150px',
            transform: 'translate3d(-450px, -150px, 0)',
            transformStyle: 'preserve-3d',
          }}>
            <div style={{
              position: 'absolute',
              width: '100px',
              height: '150px',
              background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
              transform: 'rotateY(0deg)',
              borderRadius: '10px 10px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            }}>
              ENTRY
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '150px',
            transform: 'translate3d(350px, -150px, 0)',
            transformStyle: 'preserve-3d',
          }}>
            <div style={{
              position: 'absolute',
              width: '100px',
              height: '150px',
              background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
              transform: 'rotateY(0deg)',
              borderRadius: '10px 10px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
            }}>
              EXIT
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Controls Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '10px 15px',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
      }}>
        <button
          onClick={() => setViewMode('3d')}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: viewMode === '3d' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Layers size={14} /> 3D View
        </button>
        <button
          onClick={() => setViewMode('top')}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: viewMode === 'top' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Map size={14} /> Top View
        </button>
        <button
          onClick={() => setViewMode('side')}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: viewMode === 'side' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Navigation size={14} /> Side View
        </button>
      </div>
      
      {/* Right Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <button
          onClick={() => setZoom(prev => Math.min(2, prev + 0.2))}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          title="Zoom In (+ key)"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.3, prev - 0.2))}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          title="Zoom Out (- key)"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={resetView}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          title="Reset View (R key)"
        >
          <RotateCw size={20} />
        </button>
        <button
          onClick={toggleFullscreen}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          title="Fullscreen (F key)"
        >
          <Maximize2 size={20} />
        </button>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button
          onClick={exportView}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          title="Export View"
        >
          <Download size={20} />
        </button>
      </div>
      
      {/* Floor Selector */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '10px',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
      }}>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '5px',
          textAlign: 'center',
        }}>
          FLOORS
        </div>
        {[3, 2, 1, 0].map((floor) => (
          <button
            key={`floor-btn-${floor}`}
            onClick={() => setSelectedFloor(selectedFloor === floor ? null : floor)}
            style={{
              width: '50px',
              height: '35px',
              borderRadius: '6px',
              background: selectedFloor === floor 
                ? 'rgba(59, 130, 246, 0.3)' 
                : 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: selectedFloor === floor ? 'bold' : 'normal',
            }}
          >
            F{floor + 1}
          </button>
        ))}
        <button
          onClick={() => setSelectedFloor(null)}
          style={{
            width: '50px',
            height: '35px',
            borderRadius: '6px',
            background: selectedFloor === null 
              ? 'rgba(59, 130, 246, 0.3)' 
              : 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: selectedFloor === null ? 'bold' : 'normal',
          }}
        >
          ALL
        </button>
      </div>
      
      {/* Statistics Dashboard */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '15px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: 'white',
        fontSize: '13px',
        minWidth: '200px',
      }}>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#60a5fa',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Activity size={16} /> Warehouse Statistics
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Capacity:</span>
            <span style={{ fontWeight: 'bold' }}>72%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Active Items:</span>
            <span style={{ fontWeight: 'bold', color: '#10b981' }}>1,247</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>In Transit:</span>
            <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{movingItems.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Quarantine:</span>
            <span style={{ fontWeight: 'bold', color: '#ef4444' }}>23</span>
          </div>
          
          <div style={{ 
            marginTop: '10px', 
            paddingTop: '10px', 
            borderTop: '1px solid rgba(59, 130, 246, 0.2)' 
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '5px' }}>
              Zone Distribution
            </div>
            {Object.entries(ZONE_COLORS).map(([zone, colors]) => (
              <div key={zone} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '4px',
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: colors.primary,
                }} />
                <span style={{ fontSize: '11px', flex: 1, textTransform: 'capitalize' }}>{zone}</span>
                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
                  {Math.floor(Math.random() * 300) + 100}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mini Map */}
      {showMinimap && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '150px',
          height: '150px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '10px',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transform: 'rotateX(-90deg)',
            transformStyle: 'preserve-3d',
          }}>
            {warehouseData[selectedFloor ?? 0].map((rack) => (
              <div
                key={`minimap-${rack.id}`}
                style={{
                  position: 'absolute',
                  left: `${(rack.x + 4) * 12.5}%`,
                  top: `${(rack.z + 3) * 16.66}%`,
                  width: '10px',
                  height: '10px',
                  background: ZONE_COLORS[rack.zone].primary,
                  borderRadius: '2px',
                  opacity: rack.occupied / 100,
                  border: selectedRack === rack.id ? '2px solid white' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Keyboard Shortcuts Help */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '11px',
        display: 'flex',
        gap: '15px',
      }}>
        <span>🖱️ Drag to rotate</span>
        <span>⚲ Scroll to zoom</span>
        <span>WASD Navigate</span>
        <span>Space Play/Pause</span>
        <span>R Reset</span>
        <span>F Fullscreen</span>
      </div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
        
        @keyframes gridMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(50px) translateY(50px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px currentColor; }
          50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
        }
      `}</style>
    </div>
  );
};

export default EnhancedWarehouse3D;