/**
 * Comprehensive Mock API Service for RFID Tracking System Showcase
 * This service provides simulated API responses for all features
 * No real data or business logic - demonstration purposes only
 */

import { mockEvidenceItems, mockLabZones, mockRfidReaders, mockActivityData } from './mockDataService';

// Simulated delay to mimic real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock API class
class MockAPI {
  // Authentication
  async login(credentials: any) {
    await delay(500);
    return {
      success: true,
      token: 'mock-jwt-token-' + generateId(),
      user: {
        id: 'user-001',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin',
        permissions: ['view_all', 'edit_all', 'manage_users']
      }
    };
  }

  async logout() {
    await delay(200);
    return { success: true };
  }

  // Dashboard Stats
  async getDashboardStats() {
    await delay(300);
    return {
      totalEvidence: 1256,
      activeProcessing: 23,
      inStorage: 1178,
      inTransit: 55,
      alertsToday: 7,
      chainOfCustodyEvents: 3892,
      systemUptime: '99.97%',
      avgProcessingTime: '2.3 hours',
      complianceScore: 98.5
    };
  }

  // Evidence Management
  async getEvidenceItems(filters?: any) {
    await delay(400);
    let items = [...mockEvidenceItems];
    
    // Apply filters if provided
    if (filters?.status) {
      items = items.filter(item => item.status === filters.status);
    }
    if (filters?.location) {
      items = items.filter(item => item.location.includes(filters.location));
    }
    
    return {
      items,
      total: items.length,
      page: 1,
      pageSize: 20
    };
  }

  async getEvidenceById(id: string) {
    await delay(300);
    const item = mockEvidenceItems.find(e => e.id === id);
    return item || null;
  }

  async updateEvidence(id: string, updates: any) {
    await delay(500);
    return {
      success: true,
      message: 'Evidence updated successfully',
      data: { id, ...updates }
    };
  }

  // RFID Tracking
  async getRFIDReaders() {
    await delay(300);
    return mockRfidReaders;
  }

  async getRFIDActivity(timeRange?: any) {
    await delay(400);
    return mockActivityData;
  }

  async trackMovement(itemId: string) {
    await delay(300);
    return {
      itemId,
      movements: [
        { timestamp: new Date(Date.now() - 3600000), location: 'Evidence Reception', action: 'Check-in' },
        { timestamp: new Date(Date.now() - 1800000), location: 'Lab Zone A', action: 'Processing Started' },
        { timestamp: new Date(), location: 'Lab Zone A', action: 'In Progress' }
      ]
    };
  }

  // Lab Zones
  async getLabZones() {
    await delay(300);
    return mockLabZones;
  }

  async getZoneDetails(zoneId: string) {
    await delay(300);
    const zone = mockLabZones.find(z => z.id === zoneId);
    return zone ? {
      ...zone,
      currentOccupants: Math.floor(Math.random() * 5) + 1,
      equipmentStatus: 'Operational',
      lastMaintenance: new Date(Date.now() - 86400000 * 7).toISOString()
    } : null;
  }

  // Storage Management
  async getStorageUnits() {
    await delay(400);
    return [
      { id: 'unit-1', name: 'Cold Storage A', type: 'refrigerated', capacity: 100, used: 67, temperature: -20 },
      { id: 'unit-2', name: 'Evidence Vault B', type: 'secure', capacity: 500, used: 423, accessLevel: 'restricted' },
      { id: 'unit-3', name: 'General Storage C', type: 'standard', capacity: 1000, used: 789, humidity: 45 },
      { id: 'unit-4', name: 'Hazmat Storage D', type: 'hazardous', capacity: 50, used: 12, ventilation: 'active' }
    ];
  }

  async getStorageHistory(unitId: string) {
    await delay(300);
    return {
      unitId,
      history: [
        { timestamp: new Date(Date.now() - 86400000), action: 'Item Added', itemId: 'EV-2024-001', user: 'Lab Tech' },
        { timestamp: new Date(Date.now() - 172800000), action: 'Temperature Check', value: -20.5, user: 'System' },
        { timestamp: new Date(Date.now() - 259200000), action: 'Item Removed', itemId: 'EV-2024-002', user: 'Analyst' }
      ]
    };
  }

