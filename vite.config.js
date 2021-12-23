import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'



let plugins = [

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
