// production config
const {merge} = require('webpack-merge');
const {resolve} = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, '../../public/pack'),
    publicPath: '/pack/'
  },
  devtool: 'source-map',
  plugins: [],
});
