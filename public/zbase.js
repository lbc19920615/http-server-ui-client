
function stdlib() {
    function defStruct(defs = {}) {
        let keys = Object.keys(defs);
        let funname = keys[0];
        let fun = defs[funname]
        let ins = {
            [funname]: function (...args) {
                let obj = fun();
                Object.defineProperties(obj, {
                    constructor: {
                        value: fun,
                        enumerable: false,
                        writable: true,
                        configurable: true,
                    },
                })
                if (obj.init) {
                    obj.init(...args)
                }
                return obj
            }
        }

        return ins[funname]
    }


    function defObject(defs = {}) {

        let fun = defs.value;
        let ins = function () {
            let obj = fun();
            return obj
        }

        return ins()
    }

    return { defStruct, defObject }
}
window.stdlib = stdlib;

window.stdStruct = function () {
    let { defStruct } = stdlib();
    let StorageList = defStruct({
        ['StorageList']: function () {
            return {
                ups: [],
                storykey: '',
                async init(storykey = '') {
                    this.storykey = storykey;
                    let ups = await ZY.store.getItem(this.storykey);
                    if (!ups) {
                        await ZY.store.setItem(this.storykey, []);
                        ups = []
                    }
                    this.ups = ups
                    console.log('init', ups, this);
                },
                async save() {
                    await ZY.store.setItem(this.storykey, structuredClone(this.ups));
                },
                items() {
                    return structuredClone(this.ups)
                },
                add(name = '') {
                    if (name) {
                        this.ups.push(name);
                        this.save();
                    }
                },
                del(name) {
                    if (name) {
                        let index = this.ups.findIndex(v => v === name);
                        if (index > -1) {
                            console.log(this.ups, index, name)
                            this.ups.splice(index, 1)
                            this.save();
                        }
                    }
                }
            }
        }
    });
    return { StorageList }
}

window.stdDomLib = function () {
    let appendHtml = function (html, { tag = 'div' } = {}) {
        let dom = document.createElement(tag);
        dom.innerHTML = html;
        document.body.append(...dom.children);
    }
    return { appendHtml }
}

window.zInitMessageCallback = function () {
    let callbacks = [];
    window.addEventListener('message', function (e) {
        console.log('message')

        callbacks.forEach(callback => {
            callback(e)
            callbacks.shift()
        });

    });
    function pushCallback(fun) {
        callbacks.push(fun)
    }
    return { pushCallback }
}