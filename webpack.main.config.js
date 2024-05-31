
module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  resolve: { fallback: { "path": false } },
  module: {
    rules: require('./webpack.rules'),
  },
};
