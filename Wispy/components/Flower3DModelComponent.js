// src/components/Flower3DModelComponent.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';

const modelPath = require('../assets/models/talkingflower.glb');

function Model(props) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene.clone()} {...props} />;
}

export default function Flower3DModel(props) {
  return (
    <Suspense fallback={null}>
      <Model {...props} />
    </Suspense>
  );
}

useGLTF.preload(modelPath);
