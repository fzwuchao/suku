const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/* module.exports = {
  devServer: {
    proxy: 'http://qqtou.natapp1.cc/v1'
  }
} */
module.exports = {
    outputDir: 'suku-mb',
    devServer: {
      disableHostCheck: true,
        proxy: {
            '/shanyuan': {
                // 开发环境
                target: 'http://clearness84.adt100.com',
                pathRewrite: {
                    '^/shanyuan': '/shanyuan'
                },
                changeOrigin: true
            },
            "v1": {
                // 区块链
                target: 'http://10.2.30.101:7539',
                pathRewrite: {
                    '^/v1': '/v1'
                },
                changeOrigin: true
            },
            "/": {
              // 开发环境
              target: "http://127.0.0.1:7001",
              // 测试环境 target : 'http://10.2.30.193:58080',
              pathRewrite: {
                  "^/": "/"
              },
              changeOrigin: true
          }
        }
    },
    configureWebpack: {
        plugins: [new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'static'),
            to: path.resolve(__dirname, 'suku-mb/static'),
            ignore: ['.*']
        }])]
    }
}