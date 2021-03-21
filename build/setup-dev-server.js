const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");

const resolve = (file) => path.resolve(__dirname, file);

module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise((r) => (ready = r));

  let template;
  let serverBundle;
  let clientManifest;

  const update = () => {
    if (template && serverBundle && clientManifest) {
      ready();
      callback(serverBundle && template && clientManifest);
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
    console.log(serverBundle);
    update();
  });
  // serverCompiler.watch({}, (err, stats) => {
  //   if (err) throw err; // webpack 错误
  //   if (stats.hasErrors()) return;

  //   serverBundle = JSON.parse(
  //     fs.readFileSync(resolve("../dist/vue-ssr-server-bundle.json"), "utf-8")
  //   );
  //   console.log(serverBundle);
  //   update();
  // });

  // clientManifest

  return onReady;
};
