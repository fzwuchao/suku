const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
/* module.exports = {
  devServer: {
    proxy: 'http://qqtou.natapp1.cc/v1'
  }
} */
module.exports = {
    outputDir: "suku",
    devServer: {
        disableHostCheck: true
            /* proxy: {
                "/": {
                    // 开发环境
                    target: "http://api.sukudianzi.com",
                    // 测试环境 target : 'http://10.2.30.193:58080',
                    pathRewrite: {
                        "^/": "/"
                    },
                    changeOrigin: true
                }
            } */
    },
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, "static"),
                to: path.resolve(__dirname, "benefit-pc/static"),
                ignore: [".*"]
            }])
        ]
    }
};