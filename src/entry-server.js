/**
 * 服务端入口
 */
import { createApp } from "./app";

export default async (context) => {
  // 因为有可能回事异步路由钩子函数或组件,所以我们将返回一个Promise
  // 以便服务器能够等待所有的内容在渲染前准备就绪
  const { app, router } = createApp();
  // 设置服务器端 router 的位置
  router.push(context.url);

  await new Promise(router.onReady.bind(router));

  return app;
};
