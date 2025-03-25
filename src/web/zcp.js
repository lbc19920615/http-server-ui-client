import onChange from 'on-change';
import {bindRootEle, travelChildren, utils} from "../../../htmlapp/src/core.js"
import {CondsMap, deepSet, parseStaticTemplate} from "./frm";
import {arrayDiffById} from "./ext";
import {getExprAst, runExpr} from "./jexpr";
import XRegExp from "xregexp";

if (!globalThis.XRegExp) {
    globalThis.XRegExp = XRegExp;
}

function getTemplate(template = '') {
    let cloneteamplate = []
    function  buildsubctx() {
        return {
            children: [],
            value: '',
        }
    }

    let isneedBlock = false;
    let subctx = buildsubctx()
    function deeepGrep(str = '', subctx) {

        let templateArr = XRegExp.matchRecursive(str, '{#[\\w\\d_]+\\s*[^}]*}', '{/[\\w\\d_]+}', 'gi', {
            valueNames: ['between', 'left', 'match', 'right']
        });
        // console.log(templateArr)

        templateArr.forEach((t1, index) => {
            let ctx = buildsubctx();
            if (t1.name === 'match') {
                if (index - 1 >= 0) {
                    ctx.par = [templateArr[index - 1], templateArr[index +1]];
                }
                deeepGrep(t1.value, ctx);
                // console.log(ctx)
            }
            else {
                let v = t1.value;
                if (t1.name === 'right') {
                    if (isneedBlock) {
                        isneedBlock = false
                        v = v + '\n</block>'
                    }
                }
                cloneteamplate.push(v);
            }
            ctx.value = t1.value;
            subctx.children.push(ctx);
        });

        if (templateArr.length < 1) {
            // let v = str;
            if (Array.isArray(subctx.par) && subctx.par.length === 2) {
                cloneteamplate[cloneteamplate.length - 1] = '<block>\n' + cloneteamplate[cloneteamplate.length - 1]
                isneedBlock = true;
            }

            cloneteamplate.push(str)
        }
    }

    deeepGrep(template, subctx);
    console.log(cloneteamplate.join(''), subctx)
    return cloneteamplate.join('')
}

function checkIsArrayPath(path = '', arrayKeys = []) {
    if (arrayKeys.includes(path)) {
        return true;
    }
    // else {
    //     return arrayKeys.some(key => {
    //         let reg = new RegExp(key + "\\.([\\d]+)", "g");
    //         return reg.test(path);
    //     })
    // }
    return false
}


/**
 *
 * @param path
 * @param arrayKeys
 * @returns {null|string}
 */
function getLikeArrayPath(path = '', arrayKeys = []) {
    if (arrayKeys.includes(path)) {
        return path;
    }
    else {
         for (let i = 0; i < arrayKeys.length; i++) {
             let key = arrayKeys[i];
             let reg = new RegExp(key + "\\.([\\d]+)", "g");
             if (reg.test(path)) {
                 // let ret =  [...path.matchAll(reg)];
                 console.log(path)
                 return key
             }
         }
    }
    return null;
}

/**
 *
 * @param path
 * @param arrayKeys
 * @returns {null|{key, index, matches}}
 */
function getLikeArrayPathSet(path = '', arrayKeys = []) {
    if (arrayKeys.includes(path)) {
        return path;
    }
    else {
        for (let i = 0; i < arrayKeys.length; i++) {
            let key = arrayKeys[i];
            let reg = new RegExp(key + "\\.([\\d]+)", "g");
            if (reg.test(path)) {
                // console.log(path)
                let matchedArr = []
                path.replace(reg, function (...args) {

                    matchedArr.push(...args);
                });
                let index = parseInt(matchedArr[1]);
                return {key, index, matches:   matchedArr}
            }
        }
    }
    return null;
}



function replaceArrayPath(path = '', key = '', newval = '') {
    let reg = new RegExp(key + "\\.([\\d]+)", "g");
    return path.replace(reg, newval);
}


/**
 *
 * @param template
 * @param data
 * @param functions
 * @param methods
 * @returns {{init: function, setData: function}}
 */
