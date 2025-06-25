// Skybox.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber/native';

export function Skybox({ rotationX = 0, rotationY = 0 }) {
  const materialRef = useRef();
  const meshRef = useRef();

  const texture = useLoader(THREE.TextureLoader, require('../assets/images/Sky.png'));

  useEffect(() => {
    if (texture && materialRef.current) {
        materialRef.current.map = texture;
        
        materialRef.current.needsUpdate = true;
    }
  }, [texture]);

  useFrame((state, delta) => {

    if (meshRef.current) {

      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[rotationX, rotationY, 0]}>

      <sphereGeometry args={[7, 60, 40]} />
      
      <meshBasicMaterial ref={materialRef} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  );
}
