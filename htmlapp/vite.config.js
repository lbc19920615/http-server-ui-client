import { resolve } from "node:path";
import {defineConfig} from 'vite';

export default (({mode}) => {
  // console.log('mode', mode, loadEnv(mode, process.cwd()))
  return defineConfig({
      build:{
          target: "modules",
          minify: false,
          modulePreload: false,
          lib: {
              formats: ["es"],
              entry: ['src/webcom.js'],
              fileName: (format, entryName) => `z-${entryName}.${format}.js`,
              cssFileName: 'my-lib-style',
          },
          // rollupOptions: {
          //     treeshake: false,
          //     // preserveEntrySignatures: "strict",
          //     output: {
          //         // inlineDynamicImports: false,
          //         // preserveModules: true,
          //         entryFileNames: "zwebcom.js",
          //         assetFileNames: 'zwebcom.css',
          //         manualChunks(id) {
          //             return 'zwebcom'
          //         },
          //     }
          // }
      },

  })
})
