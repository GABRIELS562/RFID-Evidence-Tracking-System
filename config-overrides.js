const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  // Add fallbacks for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify"),
    "querystring": require.resolve("querystring-es3"),
    "util": require.resolve("util/"),
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"),
    "fs": false,
    "net": false,
    "tls": false,
    "child_process": false,
    "dns": false,
    "timers": false
  };

  // Add plugins to provide globals
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  // Add alias for src directory
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
  };

  return config;
};