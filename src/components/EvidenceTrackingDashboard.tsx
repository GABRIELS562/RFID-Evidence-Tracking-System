import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent, StatCard } from './ui/EnhancedCard';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChainOfCustodyTimeline, PriorityAlert, EnvironmentalMonitor, QuickActionsPanel } from './ForensicComponents';
import { EnhancedEvidenceSearch } from './EnhancedEvidenceSearch';

interface EvidenceItem {
  id: string;
  caseNumber: string;
  description: string;
  location: string;
  status: 'checked-in' | 'in-transit' | 'in-lab' | 'in-court' | 'disposed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastScanned: Date;
  chain: Array<{
    timestamp: Date;
    action: string;
    officer: string;
    location: string;
  }>;
  temperature?: number;
  humidity?: number;
  tags: string[];
  officer: string;
  chainStatus: 'verified' | 'pending' | 'broken';
}

const EvidenceTrackingDashboard: React.FC = () => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [realTimeAlerts, setRealTimeAlerts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'dashboard' | 'search' | 'chain'>('dashboard');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockEvidence: EvidenceItem[] = [
      {
        id: 'EVD-2024-001',
        caseNumber: 'CASE-2024-1234',
        description: 'DNA Sample - Homicide Investigation',
        location: 'Forensic Lab - Biology Unit',
        status: 'in-lab',
        priority: 'critical',
        lastScanned: new Date(),
        chain: [
          { timestamp: new Date(Date.now() - 3600000), action: 'Evidence Collected', officer: 'Det. Smith', location: 'Crime Scene' },
          { timestamp: new Date(Date.now() - 1800000), action: 'Checked In', officer: 'Off. Johnson', location: 'Evidence Room' },
          { timestamp: new Date(), action: 'Transferred to Lab', officer: 'Lab Tech Wilson', location: 'Forensic Lab' },
        ],
        temperature: 4.2,
        humidity: 45,
        tags: ['DNA', 'Homicide', 'Biological', 'Priority'],
        officer: 'Det. Smith',
        chainStatus: 'verified'
      },
      {
        id: 'EVD-2024-002',
        caseNumber: 'CASE-2024-5678',
        description: 'Firearm - Ballistics Analysis',
        location: 'Ballistics Lab',
        status: 'in-lab',
        priority: 'high',
        lastScanned: new Date(),
        chain: [
          { timestamp: new Date(Date.now() - 7200000), action: 'Evidence Collected', officer: 'Off. Davis', location: 'Crime Scene' },
          { timestamp: new Date(Date.now() - 3600000), action: 'Preliminary Exam', officer: 'Det. Martinez', location: 'Evidence Room' },
        ],
        temperature: 21,
        humidity: 50,
        tags: ['Firearm', 'Ballistics', 'Weapon'],
        officer: 'Off. Davis',
        chainStatus: 'pending'
      },
      {
        id: 'EVD-2024-003',
        caseNumber: 'CASE-2024-9012',
        description: 'Digital Device - Fraud Investigation',
        location: 'Digital Forensics Lab',
        status: 'checked-in',
        priority: 'medium',
        lastScanned: new Date(),
        chain: [
          { timestamp: new Date(Date.now() - 86400000), action: 'Device Seized', officer: 'Det. Brown', location: 'Suspect Residence' },
        ],
        temperature: 20,
        humidity: 40,
        tags: ['Digital', 'Fraud', 'Computer'],
        officer: 'Det. Brown',
        chainStatus: 'verified'
      },
      {
        id: 'EVD-2024-004',
        caseNumber: 'CASE-2024-3456',
        description: 'Blood Sample - Assault Case',
        location: 'Cold Storage Unit 3',
        status: 'checked-in',
        priority: 'critical',
        lastScanned: new Date(Date.now() - 300000),
        chain: [
          { timestamp: new Date(Date.now() - 7200000), action: 'Sample Collected', officer: 'Paramedic Jones', location: 'Hospital' },
          { timestamp: new Date(Date.now() - 3600000), action: 'Chain Transfer', officer: 'Off. Wilson', location: 'Evidence Room' },
        ],
        temperature: 2.8,
        humidity: 35,
        tags: ['Blood', 'Biological', 'Assault'],
        officer: 'Off. Wilson',
        chainStatus: 'broken'
      },
      {
        id: 'EVD-2024-005',
        caseNumber: 'CASE-2024-7890',
        description: 'Fabric Sample - Burglary',
        location: 'Evidence Locker B-12',
        status: 'in-transit',
        priority: 'low',
        lastScanned: new Date(Date.now() - 600000),
        chain: [
          { timestamp: new Date(Date.now() - 172800000), action: 'Evidence Collected', officer: 'Off. Garcia', location: 'Crime Scene' },
          { timestamp: new Date(Date.now() - 86400000), action: 'Initial Processing', officer: 'Tech Anderson', location: 'Evidence Room' },
        ],
        temperature: 18,
        humidity: 42,
        tags: ['Fabric', 'Burglary', 'Trace'],
        officer: 'Off. Garcia',
        chainStatus: 'verified'
      },
    ];
    setEvidenceItems(mockEvidence);

    // Simulate real-time alerts
    const interval = setInterval(() => {
      const alerts = [
        { 
          type: 'critical', 
          message: 'CRITICAL: Chain of custody broken for EVD-2024-004', 
          time: new Date(),
          priority: 'critical',
          actionRequired: true 
        },
        { 
          type: 'warning', 
          message: 'Temperature anomaly detected in Cold Storage Unit 3: 8.2°C', 
          time: new Date(),
          priority: 'high',
          actionRequired: true 
        },
        { 
          type: 'info', 
          message: 'Evidence EVD-2024-005 location updated: In Transit to Court', 
          time: new Date(),
          priority: 'medium' 
        },
        { 
          type: 'success', 
          message: 'Ballistics analysis completed for EVD-2024-002', 
          time: new Date(),
          priority: 'low' 
        },
        { 
          type: 'warning', 
          message: 'Humidity spike in Evidence Room: 78%', 
          time: new Date(),
          priority: 'medium',
          actionRequired: true 
        },
      ];
      
      // Add random alert
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      setRealTimeAlerts(prev => [{ ...randomAlert, id: Date.now() }, ...prev].slice(0, 8));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Chart data
  const evidenceFlowData = [
    { name: 'Mon', received: 12, processed: 10, released: 8 },
    { name: 'Tue', received: 15, processed: 13, released: 11 },
    { name: 'Wed', received: 18, processed: 16, released: 14 },
    { name: 'Thu', received: 14, processed: 12, released: 10 },
    { name: 'Fri', received: 20, processed: 18, released: 15 },
    { name: 'Sat', received: 8, processed: 7, released: 6 },
    { name: 'Sun', received: 5, processed: 4, released: 3 },
  ];

  const statusDistribution = [
    { name: 'Checked In', value: 35, color: '#4facfe' },
    { name: 'In Transit', value: 15, color: '#fa709a' },
    { name: 'In Lab', value: 25, color: '#667eea' },
    { name: 'In Court', value: 10, color: '#fee140' },
    { name: 'Disposed', value: 15, color: '#43e97b' },
  ];

  const labUtilization = [
    { lab: 'Biology', capacity: 85, efficiency: 92 },
    { lab: 'Chemistry', capacity: 70, efficiency: 88 },
    { lab: 'Ballistics', capacity: 60, efficiency: 95 },
    { lab: 'Digital', capacity: 90, efficiency: 87 },
    { lab: 'Fraud', capacity: 45, efficiency: 90 },
  ];

  const priorityRadarData = [
    { category: 'Critical', A: 120, B: 110, fullMark: 150 },
    { category: 'High', A: 98, B: 130, fullMark: 150 },
    { category: 'Medium', A: 86, B: 130, fullMark: 150 },
    { category: 'Low', A: 99, B: 100, fullMark: 150 },
    { category: 'Routine', A: 85, B: 90, fullMark: 150 },
  ];

  // Enhanced utility functions
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'checked-in': '#3b82f6',
      'in-transit': '#f59e0b',
      'in-lab': '#8b5cf6',
      'in-court': '#ec4899',
      'disposed': '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'critical': '#dc2626',
      'high': '#ea580c',
      'medium': '#ca8a04',
      'low': '#16a34a',
    };
    return colors[priority] || '#6b7280';
  };

  // Filter evidence based on search and filters
  const filteredEvidence = evidenceItems.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Priority statistics
  const priorityStats = {
    critical: evidenceItems.filter(item => item.priority === 'critical').length,
    high: evidenceItems.filter(item => item.priority === 'high').length,
    medium: evidenceItems.filter(item => item.priority === 'medium').length,
    low: evidenceItems.filter(item => item.priority === 'low').length,
    brokenChain: evidenceItems.filter(item => item.chainStatus === 'broken').length,
    pendingChain: evidenceItems.filter(item => item.chainStatus === 'pending').length
  };

  // Environmental monitoring data
  const environmentalData = evidenceItems.filter(item => 
    item.temperature !== undefined && item.humidity !== undefined
  ).map(item => ({
    temperature: item.temperature!,
    humidity: item.humidity!,
    timestamp: item.lastScanned,
    location: item.location,
    status: item.temperature! < 2 || item.temperature! > 8 || 
            item.humidity! < 30 || item.humidity! > 70 ? 'warning' as const : 'optimal' as const
  }));

  // Quick actions configuration
  const quickActions = [
    {
      id: 'emergency',
      label: 'Emergency Alert',
      icon: 'ALERT',
      onClick: () => setEmergencyMode(!emergencyMode),
      type: 'emergency' as const,
      badge: priorityStats.critical
    },
    {
      id: 'chain-broken',
      label: 'Broken Chain',
      icon: 'BREAK',
      onClick: () => setSelectedItem(evidenceItems.find(item => item.chainStatus === 'broken') || null),
      type: 'critical' as const,
      badge: priorityStats.brokenChain
    },
    {
      id: 'temp-alert',
      label: 'Temp Alert',
      icon: 'TEMP',
      onClick: () => console.log('Temperature alert clicked'),
      type: 'secondary' as const,
      badge: environmentalData.filter(d => d.status === 'warning').length
    },
    {
      id: 'new-evidence',
      label: 'Add Evidence',
      icon: 'ADD',
      onClick: () => console.log('Add evidence clicked'),
      type: 'primary' as const
    },
    {
      id: 'search',
      label: 'Search Evidence',
      icon: 'FIND',
      onClick: () => setViewMode('search'),
      type: 'primary' as const
    },
    {
      id: 'reports',
      label: 'Generate Report',
      icon: 'RPT',
      onClick: () => console.log('Generate report clicked'),
      type: 'secondary' as const
    }
  ];

  // Chain events for selected item
  const chainEvents = selectedItem ? selectedItem.chain.map((event, index) => ({
    id: `${selectedItem.id}-${index}`,
    timestamp: event.timestamp,
    action: event.action,
    officer: event.officer,
    location: event.location,
    status: selectedItem.chainStatus,
    notes: index === 0 ? 'Initial evidence collection and documentation' : 
           index === selectedItem.chain.length - 1 ? 'Latest chain event' : undefined
  })) : [];

  // Handle evidence selection
  const handleEvidenceSelect = (evidence: EvidenceItem) => {
    setSelectedItem(evidence);
    setViewMode('chain');
  };

  // Handle bulk actions
  const handleBulkAction = (selectedIds: string[], action: string) => {
    console.log(`Bulk action ${action} on:`, selectedIds);
    // Implement bulk action logic here
  };

  // Remove the old filtering logic as it's now handled by EnhancedEvidenceSearch

  // Render different views based on mode
  const renderContent = () => {
    switch (viewMode) {
      case 'search':
        return (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setViewMode('dashboard')}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px'
                }}
              >
                <span>←</span>
                Back to Dashboard
              </button>
              {priorityStats.critical > 0 && (
                <PriorityAlert 
                  priority="critical" 
                  count={priorityStats.critical}
                  onClick={() => setViewMode('dashboard')}
                />
              )}
            </div>
            <EnhancedEvidenceSearch 
              evidence={evidenceItems}
              onEvidenceSelect={handleEvidenceSelect}
              onBulkAction={handleBulkAction}
            />
          </div>
        );

      case 'chain':
        return (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <button
                onClick={() => setViewMode('dashboard')}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px'
                }}
              >
                <span>←</span>
                Back to Dashboard
              </button>
              
              {selectedItem && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 24px',
                  background: theme === 'dark' 
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9))'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{
                    background: getPriorityColor(selectedItem.priority),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {selectedItem.priority}
                  </span>
                  <div>
                    <div style={{
                      fontWeight: '700',
                      color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                    }}>
                      {selectedItem.id}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b'
                    }}>
                      {selectedItem.description}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedItem && (
              <ChainOfCustodyTimeline 
                events={chainEvents}
                evidenceId={selectedItem.id}
                onAddEvent={() => console.log('Add chain event')}
              />
            )}
          </div>
        );

      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Enhanced Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px'
            }}>
              Evidence Management System
            </h1>
            <p style={{ 
              color: theme === 'dark' ? '#94a3b8' : '#64748b', 
              fontSize: '1.125rem',
              fontWeight: '500'
            }}>
              Forensic Laboratory Management System • ISO 17025 Compliant • Real-time Chain of Custody
            </p>
          </div>
          
          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setViewMode('search')}
              className="btn-primary"
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                background: '#667eea',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>FIND</span>
              Advanced Search
            </button>
          </div>
        </div>
        
        {/* Priority Alerts Row */}
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '16px'
        }}>
          {priorityStats.critical > 0 && (
            <PriorityAlert 
              priority="critical" 
              count={priorityStats.critical}
              onClick={() => setViewMode('search')}
            />
          )}
          {priorityStats.brokenChain > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              animation: 'chainBrokenAlert 1s ease-in-out infinite'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'white'
              }}>BREAK</span>
              {priorityStats.brokenChain} Broken Chain{priorityStats.brokenChain !== 1 ? 's' : ''}
            </div>
          )}
          {environmentalData.filter(d => d.status === 'warning').length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'white'
              }}>TEMP</span>
              {environmentalData.filter(d => d.status === 'warning').length} Environment Alert{environmentalData.filter(d => d.status === 'warning').length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <StatCard 
          title="Total Evidence Items" 
          value={evidenceItems.length.toString()}
          change={12.5}
          icon="ITEMS"
          color="primary"
        />
        <StatCard 
          title="In Processing" 
          value={evidenceItems.filter(item => item.status === 'in-lab').length.toString()}
          change={-5.2}
          icon="PROC"
          color="warning"
        />
        <StatCard 
          title="Chain Verified" 
          value={`${Math.round((evidenceItems.filter(item => item.chainStatus === 'verified').length / evidenceItems.length) * 100)}%`}
          change={evidenceItems.filter(item => item.chainStatus === 'broken').length > 0 ? -15.2 : 2.1}
          icon="VRFD"
          color={evidenceItems.filter(item => item.chainStatus === 'broken').length > 0 ? "danger" : "success"}
        />
        <StatCard 
          title="Critical Items" 
          value={priorityStats.critical.toString()}
          change={priorityStats.critical > 0 ? 200 : -50}
          icon="ALERT"
          color="danger"
        />
        <StatCard 
          title="Environmental Alerts" 
          value={environmentalData.filter(d => d.status === 'warning').length.toString()}
          change={-25}
          icon="TEMP"
          color="warning"
        />
        <StatCard 
          title="System Uptime" 
          value="99.94%"
          change={0.02}
          icon="UPTIME"
          color="success"
        />
      </div>

      {/* Quick Actions Panel */}
      {showQuickActions && (
        <div style={{ marginBottom: '32px' }}>
          <QuickActionsPanel 
            actions={quickActions}
            title="Forensic Operations"
          />
        </div>
      )}

      {/* Enhanced Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        {/* Evidence Flow Chart */}
        <EnhancedCard variant="glass" animated>
          <EnhancedCardHeader>
            <EnhancedCardTitle gradient>Evidence Flow Analysis</EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evidenceFlowData}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#764ba2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <Tooltip 
                  contentStyle={{ 
                    background: theme === 'dark' ? '#1e293b' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="received" stroke="#667eea" fillOpacity={1} fill="url(#colorReceived)" strokeWidth={2} />
                <Area type="monotone" dataKey="processed" stroke="#764ba2" fillOpacity={1} fill="url(#colorProcessed)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Status Distribution */}
        <EnhancedCard variant="glass" animated>
          <EnhancedCardHeader>
            <EnhancedCardTitle gradient>Status Distribution</EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </EnhancedCardContent>
        </EnhancedCard>
      </div>

      {/* Environmental Monitor */}
      {environmentalData.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <EnvironmentalMonitor 
            data={environmentalData}
            title="Environmental Monitoring"
          />
        </div>
      )}

      {/* Lab Utilization */}
      <EnhancedCard variant="glass" animated style={{ marginBottom: '32px' }}>
        <EnhancedCardHeader>
          <EnhancedCardTitle gradient>LAB Laboratory Utilization & Efficiency</EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={labUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="lab" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  background: theme === 'dark' ? '#1e293b' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="capacity" fill="#667eea" radius={[8, 8, 0, 0]} />
              <Bar dataKey="efficiency" fill="#764ba2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Recent Evidence Activity */}
      <EnhancedCard variant="glass" animated>
        <EnhancedCardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <EnhancedCardTitle gradient>RECENT Recent Evidence Activity</EnhancedCardTitle>
            <button
              onClick={() => setViewMode('search')}
              className="btn-primary"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                background: '#667eea',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>FIND</span>
              Advanced Search
            </button>
          </div>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    borderRadius: '16px 0 0 16px'
                  }}>Evidence ID</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.05em'
                  }}>Case</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.05em'
                  }}>Description</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.05em'
                  }}>Status</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.05em'
                  }}>Priority</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.05em'
                  }}>Chain</th>
                  <th style={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    borderRadius: '0 16px 16px 0'
                  }}>Last Scan</th>
                </tr>
              </thead>
              <tbody>
                {evidenceItems.slice(0, 10).map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => handleEvidenceSelect(item)}
                    className={`priority-${item.priority}`}
                    style={{
                      background: theme === 'dark' 
                        ? item.priority === 'critical' ? 'linear-gradient(135deg, #450a0a, #1e293b)' :
                          item.priority === 'high' ? 'linear-gradient(135deg, #451a03, #1e293b)' :
                          'linear-gradient(135deg, #1e293b, #334155)'
                        : item.priority === 'critical' ? 'linear-gradient(135deg, #fef2f2, #ffffff)' :
                          item.priority === 'high' ? 'linear-gradient(135deg, #fffbeb, #ffffff)' :
                          'white',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      borderLeft: item.priority === 'critical' ? '4px solid #dc2626' :
                                   item.priority === 'high' ? '3px solid #ea580c' :
                                   item.priority === 'medium' ? '2px solid #ca8a04' :
                                   '1px solid #16a34a'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    }}
                  >
                    <td style={{ 
                      padding: '16px 12px',
                      borderRadius: '16px 0 0 16px',
                      fontWeight: '600'
                    }}>
                      <div className="rfid-tag scanning" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '700',
                        fontFamily: 'monospace'
                      }}>
                        <span className="rfid-signal" style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#10b981'
                        }}>RFID</span>
                        {item.id}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px 12px',
                      color: theme === 'dark' ? '#cbd5e1' : '#475569',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>{item.caseNumber}</td>
                    <td style={{ 
                      padding: '16px 12px',
                      color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontSize: '14px',
                      maxWidth: '250px'
                    }}>{item.description}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={`status-badge ${item.status}`} style={{
                        background: getStatusColor(item.status),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={`priority-badge ${item.priority}`} style={{
                        background: getPriorityColor(item.priority),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}>
                        {item.priority}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: item.chainStatus === 'verified' ? '#10b981' :
                                       item.chainStatus === 'pending' ? '#f59e0b' : '#ef4444',
                          boxShadow: '0 0 0 2px white'
                        }} />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: item.chainStatus === 'verified' ? '#10b981' :
                                 item.chainStatus === 'pending' ? '#f59e0b' : '#ef4444',
                          textTransform: 'capitalize'
                        }}>
                          {item.chainStatus}
                        </span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px 12px',
                      borderRadius: '0 16px 16px 0',
                      color: theme === 'dark' ? '#94a3b8' : '#64748b',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {new Date(item.lastScanned).toLocaleDateString()}<br />
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>
                        {new Date(item.lastScanned).toLocaleTimeString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{
              textAlign: 'center',
              marginTop: '16px'
            }}>
              <button
                onClick={() => setViewMode('search')}
                className="btn-secondary"
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  background: '#667eea',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>FIND</span>
                View All Evidence ({evidenceItems.length} total)
              </button>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

    </div>
  );

  return (
    <div style={{ 
      padding: '24px', 
      minHeight: '100vh', 
      background: theme === 'dark' ? '#0f172a' : '#f8fafc',
      position: 'relative'
    }}>
      {/* Emergency Banner */}
      {emergencyMode && (
        <div className="emergency-banner" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          color: 'white',
          padding: '16px',
          textAlign: 'center',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          <div className="emergency-banner-content" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <span className="emergency-icon" style={{
              fontSize: '24px',
              animation: 'pulse 1s infinite'
            }}>ALERT</span>
            <span className="emergency-text" style={{
              fontSize: '18px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              EMERGENCY MODE ACTIVATED - CRITICAL EVIDENCE ALERTS
            </span>
            <button
              onClick={() => setEmergencyMode(false)}
              className="emergency-dismiss"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 'auto'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        paddingTop: emergencyMode ? '80px' : '0',
        transition: 'padding-top 0.3s ease'
      }}>
        {renderContent()}
      </div>

      {/* Real-time Alerts */}
      <div style={{ 
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '380px',
        maxHeight: '500px',
        overflowY: 'auto',
        zIndex: 9000
      }}>
        <EnhancedCard variant="glass" animated>
          <EnhancedCardHeader>
            <EnhancedCardTitle style={{ fontSize: '1.25rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: realTimeAlerts.some(alert => alert.priority === 'critical') ? '#ef4444' : '#f59e0b',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></span>
                ALERTS Live Alerts
              </span>
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            {realTimeAlerts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '32px',
                color: theme === 'dark' ? '#94a3b8' : '#64748b'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  marginBottom: '12px',
                  fontWeight: '700',
                  color: theme === 'dark' ? '#64748b' : '#94a3b8'
                }}>STATUS</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>All Clear</div>
                <div style={{ fontSize: '14px' }}>No active alerts at this time</div>
              </div>
            ) : (
              realTimeAlerts.map((alert, index) => (
                <div key={alert.id || index} style={{
                  padding: '16px',
                  marginBottom: '12px',
                  background: theme === 'dark' 
                    ? alert.priority === 'critical' ? 'rgba(220, 38, 38, 0.2)' :
                      alert.priority === 'high' ? 'rgba(245, 158, 11, 0.2)' :
                      'rgba(30, 41, 59, 0.8)'
                    : alert.priority === 'critical' ? 'rgba(254, 242, 242, 0.9)' :
                      alert.priority === 'high' ? 'rgba(255, 251, 235, 0.9)' :
                      'rgba(248, 250, 252, 0.9)',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${
                    alert.type === 'critical' ? '#ef4444' :
                    alert.type === 'warning' ? '#f59e0b' : 
                    alert.type === 'success' ? '#10b981' : 
                    alert.type === 'info' ? '#3b82f6' : '#6b7280'
                  }`,
                  animation: 'slideInRight 0.5s ease-out',
                  boxShadow: alert.priority === 'critical' ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  cursor: alert.actionRequired ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                onClick={alert.actionRequired ? () => {
                  if (alert.type === 'critical') setEmergencyMode(true);
                  console.log('Alert action:', alert);
                } : undefined}
                onMouseEnter={alert.actionRequired ? (e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = alert.priority === 'critical' 
                    ? '0 0 25px rgba(239, 68, 68, 0.4)' 
                    : '0 4px 8px rgba(0, 0, 0, 0.15)';
                } : undefined}
                onMouseLeave={alert.actionRequired ? (e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = alert.priority === 'critical' 
                    ? '0 0 20px rgba(239, 68, 68, 0.3)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.1)';
                } : undefined}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      marginTop: '2px'
                    }}>
                      <div style={{
                        background: alert.type === 'critical' ? '#ef4444' :
                                   alert.type === 'warning' ? '#f59e0b' : 
                                   alert.type === 'success' ? '#10b981' :
                                   alert.type === 'info' ? '#3b82f6' : '#6b7280',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}>
                        {alert.type === 'critical' ? 'CRIT' :
                         alert.type === 'warning' ? 'WARN' : 
                         alert.type === 'success' ? 'OK' :
                         alert.type === 'info' ? 'INFO' : 'DATA'}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                        marginBottom: '4px'
                      }}>
                        {alert.message}
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px'
                      }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: theme === 'dark' ? '#94a3b8' : '#64748b',
                          fontWeight: '500'
                        }}>
                          {new Date(alert.time).toLocaleTimeString()}
                        </div>
                        {alert.actionRequired && (
                          <span style={{
                            background: alert.type === 'critical' ? '#ef4444' : '#f59e0b',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em'
                          }}>
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {realTimeAlerts.length > 0 && (
              <div style={{
                textAlign: 'center',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
              }}>
                <button
                  onClick={() => setRealTimeAlerts([])}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${theme === 'dark' ? '#64748b' : '#94a3b8'}`,
                    color: theme === 'dark' ? '#94a3b8' : '#64748b',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme === 'dark' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(148, 163, 184, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Clear All Alerts
                </button>
              </div>
            )}
          </EnhancedCardContent>
        </EnhancedCard>
      </div>
    </div>
  );
};

export default EvidenceTrackingDashboard;

// Keyframe animations for the component
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes chainBrokenAlert {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes criticalPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;
document.head.appendChild(styleSheet);