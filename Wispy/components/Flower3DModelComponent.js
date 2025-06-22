// src/components/Flower3DModelComponent.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';

const modelPath = require('../assets/models/talkingflower.glb');

function Model(props) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} {...props} />;
}

export default function Flower3DModel() {
  return (
    <Canvas camera={{ position: [0, 0.5, 5], fov: 25 }}>
      <ambientLight intensity={2.5} />
      <directionalLight position={[1, 3, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Model scale={3.5} position={[0, -1.2, 0]} />
      </Suspense>
    </Canvas>
  );
}
useGLTF.preload(modelPath);
