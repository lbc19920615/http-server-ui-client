import "./zbase.js"

let microdiif = (function () {
    const richTypes = { Date: true, RegExp: true, String: true, Number: true };
    return function diff(obj, newObj, options = { cyclesFix: true }, _stack = []) {
        let diffs = [];
        const isObjArray = Array.isArray(obj);
        for (const key in obj) {
            const objKey = obj[key];
            const path = isObjArray ? +key : key;
            if (!(key in newObj)) {
                diffs.push({
                    type: "REMOVE",
                    path: [path],
                    oldValue: obj[key],
                });
                continue;
            }
            const newObjKey = newObj[key];
            const areCompatibleObjects = typeof objKey === "object" &&
                typeof newObjKey === "object" &&
                Array.isArray(objKey) === Array.isArray(newObjKey);
            if (objKey &&
                newObjKey &&
                areCompatibleObjects &&
                !richTypes[Object.getPrototypeOf(objKey)?.constructor?.name] &&
                (!options.cyclesFix || !_stack.includes(objKey))) {
                const nestedDiffs = diff(objKey, newObjKey, options, options.cyclesFix ? _stack.concat([objKey]) : []);
                diffs.push.apply(diffs, nestedDiffs.map((difference) => {
                    difference.path.unshift(path);
                    return difference;
                }));
            }
            else if (objKey !== newObjKey &&
                // treat NaN values as equivalent
                !(Number.isNaN(objKey) && Number.isNaN(newObjKey)) &&
                !(areCompatibleObjects &&
                    (isNaN(objKey)
                        ? objKey + "" === newObjKey + ""
                        : +objKey === +newObjKey))) {
                diffs.push({
                    path: [path],
                    type: "CHANGE",
                    value: newObjKey,
                    oldValue: objKey,
                });
            }
        }
        const isNewObjArray = Array.isArray(newObj);
        for (const key in newObj) {
            if (!(key in obj)) {
                diffs.push({
                    type: "CREATE",
                    path: [isNewObjArray ? +key : key],
                    value: newObj[key],
                });
            }
        }
        return diffs;
    }
})();

/**
 * 
 * @param { Element | Window | Document | EventTarget} target 
 * @param {string} eventType 
 * @param {EventListenerOrEventListenerObject | CustomEventListener} listener 
 * @param {boolean | AddEventListenerOptions} options 
 * @returns {{off:() => {}}}
 */
function on(
    target,
    eventType,
    listener,
    options
) {
    target.addEventListener(eventType, listener, options);

    return {
        off() {
            target.removeEventListener(eventType, listener, options);
        }
    };
}

let dom = {}
dom.on = on;

const obj1 = [1, 2];
const obj2 = [1];

// console.log(microdiif(obj1, obj2));

