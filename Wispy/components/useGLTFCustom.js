// utils/useGLTFCustom.js (예시 경로)
import assert from 'assert';
import { decode } from 'base64-arraybuffer';
import { resolveAsync } from 'expo-asset-utils';
import * as FileSystem from 'expo-file-system';
import { suspend } from 'suspend-react'; // suspend-react 설치 필요: npm i suspend-react
import * as _THREE from 'three'; // three 패키지를 명시적으로 가져오기
import { GLTF, GLTFLoader } from 'three-stdlib';

// THREE를 명시적으로 사용 (이슈에서 THREE가 정의되지 않았다는 오류가 있을 수 있음을 시사)
const THREE = _THREE;

async function loadFileAsync({ asset, funcName }) {
  if (!asset) {
    throw new Error(`ExpoTHREE.${funcName}: Cannot parse a null asset`);
  }
  // expo-asset-utils의 resolveAsync를 사용하여 에셋의 localUri를 가져옵니다.
  const resolvedAsset = await resolveAsync(asset);
  return resolvedAsset.localUri ?? null;
}

function buildGraph(object) {
  const data = { nodes: {}, materials: {} };
  if (object) {
    object.traverse((obj) => {
      if (obj.name) {
        data.nodes[obj.name] = obj;
      }
      if (obj.material && !data.materials[obj.material.name]) {
        data.materials[obj.material.name] = obj.material;
      }
    });
  }
  return data;
}

async function loadGLTFAsync({ asset }) {
  const uri = await loadFileAsync({
    asset,
    funcName: 'loadGLTFAsync',
  });

  assert(uri, 'loadGLTFAsync uri should exist');

  // FileSystem을 사용하여 파일을 Base64 문자열로 읽습니다.
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Base64 문자열을 ArrayBuffer로 디코딩합니다.
  const arrayBuffer = decode(base64);
  const loader = new GLTFLoader();

  // ArrayBuffer를 파싱합니다. 경로 부분은 빈 문자열 또는 적절한 값으로 전달합니다.
  // GLB/GLTF 내부에 상대 경로가 있다면 이 부분이 중요할 수 있습니다.
  const res = await loader.parseAsync(arrayBuffer, ''); // 경로 인자 추가 (이슈 해결에 도움될 수 있음)

  if (res.scene) {
    //Object.assign(res, buildGraph(res.scene));
    const graph = buildGraph(res.scene);
    res.nodes = graph.nodes;
    res.materials = graph.materials;
  }

  return res;
}

export const useGLTFCustom = (asset) =>
  suspend(async () => loadGLTFAsync({ asset }), ['useGLTFCustom', asset]);

