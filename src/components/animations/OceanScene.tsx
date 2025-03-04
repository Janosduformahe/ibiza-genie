
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import OceanWaves from './OceanWaves';

interface OceanSceneProps {
  isVisible: boolean;
}

const OceanScene: React.FC<OceanSceneProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-96 mx-auto">
        <button 
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 text-black"
          onClick={() => document.dispatchEvent(new CustomEvent('closeOceanAnimation'))}
        >
          ✕
        </button>
        <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OceanWaves />
            <OrbitControls enableZoom={true} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default OceanScene;
