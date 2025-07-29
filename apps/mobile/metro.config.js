const { getDefaultConfig } = require('@expo/metro-config');
const customResolver = require('./metro.resolver');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs', 'mjs'],
    alias: {
      'react-native': 'react-native',
    },
    platforms: ['ios', 'android', 'native', 'web'],
    resolverMainFields: ['react-native', 'browser', 'main'],
    nodeModulesPaths: [
      ...defaultConfig.resolver.nodeModulesPaths,
      'node_modules',
    ],
    resolveRequest: customResolver.resolveRequest,
  },
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [
    ...defaultConfig.watchFolders,
    'node_modules',
  ],
};

module.exports = config;
