const path = require('path');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// ---- path ----
const resolve = (...args) => path.resolve(__dirname, ...args);

const config = {
  mode: "development",
  entry: {
    manage: resolve('src/index.js')
  },
  output: {
    path: resolve('dist'),
    filename: `[name].bundle.js`,
    chunkFilename: `[id].js`,
  },
  resolve: {
    alias: {
      '@src': resolve('src')
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
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        // 提取 css 到外部文件件
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024 * 9, // 9KB 以下图片将被编码成base64格式
            name: '_images/[name].[hash:8].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('./src/pages/index.html'), // 入口模板
      filename: 'index.html'
    }),
    // 提取 css 到外部文件件
    new MiniCssExtractPlugin(),
    new ngAnnotatePlugin({
      add: true,
    })
  ],
};

module.exports = config;
