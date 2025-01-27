import "./zy.js"
import { createInstance } from "./zui.js"

console.log(createInstance, 1)

let { defStruct} = window.stdlib();
let { StorageList } = window.stdStruct();



let ins = createInstance();
let createEle = ins.createEle;
let { View, Dialog1, dynEach, Link, choose } = ins.useViews();
let dom = ins.dom;

let testobj = StorageList('ups');

        let mcb = window.zInitMessageCallback();

        let getHistory = function() {
            return new Promise(resolve => {
                document.querySelector('iframe[data-count]').contentWindow.postMessage( {
                    type: 'COLS_GET', key: 'search_history:search_history', id: 1
                }, "https://s1.hdslb.com");
                mcb.pushCallback(function(e) {
                    console.log(e.data)
                    if (e.data.type === 'COLS_RES') {
                        let val = e.data?.value;
                        let obj = JSON.parse(val);
                        resolve(obj);
                    }
                })
            })
        }
        let shareCss = `
.plg_btn {
 width: max-content;
 margin-left: 10px;
}

.plg_row {
 display: flex;
 align-items: center;
}


.no_act_dialog [dialog_form] {
 height: 0 !important;
 overflow: hidden;
}


.history_list {
 position: relative;
}

 .history_list  {
    & dialog {
        left: auto;
    }
 }

        `



let mainComp = ins.createComp({
    styles: [
        shareCss
    ],
    setup() {
        let str = 'hello';
        let num = 1;
        let arr = [];
        return {
            str,
            num,
            arr,
        }
    },
    render(state, { $set, element, ...funcs } = {}) {
        console.log(state, $set, funcs);

        let getref = funcs.$getRef;
        
        Dialog1({
            $refname: 'dialog8',
            classList: ['no_act_dialog', 'app-dialog'],
            dialogHtml() {
                return '<div dialog_app></div>'
            }
        });

        View('', function() {
            
            View('&#x2630;', {
                classList: ['history_list'],
                onclick(e) {
                    //console.log(funcs.$getRef('dialog8'))

                    let dialog8 = getref('dialog8')
                    dialog8.mount(e.target).then((dialog) => {
                        let appcon = dialog.children[0];
                        let dialogComp = ins.createComp({
                            styles: [
                                shareCss
                            ],
                            setup() {
                                let historys = [];
                                return {
                                    historys
                                }
                            },
                            render(state, { $set, element, ...funcs } = {}) {
                                getHistory().then(res => {
                                    console.log(res)
                                    $set('historys', function(oldval) {
                                        return [].concat(res.map(v => v.value))
                                    })
                                })

                                dynEach({
                                    valpath: 'historys',
                                    create(dialogitem) {
                                        View('',{
                                            classList: ['plg_row']
                                        }, function() {
                                            View(dialogitem);
                                            View('choose', {
                                                classList: ['plg_btn'],
                                                onclick() {
                                                  
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                        })
                        dialogComp.mount(appcon);
                    });
                }
            })
        });


    }
});

mainComp.mount(document.querySelector('#actionapp'))