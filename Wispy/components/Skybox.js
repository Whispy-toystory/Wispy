// Skybox.js (이것이 진정한 최후의 최종 코드입니다)
import React, { useEffect, useRef } from 'react';
// useThree와 Asset은 이제 필요 없습니다.
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber/native'; // 더 간단한 로더 훅을 사용합니다.

export function Skybox({ rotationX = 0, rotationY = 0 }) {
  const materialRef = useRef();
  const meshRef = useRef();


  // useLoader 훅으로 코드를 더 단순화합니다.
  // Asset.fromModule, loader.load 등의 복잡한 과정이 한 줄로 해결됩니다.
  const texture = useLoader(THREE.TextureLoader, require('../assets/images/Sky.png'));

  useEffect(() => {
    // 텍스처가 로드되면 재질에 적용합니다.
    if (texture && materialRef.current) {
        materialRef.current.map = texture;
        
        materialRef.current.needsUpdate = true;
    }
  }, [texture]); // texture가 로드되면 이 useEffect가 다시 실행됩니다.

  // 2. useFrame 훅을 사용하여 애니메이션을 만듭니다.
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
