module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Suporte para decorators e outras features do Expo Router
      "expo-router/babel",
    ],
  };
};
