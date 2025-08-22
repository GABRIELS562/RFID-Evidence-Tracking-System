import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text } from '@react-three/drei';

interface Simple3DViewProps {
  items?: any[];
}

const Simple3DView: React.FC<Simple3DViewProps> = ({ items = [] }) => {
  return (
    <div style={{ width: '100%', height: '500px', background: '#000' }}>
      <Canvas camera={{ position: [10, 10, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={true} />
        
        {/* Floor */}
        <Box position={[0, -0.5, 0]} args={[15, 0.1, 15]}>
          <meshStandardMaterial color="#333" />
        </Box>
        
        {/* Evidence items as spheres */}
        {items.map((item, index) => (
          <Sphere key={index} position={[
            Math.random() * 10 - 5,
            1,
            Math.random() * 10 - 5
          ]} args={[0.3, 32, 32]}>
            <meshStandardMaterial color="#ff6b6b" />
          </Sphere>
        ))}
        
        {/* Lab zones */}
        <Box position={[-3, 0.5, -3]} args={[2, 1, 2]}>
          <meshStandardMaterial color="#4a90e2" opacity={0.7} transparent />
        </Box>
        <Box position={[3, 0.5, -3]} args={[2, 1, 2]}>
          <meshStandardMaterial color="#7b1fa2" opacity={0.7} transparent />
        </Box>
        <Box position={[-3, 0.5, 3]} args={[2, 1, 2]}>
          <meshStandardMaterial color="#388e3c" opacity={0.7} transparent />
        </Box>
        <Box position={[3, 0.5, 3]} args={[2, 1, 2]}>
          <meshStandardMaterial color="#f57c00" opacity={0.7} transparent />
        </Box>
        
        <Text position={[0, 3, 0]} fontSize={0.5} color="white">
          Forensic Lab 3D View
        </Text>
      </Canvas>
    </div>
  );
};

export default Simple3DView;