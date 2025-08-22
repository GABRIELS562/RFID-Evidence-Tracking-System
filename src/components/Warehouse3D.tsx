import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, Sphere } from '@react-three/drei';

interface Warehouse3DProps {
  boxes?: any[];
  rfidTags?: any[];
  showHeatmap?: boolean;
  showPaths?: boolean;
  onBoxClick?: (boxId: any) => void;
}

const Warehouse3D: React.FC<Warehouse3DProps> = ({ 
  boxes = [], 
  rfidTags = [], 
  showHeatmap = false, 
  showPaths = false,
  onBoxClick 
}) => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <OrbitControls />
        
        {/* Warehouse floor */}
        <Box position={[0, -1, 0]} args={[20, 0.5, 20]}>
          <meshStandardMaterial color="#888" />
        </Box>
        
        {/* Storage areas - default display if no boxes provided */}
        {boxes.length === 0 ? (
          <>
            <Box position={[-5, 1, -5]} args={[3, 2, 3]}>
              <meshStandardMaterial color="#4a90e2" />
            </Box>
            <Box position={[5, 1, -5]} args={[3, 2, 3]}>
              <meshStandardMaterial color="#4a90e2" />
            </Box>
            <Box position={[-5, 1, 5]} args={[3, 2, 3]}>
              <meshStandardMaterial color="#4a90e2" />
            </Box>
            <Box position={[5, 1, 5]} args={[3, 2, 3]}>
              <meshStandardMaterial color="#4a90e2" />
            </Box>
          </>
        ) : (
          /* Render actual boxes */
          boxes.map((box, index) => (
            <Box 
              key={box.id || index}
              position={[
                (index % 4) * 4 - 6,
                1,
                Math.floor(index / 4) * 4 - 6
              ]}
              args={[3, 2, 3]}
              onClick={() => onBoxClick && onBoxClick(box.id)}
            >
              <meshStandardMaterial 
                color={box.status === 'full' ? '#ef4444' : 
                       box.status === 'partial' ? '#f59e0b' : '#10b981'} 
              />
            </Box>
          ))
        )}
        
        {/* RFID Tags visualization */}
        {rfidTags.map((tag, index) => (
          <Sphere 
            key={tag.id || index}
            position={[
              (index % 4) * 4 - 6,
              3,
              Math.floor(index / 4) * 4 - 6
            ]}
            args={[0.2]}
          >
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
          </Sphere>
        ))}
        
        {/* Heatmap overlay if enabled */}
        {showHeatmap && (
          <Box position={[0, 0.1, 0]} args={[20, 0.1, 20]}>
            <meshStandardMaterial 
              color="#ff0000" 
              transparent 
              opacity={0.3} 
            />
          </Box>
        )}
        
        <Text position={[0, 5, 0]} fontSize={1} color="white">
          3D Warehouse View
        </Text>
      </Canvas>
    </div>
  );
};

export default Warehouse3D;