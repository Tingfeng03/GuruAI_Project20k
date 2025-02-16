module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // This already includes Expo Router in SDK 50+, so no need for `expo-router/babel`
      "babel-preset-expo",
    ],
    plugins: [
      // For `.env` support
      "module:react-native-dotenv",
    ],
  };
};
