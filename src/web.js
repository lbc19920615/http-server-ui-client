import {BaseEle, bindRootEle, utils} from "./web/core.js"
import "./web/ext"

import "./web/imageslider.js"
import {parseStaticTemplate} from "./frm"
import onChange from 'on-change';
import {arrayDiffById} from "@/web/ext";
import {getExprAst} from "@/jexpr";

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
}

let renderTpl = function(tempData  = {}, {debug = false} = {}) {

    let htmlString = /*html*/`
<template>
    <h1>Shopping list</h1>
    <z-list bind:click="handleClick">
        <div slot="content">
            <div>
            {= str} {= num} {= num + 1}
            </div>
            {= deepobj.name}
            {#each items as item, i}
            <z-list-item>item_{= i}</z-list-item>
            <div class="sub">
                {#each item.items as sub_item, y}
                    <div>sub_item1 {= i} {= y}</div>
                {/each}

                {#if testFalse}  <div>truedom</div>   {/if}

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

    // function logHtml(newStr= '') {
    //     if (globalThis.beautifier) {
    //         console.log(beautifier.html(newStr));
    //     }
    // }


    setTimeout(() =>{


        function strToNodes(newStr = '') {
            let parser = new DOMParser();
            let doc = parser.parseFromString(`<div>${newStr}</div>`, "text/html")
            // console.dir([...doc.body.childNodes[0].childNodes]);
            parser = null;
            return [...doc.body.childNodes[0].childNodes]
        }

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
         * @returns {{render: (arr: Array) => [{}]}}
         */
        ctx.findNeedRender = function (path = '') {
            console.log(ctx.domMap, path);
            function clearFromNode(start, end){
                let subNodes = [];

                let cur = start;
                while (cur?.nextSibling !== end) {
                    // console.log(cur)
                    subNodes.push(cur.nextSibling);
                    cur = cur.nextSibling;
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
                        if (type.startsWith("start__") && id) {
                            ctx.deleteById(key, id);
                        }
                    })
                    // console.dir(node);
                    node.remove()
                })
            }



            if (ctx.domMap.has(path)) {
                // console.log(ctx.comments)
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
                                    clearFromNode(start, end)
                                },
                                getDomFromData (arr= []) {
                                    let newStr = v.getRenderStr(arr);
                                    // console.log(newStr)

                                    return strToNodes(newStr)
                                }
                            }
                        }
                    }

                    else {
                        return {
                            ...v,
                            clear(type) {
                                let eachStartId = `start__${type}:${v.id}`;
                                let eachEndId = `end__${type}:${v.id}`;

                                let startC = ctx.comments.find(comment => comment.nodeValue.includes(eachStartId))
                                let endC = ctx.comments.find(comment => comment.nodeValue.includes(eachEndId))

                                console.log(startC, endC)

                                clearFromNode(startC, endC)
                                return {
                                    start: startC,
                                    end: endC,
                                }
                            },
                            getDomFromData(value) {
                                let newStr = v.getRenderStr(value);
                                // console.log(newStr)

                                return strToNodes(newStr)
                            }
                        }
                    }
                })
                return ret.filter(v => v)
            }
            return []
        }

        ctx.findById = function (key = '', id = '') {
            // console.log(key, id);
            if (ctx.domMap.has(key)) {
                let arr = ctx.domMap.get(key);
                let index = arr.findIndex(v => v.id === id);
                if (index > -1) {
                    return arr[index];
                }
            }
            return null;
        }

        window.watchedObject = onChange(tempData, function (path, value, previousValue, applyData) {
            // console.log('this:', this);
            console.log('path:', path);
            console.log('value:', value);
            console.log('previousValue:', previousValue);
            // console.log('applyData:', applyData);
            if (path === "str") {
                let needRenders = ctx?.findNeedRender(path);
                needRenders.forEach(needRender => {
                    if (needRender.type === "value") {
                        needRender.reload()
                    }
                })

            }

            if (path === "testFalse") {
                let needRenders = ctx?.findNeedRender(path);
                needRenders.forEach(needRender => {
                    // needRender.getRenderStr(value)
                    if (needRender.type === "if") {
                        let {start} = needRender.clear("if");
                        let nodes =  needRender.getDomFromData(value);
                        start.after(...nodes);
                        // console.log(start)
                    }
                })
            }

            if (path.startsWith('items') && Array.isArray(value)) {
                let diffed = arrayDiffById(previousValue, value);
                // console.log(diffed)
                /**
                 * @type {[]}
                 */
                let arr = value;
                let needRenders = ctx?.findNeedRender(path);
                needRenders.forEach(item => {
                    function deleteSubItem(value, {from = item} = {}) {
                        let index = previousValue.findIndex(v => v === value);
                        if (index !== -1) {
                            let subitem0 = from?.getSubItem(index);
                            from?.clearFromNode(subitem0.start?.previousSibling, subitem0.end?.nextSibling);
                        }
                    }

                    function appendSubItem(value, {from = item} = {}) {
                        let index = arr.findIndex(v => v === value);
                        if (index !== -1) {
                            let preItem = from?.getSubItem(index - 1);
                            // console.log(index, preItem)
                            if (preItem.end !== null) {
                                let insertEle = preItem.end;
                                let domes = from?.getDomFromData([value]);
                                insertEle.after(...domes)
                            }
                        }
                    }

                    diffed.deleted.forEach((del_item) => {
                        deleteSubItem(del_item, {from: item});
                    })

                    diffed.added.forEach((add_item) => {
                        appendSubItem(add_item, {from: item});
                    });

                    // diffed.updated.forEach((upt_item) => {
                    //     deleteSubItem(upt_item, {from: item});
                    //     appendSubItem(upt_item, {from: item});
                    // })
                })

                console.dir(ctx.domMap)
            }
        });


        function parseValueToTextNode(nodes = []) {
            nodes.forEach(node => {
                // console.dir(node);
                if (node.nodeName === 'VALUE') {
                    let key = node.textContent;
                    let ast = getExprAst(key);
                    let ids = [];
                    ast.getIds(ids)
                    if (ids.length > 0) {
                        key = ids[0];
                    }
                    let id = node.getAttribute('id');
                    // console.log(key, id)
                    let ins = ctx.findById(key, id);
                    if (ins) {
                        console.log(ins)
                        let str = ins.getRenderStr();
                        console.log('str:', str)

                        let textNode = new Text(str);
                        textNode.id = id;
                        node.after(textNode);
                        node.remove();
                        ins.cache(textNode)
                    }
                }
                else {
                    if (node.childNodes.length > 0) {
                        parseValueToTextNode([...node.childNodes]);
                    }
                }
            })

            return nodes
        }

        function test() {



            let rootEle =  document.querySelector('#webapp');

            let ret = renderTpl(tempData, {debug: true});

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

            let domes = strToNodes(ret.str)

            parseValueToTextNode(domes)

            console.dir(domes);

            rootEle.append(...domes)





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