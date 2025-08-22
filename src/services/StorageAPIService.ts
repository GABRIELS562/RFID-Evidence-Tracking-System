// Storage API Service - Mock implementation for demo

export interface StorageBox {
  id: string;
  name: string;
  location: string;
  capacity: number;
  used: number;
  occupied?: number;
  items: string[];
  status: 'available' | 'full' | 'maintenance';
  box_code?: string;
  zone_name?: string;
  zone_id?: string;
  client_name?: string;
  client_id?: string;
  shelf_code?: string;
  monthly_rate?: number;
}

export interface StorageZone {
  id: string;
  name: string;
  type: string;
  boxes: StorageBox[];
  temperature: number;
  humidity: number;
  zone_name?: string;
  is_active?: boolean;
  zone_type?: string;
  box_count?: number;
  used_capacity?: number;
  total_capacity?: number;
  utilization_percentage?: number;
}

export interface RetrievalRequest {
  id: string;
  itemId: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'retrieved' | 'returned';
  timestamp: string;
  request_number?: string;
  urgency?: string;
  client_name?: string;
  client_id?: string;
  total_items?: number;
  completion_deadline?: string;
  retrieval_fee?: number;
}

export interface StorageStatistics {
  totalBoxes: number;
  usedBoxes: number;
  totalCapacity: number;
  usedCapacity: number;
  pendingRequests: number;
  summary?: {
    total_boxes: number;
    active_boxes: number;
    total_dockets: number;
    full_boxes: number;
    total_clients: number;
    monthly_revenue: number;
  };
  zones?: Array<{
    zone_name: string;
    utilization: number;
  }>;
  recentActivity?: Array<{
    movement_type: string;
    timestamp: string;
    description: string;
    docket_code?: string;
    performed_by?: string;
    movement_timestamp?: string;
  }>;
}

class StorageAPIServiceClass {
  async getStorageBoxes(filters?: any): Promise<StorageBox[]> {
    // Mock data with extended properties
    const boxes = [
      {
        id: 'box-001',
        name: 'Evidence Box A1',
        location: 'Zone A, Shelf 1',
        capacity: 100,
        used: 65,
        occupied: 65,
        items: ['EV-001', 'EV-002', 'EV-003'],
        status: 'available' as const,
        box_code: 'BOX-001',
        zone_name: 'Zone A',
        zone_id: 'zone-a',
        client_name: 'Department of Justice',
        client_id: 'client-001',
        shelf_code: 'A-01',
        monthly_rate: 40
      },
      {
        id: 'box-002',
        name: 'Evidence Box A2',
        location: 'Zone A, Shelf 2',
        capacity: 100,
        used: 100,
        occupied: 100,
        items: ['EV-004', 'EV-005', 'EV-006', 'EV-007'],
        status: 'full' as const,
        box_code: 'BOX-002',
        zone_name: 'Zone A',
        zone_id: 'zone-a',
        client_name: 'Metro Police',
        client_id: 'client-002',
        shelf_code: 'A-02',
        monthly_rate: 40
      }
    ];
    
    // Apply filters if provided
    if (filters?.zone_id) {
      return boxes.filter(box => box.zone_id === filters.zone_id);
    }
    
    return boxes;
  }

  async getStorageZones(): Promise<StorageZone[]> {
    const boxes = await this.getStorageBoxes();
    return [
      {
        id: 'zone-a',
        name: 'Zone A - High Security',
        type: 'restricted',
        boxes: boxes,
        temperature: 18,
        humidity: 45,
        zone_name: 'Zone A',
        is_active: true,
        zone_type: 'High Security',
        box_count: boxes.length,
        used_capacity: 165,
        total_capacity: 200,
        utilization_percentage: 82.5
      }
    ];
  }

