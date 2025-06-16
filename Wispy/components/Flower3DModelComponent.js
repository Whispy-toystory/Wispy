// components/Flower3DModelComponent.js
import React, { Suspense, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import useControls from 'r3f-native-orbitcontrols';
import { Asset } from 'expo-asset';
import { readAsStringAsync, EncodingType } from 'expo-file-system';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { decode } from 'base64-arraybuffer';

// 로딩 로직을 React 외부의 async 함수로 분리
async function parseGLB(arrayBuffer) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    // GLTFLoader가 전역 객체나 다른 라이브러리의 영향을 받지 않는지 확인하기 위해
    // 로더를 사용하는 부분을 최대한 격리합니다.
    try {
        loader.parse(arrayBuffer, '', resolve, reject);
    } catch (e) {
        reject(e);
    }
  });
}

async function loadAndParseModel(modelAssetModule) {
  console.log("loadAndParseModel: 시작");
  const asset = Asset.fromModule(modelAssetModule);
  if (!asset.downloaded) {
    await asset.downloadAsync();
  }
  console.log("loadAndParseModel: 에셋 다운로드 완료, 로컬 URI:", asset.localUri || asset.uri);

  // asset.localUri를 사용하여 파일 시스템에서 직접 읽어옵니다.
  const base64 = await readAsStringAsync(asset.localUri || asset.uri, {
    encoding: EncodingType.Base64,
  });
  const arrayBuffer = decode(base64);
  console.log("loadAndParseModel: ArrayBuffer 변환 완료, 크기:", arrayBuffer.byteLength);

  const gltf = await parseGLB(arrayBuffer);
  console.log("loadAndParseModel: GLTF 파싱 성공");
  return gltf.scene; // Scene 객체 반환
}

async function loadTexture(textureAssetModule) {
    const asset = Asset.fromModule(textureAssetModule);
    if (!asset.downloaded) {
        await asset.downloadAsync();
    }
    console.log("loadTexture: 텍스처 에셋 로드 완료, URI:", asset.localUri || asset.uri);
    const loader = new THREE.TextureLoader();
    // TextureLoader는 file URI를 잘 처리합니다.
    return loader.load(asset.localUri || asset.uri);
}


function GlobalLoaderUI({ message }) { return <View style={styles.loaderOverlay}><Text style={styles.loadingText}>{message}</Text><ActivityIndicator size="large" color="#FF69B4" /></View>;}

const Flower3DModel = () => {
  const modelAssetModule = require('../assets/models/talkingflower.glb');
  const textureAssetModule = require('../assets/models/flower_texture.png');

  const [scene, setScene] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('3D 모델 로딩 시작...');
  const [OrbitControls, events] = useControls();

  useEffect(() => {
    const loadAllAssets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        setLoadingMessage('모델 데이터 로딩 및 파싱 중...');
        const modelScene = await loadAndParseModel(modelAssetModule);
        
        setLoadingMessage('텍스처 데이터 로딩 중...');
        const texture = await loadTexture(textureAssetModule);
        texture.flipY = false;

        modelScene.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
        console.log("모든 에셋 로딩 및 텍스처 적용 완료");
        setScene(modelScene);
      } catch (e) {
        console.error("최종 에셋 로딩 과정에서 오류:", e);
        setError(e.message || '모델 또는 텍스처를 로드할 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    loadAllAssets();
  }, [modelAssetModule, textureAssetModule]);

  if (error) return <View style={styles.errorContainer}><Text style={styles.errorText}>오류: {error}</Text></View>;
  if (isLoading || !scene) return <GlobalLoaderUI message={loadingMessage} />;

  const modelScale = 0.3;
  const modelPosition = [0, 0, 0];

  return (
    <View {...events} style={styles.container}>
      <Canvas camera={{ position: [0, 0.5, 1.5], fov: 50 }}>
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        <primitive 
            object={scene} 
            scale={modelScale}
            position={modelPosition}
        />
        <OrbitControls />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%', backgroundColor: '#222' },
  loaderOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 10 },
  loadingText: { color: '#FFFFFF', fontSize: 16, marginBottom: 10 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default Flower3DModel;
