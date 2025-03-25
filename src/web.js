import {initGlobal} from '../../htmlapp/src/webcom.js'

initGlobal()


import {BaseEle} from "../../htmlapp/src/core.js"
import {deepGet} from "./web/frm";
import {buildAppCtx} from "./web/zcp";
import {setArrWhen} from "./web/ext";

function getLocalDatetime(timestamp) {
    const dayjsLocal = globalThis.dayjs(timestamp);
    // const dayjsIst = dayjsLocal.tz('Asia/Shanghai');
    return dayjsLocal.format('YYYY-MM-DDTHH:mm:ss') ;
}

class ZList extends BaseEle {
    constructor() {
        super()
        this.setTemplate("#z-list_tpl")
    }
}

ZList.defsel('z-list', {
    attrs: {
        color: '',
        size: 0
    }
});

class ZListItem extends BaseEle {
    constructor() {
        super()
        this.setTemplate("#z-list-item_tpl")
    }
}

ZListItem.defsel('z-list-item', {
    attrs: {
        name: '',
    }
});

class ZValue extends BaseEle {
    constructor() {
        super()
        this.setTemplate("#z-value_tpl")
    }

    /**
     *
     * @param item{Node}
     * @private
     */
    _listenSlot(item) {
        item.$slotHost = this;
        let self = this;
        let content = item.textContent;
        Object.defineProperty(item, "$textContent", {
            get: function () {
                return content
            },
            set: function (value) {
                // console.log("sssss", value)
                content = value;
                self.onSlotValueChange(value)
            },
            enumerable: true,
            configurable: true,
        })
    }
    onSlotValueChange(newVal) {
        this.shadowRoot.querySelector('#result').textContent = parseFloat(newVal).toFixed(2);
    }
    onSlotChange(e, {slotnodes} = {}) {
        let slot1 = slotnodes[0];
        if (slot1) {
            let str = '';
            slot1.forEach((item) => {
                this._listenSlot(item)
                str = str + item.textContent;
            })

            this.onSlotValueChange(str)
        }

        // console.log(slotnodes)
    }
    unmounted() {
        console.log("ZValue unmounted");
    }
}

ZValue.defsel('z-value', {
    attrs: {
        name: '',
    }
});

import { z } from "zod";

function testWeb() {
    console.log( getLocalDatetime())

    let datetimeRegexp = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/gm
    let todoSchema = z.object({
        id: z.string().default(Date.now() + ''),
        text: z.string().default(''),
        price: z.string().default(''),
        symbol: z.string().default(''),
        num: z.string().default('0'),
        datetime: z.string().regex(datetimeRegexp).default(getLocalDatetime() ),
        completed: z.boolean().default(false),
        items: z.array(z.any()).default([]),
    });



   let expire = new window.ZExpireStore('todos__' + "demo");
    expire.clearExpired();

    function parseInclude(html = '', {hasAuth =function () {return true}} = {}) {
        let reg = /\#include\s*\(([^\)]*)\)/g
        html = html.replace(reg, function (match,$1) {
            let partHtml = document.getElementById($1).innerHTML;
            if (!hasAuth($1)) {
                partHtml = ''
            }
            return partHtml
        });
        return html;
    }

    function basicComponent() {
        let ctx = buildAppCtx({
            template:parseInclude(document.querySelector('[zelement="webapp"]').innerHTML, {
                hasAuth() {
                    return window.innerWidth > 600;
                }
            }),
            data() {
                let datetime =  getLocalDatetime();
                return  {
                    str: "teststr",
                    num: 1,
                    testFalse: false,
                    time: '16:16:00',
                    datetime: '2025-03-06T16:16:00Z',
                    deepobj: {
                        name: 'deepobj_name',
                        items: [
                            {
                                id: Date.now(),
                                completed: true
                            }
                        ]
                    },
                    items: [
                    ],
                }
            },
            async mounted() {

                try {
                    let res = await window.fetchJSON5('http://localhost:3000/get_json_list?name=todos');

                    console.log("11111 mounted", res);
                    if (Array.isArray(res.list)) {
                        this.setData("items", res.list.map(v => {
                            return v
                        }));
                    }
                } catch (error) {}
            },
            computed: {
                computednum: function(newData) {
                    return newData?.num + 1
                }
            },
            methods: {
                handleAppendTodo() {

                    const todoObj = todoSchema.optional().parse({});
                    console.log(todoObj);
                    this.data.items?.push(todoObj)
                },
                handleClick(e) {
                    console.log(e, this)
                    let d = this.$target.$ctx?.getBindData();
                    console.log(d)
                    if (d){
                        setArrWhen(this.data.items, item => item.id === d.item.id,  (findItem) => {
                            findItem.completed = !findItem.completed;
                        });
                    }
                },
                handleInput(e) {
                    console.log(e, this)
                    let d = this.$target.$ctx?.getBindData();
                    let path = this.$target.dataset?.path;
                    // console.log(d, path)
                    if (d && path) {
                        setArrWhen(this.data.items, item => item.id === d.item.id,  (findItem) => {
                            // console.log(findItem)
                            findItem[path] = this.$target.value
                            // findItem['symbol'] = '111'
                        });
                    }
                },
                handleTimeChange(e) {
                    console.log(e, this)
                    this.data.datetime = this.$target.value
                },
                handleSubmit(e) {
                    if (expire.isExpired()) {
                        expire.setExpire(0.5);
                        // console.log("sssss")
                        postJSON('http://localhost:3000/set_json_list?name=todos', this.data.items)
                            .then(_ => {
                                window.Ztoastr.message('提交了')
                            })
                    }
                }
            }
        });




        let testTasks = function* () {
            yield function () {
                watchedObject.str = "hello";
            }
            yield function () {
                testSetData('items', v => {
                    v.push({id: Date.now(), completed: false, items: [1]});
                    return v
                })
            }
            yield function () {
                testSetData('items', v => {
                    v[0].completed = true
                    return v
                })
            }
            yield function () {
                testSetData('items', v => {
                    v[1].completed = true
                    return v
                })
            }
            yield function () {
                watchedObject.testFalse = true
            }
            yield function () {
                watchedObject.testFalse = false
            }
            yield function () {
                watchedObject.num = 3;
            }
        }

        return {ctx, testTasks}
    }

    setTimeout(() =>{

        function test() {

            let {ctx,testTasks} = basicComponent()

            let rootEle =  document.querySelector('#webapp');

            ctx.init(rootEle);

            globalThis.testSetData = function (path, fun) {
                let oldVal = deepGet(watchedObject, path)
                ctx.setData(path, fun(oldVal, watchedObject));
            }

            globalThis.testTasks = testTasks
        }

        test()

    }, 1000)
    
}

setTimeout(() => {
    testWeb()
},300)