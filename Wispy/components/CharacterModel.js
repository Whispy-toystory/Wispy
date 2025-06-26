// components/CharacterModel.js
import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei/native';
import { useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

const modelPath = require('../assets/models/character.glb');

export function CharacterModel({ isAnimated = false, ...props }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0xffffff);
        child.material.emissiveIntensity = 0.05;
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    // isAnimated가 true이고 modelRef.current가 존재할 때만 애니메이션을 실행합니다.
    if (isAnimated && modelRef.current) {
      const elapsedTime = clock.getElapsedTime();
      // 초기 y 위치(props.position[1])를 기준으로 움직이도록 수정합니다.
      const initialY = props.position ? props.position[1] : 0;
      modelRef.current.position.y = initialY + Math.sin(elapsedTime * 2) * 0.05;
    }
  });

  return <primitive ref={modelRef} object={scene} {...props} />;
}

useGLTF.preload(modelPath);