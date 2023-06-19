import './index.css';

import "./utils.js";

import { createPinia } from 'pinia';

import Folder from './views/folder';
import Home from './views/home';


import solarlunar from "solarlunar";
globalThis.solarlunar = solarlunar;

import ZVideo from "./compnents/ZVideo.vue";

import {context} from 'define-function';
console.log(context)
globalThis.createFun = async function(str, ctxObj = {}) {
  const ctx = await context({ global: {
    console,
    anwerOfEverything() {
        return 42;
    },
    ...ctxObj
  } }) // inject console and anwerOfEverything to global
  const f = await ctx.def(str)
  return f;
}

function parseParms(str) {
  var pieces = str.split("&"), data = {}, i, parts;
  // process each query pair
  for (i = 0; i < pieces.length; i++) {
    parts = pieces[i].split("=");
    if (parts.length < 2) {
      parts.push("");
    }
    data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }
  return data;
}
globalThis.parseParms = parseParms;


/**
 * 处理pixiv 名字
 * @param {*} a 
 * @param {*} b 
 */
function resolvePixivName(a, b) {
  let aarr = a.fileNameNotExt.split('_');
  let barr = b.fileNameNotExt.split('_');
  console.log(aarr[1], barr[1] );
  return parseFloat(aarr[1].replace('p', '')) - parseFloat(barr[1].replace('p', ''));
}


