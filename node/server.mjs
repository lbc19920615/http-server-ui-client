import beautify from 'js-beautify';
globalThis.beautifier = beautify


import { parseStaticTemplate } from '../src/web/frm.js';


let testtpl = function(debug = false) {

    let tempdata = {
        str: "teststr",
        num: 1,
        testFalse: false,
        deepobj: {
            name: 'deepobj_name'
        },
        items: [
            {
                items: [1,2,3]
            }
        ],
    }


    let htmlString = /*html*/`
<template>
    <h1>Shopping list</h1>
    <z-list>
        <div slot="content">
            <div>
            {= foo(deepobj)}
            {= str} {= num}
            </div>
            {= deepobj.name}
            {#each items as item, i}
            <z-list-item>item_1</z-list-item>
            <div class="sub">
                {#each item.items as sub_item, y}
                    <div>sub_item1 {= i} {= y}</div>
                {/each}

                {#if item.items}
                    <div>if_item1</div>
                {/if}  

                {#if testFalse}
                    <div>不会编译出dom</div>
                {/if} 
                
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

    let parseToVue = {
        handlers: {
            beforeRenderTag(tagname = '') {
                if (tagname === 'div') {
                    return ['view']
                }
                return [tagname]
            },
            handleEachRender(curuuid = '', ruleConds = [], options = {}, handleContent = function() {}) {
                let eachDefCond = ruleConds[1];
                let  [eachBlockValueName, eachBlockIndexName] = ['', '']
                if (eachDefCond) {
                    let arr = eachDefCond.split(',').map(v => v.trim())
                    // log(arr)
                    if (arr.length === 2) {
                        [eachBlockValueName, eachBlockIndexName] = arr
                    }
                }     
 
                // console.log(ruleConds);
                
                let wxstr = ''
                if (eachBlockValueName) {
                    wxstr = `(${eachBlockValueName.trim()})`
                }
                if (eachBlockIndexName) {
                    wxstr = `(${eachBlockValueName.trim()}, ${eachBlockIndexName.trim()})`
                }
        
                // console.log(wxstr);

                options.str = options.str + `<block v-for="${wxstr} in ${ruleConds[0]}" >\n`
                handleContent()
                options.str = options.str + `\n</block>\n`
            },
            handleValueRender(content = '', options = {}) {
                options.str = options.str + '{{ ' + content + ' }}'
            },
            handleIfRender(ruleConds = [], options = {}, handleContent = function() {}, { partials, functions, travel, createSuboption, elseIfs, elses} = {}) {
                options.str = options.str + `<block v-if="${ruleConds[0]}">\n`
                handleContent()
                options.str = options.str + `\n</block>\n`

                elseIfs.some(v => {
                    options.str = options.str + `<block v-else-if="${v.cond.trim()}">\n`;
                    let suboption = createSuboption()             
                    travel(v.nodes, suboption);
                    options.str = options.str + suboption.str
                    options.str = options.str + `\n</block>\n`
                })
                
                if (elses.length > 0) {
                    options.str = options.str + `<block v-else>\n`;
                    let suboption = createSuboption()                      
                    travel(elses.at(-1).nodes, suboption);
                    options.str = options.str + suboption.str
                    options.str = options.str + `\n</block>\n`
                }

            }
        } 
    }

    return parseStaticTemplate(htmlString, tempdata, {
        functions: {
            foo(deepobj) {
                // console.log(deepobj);
                return 'bar'
            }
        },
        log,
        handlers: parseToVue.handlers
    })

}



function testWeb() {

    const obj = {
        list: []
    };

    
    
    setTimeout(() =>{

    
        let ret = testtpl(true)


        

    }, 1000)
    
}

testWeb()