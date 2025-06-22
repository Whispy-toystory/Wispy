// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.resolver.alias = {
  three: path.resolve(projectRoot, 'node_modules/three'),
};
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;
