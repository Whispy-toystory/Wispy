// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);


if (!config.resolver) {
  config.resolver = {};
}
if (!config.resolver.assetExts) {
  config.resolver.assetExts = [];
}
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;