export let objectutils = (function () {
    function parser(path = '', prefix = '') {
        let pathArr = [];
        let lastName = '';
        let lastArr = '';
        path.split('').forEach(char => {
            if (char === '.') {
                pathArr.push([prefix + 'obj', lastName]);
                lastName = ''
            }
            else if (char === ' ') {

            }
            else if (char === '[') {
                // pathArr.push([prefix + 'obj', lastName]);
                pathArr.push([prefix + 'arr', { name: lastName, index: -1 }]);
                lastName = ''
                lastArr = ''
            }
            else if (char === ']') {
                pathArr.at(-1)[1].index = parseFloat(lastArr)
                lastArr = ''
                lastName = ''
            }
            else {
                lastName = lastName + char;
                lastArr = lastArr + char
            }
        });
        if (prefix === 'get') {
            if (lastName) {
                pathArr.push([prefix + 'obj', lastName]);
                lastName = ''
                // console.log('lastName', lastName)
            }
        }
        if (prefix === 'set') {
            if (lastName) {
                pathArr.push([prefix + 'prop', lastName]);
                lastName = ''
            }
        }
        return pathArr
    }

    let utils = {}
    utils.setobj = function (obj, key) {
        if (obj[key]) {
            return obj[key]
        }
        obj[key] = {};
        return obj[key]
    }
    utils.setarr = function (obj, def = { name: '', index: -1 }) {
        if (obj[def.name]) {
            return obj[def.name]
        }
        obj[def.name] = [];
        return obj[def.name]
    }
    utils.getobj = function (obj, path) {
        return obj[path]
    }
    utils.getarr = function (obj, def) {
        return obj[def.name]
    }

    utils.setprop = function (obj, def) {
        return obj
    }


    let runTasks = function (proxy, tasks = []) {

        let currentObj = proxy;

        // console.log(tasks)

        tasks.forEach(task => {
            let [taskFun, params] = task;
            if (utils[taskFun]) {
                // console.log(utils[taskFun])
                currentObj = utils[taskFun].apply(null, [currentObj, params])
            }
        });

        function lastSet() {
            let lasttask = tasks.at(-1)
            if (lasttask[0] === 'setarr') {
                // console.log(currentObj, lasttask[1])
                return currentObj
                // currentObj[lasttask[1]] = v
            }
            else {
                return currentObj
            }
        }

        function setVal(v) {

            let lasttask = tasks.at(-1)
            if (lasttask[0] === 'setarr') {
                // console.log(currentObj, lasttask[1])
                currentObj[lasttask[1].index] = v
                // currentObj[lasttask[1]] = v
            }
            else {
                currentObj[lasttask[1]] = v
            }

        }

        function getVal() {
            let lasttask = tasks.at(-1);
            // console.log(lasttask, currentObj)

            if (lasttask[0] === 'getarr') {
                return currentObj[lasttask[1].index]
            }
            else {
                // console.log(tasks)
                return currentObj
            }
        }



        return {
            lastSet,
            setVal,
            getVal
        }
    }

    function setObjByPath(obj = {}, path = '', val) {
        let tasks = parser(path, 'set')
        // console.log(tasks);
        let ret = runTasks(obj, tasks);
        // currentObj = val
        ret.setVal(val);
    }

    function getObjByPath(obj = {}, path = '') {
        let tasks = parser(path, 'get')
        // console.log(tasks);
        let ret = runTasks(obj, tasks);
        return ret.getVal();
    }

    function getArr(obj, path) {
        let tasks = parser(path, 'get')
        let ret = runTasks(obj, tasks);
        let lastobj = ret.lastSet();
        if (Array.isArray(lastobj)) {
            return {
                push(v) {
                    lastobj.push(v)
                },
                delByIndex(index = -1) {
                    if (index > -1) {
                        lastobj.splice(index, 1)
                    }
                },
                delBy(findFun) {
                    let findedIndex = -1;
                    if (findFun) {
                        findedIndex = lastobj.findIndex(findFun)
                    }
                    if (findedIndex > -1) {
                        lastobj.splice(findedIndex, 1)
                    }
                },
                setByIndex(index, v) {
                    lastobj[index] = v
                },
                searchBy(findFun) {
                    let findedIndex = -1;
                    if (findFun) {
                        findedIndex = lastobj.findIndex(findFun)
                    }
                    if (findedIndex > -1) {
                        return lastobj[findedIndex]
                    }
                    return undefined
                }
            }
        }
        return null
    }

    return {
        getArr,
        setObjByPath,
        getObjByPath
    }
})();


function createState(baseData = {}, { onchange } = {}) {
    let state = baseData;
    let cachedArr = {};

    /**
     * 
     * @param {string} path 
     * @param {*} v 
     */
    function $set(path, v) {
        let cacheVal = objectutils.getObjByPath(state, path);
        let oldVal = cacheVal;
        if (Array.isArray(cacheVal)) {
            oldVal = structuredClone(cacheVal)
        }
        if (Array.isArray(v)) {
            cachedArr[path] = v
        }
        let newval = v;
        if (typeof v === 'function') {
            newval = v(cacheVal)
        }
        else {
        }
        objectutils.setObjByPath(state, path, newval);

        if (onchange) {
            onchange(structuredClone(state), path, oldVal)
        }
    }

    // $set('good.some', 1);

    function $get(path) {
        return objectutils.getObjByPath(state, path)
    }

    return {
        get raw() {
            return state
        },
        $set,
        $get,
    }
}


var findComments = function (el) {
    var arr = [];
    for (var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if (node.nodeType === 8) {
            arr.push(node);
        } else {
            arr.push.apply(arr, findComments(node));
        }
    }
    return arr;
};

let globalEachContext = {}

function createUUID() {
    return window.crypto.randomUUID().replaceAll('-', '_')
}

const _defaultObj = {
    innerHTML: '',
    classList: []
}

let tplReg = /#\{([\w\d\(\)_\-+*/,'"]+)\}/g

function checkInPaths(arr = [], findFun) {
    return arr.some((v, index) => {
        return findFun(v, index)
    })
}

function getValsFromStr(str = '') {
    var ret = [];
    if (typeof str === 'string') {
        str.replace(tplReg, function (match, p1) {
            ret.push(p1)
            return match
        });
    }
    else {
        console.error('str is error', str)
    }

    return ret
}

/**
 * 
 * @param {*} tag 
 * @param {*} props 
 * @param {*} plain
 * @returns {HTMLElement}
 */
