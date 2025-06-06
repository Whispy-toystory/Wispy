import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// 모델 파일을 public URL로 업로드(예: AWS S3, Github, CloudFront, Netlify 등)
// 또는 외부 glb 샘플 URL 사용
const MODEL_URL = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'; // 예시: model-viewer 공식 샘플

export default function Flower3DModelComponent() {
  // WebView 내에서 Three.js + GLTFLoader로 GLB 파일을 로드하는 HTML
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body { margin:0; padding:0; overflow:hidden; background:transparent; }
          #c { width:100vw; height:100vh; display:block; background:transparent; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.155.0/examples/js/loaders/GLTFLoader.js"></script>
        <script>
          // 모바일 터치 대응
          document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });
        </script>
      </head>
      <body>
        <canvas id="c"></canvas>
        <script>
          var scene = new THREE.Scene();
          var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
          camera.position.set(0, 1, 3);

          var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('c'), alpha:true, antialias:true});
          renderer.setClearColor(0x000000, 0);
          renderer.setSize(window.innerWidth, window.innerHeight);

          var ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
          scene.add(ambientLight);
          var dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
          dirLight.position.set(2, 4, 2);
          scene.add(dirLight);

          var loader = new THREE.GLTFLoader();
          loader.load('${MODEL_URL}', function(gltf) {
            var model = gltf.scene;
            // 모델 위치/크기 조정 (필요시)
            model.position.set(0, 0, 0);
            model.scale.set(1.2, 1.2, 1.2);
            scene.add(model);

            animate();
          }, undefined, function(error) {
            document.body.innerHTML = '<div style="color:red;text-align:center;margin-top:50%;">모델 로드 실패<br>'+error+'</div>';
          });

          function animate() {
            requestAnimationFrame(animate);
            // 모델 자동 회전 (예시)
            if(scene.children[2]) scene.children[2].rotation.y += 0.01;
            renderer.render(scene, camera);
          }

          window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Platform.OS === 'android' ? "#FFFFFF" : "#888888"} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
