import 'view-transitions-polyfill';

const {createApp} = Vue;

import './index.css';

import "./utils.js";

import ZVideo from "./compnents/ZVideo.vue";

import Folder from './views/folder';
import Fanvas from './views/fanvas';
import Home from './views/home';

import solarlunar from "solarlunar";
globalThis.solarlunar = solarlunar;

import "./init";

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/folder/:href',
    name: '',
    component: Folder,
  },
  {
    path: '/folder/',
    name: 'folder',
    component: Folder,
  },
  {
    path: '/fanvas/:href',
    name: '',
    component: Fanvas,
  },
  {
    path: '/fanvas/',
    name: 'fanvas',
    component: Fanvas,
  },
]

const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

let _currentTo = {}
router.beforeEach(async (to) => {
  _currentTo = to
  if(to.name === "folder" && !to.params.hasOwnProperty("href")){
      to.params.href = "__"
  }
    // console.log(to)
  return true;
});

window.gl = {
  /**
   *
   * @param path {string}
   */
  navigateTo: ({path} = {}) => {
    console.log(router)
    router.push({
      path,
    });
  },
  showToast: (title = '', {type = 'success', message = '', duration = 6000} = {}) =>{
    ElementPlus.ElNotification({
        title: title,
        message,
        type: type,
        duration,
    })
  }
}

window.getCurrentPage = function() {
  let to = _currentTo;
   if (to && Array.isArray(to.matched)) {
    return to.matched[0]?.instances.default
   }
}

if (!window.appendStyle) {
  window.appendStyle = function(css = '') {
    let s = document.createElement('style');
    s.innerHTML =css;
    document.body.appendChild(s)
  }
}

const App = {}
const app = createApp(App);
app.component(ZVideo.name, ZVideo);
app.use(router)

import('/public/element-plus.js').then(() => {
  app.use(ElementPlus);
})

app.mount("#app");
app.config.devtools = true;

// defComAndReloadCurPage('f-sds', {template: `<div>hello</div>`})
// 定义代码
window.defComAndReloadCurPage = function(name = "", def = {}, force = true) {
  app.component(name, def);
  if (force) {
    getCurrentPage().$forceUpdate();
  }
}



