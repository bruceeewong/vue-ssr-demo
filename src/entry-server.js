/**
 * 服务端入口
 */
import { createApp } from "./app";

export default (context) => {
  const { app } = createApp();

  // 服务器端路由匹配 (server-side route matching)
  // 数据预取逻辑 (data pre-fetching logic)

  return app;
};
