import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { importMaps} from 'vite-plugin-import-maps';
// import basicSsl from '@vitejs/plugin-basic-ssl'


import  { networkInterfaces } from "os";

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log(results);

import {linkvue} from "./plugins/linkvue";

let plugins = [

  // handlebars({
  //   partialDirectory: resolve(__dirname, 'src/partials'),
  // }),
  // basicSsl(),
  importMaps([
    {
      imports: {
        // "vue-demi": "https://cdn.jsdelivr.net/npm/vue-demi@0.14.5/lib/index.iife.min.js",
        "pinia": "https://cdn.bootcdn.net/ajax/libs/pinia/2.3.0/pinia.iife.js"
      },
    },
  ]),
  linkvue(),
  vue(),

]



export default (({mode}) => {
  // console.log('mode', mode, loadEnv(mode, process.cwd()))
  return defineConfig({
    define: {
      __ips__: Array.isArray(results['WLAN']) ? results['WLAN'] : [] 
    },
    // 路径代理
    resolve: {
      alias: [
        { find: '@', replacement: '/src' },
      ]
    },
    plugins: plugins,
    server: {
      // https: true,
    },
  })
})
