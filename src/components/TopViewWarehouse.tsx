import React from 'react';

interface TopViewWarehouseProps {
  items?: any[];
  zones?: any[];
}

const TopViewWarehouse: React.FC<TopViewWarehouseProps> = ({ items = [], zones = [] }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      background: '#f0f0f0',
      border: '2px solid #ddd',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h3 style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px',
        margin: 0,
        color: '#333'
      }}>
        Top View - Warehouse Layout
      </h3>
      
      {/* Draw zones */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Zone A - DNA Processing */}
        <rect x="10%" y="20%" width="25%" height="30%" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
        <text x="22.5%" y="35%" textAnchor="middle" fill="#1976d2">DNA Processing</text>
        
        {/* Zone B - Storage */}
        <rect x="40%" y="20%" width="25%" height="30%" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2" />
        <text x="52.5%" y="35%" textAnchor="middle" fill="#7b1fa2">Storage Unit</text>
        
        {/* Zone C - Reception */}
        <rect x="10%" y="55%" width="25%" height="30%" fill="#e8f5e9" stroke="#388e3c" strokeWidth="2" />
        <text x="22.5%" y="70%" textAnchor="middle" fill="#388e3c">Reception</text>
        
        {/* Zone D - Analysis Lab */}
        <rect x="40%" y="55%" width="25%" height="30%" fill="#fff3e0" stroke="#f57c00" strokeWidth="2" />
        <text x="52.5%" y="70%" textAnchor="middle" fill="#f57c00">Analysis Lab</text>
        
        {/* RFID Readers */}
        <circle cx="22.5%" cy="35%" r="5" fill="#4caf50" />
        <circle cx="52.5%" cy="35%" r="5" fill="#4caf50" />
        <circle cx="22.5%" cy="70%" r="5" fill="#4caf50" />
        <circle cx="52.5%" cy="70%" r="5" fill="#4caf50" />
      </svg>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '12px', marginBottom: '5px' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#4caf50', marginRight: '5px' }}></span>
          RFID Reader
        </div>
        <div style={{ fontSize: '12px' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#ff5722', marginRight: '5px' }}></span>
          Evidence Item
        </div>
      </div>
    </div>
  );
};

export default TopViewWarehouse;