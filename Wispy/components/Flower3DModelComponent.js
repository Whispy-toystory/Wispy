// Flower3DModelComponent.js
import React, { Suspense, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native'; // useFrame 추가
import { useGLTF, OrbitControls, Environment } from '@react-three/drei/native';
import { Asset } from 'expo-asset';
import * as THREE from 'three'; // 필요에 따라 사용

// 3D 공간 내의 간단한 로딩 대체 UI
function ThreeJSLoaderFallback() {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.rotation.x += 0.02;
    }
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="lightgray" wireframe />
    </mesh>
  );
}

// 모델을 로드하고 표시하는 컴포넌트
function ModelComponent(props) {
  const [assetUri, setAssetUri] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAsset() {
      try {
        const asset = Asset.fromModule(require('../assets/3D/talkingflower.glb'));
        console.log('ModelComponent: Asset module required, ID:', asset.name); // 에셋 이름 확인
        await asset.downloadAsync();
        if (isMounted) {
          if (asset.localUri) {
            setAssetUri(asset.localUri);
            console.log('ModelComponent: Asset downloaded, localUri:', asset.localUri);
          } else {
            console.error('ModelComponent: Asset downloaded, but localUri is null.');
            setLoadError('에셋 로컬 URI를 가져올 수 없습니다.');
          }
        }
      } catch (e) {
        console.error('ModelComponent: Error loading asset.', e);
        if (isMounted) {
          setLoadError(e.message || '에셋 로딩 중 오류 발생');
        }
      }
    }
    loadAsset();
    return () => {
      isMounted = false;
    };
  }, []);

  // assetUri가 아직 준비되지 않았거나 오류 발생 시 Suspense가 처리하도록 null 반환
  // 또는 여기서 명시적으로 로딩 상태를 반환할 수 있지만, Suspense 패턴을 따름
  if (loadError) {
    // 에러가 발생하면 3D 공간에 표시할 에러 메시지 (선택적)
    // 또는 여기서 에러를 throw하여 ErrorBoundary에서 잡도록 할 수 있음
    console.error("ModelComponent: Rendering error state due to:", loadError);
    return <Text style={{ color: 'red', position: 'absolute', top: '50%', left: '50%' }}>모델 로드 실패: {loadError}</Text>;
  }

  if (!assetUri) {
    // Suspense가 fallback을 보여주도록 null 또는 로딩 컴포넌트를 반환.
    // 이 컴포넌트 자체가 Suspense의 자식이므로, 여기서 로딩 UI를 반환하면
    // Suspense의 fallback과 중복될 수 있음. Suspense에 의존.
    console.log("ModelComponent: assetUri is null, waiting for Suspense fallback.");
    return null; // Suspense가 처리하도록 함
  }

  // assetUri가 준비되면 useGLTF 사용
  const { scene } = useGLTF(assetUri);
  console.log('ModelComponent: useGLTF called with URI:', assetUri);

  // (선택 사항) 모델 조정
  // scene.scale.set(0.5, 0.5, 0.5);
  // scene.position.set(0, -0.5, 0);

  return <primitive object={scene} {...props} />;
}

export default function Flower3DModel() {
  return (
    <View style={styles.container}>
      <Suspense
        fallback={ // Canvas 외부의 로딩 UI
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>3D 모델 로딩 중...</Text>
          </View>
        }
      >
        <Canvas
          style={styles.canvas}
          gl={{ antialias: true, alpha: true }} // alpha:true는 투명 배경 허용
          camera={{ position: [0, 1, 4], fov: 50 }} // 카메라 위치 조정
          onCreated={({ gl, scene }) => {
            console.log('Canvas created!');
            // gl.setClearColor('transparent'); // Canvas 배경을 투명하게 (선택적)
          }}
        >
          <ambientLight intensity={2.0} /> {/* 조명 강도 조절 */}
          <directionalLight position={[3, 5, 2]} intensity={3.0} /> {/* 조명 위치 및 강도 조절 */}
          {/* <Environment preset="sunset" background={false} /> */}

          {/* Canvas 내부의 Suspense는 3D 에셋 로딩에만 사용 */}
          <Suspense fallback={<ThreeJSLoaderFallback />}>
            <ModelComponent />
          </Suspense>

          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333', // 전체 앱 배경색
  },
  canvas: {
    flex: 1,
  },
  loadingOverlay: { // Canvas 외부 로딩 UI
    ...StyleSheet.absoluteFillObject, // 화면 전체를 채움
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Canvas 위에 표시
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});
