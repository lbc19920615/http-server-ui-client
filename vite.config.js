import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { importMaps} from 'vite-plugin-import-maps';

import {linkvue} from "./plugins/linkvue";

let plugins = [

  // handlebars({
  //   partialDirectory: resolve(__dirname, 'src/partials'),
  // }),
  importMaps([
    {
      imports: {
        // "vue-demi": "https://cdn.jsdelivr.net/npm/vue-demi@0.14.5/lib/index.iife.min.js",
        "pinia": "https://cdnjs.cloudflare.com/ajax/libs/pinia/2.1.4/pinia.iife.min.js"
      },
    },
  ]),
  linkvue(),
  vue(),

]



export default (({mode}) => {
  // console.log('mode', mode, loadEnv(mode, process.cwd()))

  return defineConfig({

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
