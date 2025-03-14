import {BaseEle, bindRootEle, utils} from "./web/core.js"
import "./web/ext"

import "./web/imageslider.js"
import {parseStaticTemplate} from "./frm"
import onChange from 'on-change';
import {arrayDiffById} from "@/web/ext";

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


/**
 *
 * @param obj {{}}
 * @param path {string | *[]}
 * @param defaultValue {*}
 * @param delimiter
 * @returns {*}
 */
function deepGet (obj, path, defaultValue, delimiter) {
    if (typeof path === 'string') {
        path = path.split(delimiter || '.');
    }
    if (Array.isArray(path)) {
        let len = path.length;
        for (let i = 0; i < len; i++) {
            if (
                obj &&
                (Object.prototype.hasOwnProperty.call(obj, path[i]) || obj[path[i]])
            ) {
                obj = obj[path[i]];
            } else {
                return defaultValue;
            }
        }
        return obj;
    } else {
        return defaultValue;
    }
};

let renderTpl = function(tempData  = {}, {debug = false} = {}) {

    let htmlString = /*html*/`
<template>
    <h1>Shopping list</h1>
    <z-list bind:click="handleClick">
        <div slot="content">
            <div>
            {= foo(deepobj)}
            {= str} {= num}
            </div>
            {= deepobj.name}
            {#each items as item, i}
            <z-list-item>item_{= i}</z-list-item>
            <div class="sub">
                {#each item.items as sub_item, y}
                    <div>sub_item1 {= i} {= y}</div>
                {/each}

                {#if testFalse}
                    <div>if_dom</div>
                {:else-if testFalse}
                    <div>else_if_dom1</div>
                {:else-if item}
                    <div>else_if_dom2</div>
                {:else}
                    <div>else_dom</div>    
                {/if} 
            </div>
            {/each}    
        </div>
    </z-list>
</template>
    `;

    let log = debug ? console.log.bind(this) : function() {}

    return parseStaticTemplate(htmlString, tempData, {
        functions: {
            foo(deepobj) {
                return 'bar'
            }
        },
        log
    })

}


