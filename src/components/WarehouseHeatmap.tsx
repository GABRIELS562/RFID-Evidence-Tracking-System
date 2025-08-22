import React from 'react';

const WarehouseHeatmap: React.FC = () => {
  const generateHeatmapData = () => {
    const data = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        data.push({
          x: i,
          y: j,
          intensity: Math.random()
        });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  
  return (
    <div style={{
      width: '100%',
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>Warehouse Activity Heatmap</h3>
      
      <div style={{ position: 'relative', width: '100%', height: '400px', background: '#f0f0f0' }}>
        <svg width="100%" height="100%" viewBox="0 0 500 400">
          {heatmapData.map((cell, index) => (
            <rect
              key={index}
              x={cell.x * 50}
              y={cell.y * 40}
              width="50"
              height="40"
              fill={`rgba(255, ${Math.floor(255 - cell.intensity * 255)}, 0, ${cell.intensity})`}
            />
          ))}
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
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Activity Level</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '10px', background: 'rgba(255, 255, 0, 0.2)' }}></div>
            <span style={{ fontSize: '11px' }}>Low</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '10px', background: 'rgba(255, 128, 0, 0.6)' }}></div>
            <span style={{ fontSize: '11px' }}>Medium</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '10px', background: 'rgba(255, 0, 0, 1)' }}></div>
            <span style={{ fontSize: '11px' }}>High</span>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div style={{
        marginTop: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px'
      }}>
        <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff5722' }}>Zone A</div>
          <div style={{ fontSize: '12px', color: '#666' }}>High Activity</div>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff9800' }}>Zone B</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Medium Activity</div>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>Zone C</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Low Activity</div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseHeatmap;