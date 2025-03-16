import "./web/imageslider.js"

import onChange from 'on-change';
import {BaseEle, bindRootEle, utils} from "./web/core.js"
import {deepSet, deepGet, parseStaticTemplate} from "./frm";
import {arrayDiffById} from "./web/ext";
import {getExprAst} from "./jexpr";

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




function testWeb() {


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


    let computed = {
        runnum: function(newData) {
            return newData?.num + 1
        }
    }



    function checkIsArrayPath(path = '', arrayKeys = []) {
        if (arrayKeys.includes(path)) {
            return true;
        }
        else {
            return arrayKeys.some(key => {
                let reg = new RegExp(key + "\\.([\\d]+)", "g");
                return reg.test(path);
            })
        }
    }

    /**
     *
     * @param template
     * @param data
     * @param functions
     * @param methods
     * @returns {{init: function, setData: function}}
     */
    function  buildAppCtx({template = '', data = function () { return {} }, computed = {}, methods = {} } = {}) {
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
            },
            init: function () {},

        }

        let renderTpl = function(htmlString, tempData  = {}, {functions, debug = false} = {}) {
            let log = debug ? console.log.bind(this) : function() {}

            return parseStaticTemplate(htmlString, tempData, {
                functions,
                log
            })
        }

        let watchedObject;
        let functions = {
        }

        Object.keys(computed).forEach(key => {
            let funReg = /function(\s*)\(([^)]+)\)/g;
            let fun = computed[key];
            let funStr = fun.toString();

            let mathchAll = funStr.matchAll(funReg);
            let funargs = [...mathchAll];
            let argName= funargs[0][2];
            console.log(argName)

            let reg = new RegExp(argName + "\\s*[?]*\\.([\\d\\w_]+)", "g")

            let watchMatch = funStr.matchAll(reg);
            let watchesALl = [...watchMatch];


            let watches = []
            watches = watchesALl.map(v => {
                return v[1]
            })
            // console.log(watchesALl, watches);

            Object.defineProperty(functions, key, {
                get() {
                    return {
                        watches,
                        value() {
                            return  computed[key](watchedObject)
                        }
                    }
                },
                enumerable: true,
                configurable: true,
            })
        });


        /**
         *
         * @param rootEle
         */
        ctx.init = function (rootEle) {
            let coreData = data();
            watchedObject = onChange(coreData, function (path, value, previousValue, applyData) {
                // console.log('this:', this);
                console.log('path:', path);
                console.log('value:', value);
                console.log('previousValue:', previousValue);
                // console.log('applyData:', applyData);

                let arrayKeys = [...ctx.keysSet]

                if (checkIsArrayPath(path, arrayKeys) && Array.isArray(value)) {
                    ctx.findNeedRender(path).forEach(needRender => {
                        ctx.renderNeedRender(needRender, {value, previousValue})
                    })
                    // console.dir(ctx.domMap)
                }

                else {
                    let needRenders = ctx.findNeedRender(path);

                    let computedKeys = ctx.getComputedKeys(functions, path);
                    computedKeys.forEach(function(key) {
                        ctx.findNeedRender(key).forEach(needRender => {
                            needRender?.reload(watchedObject);
                        })
                    });

                    needRenders.forEach(needRender => {
                        ctx.renderNeedRender(needRender, {value, previousValue})
                    });
                }
            });

            // ctx.methods = methods;

            ctx.rootEle = rootEle;
            let ret = renderTpl(template, watchedObject, {functions, debug: false});
            Object.defineProperty(ctx, "domMap", {
                get() {
                    return ret.methods.domMap
                }
            });
            Object.defineProperty(ctx, "keysSet", {
                get() {
                    return ret.methods.keysSet
                }
            })
            Object.defineProperty(ctx, "data", {
                get() {
                    return data
                }
            })

            // console.log(ctx.keysSet)

            let domes = getNewNodes(ret.str);
            rootEle.append(...domes);

            bindRootEle(rootEle, methods);

            window.watchedObject = watchedObject;
        }

        /**
         *
         * @param path
         * @param value {*}
         */
        ctx.setData = function (path = '', value) {
            deepSet(ctx.data, path, value);
        }

        /**
         *
         * @param path
         * @returns {*|*[]}
         */
        ctx.findNeedRender = function (path = '') {
            // console.log(ctx.domMap, path);
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
                        // console.log(comments, startC)
                        if (startC) {
                            return {
                                type: "each",
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

        ctx.getComputedKeys = function (computedFuns = {}, path = '') {
            let computedKeys = [];
            Object.keys(computedFuns).forEach(function(key) {
                console.log(functions[key])
                if (functions[key]?.watches) {
                    computedKeys = computedKeys.concat(functions[key].watches);
                }

                else {
                    let funcStr = Object.getOwnPropertyDescriptor(functions, key);
                    // console.log("funcStr", funcStr?.get.toString())
                    let regexp = /\{\{([^}]*)}}/g;
                    let mathAll = funcStr?.get.toString().matchAll(regexp)
                    // console.log([...mathAll])
                    let mathces = [...mathAll]
                    if (mathces.length > 0) {
                        let end = mathces.at(-1);
                        let arr = end[1].split(',');
                        if (arr.includes(path)) {
                            computedKeys.push(key);
                        }
                    }
                }
            });
            return computedKeys
        }


        /**
         *
         * @param needRender {{type: string,getDomFromData?: function}}
         * @param value
         * @param previousValue
         */
        ctx.renderNeedRender = function (needRender, {value, previousValue} = {}) {
            if (needRender.type === "if") {
                let {start} = needRender?.clear("if");
                if (start){
                    let nodes = needRender.getDomFromData(value);
                    start.after(...nodes);
                }
                // console.log(start)
            }
            if (needRender.type === "value") {
                needRender?.reload()
            }
            console.log(needRender)
            if (needRender.type === "each") {
                /**
                 * @type {[]}
                 */
                let arr = value;
                let diffed = arrayDiffById(previousValue, arr);
                console.log(diffed)

                function deleteSubItem(value, {from = needRender} = {}) {
                    let index = previousValue.findIndex(v => v === value);
                    if (index !== -1) {
                        let subitem0 = from?.getSubItem(index);
                        from?.clearFromNode(subitem0.start?.previousSibling, subitem0.end?.nextSibling);
                    }
                }

                function appendSubItem(value, {from = needRender} = {}) {
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
                    deleteSubItem(del_item, {from: needRender});
                })

                diffed.added.forEach((add_item) => {
                    appendSubItem(add_item, {from: needRender});
                });
            }
        }
        return ctx
    }

    setTimeout(() =>{



        let ctx = buildAppCtx({
            template: htmlString,
            data() {
                return tempData
            },
            computed,
            methods: {
                handleClick(e) {
                    console.log(e)
                }
            }
        });

        function test() {

            let rootEle =  document.querySelector('#webapp');

            ctx.init(rootEle);

            globalThis.testSetData = function (path, fun) {
                let oldVal = deepGet(watchedObject, path)
                ctx.setData(path, fun(oldVal, watchedObject));
            }

            globalThis.testTasks = function* () {
                yield function () {
                    watchedObject.str = "hello";
                }
                yield function () {
                    testSetData('items', v => {
                        v.push({id: Date.now(), items: [1]});
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
        }

        test()

    }, 1000)
    
}

testWeb()