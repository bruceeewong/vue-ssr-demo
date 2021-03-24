/**
 * 服务端入口
 */
import { createApp } from "./app";

export default (context) => {
  // 因为有可能回事异步路由钩子函数或组件,所以我们将返回一个Promise
  // 以便服务器能够等待所有的内容在渲染前准备就绪
  return new Promise((resolve, reject) => {
    const { app, router } = createApp();
    // 服务器端路由匹配 (server-side route matching)
    // 数据预取逻辑 (data pre-fetching logic)

    // 设置服务器端 router 的位置
    router.push(context.url);

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 匹配不到的路由,执行 reject 函数, 并返回404
      if (matchedComponents.length === 0) {
        return reject({ code: 404 });
      }
      resolve(app);
    }, reject);
  });
};
