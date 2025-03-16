import {getExprAst, runExpr} from "./jexpr.js"

import parse from 'html-dom-parser';

function createUUID () {
    if (!('randomUUID' in crypto)) {
        // https://stackoverflow.com/a/2117523/2800218
        // LICENSE: https://creativecommons.org/licenses/by-sa/4.0/legalcode
        crypto.randomUUID = function randomUUID() {
            return (
                [1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,
                                                    c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                                                   );
        };

    }

    return crypto.randomUUID().replaceAll('-', '_')
}

export function deepSet (obj, path, val) {
    path = path.replaceAll("[", ".[");
    const keys = path.split(".");

    for (let i = 0; i < keys.length; i++) {
        let currentKey = keys[i];
        let nextKey = keys[i + 1];
        if (currentKey.includes("[")) {
            currentKey = parseInt(currentKey.substring(1, currentKey.length - 1));
        }
        if (nextKey && nextKey.includes("[")) {
            nextKey = parseInt(nextKey.substring(1, nextKey.length - 1));
        }

        if (typeof nextKey !== "undefined") {
            obj[currentKey] = obj[currentKey] ? obj[currentKey] : (isNaN(nextKey) ? {} : []);
        } else {
            obj[currentKey] = val;
        }

        obj = obj[currentKey];
    }
}

export function deepGet (obj, path, defaultValue, delimiter) {
    if (typeof path === 'string') {
        path = path.split(delimiter || '.');
    }
    if (Array.isArray(path)) {
        var len = path.length;
        for (var i = 0; i < len; i++) {
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
   
function attrsToStr(attribs = {}) {
    let attrStr = ''
    Object.keys(attribs).forEach(attrname => {
        attrStr  = attrStr + ` ${attrname}="${attribs[attrname]}"`
    })
    return attrStr
}

let parseToHtml = {
    handlers: {
        beforeRenderTag(tagname = '', childNode = {attribs: {}}) {
            return [tagname]
        },
        handleEachRender(curuuid = '', ruleConds = [], options = {}, handleContent, {partials, byCond, travel, createSubOption} = {}) {
            // console.log(partials)
            let uid = curuuid;
            let arr = options.methods.get(ruleConds[0]);
            let nodes = partials[0].nodes.map(v => v.cloneNode(true));
            options.methods.domMap.set(ruleConds[0], {
                id: uid,
                type: "each",
                key: byCond ?  byCond : "",
                nodes: nodes,
                getRenderStr(arr = [], newNodes = nodes) {
                    let str = "";
                    arr.forEach((v, index)=>{
                        let suboption = createSubOption(v, index);
                        // console.log(suboption.methods.data())
                        travel(newNodes, suboption);
                        str = str + `\n<!--start__each_item:${uid}:${ruleConds[0]}-->`
                        str = str + '\n' + suboption.str;
                        str = str + `\n<!--end__each_item:${uid}:${ruleConds[0]}-->`
                    });
                    return str;
                }
            });
            options.methods.keysSet.add(ruleConds[0]);
            if (Array.isArray(arr)) {
                options.str = options.str + `\n<!--start__each:${uid}:${ruleConds[0]}-->\n`
                arr.forEach((v, index)=>{
                    options.str = options.str + `\n<!--start__each_item:${uid}:${ruleConds[0]}-->`
                    handleContent(v, index)
                    options.str = options.str + `\n<!--end__each_item:${uid}:${ruleConds[0]}-->`
                });
                options.str = options.str + `\n<!--end__each:${uid}:${ruleConds[0]}-->`
            } else {
                console.log('不是arr', arr, options)
            }
        },
        handleValueRender(content = '', options = {}, {tempdata, functions} = {}) {
            // let result = runExpr(content, {
            //     ...options.methods.data(),
            //     ...functions
            // })
            // options.str = options.str +  result

            let uid = createUUID();

            function getC(content) {
                return {
                    id: uid,
                    type: "value",
                    cur: null,
                    cache(cacheTextNode) {
                        this.cur = cacheTextNode;
                    },
                    getRenderStr(newData) {
                        return runExpr(content, {
                            ...options.methods.data(),
                            ...functions
                        })
                    },
                    reload(newData) {
                        // console.log('sssss', this)
                        if (this.cur) {
                            this.cur.textContent = this.getRenderStr(newData)
                        }
                    }
                }
            }

            function  setVal(key, content){
                let c= getC(content)
                options.methods.domMap.set(key, c);
            }

            // console.log(content);
            if (deepGet(tempdata, content)) {
                setVal(content, content)
            }
            else if (deepGet(functions, content)) {
                let c = getC(content);

                c.getRenderStr = function (newData) {
                    // console.log(functions[content])
                    return functions[content]?.value()
                }
                options.methods.domMap.set(content, c);
            }
            else {
                let ast = getExprAst(content);
                let ids = [];
                ast.getIds(ids)

                ids.forEach(id => {
                    setVal(id, content);
                })

            }

            options.str = options.str +  `<value id="${uid}">${content}</value>`
        },
        handleIfRender(ruleConds = [], options = {}, handleContent = function() {}, {partials, functions, travel, createSuboption, elseIfs, elses} = {}) {
            let uid = createUUID();

            let result = runExpr(ruleConds[0], {
                ...options.methods.data(),
                ...functions
            })

            function getElseCondStr() {
                let suboption = {}
                let isMatches = false;
                elseIfs.some(v => {
                    suboption = createSuboption()

                    isMatches = Boolean(runExpr(v.cond, {
                        ...options.methods.data(),
                        ...functions
                    }));

                    if (isMatches) {
                        travel(v.nodes, suboption);
                    }

                    return isMatches
                })

                if (elses.length > 0 && !isMatches) {
                    suboption = createSuboption()
                    travel(elses.at(-1).nodes, suboption);
                }

                return suboption.str
            }

            function getRenderStr(value) {
                let result = runExpr(ruleConds[0], {
                    ...options.methods.data(),
                    ...functions
                })
                let suboption = {};
                if (result) {
                    suboption = createSuboption()
                    travel(partials[0].nodes, suboption);
                    return suboption.str;
                }  else {
                    let str = getElseCondStr()
                    if (str) {
                        return str
                    }
                }

                return '';
            }

            options.methods.domMap.set(ruleConds[0], {
                id: uid,
                type: "if",
                getRenderStr(value) {
                   let ret = getRenderStr(value);
                   if (ret) {
                       return ret;
                   }
                   return ''
                }
            })

            // console.log(result);
            options.str = options.str + `\n<!--start__if:${uid}:${ruleConds[0]}-->\n`
            if (result) {
                handleContent()
            }
            else {
                let str = getElseCondStr()
                if (str) {
                    options.str = options.str + str
                }
            }
            options.str = options.str + `\n<!--end__if:${uid}:${ruleConds[0]}-->\n`
        }
    } 
}


class CondsMap {
    /**
     *
     * @type {Map<string, *[]>}
     */
    data = new Map()
    set(key, value) {
        if (!this.data.has(key)) {
            let newArr = []
            newArr.push(value)
            this.data.set(key, newArr)
        }
        else {
            let oldArr = this.data.get(key)
            oldArr.push(value)
            this.data.set(key, oldArr)
        }
    }
    get(key) {
        return this.data.get(key);
    }
    update(key = '', arr = []) {
        if (!Array.isArray(arr)) {
            return
        }
        this.data.set(key, arr);
    }
    has(key) {
        return this.data.has(key);
    }
}

export function parseStaticTemplate(html = '', tempdata = {}, {functions = {}, log = function() {}, handlers = parseToHtml.handlers} = {}) {
    let tagRegexp = /\{(\#[^\s]*)\s*([^}]*)\}/g;
    let flcRegexp = /\{(\:+)\s*([^}\s]*)(.*)\}/g;
    let varRegexp = /\{=\s*([^}]*)\}/g;

    let endRegexp = /\{(\/+)\s*([^}\s]*)(.*)\}/g;

    log(html);

    let htmlString = html;

    htmlString = htmlString.replaceAll(tagRegexp, function(m) {
        return '<nogap></nogap>'+ m + '<nogap></nogap>'
    });

    htmlString = htmlString.replaceAll(flcRegexp, function(m) {
        return '<nogap></nogap>'+ m + '<nogap></nogap>'
    });

    htmlString = htmlString.replaceAll(endRegexp, function(m) {
        return '<nogap></nogap>'+ m + '<nogap></nogap>'
    });

    htmlString = htmlString.replaceAll(varRegexp, function(m, $1) {
        return '<value>'+($1 + '').trim()+'</value>'
    })

    log(htmlString);



    let parsed = parse(htmlString);
    console.log(parsed)
    let domarr = parsed.filter(v => v.name === "template")
    let content = domarr[0]


    function getPath(basepath, path) {
        if (basepath && path !== '') {
            return basepath + '.' + path
        }
        else if (basepath && path === '') {
            return basepath 
        }
        return path
    }


    /**
     *
     * @type {{domMap: CondsMap, path: string, data(): {}, get(*): *}}
     */
    let methods = {
        domMap: new CondsMap(),
        keysSet: new Set(),
        path: '',
        data() {
            return tempdata
        },
        get(path) {
            let basepath = this.path;
            let p = getPath(basepath, path)
            return deepGet(this.data(),  p)
        }
    }

    /**
     *
     * @type {{str: string, methods: {domMap: CondsMap, keysSet: Set, path: string, data(): {}, get(*): *}}}
     */
    let options = {
        str: '',
        methods
    }


    /**
     * 
     * @param {HTMLAllCollection} children 
     * @param {options} options
     */
    function travel(children, options) {
    
        let rule = '';
        let ruleCond = '';
        let isPartial = false;
        let isInner = false;
        let partials = [{
            nodes: []
        }];
        let curuuid = '';
        [...children].forEach(childNode => {
    
            if (childNode.type === "text") {
                let t = childNode.data.trim();
                
                if (t.startsWith('{#')) {
                    let a =  t.matchAll(tagRegexp);

                    let [_, key, value] = [...a][0];

                    // log(key, value);
                    
                    isPartial  = true
                    rule = key;
                    ruleCond = value
                }
                else if (t.startsWith('{:')) {
                    let a =  t.matchAll(flcRegexp);
                    let [_, key, value, cond] = [...a][0];
                    // console.log(key, value);

                    isInner = true

                    let obj = {
                        cond: '',
                        type: value,
                        nodes: []
                    }
       
                    if (value === 'else-if') {
                        obj.cond = cond
                    }

                    partials.push(obj)
                }
                else if (t.startsWith('{/')) {
                    if (rule === '#each') {
                        curuuid = createUUID();
                        let byCond = "";
                        if (ruleCond.includes("by")) {
                            let ruleCondArr = ruleCond.split('by');
                            ruleCond = ruleCondArr[0].trim();
                            byCond = ruleCondArr[1].trim();
                        }

                        // console.log(byCond)

                        let eachBlockValueName = '';
                        let eachBlockIndexName = '';
                        let ruleConds = ruleCond.split('as').map(v => v.trim());
                        // log(ruleConds);
                        let eachDefCond = ruleConds[1]
                        if (eachDefCond) {
                            let arr = eachDefCond.split(',').map(v => v.trim())
                            // log(arr)
                            if (arr.length === 2) {
                                [eachBlockValueName, eachBlockIndexName] = arr
                            }
                        }

                        if (handlers?.handleEachRender) {
                            function  createSubOption(v, index) {
                                return {
                                    str: '',
                                    methods: {
                                        ...options.methods,
                                        data() {
                                            let newdata = {
                                                ...options.methods.data(),
                                            }
                                            if (eachBlockValueName) {
                                                newdata[eachBlockValueName] = v
                                            }

                                            if (eachBlockIndexName) {
                                                newdata[eachBlockIndexName] = index
                                            }
                                            return newdata
                                        },
                                    }
                                }
                            }
                            handlers.handleEachRender(curuuid, ruleConds,  options, function(v, index) {
                                let suboption = createSubOption(v, index);
                                travel(partials[0].nodes, suboption);
                                options.str = options.str + suboption.str
                            //    log(suboption.str);
                            }, {partials, byCond, travel, createSubOption})
                       }

                    }
                    else if (rule === '#if')  {
                        let ruleConds = [ruleCond.trim()]
                        // log(childNode);

                        function createSuboption() {
                            return {
                                str: '',
                                methods: {
                                    ...options.methods,
                                    data() {
                                        return {
                                            ...options.methods.data(),
                                        }
                                    },
                                },
                            };
                        }

                        let partialsElse = partials.filter(v => {
                            return v.type
                        });

                        let elseIfs = partialsElse.filter(v => {
                            return v.type === 'else-if'
                        });

                        let elses = partialsElse.filter(v => {
                            return v.type === 'else'
                        });
                        // console.log(elseIfs);

                        if (handlers?.handleIfRender) {
                            handlers?.handleIfRender(ruleConds, options, function() {
                                let suboption = createSuboption()
                                travel(partials[0].nodes, suboption);
                                options.str = options.str + suboption.str
                            }, {partials, functions, travel, createSuboption, elseIfs, elses})
                        }
                    }

                    isPartial = false
                    isInner = false
                    partials = [{
                        nodes: []
                    }]
                    rule = ''
                    ruleCond = ''
                    curuuid = ''
                }
                else {

                    let c = childNode.data;
 
                    if (childNode?.nextSibling?.name ===  "nogap") {
                        c = ''
                    }
                    if (childNode?.previousSibling?.name ===  "nogap") {
                        c = ''
                    }

                    if (childNode?.nextSibling?.name ===  "nogap" && childNode?.previousElementSibling?.localName ===  "nogap") {
                        c = '\n'
                    }

                    options.str = options.str +  c;
                }
            }
            else {
                
                if (!isPartial) {
                    
                    let tagname = childNode.name 

                    if (tagname.includes('nogap')) {
    // 
                    }
                    else if (tagname.includes('value')) {
                        let content = ''

                        childNode.children.forEach(v => {
                            content = content + v.data
                        })
                        // log(content);
                        
                        if (handlers?.handleValueRender) {
                            handlers.handleValueRender(content, options, {tempdata, functions})
                        }
                    }
                    else {
                        if (childNode.children) {
                            let attrStr = attrsToStr(childNode.attribs);
                            
                            if (handlers?.beforeRenderTag) {
                                [tagname] = handlers.beforeRenderTag(tagname, childNode)
                            }

                            options.str = options.str + `<${tagname} ${attrStr}>`
                            travel(childNode.children, options)
                            options.str = options.str + `</${tagname}>`  
                        }
                    }
                }
                else {
                    if (!isInner) {
                        partials[0].nodes.push(childNode)
                    }
                    else {
                        partials.at(-1).nodes.push(childNode)
                    }
                }
            }
        });
    }

    travel(content.children, options);

    // log(options.str)

    if (globalThis.beautifier) {
        log(beautifier.html(options.str));
    }
    return options
}
