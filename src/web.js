import {BaseEle} from "./web/core.js"

import "./web/imageslider.js"

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

import { parseStaticTemplate } from "./frm"

let testTpl = function(debug = false) {

    let tempData = {
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

    return parseStaticTemplate(htmlString, tempData, {
        functions: {
            foo(deepobj) {
                
                return 'bar'
            }
        },
        log
    })

}


import onChange from 'on-change';

function testWeb() {

    const obj = {
        list: []
    };
    let index = 0;
    const watchedObject = onChange(obj, function (path, value, previousValue, applyData) {
        console.log('Object changed:', ++index);
        console.log('this:', this);
        console.log('path:', path);
        console.log('value:', value);
        console.log('previousValue:', previousValue);
        console.log('applyData:', applyData);
        if (path.startsWith('list')) {
            let items = deepGet(obj, 'list', []);

        }
    });
    
    
    
    setTimeout(() =>{
     
        watchedObject.list.push({
            num: Date.now(),
            content: ''
        })
    
        window.watchedObject = watchedObject
    
        let html = testTpl(false)
        // document.querySelector('#webapp').setHTMLUnsafe(html)

        

    }, 1000)
    
}

testWeb()