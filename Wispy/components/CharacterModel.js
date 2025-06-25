import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';


const modelPath = require('../assets/models/character.glb');

export function CharacterModel(props) {
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0xffffff); // 흰색 빛을 방출

        // 방출하는 빛의 강도
        child.material.emissiveIntensity = 0.05;
      }
    });
  }, []);

  return <primitive object={scene} {...props} />;
}


useGLTF.preload(modelPath);