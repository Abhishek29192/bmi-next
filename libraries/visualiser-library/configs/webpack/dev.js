// development config
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');
const {resolve} = require('path');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, '../../public/pack'),
    publicPath: '/pack/'
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
  ],
});
