/**
 * API Service Adapter for Showcase
 * Routes all API calls to mock service for demonstration
 */

import mockAPI from './mockAPI';

// Create axios-like interface for compatibility
const api = {
  get: async (url: string, config?: any) => {
    // Route to appropriate mock function based on URL
    if (url.includes('/dashboard/stats')) return { data: await mockAPI.getDashboardStats() };
    if (url.includes('/evidence')) return { data: await mockAPI.getEvidenceItems(config?.params) };
    if (url.includes('/rfid/readers')) return { data: await mockAPI.getRFIDReaders() };
    if (url.includes('/rfid/activity')) return { data: await mockAPI.getRFIDActivity() };
    if (url.includes('/zones')) return { data: await mockAPI.getLabZones() };
    if (url.includes('/storage')) return { data: await mockAPI.getStorageUnits() };
    if (url.includes('/analytics')) return { data: await mockAPI.getAnalyticsData('default', {}) };
    if (url.includes('/audit')) return { data: await mockAPI.getAuditLogs() };
    if (url.includes('/users')) return { data: await mockAPI.getUsers() };
    if (url.includes('/budget')) return { data: await mockAPI.getBudgetData() };
    if (url.includes('/court')) return { data: await mockAPI.getCourtCases() };
    if (url.includes('/mobile')) return { data: await mockAPI.getMobileUnits() };
    if (url.includes('/settings')) return { data: await mockAPI.getSystemSettings() };
    
    // Default response
    return { data: { success: true, message: 'Mock data' } };
  },

  post: async (url: string, data?: any, config?: any) => {
    if (url.includes('/auth/login')) return { data: await mockAPI.login(data) };
    if (url.includes('/auth/logout')) return { data: await mockAPI.logout() };
    if (url.includes('/evidence')) return { data: await mockAPI.updateEvidence('new', data) };
    if (url.includes('/reports/generate')) return { data: await mockAPI.generateReport(data.type, data) };
    if (url.includes('/ai/classify')) return { data: await mockAPI.classifyEvidence(data) };
    if (url.includes('/court/prepare')) return { data: await mockAPI.prepareEvidencePackage(data.caseId) };
    
    return { data: { success: true, data } };
  },

  put: async (url: string, data?: any) => {
    if (url.includes('/evidence')) return { data: await mockAPI.updateEvidence(data.id, data) };
    if (url.includes('/users')) return { data: await mockAPI.updateUser(data.id, data) };
    if (url.includes('/settings')) return { data: await mockAPI.updateSystemSettings('general', data) };
    
    return { data: { success: true, data } };
  },

  delete: async (url: string) => {
    return { data: { success: true, message: 'Item deleted (mock)' } };
  },

  patch: async (url: string, data?: any) => {
    return { data: { success: true, data } };
  }
};

export default api;

// Also export mock WebSocket connection
export const createWebSocketConnection = () => {
  return {
    on: (event: string, callback: Function) => {
      if (event === 'update') {
        mockAPI.subscribeToUpdates(callback as any);
      }
    },
    emit: (event: string, data: any) => {
      console.log('Mock WebSocket emit:', event, data);
    },
    disconnect: () => {
      console.log('Mock WebSocket disconnected');
    }
  };
};