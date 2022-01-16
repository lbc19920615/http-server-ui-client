import {loadEnv} from 'vite'
import FindFiles from "node-find-files"

let config = loadEnv('development', process.cwd());
console.log(config)

import path from "path";
// import JSON5 from 'json5';
// import os from "os";
// let root = (os.platform == "win32") ? process.cwd().split(path.sep)[0] : "/"

import {screenShot} from "../core.mjs";

// console.log(root)

/**
 * 查找文件
 * @param name
 * @param folder
 */
function findFilesByName(name, {folder = ''} = {}) {
  return new  Promise(resolve => {
    let paths = []
    let finder = new FindFiles({
      rootFolder : folder,
      filterFunction : function (p, stat) {
        let pathArr = p.split(path.sep)
        // console.log(pathArr)
        return pathArr[pathArr.length - 1].includes(name)
      }
    });
    finder.on("match", function(strPath, stat) {
      // console.log(strPath + " - " + stat.mtime);
      paths.push(strPath)
    })
    finder.on("complete", function() {
      console.log("Finished", paths)
      resolve(paths)
    })
    finder.startSearch()
  })
}

const ROOT_PATH = config.VITE_ROOT_PATH

export function linkvue(pluginOptions) {
  let server
  return {
    name: 'vite-import-linkvue',
    config() {
      return {}
    },
    async transform(code, id) {
      let url = new URL(id)
      if (!url.pathname.endsWith('.linkvue')) return null
      console.log(url)
      let href = url.searchParams.get('href')

      screenShot(path.join(ROOT_PATH, href))
      return {
        code: `export default {}`,
        map: null // 如果可行将提供 source map
      }
    },
  }
}
