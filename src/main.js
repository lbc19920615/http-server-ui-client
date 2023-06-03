import './index.css'
// import qs from 'qs'
// import JSON5 from 'json5';

import ZVideo from "./compnents/ZVideo.vue";

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

// findElements takes a function definition, the output must be Truthy or Falsy
function findElements( accept = x => customElements.get(x.localName) || 0) {
  function log() {
    console.log(`%c findElements `, `background:purple;color:yellow`, ...arguments);
  }
  let node, elements = [], shadowRootCount = 0;
  function diveNode( diveRoot ) {
    // IE9 was last to implement the TreeWalker/NodeIterator API ... in 2011
    let iterator = document.createNodeIterator(
        diveRoot,
        NodeFilter.SHOW_ELEMENT,
        node => accept(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    );
    while ( node = iterator.nextNode() ) {
      if (node.shadowRoot) {
        log(`dive into shadowRoot #${++shadowRootCount} at`, node.outerHTML);
        [...node.shadowRoot.children].forEach( diveNode );
      }
      elements.push(node);
    }
  }
  diveNode( document.body ); // initial dive location
  log(elements.length, `elements found`,[elements]);
  //return elements;
}
// findElements((x) => true); // find all DOM elements
// findElements(); // find all Custom Elements

function getHereDoc(fn) {
  return fn.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}

const SEVER_ORIGIN =   'http://' + location.hostname + ':7100';
const hashQuery = location.hash.replace('#/?', '?')
let globalURL = new  URL('https://www.baidu.com' + hashQuery)
let globalSearchParams = globalURL.searchParams
let globalHREF = globalSearchParams.get('href')

// let str = qs.stringify({
//   ssds: '111',
//   name: 'sdsdsdsd'
// });

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
    console.log(url)
    var myHeaders = new Headers();
    myHeaders.append('pragma', 'no-cache');
    myHeaders.append('cache-control', 'no-cache');
    // myHeaders.append('custom', '1');

    var myInit = {
      method: 'GET',
      headers: myHeaders,
    };

    let randomStr = '?v=' + Date.now()
    var myRequest = new Request(url + randomStr);

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
    })
  })
}


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

let utilsMixin = {
  methods: {
    utils_screenShot() {
      let { href = '' } = this.$router.currentRoute.value.query
      // console.log(href)
      import(`./sds.linkvue?v=${Date.now()}&href=${href}`)
    },
    utils_jumpTo() {
      window.jumpToItem(this.num)
    },
    utils_appendNum(v = 10) {
      this.num = this.num + v
    }
  }
}

let searchMixin = {
  data() {
    return {
      searchContion: {
      
      }
    }
  },
  beforeMount() {
    this.resetSearchContion(); 
  },
  methods: {
    resetSearchContion() {
      this.searchContion.reverse =  false
      this.searchContion.site = ''
    }
  }
}

