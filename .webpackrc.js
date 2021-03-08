const path = require('path');

export default {
  entry: 'src/index.js',
  outputPath: path.resolve(__dirname, '../../../target/static/admin'),
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/admin',
  hash: true,

  proxy: {
    '/admin/common/upload_file': {
      target: 'http://127.0.0.1:8088',
      changeOrigin: true,
    },
  },
};
