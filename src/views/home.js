import { html } from "../lib";
import { defineStore,storeToRefs  } from 'pinia'
const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0, name: 'Eduardo' }),
    getters: {
      doubleCount: (state) => state.count * 2,
    },
    actions: {
      increment() {
        this.count++
      },
    },
})

export default {
    template: '#home-tpl',
    data() {
        return {
            obj: {}
        };
    },
    setup(props) {
        const store = useCounterStore();
        const { name, doubleCount } = storeToRefs(store)
        const { increment } = store;
        console.log(name)
        return {
            name, doubleCount,increment
        }
    },
    beforeMount() {
        window.defComAndReloadCurPage('home-form',
           {
                template: html`
                    hello
                `,

           }, false
        )
    },
}