function createEle(tag = 'div', props = {},  plain = false) {
    let ele = null;
    if (tag === '#') {
        ele = document.createDocumentFragment()
    }
    else if (tag === '!') {
        ele = document.createComment(props?.uuid ?? '')
    }
    else {
        ele = document.createElement(tag);
    }
    if (props) {


        Object.entries(props).forEach(([key, value]) => {
            if (key === 'classList') {
                value.forEach(v => {
                    ele.classList.add(v)
                })
            }
            else {
                ele[key] = value ?? _defaultObj[key]
            }
        });

        if (!plain) {
            if (props.template || props.$watches || props.templates) {
                let vals = [];
                if (props.$watches) {
                    vals = structuredClone(props.$watches)
                }
                if (props.template) {
                    if (typeof props.template !== 'function') {
                        vals = getValsFromStr(props.template)
                    }
    
                }
                if (props.templates) {
                    props.templates.forEach(tpl => {
                        vals = vals.concat(getValsFromStr(tpl))
                    })
                }
    
                function templateHtml(newState) {
                    if (props.template) {
                        if (typeof props.template == 'function') {
                            ele.innerHTML = props.template()
                        }
                        else {
                            ele.innerHTML = props.template.replace(tplReg, function (match, p1) {
                                return objectutils.getObjByPath(newState, p1)
                            });
                        }
                    }
                }
    
                ele.$$tpl = function (newState) {
                    // console.log('$$tpl')
                    templateHtml(newState)
                }
    
                // console.log('need update', ele, vals)
                // console.log(vals)
                ele.$$update = function (newState, { paths = [], oldval, initInit = false } = {}) {
                    // console.log(newState, paths)
    
                    let hasPath = checkInPaths(paths, (v = '') => {
                        return vals.some(val => {
                            return v.startsWith(val)
                        })
                    })
                    if (initInit || hasPath) {
    
                        // console.log('sss', props)
                        if (props.handleupdate) {
                            // console.log(ele)
                            props.handleupdate.bind(ele)(newState, { paths, oldval })
                        }
                        else {
                            templateHtml(newState)
                        }
                        return true
                    }
                    else {
                        // console.log('not need update', ele, vals,paths)
                    }
                    return false;
                }
            }
        }

    }
    return ele
}

