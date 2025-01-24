

// function precss() {
//     const str3 = `
//     .tag1 {
//         $prop1: $varname;
    
//         $prop8: calc($varname($name1) * 2);
        
//         &:nth(1) {
//             $prop1: 1;
//             $prop8: 8;
//         }
    
//         &__child  {
//         }
    
//     }
    
//     @media (width > 600px) {
//         .tag3 {
//             $prop1: $varname;
//             $prop8: calc($varname($name1) * 2);
//             $after1: 1;
//             $after8: 8;
            
//             &:nth(1) {
//                 $prop1: 1;
//                 $prop8: 8;
//             }
        
//         }
        
//     }
//     .tag2 {
//         $after1: 1;
//         $after8: 8;
//         .tag2_1 {
//             $prop1: 1;
//             $prop8: 8;
//             &:state(active) {
//                 $prop1: 1;
//                 $prop8: 8;
//             }
    
//             .tag2_2:state(active) {
            
//             }
//         }
//     }
    
//             `;

//     let ret = {
//         parent: '',
//         styles: [],
//         ele: {
//             name: '',
//             props: []
//         },
//     }


//     function getprops(str = '', handleProp) {
//         let lines = str.split('\n').map(s => s.trim())

//         let props = lines.filter(v => {
//             return v.includes(';')
//         }).map(v => {
//             let val = v.trim();
//             if (handleProp) {
//                 val = handleProp(val)
//             }
//             return val
//         })
//         return props
//     }


//     function isAtrule(v = '') {
//         return ['@media', '@container', '@support'].some(s => {
//             return v.includes(s)
//         })
//     }


//     function travelCss(str, ret, context) {

//         let arr = XRegExp.matchRecursive(str, '{', '}', 'g', {
//             valueNames: ['literal', null, 'value', null],
//             escapeChar: '\\'
//         });

//         //    console.log(arr)

//         arr.forEach((v, index) => {
//             if (v.name === 'literal') {
//                 let content = arr[index + 1];
//                 let val = v.value.trim();
//                 let childRet = {
//                     parent: val,
//                     styles: [],
//                     children: []
//                 }





//                 let lines = v.value.split('\n').map(s => s.trim()).filter(v => v)

//                 let props = getprops(v.value, context?.handleProp)

//                 let sel = '';
//                 lines.forEach(line => {
//                     if (!line.includes(';')) {
//                         sel = line.trim()
//                     }
//                 })
//                 //    console.log(lines, props, sel)

//                 if (sel) {
//                     let newName = sel;
//                     if (!sel.includes('&')) {
//                         newName = (ret.ele.name + ' ' + sel).trim()
//                     } else {
//                         newName = sel.replace(/&/g, ret.ele.name)
//                     }

//                     if (isAtrule(sel)) {
//                         // console.log('sssssssssssss', sel, newName)
//                         let ele = {
//                             name: newName,
//                             props: [],
//                             context: {
//                                 ele: {
//                                     name: '',
//                                     props: [],
//                                 },
//                                 parent: '',
//                                 styles: [],
//                             }
//                         }

//                         ret.styles.push(ele);


//                         if (content) {
//                             travelCss(content.value.trim(), ele.context, context);
//                             // console.log(ele.context)
//                             // ele.context.styles.forEach(v => {
//                             //     ele.context.styles.push(v)
//                             // });
//                         }
//                     }
//                     else {
//                         let ele = {
//                             name: newName,
//                             props: []
//                         }

//                         ret.styles.push(ele);
//                         childRet.ele = ele;

//                         // console.log(content)
//                         if (content) {

//                             if (!content.value.includes('{')) {
//                                 let props = getprops(content.value, context?.handleProp);
//                                 ele.props = ele.props.concat(props)
//                             }



//                             travelCss(content.value.trim(), childRet, context);
//                             // console.log(content, childRet)
//                             childRet.styles.forEach(v => {
//                                 ret.styles.push(v)
//                             });
//                         }
//                     }
//                 }


//                 ret.ele.props = ret.ele.props.concat(props);

//             }
//         })

//     }

//     function handleProp(propdef) {
//         let shortcuts = [
//             [
//                 "a",
//                 "animation"
//             ],
//             [
//                 "bgc",
//                 "background-color"
//             ],
//             [
//                 "c",
//                 "color"
//             ],
//             [
//                 "bg",
//                 "background"
//             ],
//             [
//                 "bgi",
//                 "background-image"
//             ],
//             [
//                 "b",
//                 "border"
//             ],
//             [
//                 "br",
//                 "border-right"
//             ],
//             [
//                 "bl",
//                 "border-left"
//             ],
//             [
//                 "bt",
//                 "border-top"
//             ],
//             [
//                 "bb",
//                 "border-bottom"
//             ],
//             [
//                 "bc",
//                 "border-color"
//             ],
//             [
//                 "brc",
//                 "border-right-color"
//             ],
//             [
//                 "blc",
//                 "border-left-color"
//             ],
//             [
//                 "btc",
//                 "border-top-color"
//             ],
//             [
//                 "bbc",
//                 "border-bottom-color"
//             ],
//             [
//                 "bs",
//                 "border-style"
//             ],
//             [
//                 "brs",
//                 "border-right-style"
//             ],
//             [
//                 "bls",
//                 "border-left-style"
//             ],
//             [
//                 "bts",
//                 "border-top-style"
//             ],
//             [
//                 "bbs",
//                 "border-bottom-style"
//             ],
//             [
//                 "bw",
//                 "border-width"
//             ],
//             [
//                 "brw",
//                 "border-right-width"
//             ],
//             [
//                 "blw",
//                 "border-left-width"
//             ],
//             [
//                 "btw",
//                 "border-top-width"
//             ],
//             [
//                 "bbw",
//                 "border-bottom-width"
//             ],
//             [
//                 "radius",
//                 "border-radius"
//             ],
//             [
//                 "o",
//                 "outline"
//             ],
//             [
//                 "oc",
//                 "outline-color"
//             ],
//             [
//                 "os",
//                 "outline-style"
//             ],
//             [
//                 "ow",
//                 "outline-width"
//             ],
//             [
//                 "maxw",
//                 "max-width"
//             ],
//             [
//                 "minw",
//                 "min-width"
//             ],
//             [
//                 "h",
//                 "height"
//             ],
//             [
//                 "w",
//                 "width"
//             ],
//             [
//                 "maxh",
//                 "max-height"
//             ],
//             [
//                 "minh",
//                 "min-height"
//             ],
//             [
//                 "of",
//                 "overflow"
//             ],
//             [
//                 "ofx",
//                 "overflow-x"
//             ],
//             [
//                 "ofy",
//                 "overflow-y"
//             ],
//             [
//                 "scrollb",
//                 "scroll-behavior"
//             ],
//             [
//                 "p",
//                 "padding"
//             ],
//             [
//                 "m",
//                 "margin"
//             ],
//             [
//                 "pr",
//                 "padding-right"
//             ],
//             [
//                 "pl",
//                 "padding-left"
//             ],
//             [
//                 "pt",
//                 "padding-top"
//             ],
//             [
//                 "pb",
//                 "padding-bottom"
//             ],
//             [
//                 "mr",
//                 "margin-right"
//             ],
//             [
//                 "ml",
//                 "margin-left"
//             ],
//             [
//                 "mt",
//                 "margin-top"
//             ],
//             [
//                 "mb",
//                 "margin-bottom"
//             ],
//             [
//                 "d",
//                 "display"
//             ],
//             [
//                 "flexw",
//                 "flex-wrap"
//             ],
//             [
//                 "flexg",
//                 "flex-grow"
//             ],
//             [
//                 "flexdir",
//                 "flex-direction"
//             ],
//             [
//                 "ai",
//                 "align-items"
//             ],
//             [
//                 "ac",
//                 "align-content"
//             ],
//             [
//                 "jc",
//                 "justify-content"
//             ],
//             [
//                 "gcols",
//                 "grid-template-columns"
//             ],
//             [
//                 "grows",
//                 "grid-template-rows"
//             ],
//             [
//                 "gacols",
//                 "grid-auto-columns"
//             ],
//             [
//                 "garows",
//                 "grid-auto-rows"
//             ],
//             [
//                 "areas",
//                 "grid-template-areas"
//             ],
//             [
//                 "area",
//                 "grid-area"
//             ],
//             [
//                 "dir",
//                 "direction"
//             ],
//             [
//                 "textt",
//                 "text-transform"
//             ],
//             [
//                 "ta",
//                 "text-align"
//             ],
//             [
//                 "td",
//                 "text-decoration"
//             ],
//             [
//                 "ws",
//                 "white-space"
//             ],
//             [
//                 "ww",
//                 "word-wrap"
//             ],
//             [
//                 "ff",
//                 "font-family"
//             ],
//             [
//                 "to",
//                 "text-overflow"
//             ],
//             [
//                 "ls",
//                 "letter-spacing"
//             ],
//             [
//                 "lh",
//                 "line-height"
//             ],
//             [
//                 "wb",
//                 "word-break"
//             ],
//             [
//                 "fv",
//                 "font-variant"
//             ],
//             [
//                 "fs",
//                 "font-size"
//             ],
//             [
//                 "fw",
//                 "font-weight"
//             ],
//             [
//                 "fstyle",
//                 "font-style"
//             ],
//             [
//                 "f",
//                 "font"
//             ],
//             [
//                 "pos",
//                 "position"
//             ],
//             [
//                 "z",
//                 "z-index"
//             ],
//             [
//                 "tr",
//                 "transform"
//             ],
//             [
//                 "cur",
//                 "cursor"
//             ]
//         ];
//         let shourcutmap = Object.fromEntries(shortcuts);