  async getRetrievalRequests(filters?: { status?: string }): Promise<RetrievalRequest[]> {
    const allRequests = [
      {
        id: 'req-001',
        itemId: 'EV-001',
        requestedBy: 'Officer Demo',
        status: 'pending' as const,
        timestamp: new Date().toISOString(),
        request_number: 'REQ-001',
        urgency: 'normal',
        client_name: 'Department of Justice',
        client_id: 'client-001',
        total_items: 1,
        completion_deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        retrieval_fee: 25
      },
      {
        id: 'req-002',
        itemId: 'EV-002',
        requestedBy: 'Detective Smith',
        status: 'approved' as const,
        timestamp: new Date().toISOString(),
        request_number: 'REQ-002',
        urgency: 'urgent',
        client_name: 'Metro Police',
        client_id: 'client-002',
        total_items: 2,
        completion_deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        retrieval_fee: 50
      }
    ];
    
    if (filters?.status) {
      return allRequests.filter(req => req.status === filters.status);
    }
    
    return allRequests;
  }

  async getStorageStatistics(): Promise<StorageStatistics> {
    return {
      totalBoxes: 50,
      usedBoxes: 35,
      totalCapacity: 5000,
      usedCapacity: 3250,
      pendingRequests: 5,
      summary: {
        total_boxes: 50,
        active_boxes: 35,
        total_dockets: 150,
        full_boxes: 12,
        total_clients: 8,
        monthly_revenue: 1400
      },
      zones: [
        { zone_name: 'Zone A', utilization: 82.5 },
        { zone_name: 'Zone B', utilization: 65.0 },
        { zone_name: 'Zone C', utilization: 45.2 }
      ],
      recentActivity: [
        {
          movement_type: 'retrieval',
          timestamp: new Date().toISOString(),
          description: 'Evidence retrieved for court hearing',
          docket_code: 'DOC-2024-001',
          performed_by: 'Officer Demo',
          movement_timestamp: new Date().toISOString()
        },
        {
          movement_type: 'deposit',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          description: 'New evidence deposited in Zone A',
          docket_code: 'DOC-2024-002',
          performed_by: 'Detective Smith',
          movement_timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    };
  }

  async createStorageBox(boxData: Partial<StorageBox>): Promise<StorageBox> {
    // Mock implementation - in real app would POST to API
    const newBox: StorageBox = {
      id: `box-${Date.now()}`,
      name: boxData.name || 'New Storage Box',
      location: boxData.location || 'Unassigned',
      capacity: boxData.capacity || 100,
      used: 0,
      occupied: 0,
      items: [],
      status: 'available',
      box_code: `BOX-${Date.now()}`,
      zone_name: boxData.zone_name,
      zone_id: boxData.zone_id,
      client_name: boxData.client_name,
      client_id: boxData.client_id,
      shelf_code: boxData.shelf_code,
      monthly_rate: boxData.monthly_rate || 40
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newBox;
  }

  async createRetrievalRequest(requestData: Partial<RetrievalRequest>): Promise<RetrievalRequest> {
    // Mock implementation - in real app would POST to API
    const newRequest: RetrievalRequest = {
      id: `req-${Date.now()}`,
      itemId: requestData.itemId || '',
      requestedBy: requestData.requestedBy || 'Unknown',
      status: 'pending',
      timestamp: new Date().toISOString(),
      request_number: `REQ-${Date.now()}`,
      urgency: requestData.urgency || 'normal',
      client_name: requestData.client_name,
      client_id: requestData.client_id,
      total_items: requestData.total_items || 1,
      completion_deadline: requestData.urgency === 'urgent' 
        ? new Date(Date.now() + 30 * 60 * 1000).toISOString()
        : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      retrieval_fee: requestData.urgency === 'urgent' ? 50 : 25
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newRequest;
  }

  async completeRetrieval(requestId: string | number): Promise<void> {
    // Mock implementation - in real app would PUT to API
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would update the request status to 'retrieved'
    console.log(`Retrieval request ${requestId} completed`);
  }

  // Alias for backward compatibility
  async getStatistics(): Promise<StorageStatistics> {
    return this.getStorageStatistics();
  }
}

export const storageAPI = new StorageAPIServiceClass();