function createCompsBuild(createView, createRender, {utils} = {}) {
    return function () {
        let view1 = createView(function (props) {
            let div = createEle('div', props);
            return div
        });

        function View(tpl = '', props = {}, callback = function() {}) {
            let opt ={
                template: tpl,
            }
            if (typeof props === 'function') {
                callback = props
            } else {
                opt = {
                    ...opt,
                    ...props
                }
            }
            view1(opt, callback);
        }

        let Comment = createView(function (props) {
            let div = document.createComment(props.text)
            return div
        });

        /**
         * 
         * @param {HTMLElement} dom 
         * @param {*} parentselectorname 
         */
        function findLevelLast(dom, parentselectorname = '') {
            let parentElement = dom.parentElement;
            // console.dir(dom)
            let curret = dom;
            if (parentElement) {
                [...parentElement.children].forEach(v => {
                    if (v.parentselectorname === parentselectorname) {
                        curret = v
                    }
                });
            }
            return curret
        }

        let needselpolyfill = true;
        let Sel = createView(function (props = []) {
            let div = document.createElement('div');
            div.selectorname = props[0];
            div.selectortext = props[0]
            div.csspropmap = {}
            if (props[1]) {
                Object.entries(props[1]).forEach(([k, v]) => {
                    div.csspropmap[k] = v
                })
            }
            // console.dir(div.csspropmap)
            return div;
        }, {
            /**
             * 
             * @param {HTMLElement} parent 
             * @param {HTMLElement} ret 
             */
            customAppend(parent, ret) {
                // console.log(parent, ret)
                let atrules = ['@media', '@container', '@supports']
                /**
                 * @type {string}
                 */
                let parentselectorname = parent?.selectorname ?? '';
                let isneedlevel = needselpolyfill && parentselectorname != '' && !atrules.some(v => parentselectorname.includes(v))
                // console.log(parentselectorname)
                if (isneedlevel) {
                    let innerHTML = ret.innerHTML
                    if (ret.selectorname.includes('&')) {
                        innerHTML = ret.selectorname.replace('&', parentselectorname);
                    }
                    else {
                        innerHTML = `${parentselectorname} ${ret.selectorname}`
                    }
                    ret.selectortext = innerHTML
                    // console.log(parent)
                    try {
                        ret.parentselectorname = parentselectorname
                        let dom = findLevelLast(parent, parentselectorname);
                        //    console.log(dom)
                        dom?.after(ret)
                    } catch (e) {
                        console.log(e)
                    }
                }
                else {
                    parent.appendChild(ret)
                }
            }
        });

        function strsel(strings) {
            if (Array.isArray(strings)) {
                return function(def = {}, callback) {
                    Sel([strings[0], def], function() {
                        if (callback) {
                            callback()
                        }
                    })
                }
            }
        }

        let stylesheet = createView(function (props) {
            let div = createEle('div');
            div.classList.add('stylesheet');

            if (props.mode === 'simple') {
                props = {
                    ...props,
                    ...utils.createstylesheethandle()
                }
            }


            /**
             * 
             * @param {HTMLElement} p 
             * @param {{css: string}} ret 
             */
            function travelCss(p, ret) {
                if (p.children) {
                    [...p.children].forEach(v => {
                        // console.log(v)
                        let childCtx = {
                            css: ''
                        }
                        travelCss(v, childCtx);
                        let propstr = '';
                        Object.entries(v.csspropmap).forEach(([k, v]) => {
                            let defstr = `${k}: ${v};
                            `
                            if (props.handleProp) {
                                defstr = props.handleProp(k, v, defstr)
                            }
                            propstr = propstr + defstr;
                        })
                        ret.css = ret.css + `
        ${v.selectortext} {
        ${propstr}
        ${childCtx.css}
        }
        `;

                    })
                }
            }


            div.getCss = function () {
                let ret = {
                    css: ''
                }

                travelCss(div, ret);
                return ret.css
            }
            return div
        })

        function _renderArr(arr = [], props = {}, option) {
            Object.entries(arr).forEach(([index, item]) => {
                if (props.create) {
                    props.create(item, index, option);
                }
            })
        }


        let each = createView(function (props) {

            let fragment = createEle('#', {
                ...props,
            });
            fragment.uuid = createUUID();
            return fragment
        }, {
            renderArr(props, parent) {
                // console.log(parent)
                if (props.arr) {
                    _renderArr(props.arr, props,
                        {
                            parent
                        }
                    )
                }
            },
            renderOption: {
                /**
                 * 
                 * @param {HTMLElement} child 
                 * @param {*} option 
                 */
                onChildMount(child, option) {
                    // console.log('child', child, option)
                    // let paroption = option?.paroption ?? {};
                    let needSetLoopAttribute = option.parent && option.parent instanceof DocumentFragment
                    if (needSetLoopAttribute) {
                        if (child.setAttribute) {
                            child.setAttribute('__loop_uuid', option.parent.uuid)
                        }
                    }
              
                    if (child.$$tpl) {
                        child.$$tpl()
                    }
                }
            }
        });


        let Lazyeach = createView(function (props) {
            let fragment = document.createElement('div');
            // fragment.currentIndex = 0;
            fragment.uuid = createUUID();

            fragment.appendNext = function (arr) {
                // fragment.currentIndex =  fragment.currentIndex + 1;
                // console.log(props)
                createRender(fragment, function () {
                    _renderArr(arr, props)
                })
            }

            return fragment
        }, {
            renderArr(props) {
                if (props.arr) {
                    _renderArr(props.arr, props)
                }
            }
        });

        function tplIsRetTrue(tpl = '') {
            let str = tpl;
            str = str.replace(tplReg, function (match, p1) {
                return 'state.' + p1
            });
            // console.log(str)
            let fun = new Function('state', `return Boolean(${str})`)
            return fun
        }

        let choose = createView(function (props = {}) {
            let uuid = createUUID();
            let templates = [];
            let qingkuang = [];
            var cases = props?.cases
            if (!Array.isArray(props?.cases)) {
                cases = Object.entries(cases)
            }
            cases.forEach(v => {
                // console.log(v)
                templates.push(v[0]);
                qingkuang.push(v[1])
            });
            // console.log(templates)
            let fragment = createEle('!', {
                uuid: 'start__' + uuid,
                templates,
                handleupdate: function (newState, { oldval, paths } = {}) {
                    // console.dir(this)

                    let uuid = this.uuid;
                    let enduuid = this.uuid.replace('start__', 'end__')
                    let nodes = [];
                    let cur = this;
                    let parent = cur.parentNode;
                    let startCheck = false;
                    parent.childNodes.forEach((node, index) => {
                        if (node.uuid === enduuid) {
                            startCheck = false
                        }
                        if (startCheck) {
                            nodes.push(node)
                        }
                        if (node.uuid === uuid) {
                            startCheck = true
                        }

                    })

                    // console.log(nodes)
                    function removeNodes() {
                        nodes.forEach(node => {
                            node.remove()
                        })
                    }

                    if (!props.notAutoRemove) {
                        removeNodes()
                    }

                    // this.nextElementSibling?.remove()

                    createRender(fragment, function () {
                        templates.some((valuetpl, index) => {
                            let calcfun = tplIsRetTrue(valuetpl);
                            // console.log(props.state, calcfun(props.state))
                            if (calcfun(newState)) {
                                qingkuang[index](newState, oldval, { removeNodes, paths, nodes })
                                return true
                            }
                            return false
                        })
                    })
                }
            });

            // console.dir(fragment)
            return fragment
        }, {
            afterRender() {

                let fragment1 = createEle('!', {
                    uuid: this.uuid.replace('start__', 'end__'),
                });

                this.after(fragment1)

            }
        });

        let dynEach = function (props = {}) {
            choose({

                notAutoRemove: true,
                cases: {
                    [`[#{${props.valpath}}]`]: function (newState, oldval, { removeNodes, paths, nodes } = {}) {
                        // console.log(paths)

                        let newArr = objectutils.getObjByPath(newState, props.valpath)
                        if (Array.isArray(oldval)) {
                            let diff = microdiif(oldval, newArr);
                            if (diff.some(v => v.type === 'CREATE' || v.type === 'REMOVE')) {
                                removeNodes();
                                // console.log('ssssssssssssssssssssssss', newArr)
                                each({
                                    arr: newArr,
                                    create: props.create
                                })
                            }
                            else {
                                // console.log(diff)

                                let arrNodes = nodes.slice(1, nodes.length - 1)
                                // console.log(arrNodes, diff)
                                diff.forEach((item) => {
                                    let indexes = item.path;
                                    // console.log('ddddddddddddddd')
                                    indexes.forEach(index => {
                                        if (arrNodes[index]) {
                                            let n = arrNodes[index];
                                            //    console.dir(n)
                                            if (n?.$$update) {
                                                n.$$update(newState,
                                                    {
                                                        paths: [props.valpath], oldval, initInit: true,
                                                    }
                                                )
                                            }
                                        }
                                    })

                                })
                            }
                        }
                        else {
                            removeNodes()
                            each({
                                arr: newArr,
                                create: props.create
                            })
                        }
                    }
                }
            })
        }

        let link1 = createView(function (props) {
            let div = createEle('a', props);
            return div
        });
    
        let Link = function(tpl, href = '', {target = ''} = {}) {
            link1({
                
                template: tpl,
                href,
                target
            })
        }
    

        let Dialog1 = createView(function (props = {}) {
            let div = createEle('div', {
              classList:[...props.classList]
            });

            let dialog = createEle('dialog')
            dialog.addEventListener("close", (e) => {
                // console.log(dialog.returnValue)
                dialog.innerHTML = ''
                if (props?.onclose) {
                    props.onclose(dialog)
                }
                if (div?.onclose) {
                    div.onclose(dialog)
                }
            });



            div.innerHTML = /*html*/`
                ${props?.innerHTML ?? ''}
                `;

            div.append(dialog);

            let lasttarget = null;

            div.mount = function(target) {
               return new Promise(resolve => {
                    if (lasttarget && lasttarget.querySelector('dialog').contains(target)) {
                     return
                    }   
                    if (dialog.open) {
                       div.close()
                   }

                   if (lasttarget !== target) {
                       
                       lasttarget = target
                       target.append(div);
                       setTimeout(() => {
                           div.toggle();
                           resolve(dialog)
                       }, 90)
                   } else {
                   lasttarget = null
                   }

               })
            }

            div.close = function() {
              dialog.close()
            }

            div.toggle = function() {
                if (!dialog.open) {
                    dialog.innerHTML = `
                    <div dialog_content>${props?.dialogHtml ? props.dialogHtml() : ''}</div>
                    <form dialog_form method="dialog">

                        <button value="subok">ok</button>
                        <button value="subno">no</button>
                    </form>
                `
                    dialog.show();
                    setTimeout(() => {
                        if (props?.onshow) {
                            props.onshow(dialog)
                        }
                    })
                }
                else {
                  dialog.close()
                }

            }

            function keydown  (e) {
                if(e.key === "Escape") {
                    // write your logic here.
                    if (dialog.open) {
                        dialog.close()
                    }
                }
            }

            dom.on(document, 'keydown', keydown);


            return div;
        });


        return { view1, View, each, Comment, Lazyeach, dynEach, choose, Dialog1, Link, Sel, strsel, stylesheet }
    }
}