//         let arr = propdef.split(':');

//         if (arr.length > 1) {
//             let key = arr[0].trim();
//             let val = arr[1].trim();


//             if (val && val.replace) {
//                 // console.log(val)
//                 val = val.replace(/\$([\w_]+)\(([^)]*)\)/g, function (match, p1, p2) {
//                     return `var(--${p1}, ${p2})`
//                 });

//                 val = val.replace(/\$([\w_]+)/g, function (match, p1) {
//                     return `var(--${p1})`
//                 });
//                 // console.log(val)
//             }

//             if (key?.startsWith('$')) {
//                 key = '--' + key.slice(1);
//             }


//             if (typeof shourcutmap !== 'undefined') {
//                 // console.log(key)
//                 if (shourcutmap[key]) {
//                     key = shourcutmap[key];
//                 }

//                 // console.log(key)
//             }

//             return `${key}: ${val}`;
//         }

//         return propdef
//     }



//     travelCss(str3.trim(), ret, {
//         handleProp
//     });

//     console.log(str3)
//     console.log(ret)

//     function stringify(styles = []) {
//         let css = '';
//         styles.forEach(cssrule => {
//             let propstr = '';
//             cssrule?.props?.forEach(v => {
//                 propstr = propstr + '\t' + v + '\n';
//             });

//             let childcss = '';
//             if (cssrule.context) {
//                 childcss = stringify(cssrule.context.styles)
//             }

//             css = css + `${cssrule.name} {
//     ${childcss}
//     ${propstr}}
    
//     `
//         });
//         return css
//     }

//     console.log(stringify(ret.styles))
// }
import './env.js';

