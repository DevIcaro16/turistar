const { getDefaultConfig } = require('@expo/metro-config');

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
  },
};

module.exports = config;