  // Analytics
  async getAnalyticsData(metric: string, timeRange: any) {
    await delay(500);
    const generateTimeSeries = (points: number) => {
      return Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(Date.now() - (points - i) * 3600000).toISOString(),
        value: Math.random() * 100 + 50
      }));
    };

    return {
      metric,
      data: generateTimeSeries(24),
      summary: {
        average: 75.5,
        min: 45.2,
        max: 98.7,
        trend: 'increasing'
      }
    };
  }

  async getPredictiveAnalytics() {
    await delay(600);
    return {
      predictions: [
        { metric: 'Processing Load', nextHour: 85, confidence: 0.92 },
        { metric: 'Storage Capacity', nextDay: 78, confidence: 0.88 },
        { metric: 'Staff Required', nextShift: 12, confidence: 0.95 }
      ],
      recommendations: [
        'Consider adding staff to Lab Zone A during peak hours',
        'Storage Unit B approaching capacity - plan for overflow',
        'Maintenance scheduled for RFID Reader 3 in 2 days'
      ]
    };
  }

  // Audit Trail
  async getAuditLogs(filters?: any) {
    await delay(400);
    return {
      logs: [
        { timestamp: new Date(), user: 'Admin User', action: 'Login', details: 'Successful authentication', ip: '192.168.1.1' },
        { timestamp: new Date(Date.now() - 3600000), user: 'Lab Tech', action: 'Evidence Update', details: 'Updated status for EV-2024-001', ip: '192.168.1.2' },
        { timestamp: new Date(Date.now() - 7200000), user: 'System', action: 'Backup', details: 'Daily backup completed', ip: 'localhost' }
      ],
      total: 1543,
      page: 1,
      pageSize: 20
    };
  }

  // Reports
  async generateReport(type: string, parameters: any) {
    await delay(1000);
    return {
      reportId: generateId(),
      type,
      status: 'completed',
      generatedAt: new Date().toISOString(),
      downloadUrl: '/api/reports/download/' + generateId(),
      summary: {
        totalRecords: 156,
        dateRange: parameters.dateRange || 'Last 30 days',
        format: parameters.format || 'PDF'
      }
    };
  }

  async getReportHistory() {
    await delay(300);
    return [
      { id: 'rep-001', name: 'Monthly Compliance Report', generatedAt: new Date(Date.now() - 86400000), status: 'completed' },
      { id: 'rep-002', name: 'Chain of Custody Audit', generatedAt: new Date(Date.now() - 172800000), status: 'completed' },
      { id: 'rep-003', name: 'Evidence Inventory', generatedAt: new Date(Date.now() - 259200000), status: 'completed' }
    ];
  }

  // User Management
  async getUsers() {
    await delay(400);
    return [
      { id: 'user-001', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', lastLogin: new Date() },
      { id: 'user-002', name: 'Lab Technician', email: 'tech@example.com', role: 'technician', status: 'active', lastLogin: new Date(Date.now() - 3600000) },
      { id: 'user-003', name: 'Analyst User', email: 'analyst@example.com', role: 'analyst', status: 'active', lastLogin: new Date(Date.now() - 7200000) },
      { id: 'user-004', name: 'Viewer User', email: 'viewer@example.com', role: 'viewer', status: 'inactive', lastLogin: new Date(Date.now() - 86400000) }
    ];
  }

  async updateUser(userId: string, updates: any) {
    await delay(500);
    return {
      success: true,
      message: 'User updated successfully',
      data: { id: userId, ...updates }
    };
  }

  // Budget & Cost Analysis
  async getBudgetData() {
    await delay(400);
    return {
      currentBudget: 500000,
      spent: 325000,
      remaining: 175000,
      categories: [
        { name: 'Equipment', allocated: 200000, spent: 145000 },
        { name: 'Personnel', allocated: 150000, spent: 120000 },
        { name: 'Maintenance', allocated: 100000, spent: 45000 },
        { name: 'Software', allocated: 50000, spent: 15000 }
      ],
      projectedSavings: 85000,
      roi: 2.3
    };
  }

  async calculateCostSavings(parameters: any) {
    await delay(600);
    const baseCost = parameters.currentCost || 100000;
    const savings = baseCost * 0.35; // 35% savings
    return {
      currentCost: baseCost,
      projectedCost: baseCost - savings,
      savings,
      savingsPercentage: 35,
      breakEvenMonths: 18,
      fiveYearROI: savings * 5 * 1.2
    };
  }

  // Court Preparation
  async getCourtCases() {
    await delay(400);
    return [
      { id: 'case-001', caseNumber: 'CR-2024-1234', status: 'pending', evidenceCount: 12, nextHearing: new Date(Date.now() + 86400000 * 7) },
      { id: 'case-002', caseNumber: 'CR-2024-5678', status: 'active', evidenceCount: 8, nextHearing: new Date(Date.now() + 86400000 * 3) },
      { id: 'case-003', caseNumber: 'CR-2024-9012', status: 'closed', evidenceCount: 15, verdict: 'guilty' }
    ];
  }

  async prepareEvidencePackage(caseId: string) {
    await delay(800);
    return {
      caseId,
      packageId: generateId(),
      status: 'ready',
      items: [
        { id: 'EV-001', name: 'DNA Evidence', chainOfCustody: 'verified' },
        { id: 'EV-002', name: 'Fingerprint Card', chainOfCustody: 'verified' },
        { id: 'EV-003', name: 'Digital Device', chainOfCustody: 'verified' }
      ],
      verificationStatus: 'complete',
      exportReady: true
    };
  }

  // External Storage
  async getExternalStorageLocations() {
    await delay(300);
    return [
      { id: 'ext-001', name: 'Offsite Facility A', distance: '15km', capacity: 5000, used: 3200, secure: true },
      { id: 'ext-002', name: 'Partner Lab B', distance: '8km', capacity: 1000, used: 450, secure: true },
      { id: 'ext-003', name: 'Archive Center C', distance: '25km', capacity: 10000, used: 8900, secure: true }
    ];
  }

  // Mobile Field Operations
  async getMobileUnits() {
    await delay(300);
    return [
      { id: 'mobile-001', unit: 'Field Unit Alpha', status: 'active', location: { lat: -29.8587, lng: 31.0218 }, battery: 85 },
      { id: 'mobile-002', unit: 'Field Unit Beta', status: 'inactive', location: { lat: -29.8500, lng: 31.0100 }, battery: 45 },
      { id: 'mobile-003', unit: 'Field Unit Gamma', status: 'active', location: { lat: -29.8700, lng: 31.0300 }, battery: 92 }
    ];
  }

  // AI Classification
  async classifyEvidence(evidenceData: any) {
    await delay(1000);
    return {
      classification: 'Biological Evidence',
      confidence: 0.95,
      subCategories: ['DNA', 'Blood Sample'],
      suggestedStorage: 'Cold Storage A',
      handlingRequirements: ['Biohazard protocols', 'Temperature controlled', 'Chain of custody required'],
      processingPriority: 'high'
    };
  }

  async getAIInsights() {
    await delay(700);
    return {
      insights: [
        { type: 'pattern', description: 'Increased evidence intake on Mondays', confidence: 0.89 },
        { type: 'anomaly', description: 'Unusual access pattern detected in Zone B', confidence: 0.76 },
        { type: 'optimization', description: 'Suggest reorganizing Storage Unit C for 15% better efficiency', confidence: 0.92 }
      ],
      recommendations: [
        'Schedule additional staff for Monday mornings',
        'Review access logs for Zone B',
        'Implement suggested storage reorganization'
      ]
    };
  }

  // Settings
  async getSystemSettings() {
    await delay(300);
    return {
      general: {
        systemName: 'RFID Evidence Tracking System',
        timezone: 'Africa/Johannesburg',
        language: 'en-ZA',
        dateFormat: 'DD/MM/YYYY'
      },
      security: {
        passwordPolicy: 'strong',
        sessionTimeout: 30,
        twoFactorAuth: true,
        auditLogging: true
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        alertThresholds: {
          temperature: { min: -25, max: -15 },
          humidity: { min: 40, max: 60 },
          capacity: 90
        }
      },
      integrations: {
        saps: { enabled: true, status: 'connected' },
        email: { enabled: true, provider: 'smtp' },
        sms: { enabled: false, provider: null }
      }
    };
  }

  async updateSystemSettings(section: string, settings: any) {
    await delay(500);
    return {
      success: true,
      message: `${section} settings updated successfully`,
      data: settings
    };
  }

  // WebSocket simulation for real-time updates
  subscribeToUpdates(callback: (data: any) => void) {
    const interval = setInterval(() => {
      const updates = [
        { type: 'location_update', itemId: 'EV-2024-001', newLocation: 'Lab Zone B' },
        { type: 'temperature_alert', zone: 'Cold Storage A', value: -21.5 },
        { type: 'new_evidence', id: 'EV-2024-NEW', name: 'New Evidence Item' },
        { type: 'access_log', user: 'Lab Tech', zone: 'Evidence Vault B' }
      ];
      
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      callback({ ...randomUpdate, timestamp: new Date().toISOString() });
    }, 5000);

    return () => clearInterval(interval);
  }
}

// Export singleton instance
const mockAPI = new MockAPI();
export default mockAPI;