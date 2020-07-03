const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// customize plugins
const AutoGen = require('./plugins/AutoGen')

// 是否开发环境
const isDev = process.env.NODE_ENV === 'development'

// ---- path ----
const resolve = (...args) => path.resolve(__dirname, ...args);

// proxy
const proxy = require('./proxy')
const config = {
  mode: isDev ? "development" : "production",
  devtool: isDev ? 'cheap-module-eval-source-map' : 'none',
  entry: {
    manage: resolve('src/index.js')
  },
  output: {
    path: resolve('dist'),
    filename: isDev ? `[name].bundle.js` : `[name].[hash:9].js`,
    chunkFilename: isDev ? `[id].js` : `chunk~[id].[contenthash:9].js`,
  },
  resolve: {
    alias: {
      '@src': resolve('src'),

      // old source
      'static': resolve('static'),
      './static': resolve('static'),
      'erp_otweb': resolve('erp_otweb'),

      // cache
      '@cache': resolve('src/.cache')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        // 提取 css 到外部文件件
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|eot|woff2)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024 * 9, // 9KB 以下图片将被编码成base64格式
            name: 'images/[name].[hash:8].[ext]',
          },
        }],
      },
    ],
  },
  stats: { // log 信息控制
    assets: false, // 能关闭 pulibc 搬运的 log
    // children: false, // 能关闭 mini-css-extract-plugin log
  },
  plugins: [
    new AutoGen(),// 自动生成所需index.js
    new HtmlWebpackPlugin({
      template: resolve('./src/pages/index.html'), // 入口模板
      filename: 'index.html'
    }),
    // 提取 css 到外部文件件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css'
    }),
    new ngAnnotatePlugin({
      add: true,
    }),
    new WriteFileWebpackPlugin(),
    new CleanWebpackPlugin(),
    // copy static js
    new CopyPlugin({
      patterns: [
        { from: 'erp_otweb', to: 'erp_otweb' },
        { from: 'static', to: 'static' },
        { from: 'template', to: '' }
      ],
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    hot: true,
    proxy
  }
};

module.exports = config;
