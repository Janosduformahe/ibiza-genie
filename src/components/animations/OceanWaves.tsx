
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const OceanWaves = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) * 0.1;
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[10, 10, 32, 32]} />
      <MeshWobbleMaterial
        color="#0EA5E9"
        factor={0.4}
        speed={2}
        roughness={0}
        metalness={0.8}
      />
    </mesh>
  );
};

export default OceanWaves;
