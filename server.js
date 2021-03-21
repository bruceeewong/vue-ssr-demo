const express = require("express");
const fs = require("fs");

const serverBundle = require("./dist/vue-ssr-server-bundle.json");
const template = fs.readFileSync("./index.template.html", "utf-8");
const clientManifest = require("./dist/vue-ssr-client-manifest.json");

const renderer = require("vue-server-renderer").createBundleRenderer(
  serverBundle,
  {
    template,
    clientManifest,
  }
);

const server = express();

server.use("/dist", express.static("./dist")); // 开放dist目录静态资源

server.get("/", (req, res) => {
  renderer
    .renderToString({
      title: "拉勾教育",
      meta: '<meta name="description" content="拉勾教育" >',
    })
    .then((html) => {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(html);
    })
    .catch((e) => {
      console.dir(e);
      return res.status(500).end("Internal Server Error.");
    });
});

server.listen(3000, () => {
  console.log("server running at port 3000");
});
