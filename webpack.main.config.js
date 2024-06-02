const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '.webpack/main'),
        filename: 'index.js',
    },
    module: {
        rules: require('./webpack.rules'),
    },
    target: 'electron-main',
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
        },
    },
};
