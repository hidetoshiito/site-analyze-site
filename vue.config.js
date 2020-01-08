const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  // webpack.config.js の設定はここに書く
  configureWebpack: {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              // 本番はconsole.logを削除する
              drop_console: process.env.NODE_ENV === 'production' ? true : false,
              // 本番はdebuggerを削除する
              drop_debugger: process.env.NODE_ENV === 'production' ? true : false,
            }
          }
        })
      ],
    },
  },
};
