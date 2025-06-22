// src/components/Flower3DModelComponent.js

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';

// 모델 파일 경로가 올바른지 확인합니다.
const modelPath = require('../assets/models/talkingflower.glb');

function Model(props) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} {...props} />;
}

export default function Flower3DModel() {
  return (
    // Canvas와 조명, 모델의 기본 설정을 포함합니다.
    <Canvas camera={{ position: [0, 1, 5], fov: 30 }}>
      <ambientLight intensity={2.5} />
      <directionalLight position={[1, 3, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        {/* 모델의 크기와 위치를 최종적으로 조정합니다. */}
        <Model scale={2} position={[0, 0, 0]} />
      </Suspense>
    </Canvas>
  );
}

// 앱 시작 시 모델을 미리 로드하여 성능을 향상시킵니다.
useGLTF.preload(modelPath);
