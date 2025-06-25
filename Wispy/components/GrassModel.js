import React from 'react';
import { useGLTF, useTexture } from '@react-three/drei/native';
import * as THREE from 'three';

// 파일 경로 정의
const modelPath = require('../assets/models/Circular_Grass.glb');
const texturePaths = [
  require('../assets/textures/patern_1_basecolor.png'),
  require('../assets/textures/patern_1_normal.png'),
  require('../assets/textures/patern_1_roughness.png'),
  require('../assets/textures/patern_1_metallic.png')
];

export function GrassModel(props) {
  const { nodes } = useGLTF(modelPath);
  const [baseColorMap, normalMap, roughnessMap, metallicMap] = useTexture(texturePaths);

  // 모든 텍스처에 동일한 타일링(반복) 설정을 적용합니다.
  const textures = [baseColorMap, normalMap, roughnessMap, metallicMap];
  textures.forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10); // 원하는 만큼 반복 횟수 조절
    texture.flipY = false;
  });

  return (
    <mesh geometry={nodes.Node1.geometry} {...props}>
      <meshStandardMaterial 
        map={baseColorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        metalnessMap={metallicMap}
        
        color="#aaffaa" // 헥스 코드로 색상 지정
        
        emissive="green" // 스스로 녹색 빛을 내도록 설정
        emissiveIntensity={-0.3}

      />
    </mesh>
  );
}

useGLTF.preload(modelPath);
useTexture.preload(texturePaths);
