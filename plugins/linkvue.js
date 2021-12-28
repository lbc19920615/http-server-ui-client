import FindFiles from "node-find-files"

import path from "path";
import JSON5 from 'json5';
// import os from "os";
// let root = (os.platform == "win32") ? process.cwd().split(path.sep)[0] : "/"

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

export function linkvue(pluginOptions) {
  let server
  return {
    name: 'vite-import-linkvue',
    config() {
    },
    async transform(code, id) {
      let url = new URL(id);
      let name = url.searchParams.get('name')
      if (!url.pathname.endsWith('.linkvue')) return null
      let files = await findFilesByName('if', {folder: "D:\\buyaosese"})
      let data = {
        files
      }
      let str = JSON5.stringify(data)

      return `export default {
    a: '${name}',
    fun() {/*${str}*/}
  }`
    },
  }
}
