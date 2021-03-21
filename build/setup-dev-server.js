const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");

const resolve = (file) => path.resolve(__dirname, file);

module.exports = (server, callback) => {
  let ready; // 用于改变 onReady 这个promise的状态为 "Resolve"
  const onReady = new Promise((resolve) => (ready = resolve));

  let template;
  let serverBundle;
  let clientManifest;

  const update = () => {
    if (template && serverBundle && clientManifest) {
      ready(); // 改变Promise状态为resolve
      callback(serverBundle, template, clientManifest);
    }
  };

  // template
  const templatePath = resolve("../index.template.html");
  template = fs.readFileSync(templatePath, "utf-8");
  update();

  // fs.watch \ fs.watchFile 不够好用
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    update();
  });

  // serverBundle
  const serverConfig = require("./webpack.server.config");
  const serverCompiler = webpack(serverConfig);
  const serverDevMiddleware = devMiddleware(serverCompiler, {
    logLevel: "silent",
  });
  serverCompiler.hooks.done.tap("server", () => {
    serverBundle = JSON.parse(
      serverDevMiddleware.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-server-bundle.json"),
        "utf-8"
      )
    );
    update();
  });

  // clientManifest
  const clientConfig = require("./webpack.client.config");
  const clientCompiler = webpack(clientConfig);
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath, // 指定配置文件中的公共路径
    logLevel: "silent",
  });
  clientCompiler.hooks.done.tap("client", () => {
    clientManifest = JSON.parse(
      clientDevMiddleware.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-client-manifest.json"),
        "utf-8"
      )
    );
    update();
  });

  // 只有客户端: 将 clientDevMiddleware 挂在到 Express 服务中, 提供对其内部内存数据的访问
  server.use(clientDevMiddleware);

  return onReady;
};
