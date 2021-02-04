# 搭建自己的 Vue SSR 实例

## 准备

安装 `vue` & `vue-server-renderer`

## 服务端写vue模板，渲染为字符串

在服务端创建Vue实例，传入模板定义。然后使用 `vue-server-renderer` 将模板和数据渲染为HTML文本

```js
const Vue = require("vue");
const renderer = require("vue-server-renderer").createRenderer();

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

renderer.renderToString(app).then((html) => console.log(html));
```

## 使用Express创建Web服务，搭建ssr基础框架

创建express server，包裹上面的模板渲染部分，并将结果通过HTTP响应返回

```js
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
    .then((html) => res.end(html))
    .catch((e) => {
      return res.status(500).end("Internal Server Error.");
    });
});

server.listen(3000, () => {
  console.log("server running at port 3000");
});
```

此时浏览器上会展示乱码，是因为响应没有指定文本类型和编码类型。有两种解决方式：

1. 在express返回时设置`Content-Type`

```js
res.setHeader("Content-Type", "text/html; charset=utf-8");
```

2. 返回完整HTML，设置meta的charset标签

```js
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
```

推荐的做法是两种都写上，兼容性最好。

