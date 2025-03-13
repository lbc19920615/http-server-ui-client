

import { runExpr} from "./jexpr.js"

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

function deepGet (obj, path, defaultValue, delimiter) {
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
        handleEachRender(curuuid = '', ruleConds = [], options = {}, handleContent) {
            let arr =  options.methods.get(ruleConds[0]);
            if (Array.isArray(arr)) {

                options.str = options.str + `\n<!--start__each:${curuuid}-->\n`

                arr.forEach((v, index)=>{
                    handleContent(v, index)
                });
                options.str = options.str + `\n<!--end__each:${curuuid}-->`
            } else {
                console.log('不是arr', options)
            }
        },
        handleValueRender(content = '', options = {}, {functions} = {}) {
            let result = runExpr(content, {
                ...options.methods.data(),
                ...functions
            })
            options.str = options.str +  result
        },
        handleIfRender(ruleConds = [], options = {}, handleContent = function() {}, {partials, functions, travel, createSuboption, elseIfs, elses} = {}) {
            let result = runExpr(ruleConds[0], {
                ...options.methods.data(),
                ...functions
            })
            // console.log(result);

            if (result) {
                handleContent()
            }
            else {
                let isMatches = false; 
                elseIfs.some(v => {
                    let suboption = createSuboption()

                    isMatches = Boolean(runExpr(v.cond, {
                        ...options.methods.data(),
                        ...functions
                    }));

                    if (isMatches) {
                        travel(v.nodes, suboption);
                        options.str = options.str + suboption.str
                    }

                    return isMatches
                })
                
                if (elses.length > 0 && !isMatches) {
                    let suboption = createSuboption()
                    travel(elses.at(-1).nodes, suboption);
                    options.str = options.str + suboption.str
                }
            }
        }
    } 
}

export function parseStaticTemplate(html = '', tempdata = {}, {functions = {}, log = function() {}, handlers = parseToHtml.handlers} = {}) {
    let tagRegexp = /\{(\#[^\s]*)\s*([^}]*)\}/g;
    let flcRegexp = /\{(\:+)\s*([^}\s]*)(.*)\}/g;
    let varRegexp = /\{=\s*([^}]*)\}/g

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
    let content = parsed[1]
    

    function getPath(basepath, path) {
        if (basepath && path !== '') {
            return basepath + '.' + path
        }
        else if (basepath && path === '') {
            return basepath 
        }
        return path
    }

    let methods = {
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
    
    let options = {
        str: '',
        methods
    }


    /**
     * 
     * @param {HTMLAllCollection} children 
     * @param {{str: ''}} options
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
                        //  log(partials);

                        if (rule === '#each') {
                            curuuid = createUUID()
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
                                handlers.handleEachRender(curuuid, ruleConds,  options, function(v, index) {
                                   let suboption = {
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
                
                                                // log(newdata);
                
                                                return newdata
                                            },
                                        }
                                   }      
                                   travel(partials[0].nodes, suboption);
                                   options.str = options.str + suboption.str
                                //    log(suboption.str);
                                })
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
 
                    if (childNode?.nextSibling?.name ==  "nogap") {
                        c = ''
                    }
                    if (childNode?.previousSibling?.name ==  "nogap") {
                        c = ''
                    }

                    if (childNode?.nextSibling?.name ==  "nogap" && childNode?.previousElementSibling?.localName ==  "nogap") {
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
                            handlers.handleValueRender(content, options, {functions})
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

    log(options.str)

    if (globalThis.beautifier) {
        log(beautifier.html(options.str));
    }
    return options.str
}
