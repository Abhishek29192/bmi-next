// shared config (dev and prod)
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var babel = {
	loader:'babel-loader',
	options: {
	  "presets": [
		["@babel/preset-env", {"modules": false}],
		"@babel/preset-react"
	  ],
	  "env": {
		"production": {
		  "presets": ["minify"]
		},
		"test": {
		  "presets": ["@babel/preset-env", "@babel/preset-react"]
		}
	  }
	}
};

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
	alias: {}
  },
  context: resolve(__dirname, '../../Source'),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [babel], // , 'source-map-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
			MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'sass-loader'
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|mp3|mp4)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
        ],
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({template: 'index.html.ejs',}),
	new webpack.ProvidePlugin({
		React: 'react',
		ReactDom: 'react-dom',
		react: 'react'
	}),
	new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
    })
  ],
  performance: {
    hints: false,
  },
};
