module.exports = {
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          components: './src/components',
        },
      },
    ],
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], // `style: true` 会加载 less 文件
  ],
};
