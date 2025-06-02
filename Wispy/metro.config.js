// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const defaultAssetExts = config.resolver.assetExts;
config.resolver.assetExts = [
  ...defaultAssetExts,
  'glb',
  'gltf',
  'png',
  'jpg',
  'bin',
  // 필요한 다른 텍스처 확장자 추가
];

module.exports = config;