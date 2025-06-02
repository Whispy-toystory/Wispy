// Flower3DModelComponent.js
import React, { Suspense } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';

// require 대신 import 사용
import modelAsset from '../assets/3D/outputfile.gltf'; // 또는 .glb 파일

function Model() {
  console.log('--- Debug Model Asset ---');
  console.log('Value of modelAsset:', modelAsset);
  console.log('Type of modelAsset:', typeof modelAsset);
  console.log('--------------------------');

  const { scene } = useGLTF(modelAsset);
  return <primitive object={scene} dispose={null} />;
}
// 로딩 중 Canvas 대신 표시될 React Native UI 컴포넌트
function ModelLoadingFallback() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading 3D Model...</Text>
    </View>
  );
}

export default function Flower3DModel() {
  return (
    <Suspense fallback={<ModelLoadingFallback />}>
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }} style={{ flex: 1 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
