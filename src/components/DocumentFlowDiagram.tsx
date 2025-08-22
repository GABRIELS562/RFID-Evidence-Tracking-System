import React from 'react';

interface DocumentFlowDiagramProps {
  nodes?: any[];
  edges?: any[];
  onNodeClick?: (node: any) => void;
  onEdgeClick?: (edge: any) => void;
  interactive?: boolean;
}

const DocumentFlowDiagram: React.FC<DocumentFlowDiagramProps> = ({ 
  nodes = [],
  edges = [],
  onNodeClick,
  onEdgeClick,
  interactive = true
}) => {
  const defaultNodes = [
    { id: 1, label: 'Collection', x: 110, y: 85, color: '#4a90e2' },
    { id: 2, label: 'Reception', x: 310, y: 85, color: '#7b1fa2' },
    { id: 3, label: 'Processing', x: 510, y: 85, color: '#388e3c' },
    { id: 4, label: 'Storage', x: 710, y: 85, color: '#f57c00' },
    { id: 5, label: 'Analysis', x: 510, y: 215, color: '#e91e63' },
    { id: 6, label: 'Court', x: 710, y: 215, color: '#ff5722' },
  ];

  const defaultEdges = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 3, to: 5 },
    { from: 5, to: 6 },
  ];

  const displayNodes = nodes.length > 0 ? nodes : defaultNodes;
  const displayEdges = edges.length > 0 ? edges : defaultEdges;

  return (
    <div style={{
      width: '100%',
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>Evidence Flow Diagram</h3>
      
      <svg width="100%" height="400" viewBox="0 0 800 400">
        {/* Arrow marker definition */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>

        {/* Render edges */}
        {displayEdges.map((edge, index) => {
          const fromNode = displayNodes.find(n => n.id === edge.from);
          const toNode = displayNodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <path 
              key={index}
              d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
              stroke="#666" 
              strokeWidth="2" 
              markerEnd="url(#arrowhead)"
              onClick={() => interactive && onEdgeClick && onEdgeClick(edge)}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            />
          );
        })}

        {/* Render nodes */}
        {displayNodes.map((node) => (
          <g 
            key={node.id}
            onClick={() => interactive && onNodeClick && onNodeClick(node)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            <rect 
              x={node.x - 60} 
              y={node.y - 30} 
              width="120" 
              height="60" 
              fill={node.color || '#4a90e2'} 
              rx="5"
              opacity={interactive ? 0.9 : 1}
            />
            <text 
              x={node.x} 
              y={node.y} 
              textAnchor="middle" 
              fill="white" 
              fontSize="14"
            >
              {node.label}
            </text>
            {node.count && (
              <circle 
                cx={node.x + 50} 
                cy={node.y - 20} 
                r="12" 
                fill="#ff5722"
              />
            )}
            {node.count && (
              <text 
                x={node.x + 50} 
                y={node.y - 15} 
                textAnchor="middle" 
                fill="white" 
                fontSize="10"
              >
                {node.count}
              </text>
            )}
          </g>
        ))}
        
        {/* Status legend */}
        <g transform="translate(50, 320)">
          <text x="0" y="0" fontSize="12" fill="#666">Status:</text>
          <circle cx="70" cy="-3" r="5" fill="#4caf50" />
          <text x="80" y="0" fontSize="12" fill="#666">Active</text>
          <circle cx="140" cy="-3" r="5" fill="#ff9800" />
          <text x="150" y="0" fontSize="12" fill="#666">Pending</text>
          <circle cx="210" cy="-3" r="5" fill="#f44336" />
          <text x="220" y="0" fontSize="12" fill="#666">Delayed</text>
        </g>
      </svg>
    </div>
  );
};

export default DocumentFlowDiagram;