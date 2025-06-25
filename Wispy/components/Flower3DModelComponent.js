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
      {/* 부모로부터 받은 모든 props를 Model 컴포넌트로 전달합니다. */}
      <Model {...props} />
    </Suspense>
  );
}

// 앱 시작 시 모델을 미리 로드하여 성능을 향상시킵니다.
useGLTF.preload(modelPath);
