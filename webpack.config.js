const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    background: './src/background/background.js',
    popup: './src/popup/popup.js',
    options: './src/options/options.js',
    extendedView: './src/popup/extendedView.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/assets/icons', to: 'assets/icons' },
        { from: 'src/shared/locales', to: '_locales' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/extendedView.html',
      filename: 'extendedView.html',
      chunks: ['extendedView'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      template: './src/options/options.html',
      filename: 'options.html',
      chunks: ['options'],
      inject: 'body'
    }),
    ...(isProduction
      ? [
          new ZipPlugin({
            path: '../releases',
            filename: 'egypt-prayer-times.zip',
            exclude: [/\.map$/]
          })
        ]
      : [])
  ],
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'source-map'
};
