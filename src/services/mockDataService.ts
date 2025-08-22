/**
 * Mock Data Service for RFID Evidence Tracking System
 * This is a demo/showcase version with sample data
 * No real business logic or sensitive data included
 */

// Sample evidence items for demonstration
export const mockEvidenceItems = [
  {
    id: 'EV-2024-001',
    name: 'DNA Sample Kit',
    type: 'Biological Evidence',
    location: 'Lab Zone A',
    status: 'Processing',
    lastSeen: new Date().toISOString(),
    chain_of_custody: [
      { timestamp: '2024-01-15T09:00:00Z', officer: 'Officer Demo', action: 'Collected', location: 'Crime Scene' },
      { timestamp: '2024-01-15T10:30:00Z', officer: 'Lab Tech Demo', action: 'Received', location: 'Evidence Reception' },
      { timestamp: '2024-01-15T11:00:00Z', officer: 'Lab Tech Demo', action: 'Processing', location: 'Lab Zone A' }
    ]
  },
  {
    id: 'EV-2024-002',
    name: 'Fingerprint Card',
    type: 'Physical Evidence',
    location: 'Storage Unit B',
    status: 'Stored',
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    chain_of_custody: [
      { timestamp: '2024-01-14T14:00:00Z', officer: 'Officer Demo', action: 'Collected', location: 'Crime Scene' },
      { timestamp: '2024-01-14T15:30:00Z', officer: 'Evidence Manager', action: 'Stored', location: 'Storage Unit B' }
    ]
  },
  {
    id: 'EV-2024-003',
    name: 'Digital Device',
    type: 'Electronic Evidence',
    location: 'Forensic Lab',
    status: 'Analysis',
    lastSeen: new Date(Date.now() - 7200000).toISOString(),
    chain_of_custody: [
      { timestamp: '2024-01-13T09:00:00Z', officer: 'Detective Demo', action: 'Seized', location: 'Suspect Location' },
      { timestamp: '2024-01-13T11:00:00Z', officer: 'Forensic Analyst', action: 'Analysis Started', location: 'Forensic Lab' }
    ]
  }
];

// Sample zones for lab visualization
export const mockLabZones = [
  {
    id: 'zone-a',
    name: 'Lab Zone A - DNA Processing',
    type: 'restricted',
    position: { x: 100, y: 100, z: 0 },
    dimensions: { width: 200, height: 150, depth: 100 },
    activeItems: 3,
    temperature: 22.5,
    humidity: 45,
    accessLevel: 'HIGH'
  },
  {
    id: 'zone-b',
    name: 'Storage Unit B',
    type: 'storage',
    position: { x: 350, y: 100, z: 0 },
    dimensions: { width: 150, height: 150, depth: 100 },
    activeItems: 15,
    temperature: 18.0,
    humidity: 40,
    accessLevel: 'MEDIUM'
  },
  {
    id: 'zone-c',
    name: 'Evidence Reception',
    type: 'reception',
    position: { x: 100, y: 300, z: 0 },
    dimensions: { width: 200, height: 100, depth: 100 },
    activeItems: 5,
    temperature: 21.0,
    humidity: 50,
    accessLevel: 'LOW'
  },
  {
    id: 'zone-d',
    name: 'Forensic Analysis Lab',
    type: 'analysis',
    position: { x: 350, y: 300, z: 0 },
    dimensions: { width: 150, height: 100, depth: 100 },
    activeItems: 2,
    temperature: 20.0,
    humidity: 42,
    accessLevel: 'HIGH'
  }
];

// Sample RFID readers for tracking
export const mockRfidReaders = [
  { id: 'reader-1', zone: 'zone-a', status: 'active', lastPing: new Date().toISOString() },
  { id: 'reader-2', zone: 'zone-b', status: 'active', lastPing: new Date().toISOString() },
  { id: 'reader-3', zone: 'zone-c', status: 'active', lastPing: new Date().toISOString() },
  { id: 'reader-4', zone: 'zone-d', status: 'active', lastPing: new Date().toISOString() }
];

// Sample activity data for heat maps
export const mockActivityData = Array.from({ length: 50 }, (_, i) => ({
  id: `activity-${i}`,
  lat: -29.8587 + (Math.random() - 0.5) * 0.01,
  lng: 31.0218 + (Math.random() - 0.5) * 0.01,
  intensity: Math.random(),
  timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
}));

// Mock API functions
export const mockAPI = {
  getEvidenceItems: () => Promise.resolve(mockEvidenceItems),
  getLabZones: () => Promise.resolve(mockLabZones),
  getRfidReaders: () => Promise.resolve(mockRfidReaders),
  getActivityData: () => Promise.resolve(mockActivityData),
  
  // Simulate real-time updates
  subscribeToUpdates: (callback: (data: any) => void) => {
    const interval = setInterval(() => {
      // Randomly update an evidence item's location
      const randomItem = mockEvidenceItems[Math.floor(Math.random() * mockEvidenceItems.length)];
      const randomZone = mockLabZones[Math.floor(Math.random() * mockLabZones.length)];
      
      callback({
        type: 'location_update',
        itemId: randomItem.id,
        newLocation: randomZone.name,
        timestamp: new Date().toISOString()
      });
    }, 5000);
    
    return () => clearInterval(interval);
  },
  
  // Dashboard statistics
  getDashboardStats: () => Promise.resolve({
    totalEvidence: 156,
    activeProcessing: 12,
    inStorage: 134,
    alertsToday: 3,
    chainOfCustodyEvents: 892,
    systemUptime: '99.9%'
  })
};

// Generate demo movement data
export const generateMovementPath = (startZone: string, endZone: string) => {
  const start = mockLabZones.find(z => z.id === startZone);
  const end = mockLabZones.find(z => z.id === endZone);
  
  if (!start || !end) return [];
  
  const steps = 10;
  const path = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    path.push({
      x: start.position.x + (end.position.x - start.position.x) * t,
      y: start.position.y + (end.position.y - start.position.y) * t,
      z: 0,
      timestamp: new Date(Date.now() - (steps - i) * 1000).toISOString()
    });
  }
  
  return path;
};

export default mockAPI;