import {BaseEle, bindRootEle, utils} from "./web/core.js"
import {deepSet, deepGet} from "./frm";

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



let renderTpl = function(tempData  = {}, {functions, debug = false} = {}) {

    let htmlString = /*html*/`
<template>
    <h1>Shopping list</h1>
    <z-list bind:click="handleClick">
        <div slot="content">
            <div>
            {= str} {= num} {= num + 1}
            </div>
           <div>
             {= runnum}
            {= deepobj.name}
            </div>
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
        functions,
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

    let functions = {
        get runnum() {
            // {{num}}
            return deepGet(tempData, "num") + 1
        }
    }

    function  buildAppCtx() {
        function strToNodes(newStr = '') {
            let parser = new DOMParser();
            let doc = parser.parseFromString(`<div>${newStr}</div>`, "text/html")
            // console.dir([...doc.body.childNodes[0].childNodes]);
            parser = null;
            return [...doc.body.childNodes[0].childNodes]
        }

        function parseValueToTextNode(nodes = []) {
            nodes.forEach(node => {
                // console.dir(node);
                if (node.nodeName === 'VALUE') {
                    let key = node.textContent;
                    let ast = getExprAst(key);
                    let id = node.getAttribute('id');

                    let ins = ctx.findById(key, id);
                    if (!ins) {

                        let ids = [];
                        ast.getIds(ids)
                        if (ids.length > 0) {
                            key = ids[0];
                        }
                        ins = ctx.findById(key, id);
                    }
                    if (ins) {
                        // console.log(ins)
                        let str = ins.getRenderStr();
                        // console.log('str:', str)

                        let textNode = new Text(str);
                        textNode.id = id;
                        node.after(textNode);
                        node.remove();
                        ins.cache(textNode)
                    } else {
                        console.log(key, id)
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

        function getNewNodes(newStr = '') {
            let nodes = strToNodes(newStr);
            parseValueToTextNode(nodes);
            return nodes;
        }

        let ctx = {
            domMap: new Map(),
            rootEle: null,
            get comments() {
                if (this.rootEle) {
                    return utils.getAllComments(this.rootEle)
                }
                return []
            }
        }

        ctx.init = function (rootEle, data, {functions} = {}) {
            ctx.rootEle = rootEle;
            let ret = renderTpl(data, {functions, debug: false});
            Object.defineProperty(ctx, "domMap", {
                get() {
                    return ret.methods.domMap
                }
            })
            Object.defineProperty(ctx, "data", {
                get() {
                    return data
                }
            })
            let domes = getNewNodes(ret.str);
            rootEle.append(...domes)
        }

        /**
         *
         * @param path
         * @param value {*}
         */
        ctx.setData = function (path = '', value) {
            console.log(ctx.data)
            deepSet(ctx.data, path, value);
        }

        /**
         *
         * @param path
         * @returns {*|*[]}
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
                console.log(start, subNodes);

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
                let doms = ctx.domMap.get(path);
                let domsRet = doms.map(v => {

                    if (v.type === "each") {
                        let eachStartId = `start__each:${v.id}`;
                        let eachEndId = `end__each:${v.id}`;

                        let comments =  ctx.comments;
                        let startC = comments.find(comment => comment.nodeValue.includes(eachStartId))
                        let endC = comments.find(comment => comment.nodeValue.includes(eachEndId))
                        console.log(comments, startC)
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

                                    return getNewNodes(newStr)
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

                                let comments =  ctx.comments;
                                let startC = comments.find(comment => comment.nodeValue.includes(eachStartId))
                                let endC = comments.find(comment => comment.nodeValue.includes(eachEndId))

                                // console.log(startC, endC)

                                clearFromNode(startC, endC)
                                return {
                                    start: startC,
                                    end: endC,
                                }
                            },
                            getDomFromData(value) {
                                let newStr = v.getRenderStr(value);
                                // console.log(newStr)

                                return getNewNodes(newStr)
                            }
                        }
                    }
                })
                return domsRet.filter(v => v)
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

        ctx.deleteById = function (key = '', id = '') {
            // console.log(key, id);
            if (ctx.domMap.has(key)) {
                let arr = ctx.domMap.get(key);
                let index = arr.findIndex(v => v.id === id);
                if (index > -1) {
                    arr.splice(index, 1);
                }
                ctx.domMap.update(key, arr);
            }
        }
        return ctx
    }

    setTimeout(() =>{

        let ctx = buildAppCtx();

        window.watchedObject = onChange(tempData, function (path, value, previousValue, applyData) {
            // console.log('this:', this);
            console.log('path:', path);
            console.log('value:', value);
            console.log('previousValue:', previousValue);
            // console.log('applyData:', applyData);

            if (path === "testFalse") {
                let needRenders = ctx?.findNeedRender(path);
                needRenders.forEach(needRender => {
                    // needRender.getRenderStr(value)
                    if (needRender.type === "if") {
                        let {start} = needRender.clear("if");
                        if (start){
                            let nodes =  needRender.getDomFromData(value);
                            start.after(...nodes);
                        }
                        // console.log(start)
                    }
                })
            }

            else if (path.startsWith('items') && Array.isArray(value)) {
                let diffed = arrayDiffById(previousValue, value);
                console.log(diffed)
                /**
                 * @type {[]}
                 */
                let arr = value;
                let needRenders = ctx?.findNeedRender(path);
                console.log(needRenders);
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
                            console.log(index, preItem)
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

            else {
                let needRenders = ctx?.findNeedRender(path);

                Object.keys(functions).forEach(function(key) {
                    let funcStr = Object.getOwnPropertyDescriptor(functions, key);
                    console.log("funcStr", funcStr?.get.toString())
                    let regexp = /\{\{([^}]*)}}/g;
                    let mathAll = funcStr?.get.toString().matchAll(regexp)
                    // console.log([...mathAll])
                    let mathces = [...mathAll]
                    if (mathces.length > 0) {
                        let end = mathces[mathces.length - 1];
                        let arr = end[1].split(',');
                        if (arr.includes(path)) {
                            let needRenders = ctx?.findNeedRender(key);
                            needRenders.forEach(needRender => {
                                needRender?.reload();
                            })
                            // console.log("我也可以")
                        }
                    }
                })


                needRenders.forEach(needRender => {
                    if (needRender.type === "value") {
                        needRender.reload()
                    }
                });

            }
        });

        function test() {

            let rootEle =  document.querySelector('#webapp');

            ctx.init(rootEle, window.watchedObject, {functions});

            ;(function() {
                /**
                 *
                 * @param e {Event}
                 */
                rootEle.handleClick = function (e) {
                    console.log(e)
                }

                bindRootEle(rootEle, rootEle);
            })();

            globalThis.testSetData = function (path, fun) {
                let oldVal = deepGet(watchedObject, path)
                ctx.setData(path, fun(oldVal, watchedObject));
            }
        }

        test()

    }, 1000)
    
}

testWeb()