module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from', // Añade este plugin para soporte de exportación de namespace en web
      'react-native-reanimated/plugin', // Añade este plugin para react-native-reanimated
    ],
  };
};
