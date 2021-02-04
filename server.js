const Vue = require("vue");
const renderer = require("vue-server-renderer").createRenderer();
const express = require("express");

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
    .renderToString(app)
    .then((html) => {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Document</title>
        </head>
        <body>
          ${html}    
        </body>
      </html>
    `);
    })
    .catch((e) => {
      return res.status(500).end("Internal Server Error.");
    });
});

server.listen(3000, () => {
  console.log("server running at port 3000");
});
