/**
 * 同构应用通用启动入口
 * Vue SSR指南: https://ssr.vuejs.org/zh/guide/structure.html#%E4%BD%BF%E7%94%A8-webpack-%E7%9A%84%E6%BA%90%E7%A0%81%E7%BB%93%E6%9E%84
 */
import Vue from "vue";
import App from "./App.vue";
import { createRouter } from "./router";

// 导出一个工厂函数，用于创建新的, 避免状态污染
// 应用程序、router 和 store 实例

export function createApp() {
  const router = createRouter();
  const app = new Vue({
    router, // 把路由挂载在根实例中
    render: (h) => h(App), // 根实例简单的渲染应用程序组件。
  });
  return { app, router };
}
