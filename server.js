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
