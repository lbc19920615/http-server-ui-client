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

      return `export default {
    a: '${name}',
    fun() {/*${name}*/}
  }`
    },
  }
}
