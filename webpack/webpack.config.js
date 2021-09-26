const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    popup: './src/js/popup.js',
    // background: './src/js/background.js',
    content: './src/js/content.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(html)$/,
        use: ['html-loader'],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CopyPlugin({
      patterns: [{ from: 'manifest.json', to: 'manifest.json' }],
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build'),
  },
};
