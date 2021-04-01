import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/Home";

Vue.use(VueRouter);

export function createRouter() {
  const router = new VueRouter({
    mode: "history", // 同构应用一定要用history模式
    routes: [
      {
        path: "/",
        name: "home",
        component: Home,
      },
      {
        path: "/about",
        name: "about",
        component: () => import("@/pages/About"),
      },
      {
        path: "*",
        name: "error404",
        component: () => import("@/pages/Error404"),
      },
    ],
  });
  return router;
}