window.jumpToItem = function (index) {
  document.querySelector(`[data-index="${index}"]`).scrollIntoView()
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
globalThis.uuidv4 = uuidv4

function resolveHref(v, baseHref) {
  // let href = v.href
  // console.log(href)
  if (baseHref && v.href.includes(baseHref)) {
    v.href = v.href.replace(baseHref, '')
    v.href = v.href.slice(0, v.href.length - 1)
  }
  // v.href = v.href.replace(baseHref, '')
  // v.href = v.href.slice(0, v.href.length - 1)
  v.hrefDispay =  decodeURIComponent(v.href)
}

function getDateFromlastModified(lastModified = '') {
  let arr = lastModified.split(' ');
  let yearMonthDay = arr[0].split('-').map(v => parseInt(v))
  // console.log(arr, yearMonthDay)
  return window.dayjs(`${yearMonthDay[2]}-${yearMonthDay[1]}-${yearMonthDay[0]} ${arr[1]}`);
}

function fetchDirectoryURL(url = '', baseHref = '') {
  return new Promise((resolve, reject) => {
    // console.log(url)
    var myHeaders = new Headers();
    myHeaders.append('pragma', 'no-cache');
    myHeaders.append('cache-control', 'no-cache');
    // myHeaders.append('custom', '1');

    var myInit = {
      method: 'GET',
      headers: myHeaders,
    };

    let randomStr = '?v=' + Date.now();
    let myUrl = url + randomStr;
    var myRequest = new Request(myUrl);

    fetch(myRequest).then((res) => {
      return res.text()
    }).then(data => {
      document.getElementById('tpl').innerHTML = data
      let arr = []
      $('#tpl tr').each(function (index, item) {
        // console.log(index, item)
        let id =  uuidv4()
        let href = $(item).find('.display-name > a')
            .attr('href').replace(randomStr, '');
        let lastModified = $(item).find('.last-modified').html();
        // console.log(lastModified)

        let lastModifiedDate = getDateFromlastModified(lastModified);

        // console.log(href, lastModified, lastModifiedDate)
        

        href = href.slice(1)
        let hrefArr = href.split('/')
        // console.log(href)
        let fileName = hrefArr[hrefArr.length - 1]
        let fileNameArr = fileName.split('/')
        // console.log(fileNameArr)
        let last = fileNameArr[fileNameArr.length - 1]
        let lastArr = last.split('.')
        let fileNameNotExt = decodeURIComponent(lastArr.slice(0,lastArr.length - 1))
        let fileExt = lastArr[lastArr.length - 1]
        // console.log(fileNameNotExt)
        // 隐藏文件不翻译
        if (last && last.startsWith('.')) {
          return;
        }
        let ret = {
          href,
          hrefDispay: decodeURIComponent(href),
          loaded: false,
          fileNameNotExt,
          fileExt,
          dateObj: lastModifiedDate,
          date: lastModifiedDate.toISOString(),
          id,
        }
        // console.log(ret)
        if (!ret.hrefDispay.startsWith('/.')) {
          arr.push(ret)
        }
      })
      // console.log(baseHref,  arr[0].href)
      // arr[0].href = arr[0].href.replace(baseHref, '')
      // arr[0].href = arr[0].href.slice(0, arr[0].href.length - 1)
      // arr[0].hrefDispay =  decodeURIComponent(arr[0].href)
      // console.log('resolveHref', arr)
      if (!Array.isArray(arr) || !arr[0]) {
        reject(new Error('arr '))
      }
      resolveHref(arr[0], baseHref)

      if (Number.isNaN(parseFloat(arr[0].fileNameNotExt))) {
        arr = arr.sort(function(a,b){
          let aarr = a.fileNameNotExt.split(' ')
          let barr = b.fileNameNotExt.split(' ')

          if (Array.isArray(aarr) && Array.isArray(barr)) {
            return aarr[aarr.length - 1] - barr[barr.length - 1];
          }
          return a.fileNameNotExt-b.fileNameNotExt;
        })
        resolve(arr)
      }
      else {
        arr = arr.sort(function(a,b){
          console.log(a.fileNameNotExt, parseFloat(a.fileNameNotExt))
          if (a.fileNameNotExt.includes('_master')) {
            return resolvePixivName(a, b);
          }

          return a.fileNameNotExt-b.fileNameNotExt;
        })
        resolve(arr)
      }
    }).catch(e => {
      ElementPlus.ElMessage.error(e + " " + myUrl)
    })
  })
}
globalThis.fetchDirectoryURL = fetchDirectoryURL;


globalThis.resolvePath = function () {
  function resolve(pathA, pathB) {
    // 先做split，得到的结果如下几种
    //  ‘a’     => ['a']
    //  'a/b'   => ['a', 'b']
    //  '/a/b'  => ['', 'a', 'b']
    //  '/a/b/' => ['', 'a', 'b', '']
    pathB = pathB.split('/');
    if (pathB[0] === '') {
      // 如果pathB是想对于根目录
      // 则不在考虑pathA，直接返回pathB
      return pathB.join('/');
    }
    pathA = pathA.split('/');
    var aLastIndex = pathA.length - 1;
    if (pathA[aLastIndex] !== '') {
      // 文件名出栈，只保留路径
      pathA[aLastIndex] = '';
    }

    var part;
    var i = 0;
    while (typeof(part = pathB[i]) === 'string') {
      switch (part) {
        case '..':
          // 进入父级目录
          pathA.pop();
          pathA.pop();
          pathA.push('');
          break;
        case '.':
          // 当前目录
          break;
        default:
          // 进入子目录
          pathA.pop();
          pathA.push(part);
          pathA.push('');
          break;
      }
      i++;
    }
    return pathA.join('/');
  }

  var paths = arguments;
  var i = 0;
  var path;
  var r = location.pathname;
  var multiSlashReg = /\/\/+/g;
  while (typeof(path = paths[i]) === 'string') {
    // '//' ==> '/'
    path = path.replace(multiSlashReg, '/');
    r = resolve(r, path);
    i++;
  }

  return r;
};

const elementIsVisibleInViewport = (el, client) => {
  let clientHeight = client.height;

  const { top, left, bottom, right, height } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  // console.log(top, bottom, el);
  return  (top + height)  / clientHeight  > 0.5
  // return  top > 0 && bottom < client.bottom;
  // return  top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  // return partiallyVisible
  //   ? ((top > 0 && top < innerHeight) ||
  //       (bottom > 0 && bottom < innerHeight)) &&
  //       ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
  //   : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};
window.elementIsVisibleInViewport = elementIsVisibleInViewport;



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

const App = {
  mounted() {
    window.globalAppCtx = this;
  }
}
const app = Vue.createApp(App);
app.use(router)
app.component(ZVideo.name, ZVideo)

app.config.devtools = true

const pinia = createPinia()
app.use(pinia);
app.use(ElementPlus);
app.mount("#app");


// defComAndReloadCurPage('f-sds', {template: `<div>hello</div>`})
// 定义代码
window.defComAndReloadCurPage = function(name = "", def = {}) {
  app.component(name, def);
  getCurrentPage().$forceUpdate();
}




