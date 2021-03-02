/**
 * 公共配置
 */
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const resolve = (file) => path.resolve(__dirname, file);
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  output: {
    publicPath: "/dist/",
    path: resolve("../dist/"),
    filename: "[name].[chunkhash].js", // 文件内容改变,文件名发生变化,强制浏览器请求新的资源
  },
  resolve: {
    alias: {
      "@": resolve("../src/"),
    },
    extensions: [".js", ".vue", ".json"], // 可以省略的扩展名,依次解析
  },
  devtool: isProd ? "source-map" : "cheap-module-eval-source-map", // debug source map模式
  module: {
    rules: [
      // 处理图片
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
            },
          },
        ],
      },
      // 处理字体
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
      // 处理vue资源
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      // 处理CSS资源
      // 包括css文件与'.vue'文件的<style/块
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      // CSS预处理(按需)
      // {
      //   test: /\.less$/,
      //   use: ["vue-style-loader", "css-loader", "less-loader"],
      // },
    ],
  },
  plugins: [new VueLoaderPlugin(), new FriendlyErrorsWebpackPlugin()],
};
