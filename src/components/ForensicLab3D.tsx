import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';

interface LabZone {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
  coordinates: { x: number; y: number; radius?: number };
  itemCount?: number;
  lastActivity?: string;
}

interface RfidEvent {
  zone: string;
  timestamp: string;
  tagId: string;
  eventType: string;
}

// Individual Zone Component
function LabZoneModel({ zone, isActive, onClick }: { 
  zone: LabZone; 
  isActive: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Animate active zones
      if (isActive) {
        meshRef.current.rotation.y += 0.01;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.scale.setScalar(scale);
      }
    }
  });
  
  const baseY = zone.type === 'forensic' ? 0 : -0.5;
  const height = zone.type === 'forensic' ? 2 : 1.5;
  
  return (
    <group position={[zone.coordinates.x / 10 - 5, baseY, zone.coordinates.y / 10 - 5]}>
      {/* Zone cylinder/box based on type */}
      {zone.type === 'forensic' ? (
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <cylinderGeometry args={[(zone.coordinates.radius || 10) / 10, (zone.coordinates.radius || 10) / 10, height, 16]} />
          <meshStandardMaterial 
            color={zone.color} 
            opacity={hovered ? 0.9 : 0.7}
            transparent
            emissive={isActive ? zone.color : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </mesh>
      ) : (
        <Box
          args={[(zone.coordinates.radius || 10) / 10 * 2, height, (zone.coordinates.radius || 10) / 10 * 2]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={zone.color} 
            opacity={hovered ? 0.9 : 0.6}
            transparent
            emissive={isActive ? zone.color : '#000000'}
            emissiveIntensity={isActive ? 0.2 : 0}
          />
        </Box>
      )}
      
      {/* Zone label */}
      <Text
        position={[0, height / 2 + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {zone.icon} {zone.name}
      </Text>
      
      {/* Item count badge */}
      {zone.itemCount !== undefined && zone.itemCount > 0 && (
        <Html position={[0, height / 2 + 1, 0]}>
          <div style={{
            background: 'rgba(0, 212, 255, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            {zone.itemCount} items
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection lines between zones
function ZoneConnections({ zones }: { zones: LabZone[] }) {
  const connections: [string, string][] = [
    ['explosives-lab', 'central-corridor'],
    ['chemistry-lab', 'central-corridor'],
    ['fraud-lab', 'central-corridor'],
    ['biology-lab', 'central-corridor'],
    ['ballistics-lab', 'central-corridor'],
    ['central-corridor', 'main-entrance'],
    ['central-corridor', 'evidence-intake'],
    ['evidence-intake', 'evidence-storage']
  ];
  
  return (
    <>
      {connections.map(([from, to], idx) => {
        const fromZone = zones.find(z => z.id === from);
        const toZone = zones.find(z => z.id === to);
        
        if (!fromZone || !toZone) return null;
        
        const points = [
          new THREE.Vector3(fromZone.coordinates.x / 10 - 5, 0, fromZone.coordinates.y / 10 - 5),
          new THREE.Vector3(toZone.coordinates.x / 10 - 5, 0, toZone.coordinates.y / 10 - 5)
        ];
        
        return (
          <Line
            key={idx}
            points={points}
            color="#666666"
            lineWidth={1}
            opacity={0.3}
            transparent
          />
        );
      })}
    </>
  );
}

// Main 3D Forensic Lab Component
export default function ForensicLab3D() {
  const [zones, setZones] = useState<LabZone[]>([]);
  const [activeZones, setActiveZones] = useState<Set<string>>(new Set());
  const [selectedZone, setSelectedZone] = useState<LabZone | null>(null);
  const [recentEvents, setRecentEvents] = useState<RfidEvent[]>([]);
  
  // Initialize zones from layout service
  useEffect(() => {
    const defaultZones: LabZone[] = [
      { id: 'explosives-lab', name: 'Explosives', type: 'forensic', color: '#FF4444', icon: '🧨', coordinates: { x: 50, y: 30, radius: 15 } },
      { id: 'chemistry-lab', name: 'Chemistry', type: 'forensic', color: '#44BB44', icon: '🧪', coordinates: { x: 70, y: 40, radius: 15 } },
      { id: 'fraud-lab', name: 'Fraud', type: 'forensic', color: '#4444FF', icon: '📄', coordinates: { x: 70, y: 60, radius: 15 } },
      { id: 'biology-lab', name: 'Biology', type: 'forensic', color: '#BB44BB', icon: '🧬', coordinates: { x: 50, y: 70, radius: 15 } },
      { id: 'ballistics-lab', name: 'Ballistics', type: 'forensic', color: '#666666', icon: '🔫', coordinates: { x: 30, y: 60, radius: 15 } },
      { id: 'central-corridor', name: 'Central Hub', type: 'private', color: '#CCCCCC', icon: '🚪', coordinates: { x: 50, y: 50, radius: 10 } },
      { id: 'main-entrance', name: 'Security', type: 'security', color: '#FFA500', icon: '🛡️', coordinates: { x: 10, y: 50, radius: 8 } },
      { id: 'evidence-intake', name: 'Intake', type: 'storage', color: '#FFCC00', icon: '📦', coordinates: { x: 90, y: 50, radius: 10 } },
      { id: 'evidence-storage', name: 'Vault', type: 'storage', color: '#8B4513', icon: '🔐', coordinates: { x: 90, y: 70, radius: 12 } }
    ];
    
    setZones(defaultZones);
    
    // Fetch zone tracking data
    fetchZoneData();
    const interval = setInterval(fetchZoneData, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchZoneData = async () => {
    try {
      const response = await axios.get('/api/rfid/zones');
      if (response.data.zones) {
        setZones(prevZones => {
          const updatedZones = prevZones.map(zone => {
            const zoneData = response.data.zones.find((z: any) => z.zone.id === zone.id);
            if (zoneData) {
              return {
                ...zone,
                itemCount: zoneData.statistics.itemCount,
                lastActivity: zoneData.statistics.lastActivity
              };
            }
            return zone;
          });
          return updatedZones;
        });
        
        // Update active zones (zones with recent activity)
        const active = new Set<string>(
          response.data.zones
            .filter((z: any) => z.statistics.itemCount > 0)
            .map((z: any) => z.zone.id)
        );
        setActiveZones(active);
      }
    } catch (error) {
      console.error('Error fetching zone data:', error);
    }
  };
  
  // Simulate real-time events
  useEffect(() => {
    const simulateEvent = () => {
      const randomZone = zones[Math.floor(Math.random() * zones.length)];
      const event: RfidEvent = {
        zone: randomZone.id,
        timestamp: new Date().toISOString(),
        tagId: `TAG-${Math.random().toString(36).substr(2, 8)}`,
        eventType: 'detected'
      };
      
      setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
      setActiveZones(prev => new Set([...prev, randomZone.id]));
      
      // Clear active state after 3 seconds
      setTimeout(() => {
        setActiveZones(prev => {
          const newSet = new Set(prev);
          newSet.delete(randomZone.id);
          return newSet;
        });
      }, 3000);
    };
    
    const interval = setInterval(simulateEvent, 5000);
    return () => clearInterval(interval);
  }, [zones]);
  
  return (
    <div style={{ display: 'flex', height: '600px', background: '#0a0a0a' }}>
      {/* 3D Visualization */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />
          
          {/* Floor grid */}
          <gridHelper args={[20, 20, '#333333', '#222222']} />
          
          {/* Lab zones */}
          {zones.map(zone => (
            <LabZoneModel
              key={zone.id}
              zone={zone}
              isActive={activeZones.has(zone.id)}
              onClick={() => setSelectedZone(zone)}
            />
          ))}
          
          {/* Connections between zones */}
          <ZoneConnections zones={zones} />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
          />
        </Canvas>
        
        {/* Legend */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '10px',
          borderRadius: '8px',
          color: 'white',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Forensic Lab Zones</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#FF4444', marginRight: '8px', borderRadius: '2px' }}></div>
            Explosives Lab
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#44BB44', marginRight: '8px', borderRadius: '2px' }}></div>
            Chemistry Lab
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#4444FF', marginRight: '8px', borderRadius: '2px' }}></div>
            Fraud Investigation
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#BB44BB', marginRight: '8px', borderRadius: '2px' }}></div>
            Biology Lab
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', background: '#666666', marginRight: '8px', borderRadius: '2px' }}></div>
            Ballistics Lab
          </div>
        </div>
      </div>
      
      {/* Side Panel */}
      <div style={{
        width: '300px',
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '20px',
        color: 'white',
        overflowY: 'auto'
      }}>
        {selectedZone ? (
          <div>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>
              {selectedZone.icon} {selectedZone.name}
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Zone Type</div>
              <div style={{ fontSize: '16px' }}>{selectedZone.type}</div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Current Items</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00d4ff' }}>
                {selectedZone.itemCount || 0}
              </div>
            </div>
            {selectedZone.lastActivity && (
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Last Activity</div>
                <div style={{ fontSize: '14px' }}>
                  {new Date(selectedZone.lastActivity).toLocaleString()}
                </div>
              </div>
            )}
            <button
              onClick={() => setSelectedZone(null)}
              style={{
                background: '#00d4ff',
                color: 'black',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ color: '#00d4ff', marginBottom: '20px' }}>Recent Activity</h3>
            {recentEvents.length === 0 ? (
              <div style={{ color: '#666' }}>No recent events</div>
            ) : (
              recentEvents.map((event, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0, 212, 255, 0.1)',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  borderLeft: '3px solid #00d4ff'
                }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    {zones.find(z => z.id === event.zone)?.name || event.zone}
                  </div>
                  <div style={{ fontSize: '12px', color: '#00d4ff' }}>
                    {event.tagId}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}