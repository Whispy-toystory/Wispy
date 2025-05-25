// Flower3DModelComponent.js
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Text } from 'react-native'; // For loading text
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import { Asset } from 'expo-asset';

const modelPath = require('../assets/3D/flower.glb'); // Or '../assets/models/voxel_dog.glb'

function ModelLoader({ modelUri }) {
  const { scene } = useGLTF(modelUri);
  return <primitive object={scene} dispose={null} />;
}


export default function Flower3DModel() {
  const [modelUri, setModelUri] = useState(null);
  const [error, setError] = useState(null); // Optional: for displaying errors outside canvas

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const asset = Asset.fromModule(modelPath);
        if (!asset.downloaded) {
          await asset.downloadAsync();
        }
        setModelUri(asset.uri);
      } catch (e) {
        console.error("Failed to load 3D asset", e);
        setError("Failed to load 3D model.");
      }
    };
    loadAsset();
  }, []);

  if (error) {
    // Display React Native Text error *outside* the Canvas
    return <Text>{error}</Text>;
  }

  if (!modelUri) {
    // Display React Native Text loading *outside* the Canvas
    return <Text>Loading 3D model URI...</Text>;
  }

  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {/* Change fallback to null or a 3D primitive */}
      <Suspense fallback={null}>
        <ModelLoader modelUri={modelUri} />
      </Suspense>
    </Canvas>
  );
}