export function createTest() {


        
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function getProLikeVal(v)  {
            if (isNumeric(v)) {
                return parseFloat(v)
            }
            else if (v === 'true') {
                return true
            }
            else if (v === 'false') {
                return false
            }
            return v
        }


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

        return window.crypto.randomUUID().replaceAll('-', '_')
    }

    function prerun() {
        let ret = {
            parent: '',
            styles: [],
            ele: {
                name: '',
                props: []
            },
        }


        function getpropsv2(str = '', handleProp) {
            let lines = str.split('\n').map(s => s.trim());

            let props = [];
            let extprops = {}

            let extlevel = 0;
            let check = true;
            lines.forEach(line => {
                if (check) {
                    if (line.includes(';')) {
                        let val = line.trim();
                        if (line.includes('=')) {
                            if (handleProp) {
                                val = handleProp(val)
                            }
                        }
                        else {
                            val = line.trim();
                        }
        
                        // props.push(val);
                        if (extlevel < 1) {
                            props.push(val);
                        }
                        else {
                            if (!extprops['l' + extlevel]) {
                                extprops['l' + extlevel] = []
                            }
                            extprops['l' + extlevel] .push(val)
                        }
                    }
                }
                if (line.includes('{')) {
                    // console.log(lines)
                    check = false
                }
                if (line.includes('}')) {
                    extlevel = extlevel + 1;
                    check = true
                }
            })

            return {props, extprops}
        }

        function getprops(str = '', handleProp) {
            let lines = str.split('\n').map(s => s.trim());

            let props = [];
            let extprops = {}

            let extlevel = 0;
            let check = true;
            lines.forEach(line => {
                if (check) {
                    if (line.includes(';')) {
                        let val = line.trim();
                        if (handleProp) {
                            val = handleProp(val)
                        }
                        // props.push(val);
                        if (extlevel < 1) {
                            props.push(val);
                        }
                        else {
                            if (!extprops['l' + extlevel]) {
                                extprops['l' + extlevel] = []
                            }
                            extprops['l' + extlevel] .push(val)
                        }
                    }
                }
                if (line.includes('{')) {
                    // console.log(lines)
                    check = false
                }
                if (line.includes('}')) {
                    extlevel = extlevel + 1;
                    check = true
                }
            })

            return props
        }

        function isAtrule(v = '') {
            return ['struct', 'object'].some(s => {
                return v.includes(s)
            })
        }

        
        function isFun(v = '') {
            return ['fun'].some(s => {
                return v.includes(s)
            })
        }

        function isControl(v) {
            return ['if', 'else', 'else if', 'switch', 'for', 'each', 'while'].some(s => {
                return v.startsWith(s)
            })
        }


        function travelCss(str, ret, context) {
    
            let arr = XRegExp.matchRecursive(str, '{', '}', 'g', {
                valueNames: ['literal', null, 'value', null],
                escapeChar: '\\'
            });

            //    console.log(arr)

            arr.forEach((v, index) => {
                if (v.name === 'literal') {
                    let content = arr[index + 1];
                    let val = v.value.trim();
                    let childRet = {
                        parent: val,
                        styles: [],
                        children: []
                    }

            

                    let lines = val.split('\n').map(s => s.trim()).filter(v => v)

                    let props = getprops(v.value, context?.handleProp)

                    let sel = '';
                    lines.forEach(line => {
                        if (!line.includes(';')) {
                            sel = line.trim()
                        }
                    })
                    //    console.log(lines, props, sel)

                    if (sel) {
                        let newName = sel;
    
                        if (isAtrule(sel) || isFun(sel)) {
                            // console.log('sssssssssssss', content)
                            let ele = {
                                name: newName,
                                props: [],
                                ext: [],
                                context: {
                                    ele: {
                                        name: sel,
                                        props: [],
                                    },
                                    parent: '',
                                    styles: [],
                                }
                            }

                            let {props, extprops} = getpropsv2(content.value, context?.handleProp);
                            ele.props = ele.props.concat(props)

                            ret.styles.push(ele);


                            if (content) {
                                travelCss(content.value.trim(), ele.context, context);
             
                                // console.log(extprops, sel)
                                Object.entries(extprops).forEach(([k,v]) => {
                                    let index = parseFloat(k.replace('l', ''));
                                    ele.context.styles.splice(index, 0, {
                                        "name": "",
                                        isparent: true,
                                        "props": v,
                                        "parentname": sel
                                    });
                                    ele.ext = ele.ext.concat(v)
                                })
                              
                                // console.log(ele.context.styles)

                                // ele.context.styles.forEach(v => {
                                //     ele.context.styles.push(v)
                                // });
                            }
                        }
                        else {
                            let ele = {
                                name: newName,
                                props: [],
                                param: ''
                            };
                            ele.parentname = ret.ele.name;

                            ret.styles.push(ele);
                            childRet.ele = ele;

                
                            if (content) {
                                let contet_val = content.value?.trim() ?? '';

                                // console.log(contet_val)

                                let funreg = /\(([^)]*)\)\s*->/g;

                                contet_val = contet_val.replace(funreg, function(match, p1) {
                                    ele.param = p1
                                    return ''
                                })

                                if (!contet_val.includes('{')) {
                                    let props = getprops(content.value, context?.handleProp);
                                    ele.props = ele.props.concat(props)
                                }

                                travelCss(contet_val, childRet, context);
                                // console.log(contet_val, childRet)
                                childRet.styles.forEach(v => {
                                    ret.styles.push(v)
                                });
                            }
                        }
                    }


                    ret.ele.props = ret.ele.props.concat(props);

                }
            })

        }

        function handleProp(propdef) {

            let haschange = '';
            propdef.replace(/([^=]*)=([^=]*);/, function(match, k, v) {

                // console.log(v)
                let val = v.trim()
                if (val && val.startsWith('[') && val.endsWith(']')) {
                    if (val.includes(':')) {
                        val = '{' + val.slice(1, val.length - 1) + '}'
                    }
                    // console.log(val)
                    haschange = `${k} = ${val};`
                }
      
            })

            if (haschange) {
                return haschange
            }

            return propdef
        }

        function parseFunLike(name = '') {
            let funname = '';
            let funprev = '';
            let funargs = '';
            name.trim().replace(/^([\w_]*)\s*([\w]*)\(/g, function(match, p1, p2) {
                funname = p1.trim();
                console.log('funname', funname)
                if (p2 && funname) {
                    funname = p1 + ' ' + p2;
                }
                funprev = match
            });
            // console.log(funname, funargs)
            let funafter = name.replace(funprev, '');
          
            funargs = funafter.replace(';', '');
          
            funargs = funargs.replace(')', '')
            return {funname, funargs}
        }

        ;(async function (params) {
            // let res = await window.fetch('/fun.cl');
            // let str3 = await res.text()
            let str3 = document.querySelector('#str3').content.textContent
            
            travelCss(str3.trim(), ret, {
                handleProp
            });
    
            function getpropnames(props = []) {
                let propnames = props.map(v => {
                    let arr = v.split('=');
                    let left = arr[0].trim();
                    left.replace(/var\s*(.*)/, function(match, p1) {
                        left = p1
                    })
    
                    return left
                });
                return propnames
            }
    
    
            let prcesscontext = function () {
                let returns = {
    
                };
                return {
                    returns,
                    after(name = '') {
                        if (name && isAtrule(name)) {
                            return `\n/*returns ${name}*/`
                        }
                        return ''
                    },
                    end(name) {
                        if (name && isAtrule(name)) {
                            return '\n);'
                        }
                        return ''
                    },
                    handleSel(name, cssrule) {
    
                        if (name.startsWith('struct')) {
    
                            let props = cssrule.props;
                            // console.log(cssrule);
                            if (Array.isArray(cssrule.ext)) {
                                props = props.concat(cssrule.ext)
                            }
                            let propnames = getpropnames(props)
    
                            if (!returns[cssrule.name]) {
                                returns[cssrule.name] = []
                            }
    
                            returns[cssrule.name] = propnames.concat(returns[cssrule.name])
    
                            let truename = name.replace('struct', '')
    
                            name = name.replace('struct', `let ${truename} = defStruct(\nfunction `);
                            name = name + '( )';
                            return name
                        }
                        else if (name.startsWith('object')) {
                            let props = cssrule.props;
                            let propnames = getpropnames(props)
    
                            if (!returns[cssrule.name]) {
                                returns[cssrule.name] = []
                            }
    
                            returns[cssrule.name] = propnames.concat(returns[cssrule.name])
    
                            let truename = name.replace('object', '')
    
                            name = name.replace('object', `let ${truename} = defObject(\nfunction `);
                            name = name + '( )';
                            return name
                        }
                        else {
                            // console.log(cssrule)
                            if (!returns[cssrule.parentname]) {
                                returns[cssrule.parentname] = []
                            }
                            let funmodif = '';
                            let funcname = '';
                            let returnname = '';
                            name.replace(/([^(]+)\(/, function (match, p1) {
                                funcname = p1;
                            });
                     
                            name.replace(/(fun)\s*([^(]+)\(/, function (match, p1, p2) {
                                funmodif = p1;
                                funcname = p2;
                                let s = name.replace(funmodif, '');
                                // console.log(s)
                                returnname = 'function' + s
                            });
    
                            // console.log(name)
                            name.replace(/(async)\s*(fun)([^(]+)\(/, function (match, p1, p2, p3) {
                                funmodif = p1;
                                funcname = p3;
                                // console.log(p1,p2,p3);
                                let s = name.replace(funmodif, '');
                                s = s.replace(/(fun)/, 'function')
                               
                                returnname = p1 + s
                            });
                            // console.log(funcname)
    
                            // returns.push(funcname)
                            returns[cssrule.parentname].push(funcname)
                            if (!funmodif) {
                                // console.log(name)
                                if (isControl(name)) {
                                    return name
                                }
                                return 'function ' + name;
                            }
    
                            else {
    
                                return returnname
                            }
    
                        }
                    },
                    getretturn(name) {
                        let names = returns[name] ?? [];
                        names = names.filter(v => v)
                        return `return { ${names.join(', ')} }`
                    }
                }
    
            }

            function getPropObj(funargs = '') {
                let props = {};
                let proparr = funargs.split('#');
                // console.log(funargs)
                proparr.map(v => {
                    let arr = v.split('=').map(v => v.trim());
                    // console.log(v, arr)
                    if (arr[0]) {
                        let right =  arr[1];
                        right = getProLikeVal(arr[1]);
                        props[arr[0]] =right
                    }
                });
                // console.log(props)
                return props
            }
    
            function stringify(styles = [], context) {
                let css = '';
                styles.forEach(cssrule => {
                    let propstr = '';
                    cssrule?.props?.forEach(v => {
                        propstr = propstr + '\t' + v + '\n';
                    });
    
                    // console.log(cssrule.context.styles)
                    let childcss = '';
                    if (cssrule.context) {
                        childcss = stringify(cssrule.context.styles, context)
                    }
    
                    let name = cssrule.name;
                    if (context.handleSel) {
                        name = context.handleSel(cssrule.name, cssrule)
                    }
                    if (cssrule.isparent) {
                        css = css + `${propstr}
    `
                    }
                    else {
                        css = css + `${name} {
                        ${propstr}${childcss}${context?.after(cssrule.name)}
    }
    ${context?.end(cssrule.name)}
                        
                        `                    
                    }
                });
                return css
            }

            function parseDec(caclstr = '') {
                let decs = caclstr.split('=');
                let leftval = decs[0].trim();
                // console.log(leftval)
                if (leftval.startsWith('var')) {
                    let left = leftval.replace(/^var/, '').trim();
                    let right = decs[1].trim().replace(/;$/, '');
                
                    let p = [];
                    p.push('__setCtx');
                    p.push(left);
                    p.push(right);
                    return p;
                }
                else {
                    let funreg = /\(([^)]*)\)/g;
                    let left = leftval.trim();
         
                    if (decs[1] && !funreg.test(caclstr)) {
                        let right = decs[1].trim().replace(/;$/, '');
                        let p = [];
                        p.push('__update');
                        p.push(left);
                        p.push(right);
                        return p;
                    }
                    else {
                        if (decs[1] && leftval) {
                            let right = decs[1].trim().replace(/;$/, '');
                            console.log(right)

                            let callfunreg = /([\w_]*)\s*\(([^\)]*)\)/g;
                            
                            let valname = '';
                            let funargs = '';
                            right.replace(callfunreg, function(match, p1, p2) {
                                valname = p1;
                                funargs = p2;
                            });


                            console.log(valname)
                            let p = [];
                            p.push('__init');
                            p.push([left, valname, []]);
                            return p;
                        }

                        let buildfunnames = ['console'];
                        let {funname, funargs} = parseFunLike(caclstr);
                        console.log('call fun', funname + ' ', funargs)
                        if (funname) {
                            let propobj = getPropObj(funargs);
                            let p = [];
                            p.push('__call');
                            let arr = ['', funname, propobj]
                            p.push(arr);
                            return p;
                        }
                        else {
                            let callfunreg = /([\w_]*)\s*\[([^\]]*)\]\s*\(([^\)]*)\)/g;
                            

                            let objname = '';
                            let valname = '';
                            let funargs = '';
                            caclstr.replace(callfunreg, function(match, p1, p2, p3) {
                                objname = p1;
                                valname = p2;
                                funargs = p3;
                            });
                            let args = funargs.split('#').map(v => v.trim());

                            let codename = '__call';
                            if (buildfunnames.includes(objname)) {
                                codename = '__callglobal'
                            }

                            let p = [];
                            p.push(codename);
                            p.push([`${objname}.${valname}`, args])
                            return p;
                        }
              
                    }
        
                }
            }

            function getfunprops(cssrule,codes = []) {
                if (cssrule?.props && cssrule?.props.length > 0) {
                    cssrule.props.forEach(v => {
                        // propstr = propstr + '\t' + v + '\n';
                        let parsedDec = parseDec(v);
                        if (parsedDec) {
                            codes.push(parsedDec)
                        }
                    });
                }                
            }

            function createFunCtx(funuuid) {
                return  {
                    name:'fun__' + funuuid,
                    codes: [],
                    props() {
                        return {}
                    }
                }
            }
            
    
            function stringify2(styles = [], context, option = { level: 1}) {
                let codes = [];
                let switchs = [];
        
                if (option.level < 1) {
                    context.curFunCtx = {
                        name: 'main',
                        codes: [],
                        props() {
                            return {}
                        }
                    }
                    // context.programs.push(context.curFunCtx);
                    context.setFun('main', context.curFunCtx)
           
                }

                styles.forEach(cssrule => {
               
                
                    // let propstr = '';
                    if (option.level < 1) {
                     
                        getfunprops(cssrule,  context.curFunCtx.codes)
                        // console.log(cssrule,  context.curFunCtx)
                    }
            
    
                    // console.log(cssrule.context.styles)
                    // let childcss = [];
                    if (cssrule.context) {
                        // console.log(cssrule)
                        context.parent = context.curFunCtx
                        stringify2(cssrule.context.styles, context, {...option, level: 1});
               
                    }
    
       
                    let name = cssrule?.name?.trim();
    //                 if (context.handleSel) {
    //                     name = context.handleSel(cssrule.name, cssrule)
    //                 }
                    if (cssrule.isparent) {
// 
                        getfunprops(cssrule,  context.curFunCtx.codes)
                    }
                    else {
                        let funname = '';
                        let funprev = '';
                        let funargs = '';
                        name.replace(/([\w_]*)\s*([\w]*)\(/, function(match, p1, p2) {
                            funname = p1.trim();
                            if (p2) {
                                funname = p1 + ' ' + p2;
                            }
                            funprev = match
                        });
                        // console.log(funname, funargs)
                        let funafter = name.replace(funprev, '');
                        funargs = funafter.slice(0, funafter.length - 1)
                        // console.log(name, funname, funargs)

                        name.replace(/object\s*([^{\s]*)/g, function(match, p1) {
                            funname = 'object';
                            funargs = p1;
                        })


                        if (funname === 'if') {
                            let funuuid = 'switch__if__' + createUUID();
                            switchs.push([
                                funargs, funuuid
                            ]);
                            let funCtx = createFunCtx(funuuid);
                            if (option.level > 0) {
                                getfunprops(cssrule, funCtx.codes)
                            }
                            context?.setFun(funuuid, funCtx)
                            
                            console.log(cssrule, codes, funCtx)
                        }
                        else if (funname === 'object') {
                            let funuuid = 'object__' + createUUID();
                            let funCtx = createFunCtx(funuuid);
                            getfunprops(cssrule, funCtx.codes)
                            // console.log(cssrule)
                            if (cssrule?.context?.styles) {
                                // console.log(funCtx)
                                cssrule?.context?.styles.forEach(style => {
                                    let customfunreg = /fun\s*(.*)\(([^)]*)\)/g;
                                    if (customfunreg.test(style.name)) {
                                        
                                        let registerFunName = '';
                                        let registerargs = '';
                                        style.name.replace(customfunreg, function(match, p1, p2) {
                                            registerFunName = p1;
                                            registerargs = p2;;
                                        });
                                        console.log('ssssssssssssss', style, registerFunName)
                                        if (registerFunName) {
                                            let method_funuuid = 'method__' + createUUID();
                                            let funCtx1 = createFunCtx(method_funuuid);
                                            getfunprops(style, funCtx1.codes);
                                            context?.setFun(method_funuuid, funCtx1)
                                            // console.log(registerFunName)
                                            funCtx.codes.push([
                                                '__setFun', [method_funuuid, registerFunName]
                                            ])
                                        }
                                    }
                                })
                            }
                            context?.setFun(funuuid, funCtx);

                            if (context?.parent?.codes) {
                                context.parent.codes.push([
                                    '__object', [funuuid, funargs]
                                ]);
                            }
                        }
                        else if (funname === 'else if' || name.trim().startsWith('else if')) {
                            let funuuid = 'switch__elif__' + createUUID();
                            switchs.push([
                                funargs, funuuid
                            ]);
                            let funCtx = createFunCtx(funuuid);
                            if (option.level > 0) {
                                getfunprops(cssrule, funCtx.codes)
                            }
                            context?.setFun(funuuid, funCtx)
                        }
                        else if (funname === 'else' || name.trim() === 'else') {
                            let funuuid = 'switch__else__' + createUUID();
                            switchs.push([
                                'default', funuuid
                            ]);
                            // console.log(context)
               
                            
                            let funCtx = createFunCtx(funuuid);
                            if (option.level > 0) {
                                getfunprops(cssrule, funCtx.codes)
                            }
                            context?.setFun(funuuid, funCtx)
                    
                            if (context?.parent?.codes) {
                                context.parent.codes.push([
                                    '__switch', switchs
                                ]);
                            }
                            // console.log(codes)
                            switchs = [];
                        }
                        else if (funname === 'each') {
                            let eachargs = {};
                            funargs.replace(/\[([^\]]*)\]\s*in\s*(.*)/, function(match, p1, p2) {
                                let arr = p1.split(',').map(v => v).map(v => v.trim());
                                eachargs.key = arr[0];
                                eachargs.val = arr[1];
                                eachargs.valpath = p2;
                            });
                            // console.log(eachargs)
                            let funuuid = 'each__' + createUUID();
                            let funCtx = createFunCtx(funuuid);
                            // keyname: 'key',
                            // valname: 'val',
                            funCtx.keyname = eachargs.key;
                            funCtx.valname = eachargs.val;
                            if (option.level > 0) {
                                getfunprops(cssrule, funCtx.codes)
                            }
                            context?.setFun(funuuid, funCtx)

                            if (context?.parent?.codes) {
                                context.parent.codes.push([
                                    '__runloop', [eachargs.valpath, funuuid]
                                ]);
                            }
                        }
                        else {
                            let customfunreg = /fun\s*(.*)/g;
                            if (customfunreg.test(funname)) {
                                let registerFunName = '';
                                funname.replace(customfunreg, function(match, p1) {
                                    registerFunName = p1;
                                });
                                if (registerFunName) {
                                    if (registerFunName !== 'main') {
                                        // console.log(cssrule)
                                        let funuuid = 'customfun__' + createUUID();
                                        let funCtx = createFunCtx(funuuid);
                                        funCtx.name = registerFunName;
                                        if (option.level > 0) {
                                            getfunprops(cssrule, funCtx.codes)
                                        }
                                        context?.setFun(funuuid, funCtx);

                                        funCtx.props  = function() {
                                            return getPropObj(funargs)
                                        }

                                        if (context?.parent?.codes) {
                                            context.parent.codes.push([
                                                '__registerFun', [funuuid]
                                            ]);
                                        }
                                    }
                                }
                            }
                            else {
                                console.log(funname, funargs, cssrule)   
                                let propobj = getPropObj(funargs);    
                                // Object.keys(propobj).forEach(k => {
                                //     let val = propobj[k];
                                //     if (context.programs[val]) {

                                //     }
                                // })   
                                if (cssrule.param) {
                                    let funuuid = 'customfun__' + createUUID();
                                    let funCtx = createFunCtx(funuuid);
                                    funCtx.name = 'call_end_callback__' + funname;
                             
                                    funCtx.props  = function() {
                                        let obj = getPropObj(cssrule.param);

                                        return obj
                                    }
                                    funCtx.propobj  = getPropObj(cssrule.param);
                                    if (option.level > 0) {
                                        getfunprops(cssrule, funCtx.codes)
                                    }
                                    // console.log(funCtx)
                                    context?.setFun(funuuid, funCtx);
                                    propobj['__callback'] = funuuid
                                }
                             
                                let p = [];
                                p.push('__call');
                                let arr = ['', funname, propobj]
                                p.push(arr);
                             
                                // console.log(p)
                                context.parent.codes.push(p);
                            }
                 
                        }
                    }
                });
            }

            let globalFuncs = {};
            let context = prcesscontext();
            context.programs = globalFuncs;
            context.setFun = function(key, funCtx) {
                context.programs[key] = funCtx
            }
            // context.globalCtx = context;
            // let p = stringify(ret.styles, context);
            // console.log(context.returns)
            // p = p.replace(/\/\*returns\s*([^*]*)\*\//g, function(match, p1) {
            //     return context.getretturn(p1)
            // })

            let fanyiarr = ret.styles.slice(1, ret.styles.length)
            stringify2(fanyiarr, context, {level: 0});
            console.log(fanyiarr, context.programs);
            let v = document.querySelector('#out')

            if (v) {
                // v.value     = SimplyBeautiful().js(p).replace('async\n', 'async ')      
                setTimeout(() => {
                    v.value     = JSON5.stringify(  context.programs, function(key, val) {
                        if (key === 'props') {
                            return ['fun', '', JSON5.stringify(val(), null, 4)]
                        }
                        if (key === 'propobj') {
                            let obj = {}
                            Object.keys(val).forEach(k => {
                                if (typeof val[k] === 'undefined') {
                                    obj[k] = null
                                }
                                else {
                                    obj[k] = val[k]
                                }
                            })
                            return obj
                        }
                        return val
                    }, 4)
                }, 1000)
            }      
        })();


        

        // console.log(config)

    }


    prerun();

    function assignCtx(base, ctx) {
        let ret = base;
        Object.keys(ctx).forEach(k => {
            if (!k.startsWith('__')) {
                ret[k] = ctx[k]
            }
        })
        if (ctx.__$parent) {
            assignCtx(ret, ctx.__$parent)
        }
    }

    function preevals(outctx = {}, code) {
        let curctx = {} 
        assignCtx(curctx, outctx);
        console.log('preevals', curctx)


        const EOF = Symbol('EOF');


        let signarr = ["+","-","*","/",">","<","="];

        class Lexer {
          constructor(){
            this.token = []; // 临时 token 字符存储
            this.tokens = []; // 生成的正式 token
            // state 默认是 start 状态，后面通过 push 函数实现状态迁移
            this.state = this.start;
          }
          start(char) {
            // 数字
            if (["0","1","2","3","4","5","6","7","8","9"].includes(char)) {
              this.token.push(char);
              return this.inInt;
            }
            // .
            if (char === "."){
              this.token.push(char);
              return this.inFloat;
            }
            // 符号
            if (signarr.includes(char)) {
                this.token.push(char);
                return this.isSign
            }
            
            // 结束符
            if (char === EOF){
              this.emmitToken("EOF", EOF);
              return this.start;
            }

            // 空格
            if (char === '"'){
                return this.isString;
            }

            // 空格
            if (char === " "){
                return this.start;
            }

            // 字符
            if (char !== EOF && /[\w_]/.test(char) ){
                this.token.push(char);
                return this.isVairable;
            }

            // 括号
            if (char === '(') {
                // console.log('ssssssssssssss', char)
                this.token.push(char);
                return this.isParentheses;
            }
          }
          isSign(char) {
            if (signarr.includes(char)) {
                this.token.push(char);
                return this.isSign
            }
            else {
                // console.log( this.token)
                this.emmitToken("SIGN", this.token.join(""));
                this.token = [];
                return this.start;
            }
          }
          isString(char) {
            if (char === '"') {
                // this.token.push(char)
                this.emmitToken("DOUBLE_STRING", this.token.join(""));
                this.token = [];
                return this.start(' '); // put back char
            }
            else {
                // console.log(char)
                this.token.push(char);
                return this.isString;
            }
          }
          isParentheses(char) {
            if (char === ')') {
                this.token.push(char)
                this.emmitToken("PARENTHESES", this.token.join(""));
                this.token = [];
                return this.start(' '); // put back char
            }
            else {
                // console.log(char)
                this.token.push(char);
                return this.isParentheses;
            }
          }
          isFunction(char) {
            if (char === EOF) {
                return this.start(char)
            }
            else {
                if (char !== ')') {
                    this.token.push(char)
                    return this.isFunction
                }
                else {
                    this.token.push(char)
                    this.emmitToken("FUNCTION", this.token.join(""));
                    this.token = [];
                    return this.start(' '); // put back char
                }
            }
          }
          isVairable(char) {
            // console.log(char)
            if (char === EOF) {
                this.emmitToken("VARIABLE", this.token.join(""));
                this.token = [];
                return this.start(char)
            }
            if (/[\w_]/.test(char) ){
                this.token.push(char);
                return this.isVairable;
            }
            else if (char === '(') {
                this.token.push(char);
                return this.isFunction;
            }
            else {
                this.emmitToken("VARIABLE", this.token.join(""));
                this.token = [];
                return this.start(char); // put back char
            }
          }
          inInt(char) {
            if (["0","1","2","3","4","5","6","7","8","9"].includes(char)) {
              this.token.push(char);
              return this.inInt;
            } else if (char === '.') {
              this.token.push(char);
              return this.inFloat;
            } else {
              this.emmitToken("NUMBER", this.token.join(""));
              this.token = [];
              return this.start(char); // put back char
            }
          }
          inFloat(char) {
            if (["0","1","2","3","4","5","6","7","8","9"].includes(char)) {
              this.token.push(char);
              return this.inFloat;
            } else if (char === ".") {
              throw new Error("不能出现`..`");
            } else {
              if (this.token.length === 1  && this.token[0] === ".") throw new Error("不能单独出现`.`");
              this.emmitToken("NUMBER", this.token.join(""));
              this.token = [];
              return this.start(char); // put back char
            }
          }
          emmitToken(type, value) {
            this.tokens.push({
              type,
              value,
            })
          }
          push(char){
            // 每次执行 state 函数都会返回新的状态函数，实现状态迁移
            // console.log( this.state, char)
  
            if (this.state) {
                this.state = this.state(char);
            }
            else {
                console.log(char)
            }
            return this.check();
          }
          end(){
            this.state(EOF);
            return this.check();
          }
          check(){
            // 检测是否有 token 生成并返回。
            const _token = [...this.tokens];
            this.tokens = [];
            return _token;
          }
          clear(){
            this.token = [];
            this.tokens = [];
            this.state = this.start;
          }
        }

      
        function calcsum(input, {variables, calcopt = false, customfus = {}} = {}) {
            // console.log('sssssssssssss');
            function getTokens(str = '') {
                const lexer = new Lexer();
          
              
                let tokens = [];
              
                for (let c of str.split('')){
                  tokens = [...tokens,...lexer.push(c)];
                }
              
                return [...tokens,...lexer.end()];
        
            }
    
            let tokens = getTokens(input);
            // console.log(input, tokens)

    
            let funcs = {
                add(p1,p2) {
                    return p1 + p2
                },
                dec(p1, p2) {
                    return p1 - p2
                },
                multiply(p1, p2) {
                    return p1 * p2;
                },
                divide(p1, p2) {
                    return p1 / p2
                },
                cal(p1, opt, p2) {
                    if (opt === '*') {
                        return p1 * p2;
                    }
                },
                val(p1) {
                    return p1
                },
                gt(v1,v2) {
                    return v1 > v2
                },
                lt(v1, v2) {
                    return v1 < v2
                },
                eq(v1, v2) {
                    return v1 == v2;
                },
                _(str ='') {
                    let subret = calcsum(str, {variables, calcopt: false, customfus});
                    console.log('subret', subret);
                    return subret
                },
                ...customfus
            }
    
    
    
            let signmap = {
                '+': 'add',
                '-': 'dec',
                '*': 'multiply',
                '/': 'divide',
                '>': 'gt',
                '<': 'lt',
                '==': 'eq'
            }
    
            let tasks = [];

            function getval(p) {
                if (p.type === 'NUMBER') {
                    return parseFloat(p.value)
                }
                else if (p.type === 'VARIABLE') {
                    return variables[p.value]
                }
                return p.value
            }


            let tempvars = new Map();
            function gettempvarname(name, t) {
                let varname =  'r' + tempvars.size;
                let val = funcs[t[0]].apply(null, t.slice(1))
                tempvars.set(name, [varname, val]);
                // console.log(t, val)
                return varname
            }

            function handlefun(cur) {
                let reg = /([\w]+)\(([^)]*)\)/;
                cur.value.replace(reg, function(match, p1, p2) {
                    if (!p2.includes(',')) {
                        let t = [   
                            p1,
                            ...[p2 + ''],
                           
                        ]
                        let n = gettempvarname(cur.value, t)
                        
                        tasks.push([
                            ...t,
                            n
                        ])
                    }
                    else {
                        
                        let args = p2.split(',').map(v => {
                            v = v.trim();
                    
                            let ret = parseFloat(v);
                            if (Number.isNaN(ret)) {
                                // console.log(v, ret, variables[v])
                                if (['+', '-', '*', '/'].includes(v)) {
                                    // console.log('sssssssssssssss')
                                    return v
                                }

                                return variables[v]
                            }
                            return ret
                        })
                        // tasks.push([   
                        //     p1,
                        //     ...args,
                        //     gettempvarname(cur.value)
                        // ])

                        let t = [   
                            p1,
                            ...args,
                        
                        ]
                        let n = gettempvarname(cur.value, t)
                        
                        tasks.push([
                            ...t,
                            n
                        ])
                    }
                });
            }


            let lastretval = undefined;
    
            function checkprev(prev, arr, i) {
                if (prev) {
                    if (prev.type === "SIGN") {
                        let p = arr[i - 2];
                        let l = arr[i];
                        let last = '$';

                        if (l && l.type !== 'FUNCTION') {
                            if (typeof lastretval === 'undefined') {
                                last = getval(l);
                                lastretval = last;
                            }
                        }

                        if (p.type !== 'FUNCTION') {
                            tasks.push([
                                signmap[prev.value],
                                getval(p),
                                last
                            ])
                        } else {
                            if (calcopt) {
                                //    handlefun(p);
                                // console.log(tasks)
                                // let prev = arr[i - 3];
                                // checksign(prev, arr[i - 4])
                            }
                        }
                    }
                }
            }
    
            let arr = tokens.slice(0, tokens.length - 1);
            if (arr.length === 1 && calcopt) {
                tasks.push([
                    'val',
                    getval(arr[0]),
                ])
            }
            else {
                for (let i = arr.length - 1; i > -1; i--) {
                    let cur = arr[i];
                    if (cur.type !== 'SIGN') {
                      
                        if (cur.type === 'FUNCTION') {
                            handlefun(cur)
              
                            if (calcopt) {
                                let prev = arr[i - 1];
                                checkprev(prev, arr, i)
                            }
                        }
                        else {
                            
                            if (calcopt) {
                                let prev = arr[i - 1];
                                checkprev(prev, arr, i)
                            }
                        }
         
                    }
                }
            }
    
            // console.log(tasks, [...tempvars])

            let inputstr = input
            tempvars.forEach((v, k)=> {
                inputstr = inputstr.replace(k, v[0]);
                variables[v[0]] = v[1]
            })

            function run() {
                let ret;
                // console.log(tasks)
                tasks.forEach(task => {
                    let [funname, ...args] = task;
                    let parsedargs = args.map(v => {
                        if (v === '$') {
                            return ret
                        }
                        return v
                    })
                    if (funcs[funname]) {
                        ret = funcs[funname].apply(null, parsedargs)
                    }
                    else {
                        console.log(funname, task)
                    }
                });
    
                return ret
            }
            

            if(!calcopt) {
                // console.log(variables)
                return calcsum(inputstr, {calcopt: true, variables, customfus})
            }
            else {
                let ret = run()
                // console.log(input, ret, tasks)
                return ret
            }

        }

   
        let variables = {
            'false': false,
            'true': true,
            ...curctx
        }

        let customfus = {
            Arr() {
                return []
            },
            Map() {
                return new Map()
            },
            Set() {
                return new Set()
            },
            ...curctx
        }

        let cuscontext = {
            variables,
            customfus,
        }
        
        
        return  calcsum(code, cuscontext);
        // calcsum('1 + 2.3 + out + cal(out, *, 1) + _(out * 1)', cuscontext);

        
        // calcsum('1', cuscontext);

        // calcsum('1.8', cuscontext);

        // calcsum('out', cuscontext);

        // calcsum('"str"', cuscontext);

        // calcsum('false', cuscontext);


        // calcsum('Arr()', cuscontext);

        // calcsum('Map()', cuscontext);
    }

    // preevals({}, '2 > 1')
    // preevals()

    function precontext(codecache = {}, {main} = {}) {

        let { defStruct, defObject } = window.stdlib();

        /**
         * 
         * @param {{}} obj 
         * @param {string} path 
         * @param {*} value 
         * @returns 
         */
        const setObj = (obj, path, value) => {
            if (Object(obj) !== obj) return obj; // When obj is not an object
            // If not yet an array, get the keys from the string-path
            if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []; 
            path.slice(0,-1).reduce((a, c, i) => // Iterate all of them except the last one
                 Object(a[c]) === a[c] // Does the key exist and is its value an object?
                     // Yes: then follow that path
                     ? a[c] 
                     // No: create the key. Is the next key a potential array-index?
                     : a[c] = Math.abs(path[i+1])>>0 === +path[i+1] 
                           ? [] // Yes: assign a new array object
                           : {}, // No: assign a new plain object
                 obj)[path[path.length-1]] = value; // Finally assign the value to the last key
            return obj; // Return the top-level object to allow chaining
        };

        /**
         * The behaves the same as the lodash version https://www.npmjs.com/package/lodash.get
         *
         * Source: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
         */
        const getObj = (obj, path, defaultValue = undefined) => {
            const travel = regexp =>
            String.prototype.split
                .call(path, regexp)
                .filter(Boolean)
                .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
            const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
            return result === undefined || result === obj ? defaultValue : result;
        };

        let buildinfunnames = [];
        Object.keys(console).forEach(key => {
            buildinfunnames.push(`console.${key}`)
        });
        // console.log(buildinfunnames)
        
        const globalcontext = {
            outer: 'global',
            getval() {
                return 'getval'
            },
            obj: {},
            console,
            __$isFunCtx: true
        };
        window.__globalcontext = globalcontext

        function getFun(ctx, funcname) {
            let c = getObj(ctx, funcname);
            if (typeof c == 'undefined') {
                if (ctx.__$parent) {
                    return getFun(ctx.__$parent, funcname);
                }
            }
            else {
                return c
            }
        }


        /**
         * 
         * @param {{}} ctx 
         * @param {string} cond 
         * @returns {string}
         */
        function parseCondFun(ctx = {}, cond = '') {
            let funreg = /([\w_]*)\(([^\)]*)\)/g;
            let isRun = false;
                // console.log(v)

            cond = cond.replace(funreg, function(match, p1, p2) {
                isRun = true;
                // console.log(match, p1, p2)
                let funname = (p1 + '').trim();
                let args = (p2 + '').trim().split(',');
                let fun = getCtxVal(ctx, funname);
                let parsedargs = parseCtxArgs(ctx, args);
                // console.log(funname,parsedargs)
                if (fun) {
                    return fun.apply(null, parsedargs)
                }
                return match
            });

            // if (!isRun) {
            //     let args = [cond]
            //     return parseargs(args)[0]
            // }
            

            return cond
        }


        /**
         * 
         * @param {*} name 
         * @returns 
         */
        function getprops(name) {
            try {
                // console.log(codecache)
                if (codecache[name] && codecache[name].props) {
                    return codecache[name]?.props() ?? {}
                }

                return {}
            } catch(e) {
                console.log(e)
                return {}
            }
        }

        function __registerFun(ctx, somfunuuid, customname) {
            let cache = codecache[somfunuuid];
            if (cache) {
                let _name = customname ?? cache.name
                if (_name) {
                    ctx[_name] = createCodeFun(cache, somfunuuid)
                }
            }
        }

        function __createFun(somfunuuid) {
            let cache = codecache[somfunuuid];
            if (cache) {
                return  createCodeFun(cache, somfunuuid)
            }
            else {
                return null
            }
        }
        
        function setCtxVal(ctx = {}, key, val) {
            if (ctx.__$isFunCtx) {
                ctx[key] = val
            }
            else {
                if (ctx.__$parent) {
                    setCtxVal(ctx.__$parent, key, val)
                }
            }
        }

        // function updateCtxVal(ctx = {}, key, val) {
        //     if (typeof ctx[key] === 'undefined') {
        //         if (ctx.__$parent) {
        //             updateCtxVal(ctx.__$parent, key, val)
        //         }
        //     }
        //     else {
        //         ctx[key] = val
        //     }
        // }

        /**
         * 
         * @param {{codes: []}} cache 
         * @param {*} uuid 
         * @returns 
         */
        function createCodeFun(cache, uuid = '', {cusctx} = {}) {
            /**
             * obj[p1.p8]
             */
            let objpathreg = /([^[]*)\s*\[([^]*)\]/g;
            let ret = function(outctx = {}) {
                return new Promise(resolve => {
    
                    /**
                     * @type {{}}
                     */
                    let ctx = {...getprops(uuid), __funuuid: uuid, __$isFunCtx: true};

                    ctx.__$parent = outctx;
                    if (cusctx) {
                        ctx = cusctx
                    }

      
                    if (cache.codes) {
                        // console.log(cache.codes)
                        ;(async function () {
                            for (let code of cache.codes) {
                                /**
                                 * @type {[string, Array]}
                                 */
                                let [funname, funargs] = code;

                                if (funname === '__setCtx') {
                                    console.log('sssssssssssssssssss', ctx, funname, funargs)
                                    let [valpath, valcond] = funargs;
                                    let parsedvalcond = parseCondFun(ctx, valcond);
                                    
                                    let ret = preevals(ctx, parsedvalcond)
                                    // console.log( ret);
                                    ctx[valpath] =ret
                                }
                                else if (funname === '__update') {
                                    let [valpath, valcond] = funargs;
                                    // console.log(valpath, valcond)
                                    if (objpathreg.test(valpath)) {
                                        let valname = '';
                                        let objpath = '';
                                        valpath.replace(objpathreg, function(match, p1, p2) {
                                            valname = p1;
                                            objpath = p2;            
                                        });
                                
                                        let obj = getCtxVal(ctx, valname);
                                        let parsedvalcond = parseCondFun(ctx, valcond);
                                        let ret = preevals(ctx, parsedvalcond)
                                        console.log(ctx, obj, ret);
                                        if (obj) {
                                            setObj(obj, objpath, ret)
                                        }
                                    }
                                    else {
                                        let parsedvalcond = parseCondFun(ctx, valcond);
                                        let ret = preevals(ctx, parsedvalcond)
                                        setCtxVal(ctx, valpath, ret)
                                    }
                 
                                    // console.log('__update', ctx, valpath, parsedvalcond)
                                }
                                else if (funname === '__switch') {
                                    let fun = globalcontext.__switch;
                                    console.log('__switch', ctx, funargs)
                                    await fun.apply(null, [ctx, funargs]);   
                                }
                                else if (funname === '__break') {
                                    // outctx[breaksymbol] = true;
                 
                                    let curCtx = getCurLoopCtx(outctx);
                                    console.log('__break', outctx)
                                    if (curCtx && curCtx.__$break) {
                                        curCtx.__$break()
                                    }
                                    // updateCtxVal(outctx, '__$break')
                                }
                                else if (funname === '__registerFun') {
                                    // ctx[_name] = createCodeFun(cache, somfunuuid)
                                    // console.log(funargs)
                                    let [funuuid] = funargs;
                                    __registerFun(ctx, funuuid);
                                }
                                else if (funname === '__callglobal') {
                                    console.log('__callglobal', funargs)
                                    let valpath = funargs[0];
                                    let args = parseCtxArgs(outctx, funargs[1])

                                    // console.log(args)
                                    
                                    let fun = getObj(globalcontext, valpath)
                                    if (fun) {
                                        fun.apply(null, args)
                                    }
                                }
                                else if (funname === '__call') {
                                    console.log('__call', funname, funargs, codecache)
                                    let thisobjp = funargs[0];
                                    let truename = funargs[1];
                                    let praargs = funargs.slice(2);
                   
                                    let callctx = ctx;
                                    if (thisobjp) {
                                        callctx = ctx[thisobjp]
                                    }
                                    let fun = getCtxVal(callctx, truename);
                                    // console.log(fun, ctx, thisobjp)
                      

                                    if (fun) {
                                        console.log('callctx', callctx)
                                        globalcontext.__runCusFun(fun, callctx,  praargs, {debugflag: '__call ' + thisobjp})
                                    }
                                }
                                else if (funname === '__setFun') {
//   console.log(funname, funargs, codecache, ctx, outctx);
                                    let funuuid = funargs[0];
                                    let valname = funargs[1];
                                    let innerCtx = {};
                                    innerCtx.__$parent = ctx;
                                    let cache = codecache[funuuid];

                                    let fun =  createCodeFun(cache, funuuid, {cusctx: innerCtx})
                                    // setCtxVal(innerCtx, valname, fun)
                                    ctx[valname] = fun
                                }
                                else if (funname === '__struct') {
                                    let funuuid = funargs[0];
                                    let valname = funargs[1];
                                    let innerCtx = {};
                                    innerCtx.__$parent = ctx;
                                    let cache = codecache[funuuid]
                                    let fun =  createCodeFun(cache, funuuid, {cusctx: innerCtx})

                                    await globalcontext.__runCusFun(fun, ctx, [])

                                    console.log('__struct', funargs, ctx, innerCtx)
                                    let obj = defStruct({
                                        [valname]: function() {
                                            return innerCtx
                                        }
                                    });

                                    setCtxVal(ctx, valname, obj)
                                }
                                else if (funname === '__init') {
                                    let valname = funargs[0];
                                    let structname = funargs[1];
                                    let valargs = funargs[2];
                                    console.log('__init', structname, valargs, ctx);
                                    if (typeof ctx[structname] === 'function') {
                                        let obj = ctx[structname].apply(null, valargs);
                                        // console.log(obj)
                                        // ctx[valname] = obj
                                        setCtxVal(ctx, valname, obj)
                                    }
                                }
                                else if (funname === '__object') {

                                    // console.log(funname, funargs, codecache);
                                    let funuuid = funargs[0];
                                    let valname = funargs[1];
                                    let innerCtx = {};
                                    innerCtx.__$parent = ctx;
                                    let cache = codecache[funuuid]
                                    let fun =  createCodeFun(cache, funuuid, {cusctx: innerCtx})

                                    await globalcontext.__runCusFun(fun, ctx, [])

                                    console.log('__object', ctx, innerCtx)

                                    let obj = defObject({
                                        value: function() {
                                            return innerCtx
                                        }
                                    });

                                    setCtxVal(ctx, valname, obj)
                                }
                                else {
                                    // console.log(funname)
                                    let fun = getFun(ctx, funname);

                                    if (fun) {
                                        // console.log(funargs, fun)
                                        await fun.apply(null, [ctx, ...funargs]);   
                                    }
                                }
        
              
                            }

                            resolve()
                        })();
                    }
                })
            }
            ret.__funuuid = uuid;
            return ret
        }


        /**
         * 
         * @param {[]} arr 
         * @returns 
         */
        function parseargs(arr = []) {
            let strreg = /"([^\n]*)"/g;
            console.log('parseargs', arr)
            return arr.map(v => {
                if (isNumeric(v)) {
                    return parseFloat(v)
                }
                else if (strreg.test(v)) {
                 
                    let ret = v.replace(strreg, function(match,p1) {
                        // console.log(match, p1)
                        return p1
                    })
                    // console.log(ret);
                    return ret
                }
                else if (v === 'true') {
                    return true
                }
                else if (v === 'false') {
                    return false
                }
                // console.log(v)
                return v
            })
        }

        function parseCtxArgs(outercontext = {}, args = []) {
            return parseargs(args).map(v => {
                if (typeof v === 'string') {
                  if (!v.includes('"')) {
                    if (v === 'this') {
                        return outercontext
                    }
                    let ret = getCtxVal(outercontext, v);
                    if (typeof ret === 'undefined') {
                        return v
                    }
                    return ret
                  }
                }
                return v
             });
        }


        globalcontext.__entries = function(v) {
            let ret = v;
            if (v.entries) {
             ret = v.entries()
            }
            else {
             ret = Object.entries(v)
            }
            return ret;
        }

        function getCtxVal(ctx, valpath) {
            let r =  getObj(ctx, valpath);
            if (typeof r === 'undefined') {
                if (ctx.__$parent) {
                    return getCtxVal(ctx.__$parent, valpath)
                }
            }
            else {
                return r
            }
        }

        globalcontext.__runloop = function(ctx, valpath, blockuuid,{cusval, needreturn = false, label = ''} = {}) {
            let tmpname = '__runcurloopcode' + Math.random();
            // ctx.tmpname = tmpname;
            ctx.__$loopbreak = false;
            ctx.__$label = label;
            ctx.__$break = function() {
                console.log('call break', ctx)
                ctx.__$loopbreak = true;
            }
      
            return new Promise(async resolve => {
                let val = getCtxVal(ctx, valpath);
                if (typeof cusval !== 'undefined') {
                    val = cusval
                }
   
                let __runFun = globalcontext.__runFun;
                let __createblock = globalcontext.__createblock;
    
                if (typeof val !== 'undefined') {
                    let entries = globalcontext.__entries(val);
                    // console.log([...entries])
       
                    for (let entrie of entries) {
                
                        console.log(blockuuid,   tmpname, ctx.__$label,  ctx.__$loopbreak)
             
                             
                        if (ctx.__$loopbreak) {
                            console.log('call break')
                            break;
                        }
                        let blockname = __createblock(ctx, blockuuid);
                        let cache = codecache[blockuuid];
                        // console.log(blockname)

                        let innerctx = {};
                        if (!needreturn) {
                            innerctx.__isLoopCtx = true
                        }
                        if (cache.keyname) {
                          innerctx = {...innerctx, [cache.keyname]: entrie[0], [cache.valname]: entrie[1]}
                        }
                        innerctx.__$parent = ctx;
                        innerctx.__$break = function() {
                            ctx?.__$break()
                        }
                        // console.log(cache, innerctx)
            
                        await __runFun(innerctx, blockuuid, [], {customname: blockname, debugflag: '__runloop'});
                        
             
                    }

                    resolve()
                }
                else {
                    resolve()
                }
            })
        }


        globalcontext.__createblock = function(ctx, blockuuid) {
            let funname ='__block__' + blockuuid + '__' + Math.random()
            globalcontext.__registerFun(ctx, blockuuid, funname);
            return funname
        }

        function getCurLoopCtx(ctx) {
            if (typeof ctx.__isLoopCtx === 'undefined') {
                if (ctx.__$parent) {
                    return getCurLoopCtx(ctx.__$parent)
                }
            }
            else {
                return ctx
            }
        }

        globalcontext.__switch = async function(ctx,cases = []) {
            let matchcase = '';
            // console.log('__switch', ctx, cases)
            // let defaultcases = cases.filter(v => v[0] === 'default')

            cases.some(
                /**
                 * 
                 * @param {[string, string]} v 
                 */
                v => {
                let [cond,blockuuid] = v;

                if (cond === 'default') {
                    matchcase = blockuuid
                }
                else {
                    let parsedcond = parseCondFun(ctx, cond);
                
                    if (parsedcond) {
                        let curCtx = getCurLoopCtx(ctx);
    
                        let ret = preevals(curCtx, parsedcond);
                        // console.log('cond ' +  parsedcond, curCtx, ret)
                        if (ret) {
                            matchcase = blockuuid
                            return true
                        }
                    }
                }

            });
            // console.log(matchcase)
            if (matchcase) {
                // await globalcontext.__runloop(ctx, Math.random() + '', matchcase, {cusval: [1], needreturn: true, label: '__switch'});
                // console.log('sssssssssssss')
              
                let blockname = globalcontext.__createblock(ctx, matchcase);
                let cache = codecache[matchcase];
                if (cache) {
                    await globalcontext.__runFun(ctx, matchcase, [], {customname: blockname, debugflag: '__switch'});
                }
                return;
            }
            return;
        }

        // globalcontext.__runcalc = function(ctx, code= '') {
        //     let ret = preevals(ctx, code)
        //     return ret
        // }

        globalcontext.__registerFun = function(ctx, somfunuuid, customname) {
            __registerFun(ctx, somfunuuid, customname)
        }

        globalcontext.__runCusFun = async function(fun, ctx, args = [], {customname, debugflag = ''} = {}) {
            if (fun) {
                await fun?.apply(null, [ctx, ...args]);
            }
            else {
                console.log('__runCusFun err')
            }
        }

        async function runFun( outercontext = {}, funnameuuid = '', args = [],  {customname, debugflag = ''} = {}) {
            let innercontext = {};
            innercontext.__$parent = outercontext;
            
            console.log(innercontext, outercontext, debugflag)

            if (buildinfunnames.includes(funnameuuid)) {
                // console.log(outercontext)
                let fun = getCtxVal(innercontext, funnameuuid);
                // console.log(fun, funnameuuid)
                if (fun) {
                    // console.log(args)
                    let parsedargs = parseCtxArgs(outercontext, args)
                    // console.log(parsedargs)
                    queueMicrotask(() => {
                        fun.apply(null, parsedargs);
                    })
                }
            }
            else {
                // console.log(funnameuuid, customname)
                let cache = codecache[funnameuuid];
                let funcname = customname ?? cache.name;
                let fun = getCtxVal(innercontext, funcname);
                await fun?.apply(null, [innercontext, ...args]);
                // console.log( debugflag +` call runfun ${funcname} end`)

            }
            // return outercontext
  
        }
        globalcontext.__runFun= runFun;

        let runmain = async function(ctx = globalcontext, funuuid, option = {}) {
            // globalcontext.__registerFun(ctx, funuuid);
            let fun = __createFun(funuuid);
            globalcontext.__runCusFun(fun, ctx, [], option)
        }

        
        if (main) {
            runmain(globalcontext, main,  {debugflag: 'main'})
        }




        // console.log(globalcontext)
    }

    let cssstyles = {
        ['mainfunuuid']: {
            name: 'mainfun',
            codes: [
                ['__registerFun', ['somfunuuid']],
                ['__struct', ['structfunuuid', 'HashSet']],
                ['__init', [ 'obj', 'HashSet', []]],
                ['__object', ['objfunuuid', 'config']],
                ['__update', ['obj[p1.p8]', '18']],
                ['__call', ['', 'somefun', {}]],
                ['__call', ['config', 'fun_some', {}]],
                ['__call', ['obj', 'fun_some', {}]],
                // ['__runloop', ['arr', 'loop1blockuuid']],
                // ['__switch', [
                //     ['8 > 1', 'cond1blockuuid']
                // ]],

                // ['__switch', [
                //     ['1 > 8', 'cond1blockuuid'],
                //     ['default', 'cond8blockuuid']
                // ]]
            ],
            props: function() {
                return {
                    outer: 'main',
                    arr: [1,2,3]
                }
            }
        },
        ['structfunuuid']: {
            name: '__struct_def',    
            codes: [
                ['__callglobal', [ 'console.log', [`"struct outer"`]]],
                ['__setCtx', ['name', `"struct"`]],
                ['__setFun', ['struct_sub1uuid', 'fun_some']],
            ],
            props:  function() {
                return {
                }
            }
        },
        ['struct_sub1uuid']: {
            name: 'fun_some',    
            codes: [
                ['__callglobal', [ 'console.log', [`"struct call"`, 'this']]]
            ],
            props:  function() {
                return {
                    inner: 'some'
                }
            }
        },
        ['objfunuuid']: {
            name: '__obj_def',    
            codes: [
                ['__callglobal', [ 'console.log', [`"obj outer"`]]],
                ['__setCtx', ['name', `"some"`]],
                ['__setFun', ['obj_sub1uuid', 'fun_some']],
            ],
            props:  function() {
                return {
                }
            }
        },
        ['obj_sub1uuid']: {
            name: 'fun_some',    
            codes: [
                ['__callglobal', [ 'console.log', [`"obj call"`, 'some']]]
            ],
            props:  function() {
                return {
                    inner: 'some'
                }
            }
        },
        ['somfunuuid']: {
            name: 'somefun',    
            codes: [
                // ['__setCtx', ['outer', `"some"`]],
                ['__update', ['outer', `"some change"`]],
                ['__callglobal', [ 'console.log', [`"some outer"`, 'outer']]]
            ],
            props:  function() {
                return {
                    inner: 'some'
                }
            }
        },
        ['loop1blockuuid']: {
            keyname: 'key',
            valname: 'val',
            codes: [
            //  ['__setCtx', ['outer', `"some"`]],
                ['__callglobal', [ 'console.log', ['key','val']]],
                ['__switch', [
                    ['key > 0', 'condlblockuuid']
                ]],
                // ['__break', []]
            ],
        },
        ['cond1blockuuid']: {
            name: 'cond1fun',
            codes: [
                ['__callglobal', [ 'console.log', [`"cond1"`]]]
            ],
        },
        ['cond8blockuuid']: {
            name: 'cond1fun',
            codes: [
                ['__callglobal', [ 'console.log', [`"cond8"`]]]
            ],
        },
        ['condlblockuuid']: {
            name: 'cond8fun',
            codes: [
                ['__callglobal', [ 'console.log', [`"condl"`]]],
                ['__break', []]
            ],
        }
    }

    setTimeout(() => {
        // precontext(cssstyles, {main: 'mainfunuuid'})
    }, 300)
}