class BaseEle extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._internals = this.attachInternals();
    }
    _addState(name) {
        try {
            this._internals.states.add(name);
        } catch {
            this._internals.states.add("--" + name);
        }
    }
    _delState(name) {
        try {
            this._internals.states.delete(name);
        } catch {
            this._internals.states.delete("--" + name);
        }
    }
    disconnectedCallback() {
        console.log('disconnected from the DOM');
        console.dir(this)
        if (this.lifetimeCallback) {
            this.lifetimeCallback('unMounted')
        }
    }
    connectedCallback() {
        // console.log('onnected from the DOM');
        if (this.lifetimeCallback) {
            this.lifetimeCallback('mounted')
        }
    }
}
customElements.define('base-ele', BaseEle)


export function createInstance() {
    let globalcurrentContext = null;

    let ret = {}


    let mounttasks = [];
    let umountTasks = [];

    /**
     * 
     * @param {Function} fun 
     */
    function onMount(fun) {
        mounttasks.push(
            function () {
                queueMicrotask(fun)
            }
        )
    }

    /**
     * 
     * @param {Function} fun 
     */
    function onUnMount(fun) {
        umountTasks.push(
            function () {
                queueMicrotask(fun)
            }
        )
    }

    function runAllunmountTasks() {
        // Promise.all(umountTasks).then(() => {
        //     umountTasks = [];
        // })
        umountTasks.forEach(umountTask => {
            umountTask()
        })
    }

    function runAllmountTasks() {
        // console.log(mounttasks)
        // Promise.all(mounttasks).then(() => {
        //     mounttasks = [];
        // })
        mounttasks.forEach(mounttask => {
            mounttask()
        })
    }

    function createCss(def = {}, { } = {}) {
       return new Promise(resolve => {
         /**
         * @type {HTMLElement}
         */
         let element = document.createElement('div');

         var context = {
             element
         }
 
         function updateRender(option, { initInit = false, lastpath, oldval } = {}) {
             if (def.render) {
                 // console.dir(element._shadowRoot)
                 createRender(element, function () {
                     def.render(option, context)
                 }, {
 
                 })
             }
         }
 
         updateRender({});
 
         queueMicrotask(() => {
             // console.log('end', element)
             let cssArr = [];
             let styles = [];
             if (element.children.length > 0) {
                 [...element.children].forEach(v => {
 
                     let css = v.getCss();
 
                     // Create an empty "constructed" stylesheet
                     const sheet = new CSSStyleSheet();
                     // Apply a rule to the sheet
                     sheet.replaceSync(css);
                     cssArr.push(css);
                     styles.push(sheet);
 
                 })
             }
             if (def.end) {
                 def.end(styles, cssArr)
             }

             resolve({styles, cssArr})
         });
       })

    }


    /**
     * 
     * @param {Node} node 
     * @returns 
     */
    function findShadowRoot(node) {
         if (!node.parentNode) {
            return null
         }
         else {
            let parent = node.parentNode;

            if (parent.__refs) {
                console.dir(parent)
                return parent
            }
    
            return findShadowRoot(parent)
         }
    }

    function createComp(def = {}, { tagName = 'base-ele', stateFun = createState } = {}) {

        /**
         * @type {HTMLElement}
         */
        let element = document.createElement(tagName);

        element.lifetimeCallback = function (type) {
            console.log('lifetimeCallback', type, element)
            if (type === 'mounted') {
                runAllmountTasks()
            }
            if (type === 'unMounted') {
                runAllunmountTasks()
            }
        }

        element.shadowRoot.__refs = {};
        element.shadowRoot.$setRef = function(name, v) {
             element.shadowRoot.__refs[name] = v
        }

        element.shadowRoot.$getRef = function(name) {
            return  element.shadowRoot.__refs[name] 
        }

        var context = {
            element
        }


        function querySelector(...args) {
            return element._shadowRoot.querySelector(...args)
        }

        function travelDom(elements = [], option) {
            if (elements?.length > 0) {
                [...elements].forEach(

                    item => {
                        /**
                         * @type {HTMLElement}
                         */
                        let ele = item;
                        let hasChange = false;

                        if (ele.hasAttribute) {
                            if (ele.hasAttribute('__loop_uuid')) {
                                // console.dir(ele)
                                hasChange = true
                            } else {
                                if (ele.$$update) {
                                    hasChange = ele.$$update(state.raw, option);
                                }
                            }
                        } else {
                            if (ele.$$update) {
                                hasChange = ele.$$update(state.raw, option);
                            }
                        }


                        if (!hasChange) {
                            travelDom(ele.childNodes, option)
                        }

                    })
            }
        }

        function updateRender(option, { initInit = false, lastpath, oldval } = {}) {
            if (def.render) {
                // console.dir(element._shadowRoot)
                if (initInit) {
                    element._shadowRoot.innerHTML = ''
                    createRender(element._shadowRoot, function () {
                        def.render(option, context)
                    }, {
                        onChildMount(child) {
                            // console.log('child', child)
                            if (child.$$update) {
                                child.$$update(state.raw, { paths: [lastpath], oldval, initInit })
                            }
                        },
                        curelement: element
                    })
                }
                else {
                    travelDom(element._shadowRoot.childNodes, { paths: [lastpath], oldval })
                }
            }
        }

        let defData = {}

        if (def.setup) {
            let ret = def.setup({ onMount, onUnMount, querySelector, });
            Object.entries(ret).forEach(([key, value]) => {
                if (typeof value === 'function') {
                    context[key] = value.bind(element)
                }
                else {
                    defData[key] = value
                }
            })
        }

        const state = stateFun(defData, {
            onchange(option, lastpath, oldval) {
                console.log('change state', option, lastpath, oldval)
                updateRender(option, { lastpath, oldval })
            }
        });
        context.$set = state.$set;
        context.$set = state.$set;
        context.$getRef = function(name) {
            return element.shadowRoot.$getRef(name)
        }

        function buildSheet(css) {
            const sheet = new CSSStyleSheet();
            // Apply a rule to the sheet
            sheet.replaceSync(css);
            return sheet
        }

        function appendStyle(css = '') {
            const sheet = buildSheet(css)
            // Apply the stylesheet to a document
            element.shadowRoot.adoptedStyleSheets = [...element.shadowRoot.adoptedStyleSheets, sheet];
            return sheet
        }

        if (Array.isArray(def.styles)) {
            let sheets = def.styles.map(s => {
                return buildSheet(s)
            });
            element.shadowRoot.adoptedStyleSheets = sheets
        }

        let ret = {
            element,
            appendStyle,
            ...context,
            mount(parent) {
                updateRender(state.raw, { initInit: true })
                parent.appendChild(element)
            }
        }

        return ret
    }


    function createRender(parent, callback, options = {}) {
        let runtasks = []

        let context = {
            runtasks
        }
        globalcurrentContext = {
            context: context,
            dom: parent,
            uuid: createUUID(),
        }

        if (callback) {
            callback.bind(context)()
        }

        context.runtasks.forEach(runtask => {
            let [eleFun, callback] = runtask
            let child = eleFun(parent);
            if (options.onChildMount) {
                options.onChildMount(child, {parent})
            }

      
            createRender(child, callback, options)
        });

        context.runtasks = []

    }




    let comment = createView(function (props) {
        let div = document.createComment(props.text)
        return div
    })


    /**
     * 
     * @param {() => HTMLElement | DocumentFragment} renderFun 
     * @param {*} param1 
     * @returns 
     */
    function createView(renderFun, {cusparent, renderArr, afterRender, renderOption, customAppend } = {}) {

        return function (...args) {

            let parent = cusparent ?? globalcurrentContext.dom;
            let currentContext = globalcurrentContext.context;
            // console.log(globalcurrentContext)
            if (parent.uuid) {
                globalEachContext[parent.uuid] = currentContext
            }
            let callback = args.at(-1)
            let props = {}
            if (args.length > 0) {
                props = args[0];
            }
            if (typeof callback !== 'function') {
                callback = null
            }
            // console.log(args.length, callback)
            currentContext.runtasks.push(
                [
                    /**
                     * 
                     * @param {HTMLElement} parent 
                     */
                    function (parent) {
                        let ret = renderFun(props);
                        if (renderArr) {
                            let uuid = ret.uuid
                            createRender(ret, function () {
                                // console.log(parent, ret)
                                comment({
                                    text: 'loop__start' + uuid
                                })
                                renderArr(props, ret);
                                comment({
                                    text: 'loop__end' + uuid
                                })
                            }, {
                                onChildMount(child, option) {
                                    let trueparent = ret;
                                    if (option.parent) {
                                        trueparent = option.parent
                                    }
                                    // console.log('child', child, option, trueparent)
                                    if (renderOption.onChildMount) {
                                        renderOption.onChildMount(child, { parent:  trueparent, props, paroption: option })
                                    }
                                }
                            })
                        }

                        if (customAppend) {
                            customAppend(parent, ret)
                        }
                        else {
                            // console.dir(parent)
                            if (parent instanceof Comment) {
                                parent.after(ret);
                            }
                            else {
                                parent.appendChild(ret)
                 
                            }
                        }

                        if (afterRender) {
                            afterRender.bind(ret)()
                        }


                        if (props.$refname) {
                            // globalThis[props.$refname] = ret
                        
                            let hostShadowRoot = findShadowRoot(ret);
                            if (hostShadowRoot && hostShadowRoot.$setRef) {
                                hostShadowRoot.$setRef(props.$refname, ret)
                            }

                        }



                        return ret;
                    },
                    callback
                ]
            );
            // console.log(parent)

            return
        }
    }

    ret.utils = {};
    ret.utils.createstylesheethandle = function() {
        let shortcuts = [
            [
                "a",
                "animation"
            ],
            [
                "bgc",
                "background-color"
            ],
            [
                "c",
                "color"
            ],
            [
                "bg",
                "background"
            ],
            [
                "bgi",
                "background-image"
            ],
            [
                "b",
                "border"
            ],
            [
                "br",
                "border-right"
            ],
            [
                "bl",
                "border-left"
            ],
            [
                "bt",
                "border-top"
            ],
            [
                "bb",
                "border-bottom"
            ],
            [
                "bc",
                "border-color"
            ],
            [
                "brc",
                "border-right-color"
            ],
            [
                "blc",
                "border-left-color"
            ],
            [
                "btc",
                "border-top-color"
            ],
            [
                "bbc",
                "border-bottom-color"
            ],
            [
                "bs",
                "border-style"
            ],
            [
                "brs",
                "border-right-style"
            ],
            [
                "bls",
                "border-left-style"
            ],
            [
                "bts",
                "border-top-style"
            ],
            [
                "bbs",
                "border-bottom-style"
            ],
            [
                "bw",
                "border-width"
            ],
            [
                "brw",
                "border-right-width"
            ],
            [
                "blw",
                "border-left-width"
            ],
            [
                "btw",
                "border-top-width"
            ],
            [
                "bbw",
                "border-bottom-width"
            ],
            [
                "radius",
                "border-radius"
            ],
            [
                "o",
                "outline"
            ],
            [
                "oc",
                "outline-color"
            ],
            [
                "os",
                "outline-style"
            ],
            [
                "ow",
                "outline-width"
            ],
            [
                "maxw",
                "max-width"
            ],
            [
                "minw",
                "min-width"
            ],
            [
                "h",
                "height"
            ],
            [
                "w",
                "width"
            ],
            [
                "maxh",
                "max-height"
            ],
            [
                "minh",
                "min-height"
            ],
            [
                "of",
                "overflow"
            ],
            [
                "ofx",
                "overflow-x"
            ],
            [
                "ofy",
                "overflow-y"
            ],
            [
                "scrollb",
                "scroll-behavior"
            ],
            [
                "p",
                "padding"
            ],
            [
                "m",
                "margin"
            ],
            [
                "pr",
                "padding-right"
            ],
            [
                "pl",
                "padding-left"
            ],
            [
                "pt",
                "padding-top"
            ],
            [
                "pb",
                "padding-bottom"
            ],
            [
                "mr",
                "margin-right"
            ],
            [
                "ml",
                "margin-left"
            ],
            [
                "mt",
                "margin-top"
            ],
            [
                "mb",
                "margin-bottom"
            ],
            [
                "d",
                "display"
            ],
            [
                "flexw",
                "flex-wrap"
            ],
            [
                "flexg",
                "flex-grow"
            ],
            [
                "flexdir",
                "flex-direction"
            ],
            [
                "ai",
                "align-items"
            ],
            [
                "ac",
                "align-content"
            ],
            [
                "jc",
                "justify-content"
            ],
            [
                "gcols",
                "grid-template-columns"
            ],
            [
                "grows",
                "grid-template-rows"
            ],
            [
                "gacols",
                "grid-auto-columns"
            ],
            [
                "garows",
                "grid-auto-rows"
            ],
            [
                "areas",
                "grid-template-areas"
            ],
            [
                "area",
                "grid-area"
            ],
            [
                "dir",
                "direction"
            ],
            [
                "textt",
                "text-transform"
            ],
            [
                "ta",
                "text-align"
            ],
            [
                "td",
                "text-decoration"
            ],
            [
                "ws",
                "white-space"
            ],
            [
                "ww",
                "word-wrap"
            ],
            [
                "ff",
                "font-family"
            ],
            [
                "to",
                "text-overflow"
            ],
            [
                "ls",
                "letter-spacing"
            ],
            [
                "lh",
                "line-height"
            ],
            [
                "wb",
                "word-break"
            ],
            [
                "fv",
                "font-variant"
            ],
            [
                "fs",
                "font-size"
            ],
            [
                "fw",
                "font-weight"
            ],
            [
                "fstyle",
                "font-style"
            ],
            [
                "f",
                "font"
            ],
            [
                "pos",
                "position"
            ],
            [
                "z",
                "z-index"
            ],
            [
                "tr",
                "transform"
            ],
            [
                "cur",
                "cursor"
            ]
        ];
        let shourcutmap = Object.fromEntries(shortcuts);
        let simpecsshandle = {
            handleProp(k = '', v, defStr) {
                let key = k.trim();
                let val = v;
       
                if (val && val.replace) {
                    // console.log(val)
                    val = val.replace(/\$([\w_]+)\(([^)]*)\)/g, function(match, p1, p2) {
                        return `var(--${p1}, ${p2})`
                    });

                    val = val.replace(/\$([\w_]+)/g, function(match, p1) {
                        return `var(--${p1})`
                    });
                    // console.log(val)
                }

                if (k?.startsWith('$')) {
                    key = '--' + k.slice(1);
                }

       
                if (shourcutmap[key]) {
                    // console.log(key)
                    key = shourcutmap[key];
                    // console.log(key)
                }
                
                return  `${key}: ${val};
                `;
            }
        }

        return simpecsshandle
    }

    ret.findShadowRoot = findShadowRoot;
    ret.createEle = createEle;

    ret.createComp = function (...args) {
        return createComp(...args)
    }

    ret.createCss = createCss

    ret.getcurrentcontext = function () {
        return globalcurrentContext
    }
    /**
     * 
     * @param {Function} def 
     * @returns 
     */
    ret.defView = function (def, option) {
        return createView(def, option)
    }
    ret.dom = {
        ...dom,
        findComments
    }
    ret.createRender = createRender;
    ret.useViews = createCompsBuild(createView, createRender, ret);


    return ret;
}

