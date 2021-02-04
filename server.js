const Vue = require("vue");
const express = require("express");
const fs = require("fs");
const renderer = require("vue-server-renderer").createRenderer({
  template: fs.readFileSync("./index.template.html", "utf-8"),
});

const server = express();

server.get("/", (req, res) => {
  const app = new Vue({
    template: `
      <div id="app">
        <h1>{{ message }}</h1>
      </div>
    `,
    data: {
      message: "拉勾教育",
    },
  });

  renderer
    .renderToString(app, {
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
