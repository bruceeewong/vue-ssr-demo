const express = require("express");
const fs = require("fs");
const { createBundleRenderer } = require("vue-server-renderer");
const setupDevServer = require("./build/setup-dev-server");

const server = express();
server.use("/dist", express.static("./dist")); // 开放物理磁盘中的dist目录静态资源

const isProd = process.env.NODE_ENV === "production";
let renderer;
let onReady;

if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const template = fs.readFileSync("./index.template.html", "utf-8");
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");

  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  });
} else {
  // 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest,
    });
  });
}

const handleRender = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      title: "拉勾教育",
      meta: '<meta name="description" content="拉勾教育" >',
      url: req.url, // 将请求路径注入上下文
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  } catch (err) {
    console.dir(err);
    return res.status(500).end("Internal Server Error.");
  }
};

// 服务端路径设为*, 任何路径都命中前端页面
server.get(
  "*",
  isProd
    ? handleRender
    : async (req, res) => {
        await onReady;
        handleRender(req, res);
      }
);

server.listen(3000, () => {
  console.log("server running at port 3000");
});
