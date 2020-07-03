module.exports = {
  parser: 'postcss-comment', // 允许行内注释
  plugins: [
    require('autoprefixer'), // 适配浏览器写法
  ]
}