const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    options: './src/options.js',
    unavailable: './src/unavailable.js',
    contentScript: './src/contentScript.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "path": require.resolve("path-browserify"),
      "url": require.resolve("url"),
      "stream": require.resolve("stream"),
      "buffer": require.resolve("buffer"),
      "process": require.resolve("process/browser")
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
};

//# sourceMappingURL=contentScript.js.map