export function  buildAppCtx({template = '', data = function () { return {} }, mounted, computed = {}, methods = {} } = {}) {
    template = getTemplate(template);

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
                    if (key === 'deepobj_item_index') {
                        console.log(str, ins.getData())
                    }

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
                    if (node.nodeName === 'BLOCK') {
                        // console.log(node.previousSibling);
                        parseValueToTextNode([...node.childNodes]);
                        node.previousSibling.after(...[...node.childNodes]);
                        node.remove()
                    }
                    else {
                        parseValueToTextNode([...node.childNodes]);
                    }
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
        lifeCycles: {
            mounted
        }
    }

    ctx.bindRootEle = {}

    // console.log(ctx.lifeCycles)

    ctx.template = template;

    let renderTpl = function(html = '', tempData  = {}, {functions, debug = false} = {}) {
        let log = debug ? console.log.bind(this) : function() {}

        return parseStaticTemplate(html, tempData, {
            functions,
            log
        })
    }

    let watchedObject;
    let functions = {};
    let frmFuncs = {}

    Object.keys(computed).forEach(key => {
        let funReg = /function(\s*)\(([^)]+)\)/g;
        let fun = computed[key];
        let funStr = fun.toString();

        let mathchAll = funStr.matchAll(funReg);
        let funargs = [...mathchAll];
        let argName= funargs[0][2];
        // console.log(argName)

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
        });

        Object.defineProperty(frmFuncs, key, {
            get() {
                return  computed[key](watchedObject)
            },
            enumerable: true,
            configurable: true,
        })
    });


    ctx.__bindAttrMap = new CondsMap();
    /**
     *
     * @param element {Element}
     * @private
     */
    ctx._onBindRootEle = function (element) {
        // console.dir(Object.keys(element.attributes));

        Object.keys(element.attributes).forEach(key => {
            /**
             * @type {Attr}
             */
            let attr = element.attributes[key];

            // console.log(attr.name)
            let value = attr.nodeValue;
            if (attr.name === "__uid__") {
                element.$ctx = ctx.valueMap.get(value);
                if (!element.$ctx) {
                    element.$ctx = {}
                }
                element.$ctx.hasExp = function (v) {
                    // console.log(element.$ctx.attrmap)
                    let values = Object.values(element.$ctx.attrmap)
                    return values.includes(v)
                }
                element.$ctx.setAttr = function(attrname, value) {
                    if (value === false) {
                        element.removeAttribute(attrname);
                    }
                    else {
                        element.setAttribute(attrname, value);
                    }
                }
                // console.log(ctx.valueMap.get(value), value, ctx.valueMap)
                // element.removeAttribute("__uid__")
            }

            else if (attr.name.startsWith(":")) {
                element.setAttribute(attr.name.slice(1, attr.name.length), value);

                setTimeout(() => {
                    element.removeAttribute(attr.name)
                }, 30)
            }
        })
    }

    ctx.exportCtx = function () {
        let obj = {

        }
        Object.defineProperty(obj, 'data', {
            get: function () {
                return watchedObject
            },
            configurable: true,
            enumerable: true,
        });
        return obj
    }

    /**
     *
     * @param rootEle
     */
    ctx.init = function (rootEle) {

        let coreData = data();
        // console.log(template)
        let ret = renderTpl('<template>'+template+'</template>', coreData, {functions: frmFuncs, debug: false});


        ctx.rootEle = rootEle;
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

                let isLikeArrayPath = getLikeArrayPathSet(path, arrayKeys)

                let map = ctx.eachBlocks;

                if (isLikeArrayPath) {
                    let index = isLikeArrayPath.index;
                    console.log("isLikeArrayPath", ctx, isLikeArrayPath, index)
                    let pathLikeArr = map.get(isLikeArrayPath.key);
                    if (Array.isArray(pathLikeArr)) {
                        pathLikeArr.forEach(likestr => {
                            let eachArrItems = ctx.findNeedRender(isLikeArrayPath.key);
                            let findChangeRoots =eachArrItems[0].getSubItemEles(index)
                            let truepath = replaceArrayPath(path, isLikeArrayPath.key, likestr);
                            let needRenders = ctx.findNeedRender(truepath);
                            console.log(findChangeRoots, truepath, needRenders);

                            ctx.valueMap.forEach((vit, key) => {
                                Object.keys(vit.attrmap).forEach(attrname => {
                                    let attrvalue = vit.attrmap[attrname] + '';
                                    // console.log('attrvalue', attrvalue, truepath)
                                    if  (attrvalue.includes(truepath)) {

                                        travelChildren(findChangeRoots, {
                                            handle(child) {
                                                if (child?.$ctx && child?.$ctx.hasExp(truepath)) {
                                                    // console.log(child)
                                                    // let isCurEvent = ctx.bindRootEle.checkIsCurrentEventTarget(child)
                                                    // console.log('isCurEvent', isCurEvent, child)
                                                    // if (!isCurEvent) {
                                                        child?.$ctx.setAttr(attrname, value);
                                                    // }
                                                }
                                            }
                                        })


                                        // findChangeRoots.forEach(findChangeRootItem => {
                                        //     let element = findChangeRootItem.querySelector(`[__uid__="${key}"]`);
                                        //     // console.log(vit, key, element);
                                        //     if (element) {
                                        //         requestAnimationFrame(() => {
                                        //             if (value === false) {
                                        //                 element.removeAttribute(attrname);
                                        //             }
                                        //             else {
                                        //                 element.setAttribute(attrname, value);
                                        //             }
                                        //         })
                                        //     }
                                        // })

                                    }
                                })
                            })

                            needRenders.forEach(needRender => {
                                ctx.renderNeedRender(needRender, {value, previousValue})
                            });
                        })
                    }
                }
                else {
                    let needRenders = ctx.findNeedRender(path);

                    let computedKeys = ctx.getComputedKeys(functions, path);
                    console.log(computedKeys, path)
                    computedKeys.forEach(function(key) {
                        ctx.findNeedRender(key).forEach(needRender => {
                            needRender?.reload(watchedObject);
                        })
                    });

                    needRenders.forEach(needRender => {
                        ctx.renderNeedRender(needRender, {value, previousValue})
                    });
                }
            }

            requestAnimationFrame(() => {
                ctx.bindRootEle = bindRootEle(rootEle, ctx.insmethods, ctx);
            })
        });

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
        // Object.defineProperty(ctx, "data", {
        //     get() {
        //         return data
        //     }
        // })

        Object.defineProperty(ctx, "eachBlocks", {
            get() {
                return ret.methods.eachBlocks
            }
        })

        Object.defineProperty(ctx, "valueMap", {
            get() {
                return ret.methods.valueMap
            }
        })

        ctx.insmethods = methods;
        let domes = getNewNodes(ret.str);
        rootEle.append(...domes);

        ctx.bindRootEle = bindRootEle(rootEle, ctx.insmethods, ctx);

        window.watchedObject = watchedObject;

        requestAnimationFrame(() => {
            // console.log('sssssssssssssssssssss')
            if(ctx?.lifeCycles?.mounted) {
                ctx.lifeCycles.mounted.bind(ctx)()
            }
        })
    }

    /**
     *
     * @param path
     * @param value {*}
     */
    ctx.setData = function (path = '', value) {
        deepSet(watchedObject, path, value);
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
                            key: v.key,
                            clear() {
                              return {start: startC}
                            },
                            getStart() {
                                return startC
                            },
                            getHostNodes(start = startC, end = endC) {
                                let subNodes = [];

                                let cur = start;
                                while (cur?.nextSibling !== end) {
                                    // console.log(cur)
                                    subNodes.push(cur.nextSibling);
                                    cur = cur.nextSibling;
                                }
                                console.log(subNodes);
                                return subNodes
                            },
                            getHostEles(start = startC, end = endC) {
                               let nodes = this.getHostNodes(start, end);
                               return nodes.filter(v => v instanceof HTMLElement);
                            },
                            getSubItemEles(index) {
                                let subItem = this.getSubItem(index);
                                return this.getHostEles(subItem.start, subItem.end)
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

    ctx.runExpr = runExpr;

    // ctx.getTargetData = function (target, exprstr = '') {
    //     function getClosetComment(target) {
    //         let comment = null;
    //         let cur = target?.previousSibling;
    //         while (cur) {
    //             // console.dir(cur);
    //             if (cur.nodeName === '#comment') {
    //                 comment = cur;
    //                 break;
    //             }
    //             cur = cur.previousSibling;
    //         }
    //         if (comment === null) {
    //             return getClosetComment(target.parentElement);
    //         }
    //         return comment;
    //     }
    //
    //     try {
    //         let comment = getClosetComment(target);
    //         if (comment.nodeValue.includes("start__")) {
    //             let arr = comment.nodeValue.trim().split(':');
    //             // console.log(arr)
    //             let type = arr[0];
    //             let id = arr.at(1);
    //             let key = arr.at(2);
    //             let c = ctx.findById(key, id);
    //             console.log(c)
    //             if (c.getData) {
    //                 return c.getData();
    //             }
    //         }
    //         console.dir(comment);
    //     } catch (e) {
    //         console.log(e)
    //     }
    //     return void 0
    // }

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
                if (functions[key].watches.includes(path)) {
                    computedKeys = computedKeys.concat(functions[key].watches);
                }
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
            let arrKey = needRender?.key ? needRender?.key : "id";
            // if (needRender.key){
            //     console.log("has key", needRender)
            // }

            if (previousValue.length < 1) {
                console.log(needRender)
                let {start} = needRender.clear();
                console.log(start)
                if (start){
                    let nodes = needRender.getDomFromData(value);
                    start.after(...nodes);
                }
            }
            else {
                /**
                 * @type {[]}
                 */
                let arr = value;
                let diffed = arrayDiffById(previousValue, arr, arrKey);
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
                        let preItem = from.getSubItem(index - 1);
                        console.log(index, preItem)
                        if (preItem.end !== null) {
                            let insertEle = preItem.end;
                            let domes = from.getDomFromData([value]);
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
    }
    return {
        init: ctx.init,
        setData: ctx.setData
    }
}