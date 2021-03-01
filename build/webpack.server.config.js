/**
 * 服务端打包配置
 */
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = merge(baseConfig, {
  entry: "./src/entry-server.js",
  // 让webpack以NODE的方式处理模块加载,
  // 并在编译vue时告诉vue-loader输出面向服务器的代码(server-oriented code)
  target: "node",

  output: {
    filename: "server-bundle.js",
    // 此处告知 server-bundle 使用 Node 的风格导出模块(Node-style exports)
    libraryTarget: "commonjs2",
  },

  // 不打包 node_modules 第三方包,保留require 方式直接加载
  externals: [
    nodeExternals({
      // 白名单中的资源依然打包
      allowlist: [/\.css$/],
    }),
  ],

  plugins: [
    // 将服务器输出构建为单个 JSON 文件的插件
    // 默认文件名为 vue-ssr-server-bundle.json
    new VueSSRServerPlugin(),
  ],
});
