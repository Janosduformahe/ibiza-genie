
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface OceanWavesProps {
  isBackground?: boolean;
}

const OceanWaves: React.FC<OceanWavesProps> = ({ isBackground = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isBackground) {
        // Movimiento más suave para el fondo
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime / 4) * 0.1;
        meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime / 5) * 0.1;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime / 3) * 0.05 - 0.5;
      } else {
        // Movimiento más activo para la animación modal
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) * 0.1;
        meshRef.current.rotation.y += delta * 0.1;
      }
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[0, isBackground ? -0.5 : 0, 0]} 
      rotation={[isBackground ? -Math.PI / 2.5 : 0, 0, 0]}
    >
      <planeGeometry args={[isBackground ? 30 : 10, isBackground ? 30 : 10, 32, 32]} />
      <MeshWobbleMaterial
        color={isBackground ? "#0EA5E9" : "#0EA5E9"}
        factor={isBackground ? 0.2 : 0.4}
        speed={isBackground ? 1 : 2}
        roughness={0}
        metalness={0.8}
        transparent={isBackground}
        opacity={isBackground ? 0.8 : 1}
      />
    </mesh>
  );
};

export default OceanWaves;
