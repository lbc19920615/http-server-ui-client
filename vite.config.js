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
        lodash: 'https://esm.sh/lodash-es@4.17.20',
        "three": "https://unpkg.com/three@0.153.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.153.0/examples/jsm/"
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
