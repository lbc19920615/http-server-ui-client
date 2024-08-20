const {createApp} = Vue;

import './index.css';

import "./utils.js";

import Folder from './views/folder';
import Home from './views/home';

// import * as p from "pinia";
import Simple from 'als-simple-css/simple.mjs';
window.Simple = Simple

import solarlunar from "solarlunar";
globalThis.solarlunar = solarlunar;

import ZVideo from "./compnents/ZVideo.vue";


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
})
window.getCurrentPage = function() {
  let to = _currentTo;
   if (to && Array.isArray(to.matched)) {
    return to.matched[0]?.instances.default
   }
}

window.appendStyle = function(css = '') {
  let s = document.createElement('style');
   s.innerHTML =css;
   document.body.appendChild(s)
}

const App = {}
const app = createApp(App);
app.use(router)
app.component(ZVideo.name, ZVideo)

const {createPinia} = Pinia;
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus);
app.mount("#app");
app.config.devtools = true

// defComAndReloadCurPage('f-sds', {template: `<div>hello</div>`})
// 定义代码
window.defComAndReloadCurPage = function(name = "", def = {}, force = true) {
  app.component(name, def);
  if (force) {
    getCurrentPage().$forceUpdate();
  }
}


// import PCRE from '@stephen-riley/pcre2-wasm'
