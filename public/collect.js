export let ver = '0.0.1'

function interval() {
    let c =  document.querySelector('.home__stock-index__main')?.children[0]?.textContent;
    if (c) {
        window.sendNotify(c.replace('+', ' ').replace('%',''))
    }
}

export function init() {
    console.log('collectinit')
    window.workerTimers.setInterval(() => {
        interval()
    }, 1000 * 60 * 3)
}

