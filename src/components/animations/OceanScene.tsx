
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import OceanWaves from './OceanWaves';

interface OceanSceneProps {
  isBackground?: boolean;
}

const OceanScene: React.FC<OceanSceneProps> = ({ isBackground = false }) => {
  return (
    <div className={isBackground ? "fixed inset-0 -z-10" : "fixed inset-0 z-50 bg-black/70 flex items-center justify-center"}>
      <div className={isBackground ? "w-full h-full" : "relative w-full h-full max-w-4xl max-h-96 mx-auto"}>
        {!isBackground && (
          <button 
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 text-black"
            onClick={() => document.dispatchEvent(new CustomEvent('closeOceanAnimation'))}
          >
            ✕
          </button>
        )}
        <Canvas 
          camera={{ position: [0, 2, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]} // Optimized pixel ratio
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OceanWaves isBackground={isBackground} />
            {!isBackground && <OrbitControls enableZoom={true} enableRotate={true} enablePan={false} />}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default OceanScene;
