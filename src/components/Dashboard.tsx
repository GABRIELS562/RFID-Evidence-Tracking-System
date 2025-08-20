import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Activity, Package, AlertCircle, TrendingUp } from 'lucide-react';

interface DashboardMetrics {
  totalItems: number;
  activeItems: number;
  recentScans: number;
  alerts: number;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalItems: 0,
    activeItems: 0,
    recentScans: 0,
    alerts: 0
  });

  useEffect(() => {
    // Fetch dashboard metrics
    fetchMetrics();
    
    // Set up real-time updates
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const metricCards = [
    {
      title: 'Total Inventory',
      value: metrics.totalItems.toLocaleString(),
      icon: Package,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Active Items',
      value: metrics.activeItems.toLocaleString(),
      icon: Activity,
      color: 'green',
      trend: '+5%'
    },
    {
      title: 'Recent Scans',
      value: metrics.recentScans.toLocaleString(),
      icon: TrendingUp,
      color: 'purple',
      trend: '+23%'
    },
    {
      title: 'Active Alerts',
      value: metrics.alerts.toLocaleString(),
      icon: AlertCircle,
      color: 'orange',
      trend: '-8%'
    }
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">RFID Inventory Tracking Dashboard</h1>
      
      <div className="metrics-grid">
        {metricCards.map((metric, index) => (
          <Card key={index} className="metric-card">
            <CardHeader className="metric-header">
              <CardTitle className="metric-title">{metric.title}</CardTitle>
              <metric.icon className={`metric-icon ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-trend">{metric.trend} from last week</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Real-time Activity</h2>
          <div className="activity-feed">
            {/* Real-time activity feed would go here */}
            <p>Monitoring RFID scanner activity...</p>
          </div>
        </div>

        <div className="section">
          <h2>Warehouse Zones</h2>
          <div className="zones-overview">
            {/* Zone visualization would go here */}
            <p>Zone utilization and heat map...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;