const rules = require('./webpack.rules');
const path = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  entry: './src/renderer.js',
  output: {
      path: path.resolve(__dirname, '.webpack/renderer'),
      filename: 'renderer.js',
  },
  target: 'electron-renderer',
  module: {
    rules,
  },
};
