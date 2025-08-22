import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LabUnit {
  id: string;
  name: string;
  type: 'forensic' | 'security' | 'public' | 'private' | 'storage';
  color: string;
  icon: string;
  x: number;
  y: number;
  radius: number;
  itemCount?: number;
  lastActivity?: string;
  status?: 'active' | 'inactive' | 'alert';
}

interface RfidTag {
  id: string;
  x: number;
  y: number;
  unit: string;
}

export default function ForensicLab2D() {
  const [labUnits, setLabUnits] = useState<LabUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<LabUnit | null>(null);
  const [rfidTags, setRfidTags] = useState<RfidTag[]>([]);
  const [activeEvents, setActiveEvents] = useState<Map<string, number>>(new Map());

  // Initialize forensic lab units based on actual site plan
  useEffect(() => {
    const units: LabUnit[] = [
      // Forensic Units (Central Circular Area)
      { 
        id: 'explosives-unit', 
        name: 'Explosives Unit', 
        type: 'forensic', 
        color: '#FF4444', 
        icon: '🧨',
        x: 400, 
        y: 200, 
        radius: 60,
        itemCount: 0,
        status: 'active'
      },
      { 
        id: 'chemistry-unit', 
        name: 'Chemistry Unit', 
        type: 'forensic', 
        color: '#44BB44', 
        icon: '🧪',
        x: 500, 
        y: 250, 
        radius: 60,
        itemCount: 0,
        status: 'active'
      },
      { 
        id: 'fraud-unit', 
        name: 'Fraud Unit', 
        type: 'forensic', 
        color: '#4444FF', 
        icon: '📄',
        x: 500, 
        y: 350, 
        radius: 60,
        itemCount: 0,
        status: 'active'
      },
      { 
        id: 'biology-unit', 
        name: 'Biology Unit', 
        type: 'forensic', 
        color: '#BB44BB', 
        icon: '🧬',
        x: 400, 
        y: 400, 
        radius: 60,
        itemCount: 0,
        status: 'active'
      },
      { 
        id: 'ballistics-unit', 
        name: 'Ballistics Unit', 
        type: 'forensic', 
        color: '#666666', 
        icon: '🔫',
        x: 300, 
        y: 350, 
        radius: 60,
        itemCount: 0,
        status: 'active'
      },
      // Central Hub
      { 
        id: 'central-hub', 
        name: 'Central Hub', 
        type: 'private', 
        color: '#888888', 
        icon: '🚪',
        x: 400, 
        y: 300, 
        radius: 40,
        itemCount: 0,
        status: 'active'
      },
      // Security and Storage
      { 
        id: 'main-security', 
        name: 'Main Security', 
        type: 'security', 
        color: '#FFA500', 
        icon: '🛡️',
        x: 150, 
        y: 300, 
        radius: 40,
        itemCount: 0,
        status: 'active'
      },
      { 
        id: 'evidence-intake', 
        name: 'Evidence Intake', 
        type: 'storage', 
        color: '#FFCC00', 
        icon: '📦',
        x: 650, 
        y: 300, 
        radius: 40,
        itemCount: 0,
        status: 'active'
      },
      { 
        id: 'evidence-vault', 
        name: 'Evidence Vault', 
        type: 'storage', 
        color: '#8B4513', 
        icon: '🔐',
        x: 650, 
        y: 400, 
        radius: 50,
        itemCount: 0,
        status: 'active'
      }
    ];
    
    setLabUnits(units);
    
    // Fetch real data
    fetchUnitData();
    const interval = setInterval(fetchUnitData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnitData = async () => {
    try {
      const response = await axios.get('/api/rfid/zones');
      if (response.data.zones) {
        setLabUnits(prevUnits => {
          return prevUnits.map(unit => {
            const zoneData = response.data.zones.find((z: any) => 
              z.zone.id.replace('-lab', '-unit') === unit.id || 
              z.zone.id === unit.id.replace('-unit', '-lab')
            );
            if (zoneData) {
              return {
                ...unit,
                itemCount: zoneData.statistics.itemCount,
                lastActivity: zoneData.statistics.lastActivity,
                status: zoneData.statistics.itemCount > 0 ? 'active' : 'inactive'
              };
            }
            return unit;
          });
        });
      }
    } catch (error) {
      console.error('Error fetching unit data:', error);
    }
  };

  // Simulate RFID tag movements
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random tag movement
      if (Math.random() > 0.7 && labUnits.length > 0) {
        const randomUnit = labUnits[Math.floor(Math.random() * labUnits.length)];
        const newTag: RfidTag = {
          id: `TAG-${Date.now()}`,
          x: randomUnit.x + (Math.random() - 0.5) * randomUnit.radius,
          y: randomUnit.y + (Math.random() - 0.5) * randomUnit.radius,
          unit: randomUnit.id
        };
        
        setRfidTags(prev => [...prev.slice(-20), newTag]);
        
        // Add pulse effect
        setActiveEvents(prev => {
          const newMap = new Map(prev);
          newMap.set(randomUnit.id, Date.now());
          return newMap;
        });
        
        // Remove pulse after 2 seconds
        setTimeout(() => {
          setActiveEvents(prev => {
            const newMap = new Map(prev);
            newMap.delete(randomUnit.id);
            return newMap;
          });
        }, 2000);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [labUnits]);

  // Draw connections between units
  const connections = [
    ['explosives-unit', 'central-hub'],
    ['chemistry-unit', 'central-hub'],
    ['fraud-unit', 'central-hub'],
    ['biology-unit', 'central-hub'],
    ['ballistics-unit', 'central-hub'],
    ['central-hub', 'main-security'],
    ['central-hub', 'evidence-intake'],
    ['evidence-intake', 'evidence-vault']
  ];

  const getUnitById = (id: string) => labUnits.find(u => u.id === id);

  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* SVG Canvas for 2D Lab Layout */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 800 600"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Grid Background */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#222" strokeWidth="0.5"/>
          </pattern>
          
          {/* Pulse Animation */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Draw Connections */}
        {connections.map(([from, to], idx) => {
          const fromUnit = getUnitById(from);
          const toUnit = getUnitById(to);
          if (!fromUnit || !toUnit) return null;
          
          return (
            <line
              key={idx}
              x1={fromUnit.x}
              y1={fromUnit.y}
              x2={toUnit.x}
              y2={toUnit.y}
              stroke="#333"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          );
        })}
        
        {/* Draw Lab Units */}
        {labUnits.map(unit => {
          const isActive = activeEvents.has(unit.id);
          const isPulsing = isActive && Date.now() - (activeEvents.get(unit.id) || 0) < 2000;
          
          return (
            <g key={unit.id}>
              {/* Unit Circle with Pulse Effect */}
              {isPulsing && (
                <circle
                  cx={unit.x}
                  cy={unit.y}
                  r={unit.radius}
                  fill="none"
                  stroke={unit.color}
                  strokeWidth="2"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from={unit.radius}
                    to={unit.radius * 1.5}
                    dur="1s"
                    repeatCount="2"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="1s"
                    repeatCount="2"
                  />
                </circle>
              )}
              
              {/* Main Unit Circle */}
              <circle
                cx={unit.x}
                cy={unit.y}
                r={unit.radius}
                fill={unit.color}
                fillOpacity={unit.type === 'forensic' ? 0.3 : 0.2}
                stroke={unit.color}
                strokeWidth="2"
                filter={isActive ? "url(#glow)" : ""}
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setSelectedUnit(unit)}
                onMouseEnter={(e) => {
                  e.currentTarget.setAttribute('fill-opacity', '0.5');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.setAttribute('fill-opacity', unit.type === 'forensic' ? '0.3' : '0.2');
                }}
              />
              
              {/* Unit Icon */}
              <text
                x={unit.x}
                y={unit.y - 10}
                fontSize="24"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
              >
                {unit.icon}
              </text>
              
              {/* Unit Name */}
              <text
                x={unit.x}
                y={unit.y + 10}
                fill="white"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
              >
                {unit.name}
              </text>
              
              {/* Item Count Badge */}
              {unit.itemCount !== undefined && unit.itemCount > 0 && (
                <>
                  <circle
                    cx={unit.x + unit.radius * 0.7}
                    cy={unit.y - unit.radius * 0.7}
                    r="15"
                    fill="#00d4ff"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={unit.x + unit.radius * 0.7}
                    y={unit.y - unit.radius * 0.7 + 5}
                    fill="black"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {unit.itemCount}
                  </text>
                </>
              )}
              
              {/* Status Indicator */}
              <circle
                cx={unit.x}
                cy={unit.y + unit.radius - 10}
                r="5"
                fill={unit.status === 'active' ? '#00ff00' : unit.status === 'alert' ? '#ff0000' : '#ffff00'}
              />
            </g>
          );
        })}
        
        {/* RFID Tags */}
        {rfidTags.map((tag, idx) => (
          <circle
            key={tag.id}
            cx={tag.x}
            cy={tag.y}
            r="3"
            fill="#00d4ff"
            opacity={1 - idx / rfidTags.length}
          >
            <animate
              attributeName="r"
              from="3"
              to="6"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from={1 - idx / rfidTags.length}
              to="0"
              dur="2s"
              repeatCount="1"
            />
          </circle>
        ))}
      </svg>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '10px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '12px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Forensic Units</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#FF4444', marginRight: '8px', borderRadius: '2px' }}></div>
          Explosives Unit
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#44BB44', marginRight: '8px', borderRadius: '2px' }}></div>
          Chemistry Unit
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#4444FF', marginRight: '8px', borderRadius: '2px' }}></div>
          Fraud Unit
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#BB44BB', marginRight: '8px', borderRadius: '2px' }}></div>
          Biology Unit
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', background: '#666666', marginRight: '8px', borderRadius: '2px' }}></div>
          Ballistics Unit
        </div>
      </div>
      
      {/* Selected Unit Details */}
      {selectedUnit && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '15px',
          borderRadius: '8px',
          color: 'white',
          minWidth: '200px',
          border: `2px solid ${selectedUnit.color}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, color: selectedUnit.color }}>
              {selectedUnit.icon} {selectedUnit.name}
            </h3>
            <button
              onClick={() => setSelectedUnit(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888' }}>Type</div>
            <div style={{ fontSize: '14px', textTransform: 'capitalize' }}>{selectedUnit.type}</div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888' }}>Current Items</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00d4ff' }}>
              {selectedUnit.itemCount || 0}
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888' }}>Status</div>
            <div style={{ 
              fontSize: '14px', 
              color: selectedUnit.status === 'active' ? '#00ff00' : '#ffff00',
              textTransform: 'capitalize'
            }}>
              {selectedUnit.status || 'Unknown'}
            </div>
          </div>
          
          {selectedUnit.lastActivity && (
            <div>
              <div style={{ fontSize: '12px', color: '#888' }}>Last Activity</div>
              <div style={{ fontSize: '12px' }}>
                {new Date(selectedUnit.lastActivity).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}