import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";
// import { marked } from "marked"; // 导入marked模块
import hljs from "highlight.js"; // 导入highlight.js模块
import "highlight.js/styles/atom-one-dark.css"; // 样式

// 创建v-highlight全局指令
Vue.directive("highlight", function (el) {
  const blocks = el.querySelectorAll("pre code");
  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  });
});

import "@/icons"; // icon
// import '@/permission'

if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