function testWeb() {

    let tempData = {
        str: "teststr",
        num: 1,
        testFalse: false,
        deepobj: {
            name: 'deepobj_name'
        },
        items: [
            {
                id: Date.now(),
                items: [1,2,3]
            },
        ],
    }

    function logHtml(newStr= '') {
        if (globalThis.beautifier) {
            console.log(beautifier.html(newStr));
        }
    }


    setTimeout(() =>{

        let ctx = {
            domMap: new Map(),
            /**
             * @type {Node[]}
             */
            comments: []
        }
        /**
         *
         * @param path
         * @returns {{render: (arr: Array) => [{}]}
         */
        ctx.findNeedRender = function (path = '') {
            console.log(ctx.domMap, path);
            if (ctx.domMap.has(path)) {
                console.log(ctx.comments)
                let doms = ctx.domMap.get(path);
                let ret = doms.map(v => {
                    // console.log(v)
                    if (v.type === "each") {
                        let eachStartId = `start__each:${v.id}`;
                        let eachEndId = `end__each:${v.id}`;

                        let startC = ctx.comments.find(comment => comment.nodeValue.includes(eachStartId))
                        let endC = ctx.comments.find(comment => comment.nodeValue.includes(eachEndId))

                        if (startC) {
                            return {
                                getStartNode() {
                                    return startC
                                },
                                /**
                                 *
                                 * @param index
                                 * @returns {{start: Node | null, end: Node | null}}
                                 */
                                getSubItem(index = 0) {
                                    // console.log(index)
                                    let start = null
                                    let end = null

                                    let startIndex = 0;
                                    let endIndex  = 0;
                                    let startId = "start__each_item"
                                    let endId = "end__each_item"

                                    let cur = startC;
                                    while (!cur?.nextSibling.isEqualNode(endC)) {
                                        // console.log(cur)
                                        if (start !== null && end !== null) {
                                            break;
                                        }
                                        if (cur.nextSibling?.nodeValue?.includes(startId)) {
                                            if (startIndex === index) {
                                                start = cur.nextSibling;
                                            }
                                            else {
                                                startIndex = startIndex + 1;
                                            }
                                        }
                                        if (cur.nextSibling?.nodeValue?.includes(endId)) {
                                            if (endIndex === index) {
                                                end = cur.nextSibling;
                                            }
                                            else {
                                                endIndex = endIndex + 1;
                                            }
                                        }
                                        cur = cur.nextSibling;
                                    }
                                    return {
                                        start, end
                                    }
                                },
                                /**
                                 *
                                 * @param start
                                 * @param end
                                 */
                                clearFromNode(start = startC, end = endC){
                                    let subNodes = [];

                                    let curIndex = start;
                                    while (!curIndex?.nextSibling.isEqualNode(endC)) {
                                        subNodes.push(curIndex.nextSibling);
                                        curIndex = curIndex.nextSibling;
                                    }
                                    console.log(start, end, subNodes);

                                    subNodes.forEach(node => {
                                        let comments = utils.getAllComments(node);
                                        // console.log(comments);
                                        comments.forEach(comment => {
                                            let arr = comment.nodeValue.trim().split(':');
                                            // console.log(arr)
                                            let type = arr[0];
                                            let id = arr.at(1);
                                            let key = arr.at(2);
                                            if (type === 'start__each' && id) {
                                                ctx.deleteById(key, id);
                                            }
                                        })
                                        // console.dir(node);
                                        node.remove()
                                    })
                                },
                                getDomFromData (arr= []) {
                                    let newStr = v.getRenderStr(arr);
                                    console.log(newStr)
                                    let parser = new DOMParser();
                                    let doc = parser.parseFromString(`<div>${newStr}</div>`, "text/html")
                                    // console.dir([...doc.body.childNodes[0].childNodes]);
                                    parser = null;
                                    return [...doc.body.childNodes[0].childNodes]
                                }
                            }
                        }
                    }
                })
                return ret.filter(v => v)
            }
            return []
        }


        window.watchedObject = onChange(tempData, function (path, value, previousValue, applyData) {
            // console.log('this:', this);
            console.log('path:', path);
            console.log('value:', value);
            console.log('previousValue:', previousValue);
            // console.log('applyData:', applyData);
            if (path.startsWith('items') && Array.isArray(value)) {
                let diffed = arrayDiffById(previousValue, value);
                console.log(diffed)
                /**
                 * @type {[]}
                 */
                let arr = value;
                let needRenders = ctx?.findNeedRender(path);
                needRenders.forEach(item => {
                    if (item) {
                        // update
                        // delete subitem0
                        // let subitem0 = item?.getSubItem(0);
                        // console.log(subitem0)
                        // let insertEle =  subitem0.start?.previousSibling;
                        // item?.clearFromNode(subitem0.start?.previousSibling, subitem0.end?.nextSibling);

                        diffed.deleted.forEach((del_item) => {
                            let index = previousValue.findIndex(v => v === del_item);
                            if (index !== -1) {
                                let subitem0 = item?.getSubItem(index);
                                console.log(subitem0, index)
                                item?.clearFromNode(subitem0.start?.previousSibling, subitem0.end?.nextSibling);
                            }
                        })

                        diffed.added.forEach((add_item) => {
                            let index = arr.findIndex(v => v === add_item);
                            if (index !== -1) {
                                let preItem = item?.getSubItem(index - 1);
                                // console.log(index, preItem)
                                let insertEle = preItem.end;
                                let doms = item?.getDomFromData([item]);
                                insertEle.after(...doms)
                            }
                        });



                    }
                })

                console.dir(ctx.domMap)
            }
        });


        function test() {
            let rootEle =  document.querySelector('#webapp');

            let ret = renderTpl(tempData, {debug: true});

            rootEle.innerHTML = ret.str;

            ctx.domMap = ret.methods.domMap;
            ctx.deleteById = function (key = '', id = '') {
                // console.log(key, id);
                if (ret.methods.domMap.has(key)) {
                    let arr = ret.methods.domMap.get(key);
                    let index = arr.findIndex(v => v.id === id);
                    if (index > -1) {
                        arr.splice(index, 1);
                    }
                    ret.methods.domMap.update(key, arr);
                }
            }
            ctx.comments = utils.getAllComments(rootEle);

            ;(function() {
                /**
                 *
                 * @param e {Event}
                 */
                rootEle.handleClick = function (e) {
                    console.log(e)
                }

                bindRootEle(rootEle, rootEle);

                console.dir(ctx.domMap)
            })();
        }

        test()

    }, 1000)
    
}

testWeb()