const Home = Vue.defineComponent({
  template: '#home-tpl',
  mixins: [
    utilsMixin,
    searchMixin
  ],
  mounted() {
    let { href = '' } = this.$router.currentRoute.value.query
    this.setData({href})
    this.obj.inited =  true
    this.obj.curIndex = 0;
    // console.log('mounted')
  },
  beforeRouteUpdate (to, from) {
    if (this.obj.inited) {
      let { href = '' } = to.query;
      let fromhref = from.query.href
      this.num = 0;
      this.obj.curIndex = 0;
      window.globalItems = false;
      
      document.getElementById('con').scrollTop = 0

      this.resetSearchContion();
      window.globalSearchParams = new URLSearchParams(`?href=${href}`);
      // console.log(fromhref)
      window.lastGlobalSearchParams = new URLSearchParams(`?href=${fromhref}`);
      this.setData({href})
    }

  },
  beforeRouteEnter() {
    window.globalSearchParams = new URLSearchParams(location.hash.replace('#/?', ''));
    // console.log(globalSearchParams.get('href'))
  },
  beforeRouteLeave() {
   
  },
  data() {
    return {
      num: 0,
      obj: {
        inited: false,
      },
      arr: [],
    };
  },
  computed: {
    bigImgList() {
      return this.arr.map(v => {
        return this.getImg(v.href)
      })
    },
    sortArr() {

      if (Array.isArray(this.arr)) {
        if (this.searchContion) {
          if (this.searchContion.reverse) {
            console.log(this.searchContion.reverse);
            return [...this.arr].sort((a, b) => {
              return b.dateObj - a.dateObj;
            })
          }
        }
        return [...this.arr]
      }
      return []
    },
    bigCls() {
      return location.href.includes('demo') ? 'demo' : ''
    },
    arrLen() {
    
      if (Array.isArray(this.arr)) {
        return this.arr.length
      }

      return 0
    }
  },
  methods: {

    newSite(name = '') {
      let url = `https://www.douyin.com/search/${name}?publish_time=0&sort_type=2`;
      window.open(url);
    },
    getImg(v) {
      let u = location.hash.slice(3);
      let obj = parseParms(u);
      // console.log(obj)
      if (!obj.href) {
      }
      return SEVER_ORIGIN + (obj.href ?? '/') + v.slice(1)
    },
    async setData(link) {

      let u = new URL(SEVER_ORIGIN + link.href)
      // u.searchParams.append('v', Date.now())
      let data = await fetchDirectoryURL(u.toString(), link.href)
      console.log(data)
      this.arr = data;
      Vue.nextTick(() => {
        this.resetFun();
      })
    },
    backLink() {
      let u = location.hash.slice(3)
      let obj = parseParms(u);
      let arr = obj.href.split('/')
      arr.splice(arr.length - 1 , 1)
      arr.splice(arr.length - 1 , 1)
      // console.log(arr.slice(1))
      let href = arr.slice(1).join('/')
      if (href) {
        href = href + '/'
      }
      this.$router.push({
        path: '/',
        query: {
          href: '/' + href
        }
      })
    },
    goBackHistry() {
      this.$router.back()
    },
    goToLink(img) {
      let { href = '' } = this.$router.currentRoute.value.query
      let u = location.hash.slice(3) + encodeURIComponent( img.href.slice(1));

      let obj = parseParms(u);
      // console.log(img.href, obj)
      this.$router.push({
        path: '/',
        query: {
          // href: resolvePath(href, img.href),
          href: obj.href ?? img.href
          // v: Date.now()11
        }
      })
    },
    checkMimeType(fileExt, lib) {
      let imageExt = ['png', 'jpg', 'jpeg']
      if (lib === 'image') {
        return imageExt.includes(fileExt)
      }
      return false
    },
    jumpHttpServerLink(v) {
      window.open(SEVER_ORIGIN + v)
    },
    onImageLoad(img, $event) {
      img.loaded = true;
      // console.log($event)
    },
    onImageOpen() {
      
      // this.obj.curIndex = 0
      window.setCurIndex ()
    },
    onImageSwitch(index) {
      // console.log('onImageSwitch', index)
      this.obj.curIndex = index
    },
    resetFun(){
      let self = this;
      window.globalItems = [...document.querySelectorAll('.list-item')];

      window.getSet = function() {
        return  window.globalItems.map(v => elementIsVisibleInViewport(v, true))
      }

      window.setCurIndex = function() {
        globalItems.every((v, index) => {
          let isVisible = elementIsVisibleInViewport(v, document.getElementById('con').getBoundingClientRect())
          if ( isVisible) {
            // console.log(v)
            self.obj.curIndex = index;
            return false
          }
          return true
        })
      }
    },
    onListScroll() {
   

      window.setCurIndex()
    }
  }
});
const routes = [
  {
    path: '/',
    component: Home
  },
]

const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

const App = {}
const app = Vue.createApp(App);
app.use(router)
app.component(ZVideo.name, ZVideo)

app.config.devtools = true

app.use(ElementPlus);
app.mount("#app");
