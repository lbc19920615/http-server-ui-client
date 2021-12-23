import './index.css'

const SEVER_ORIGIN =   'http://' + location.hostname + ':7100';
console.log(SEVER_ORIGIN)

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function resolveHref(v, baseHref) {
  v.href = v.href.replace(baseHref, '')
  v.href = v.href.slice(0, v.href.length - 1)
  v.hrefDispay =  decodeURIComponent(v.href)
}

function fetchDirectoryURL(url = '', baseHref = '') {
  return new Promise((resolve, reject) => {
    fetch(url).then((res) => {
      return res.text()
    }).then(data => {
      document.getElementById('tpl').innerHTML = data
      let arr = []
      $('#tpl tr').each(function (index, item) {
        // console.log(index, item)
        let id =  uuidv4()
        let href = $(item).find('.display-name > a').attr('href')
        let hrefArr = href.split('/')
        let fileName = hrefArr[hrefArr.length - 1]
        let fileNameArr = fileName.split('.')
        let fileNameNotExt = fileNameArr[0]
        let fileExt = fileNameArr[1]
        let ret = {
          href,
          hrefDispay: decodeURIComponent(href),
          loaded: false,
          fileNameNotExt,
          fileExt,
          id,
        }
        arr.push(ret)
      })
      // console.log(baseHref,  arr[0].href)
      // arr[0].href = arr[0].href.replace(baseHref, '')
      // arr[0].href = arr[0].href.slice(0, arr[0].href.length - 1)
      // arr[0].hrefDispay =  decodeURIComponent(arr[0].href)
      // console.log('resolveHref', arr)
      if (!Array.isArray(arr) || !arr[0]) {
        reject(new Error('sdsds'))
      }
      resolveHref(arr[0], baseHref)
      arr = arr.sort(function(a,b){
        return a.fileNameNotExt-b.fileNameNotExt;
      })
      resolve(arr)
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



const Home = Vue.defineComponent({
  template: '#home-tpl',
  mounted() {
    let { href = '' } = this.$router.currentRoute.value.query
    this.setData({href})
    this.inited =  true
    // console.log('mounted')
  },
  beforeRouteUpdate (to, from) {
    if (this.inited) {
      let { href = '' } = to.query
      this.setData({href})
    }
  },
  data() {
    return {
      inited: false,
      arr: [],
    };
  },
  computed: {
    bigImgList() {
      return this.arr.map(v => {
        return this.getImg(v.href)
      })
    }
  },
  methods: {
    getImg(v) {
      return SEVER_ORIGIN + v
    },
    async setData(link) {

      let data = await fetchDirectoryURL(SEVER_ORIGIN + link.href, link.href)
      // console.log(data)
      this.arr = data
    },
    goToLink(img) {
      let { href = '' } = this.$router.currentRoute.value.query
      // console.log(img.href)
      this.$router.push({
        path: '/',
        query: {
          href: resolvePath(href, img.href)
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
      console.log(this)
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

app.config.devtools = true

app.use(ElementPlus);
app.mount("#app");
