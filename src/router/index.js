import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" },
      },
    ],
  },

  {
    path: "/other",
    component: Layout,
    redirect: "/other",
    name: "Other",
    meta: { title: "上传", icon: "el-icon-upload" },
    children: [
      {
        path: "other",
        name: "other",
        component: () => import("@/views/other/upload"),
        meta: { title: "上传", icon: "el-icon-upload" },
      },
    ],
  },

  // {
  //   path: "/log",
  //   component: Layout,
  //   redirect: "/log",
  //   name: "Log",
  //   meta: { title: "日志管理", icon: "el-icon-s-tools" },
  //   children: [
  //     {
  //       path: "log",
  //       name: "log",
  //       component: () => import("@/views/log"),
  //       meta: { title: "日志", icon: "el-icon-s-data" },
  //     },
  //   ],
  // },

  // {
  //   path: "/dynamic",
  //   component: Layout,
  //   redirect: "/dynamic",
  //   name: "Dynamic",
  //   meta: { title: "动态", icon: "el-icon-edit" },
  //   children: [
  //     {
  //       path: "index",
  //       name: "Index",
  //       component: () => import("@/views/dynamic/index"),
  //       meta: { title: "动态", icon: "el-icon-edit" },
  //     },
  //   ],
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
