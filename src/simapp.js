
export function createTest() {


    function ElementLib({ html, repeat, map } = {}) {

        function handleVal(type, v) {
            let newVal = v
            if (type === 'number') {
                newVal = parseFloat(v);
            }
            return newVal
        }

        function numberField(name, prop, model, { id = createUUID(), oncallback } = {}) {
            let value = model[name];
            function handleChange() {
                return function (e) {
                    let newVal = handleVal(e.target.type, e.target[prop])

                    model[name] = newVal;
                    if (oncallback) {
                        oncallback('change', {

                            detail: newVal
                        })
                    }
                }
            }
            return html`
        <label >${name}</label>
        <input  type="number" value="${value}"
            @change="${handleChange()}"
        >
        `
        }

        function checkboxField(name, prop, model, { id = createUUID(), oncallback } = {}) {
            let value = model[name];
            function handleChange() {
                return function (e) {
                    let newVal = handleVal(e.target.type, e.target[prop])
                    model[name] = newVal;
                    if (oncallback) {

                        oncallback('change', {
                            detail: newVal
                        })
                    }
                }
            }
            return html`
        <label for="${id}">${name}</label>
        <input id="${id}" type="checkbox" value="${value}" ?checked="${value}"
            @change="${handleChange()}"
        >
        `
        }

        /**
         * 
         * @param {*} arr 
         * @param {(item: any, index: number)=>any} buildFun 
         * @param {*} keyName 
         * @returns 
         */
        function seach(arr = [], buildFun = () => { }, keyName = 'id') {
            let ret = repeat(arr, (item) => {
                if (item) {
                    return item[keyName]
                }
                return item
            }, function (item, index) {
                if (item) {
                    return buildFun(item, index)
                }
                return ''
            })
            return ret;
        }

        /**
         * 
         * @param {*} arr 
         * @param {(item: any, index: number)=>any} buildFun 
         * @returns 
         */
        function smap(arr = [], buildFun = () => { }) {
            let ret = map(arr, buildFun)
            return ret;
        }

        /**
         * 
         * @param {*} fields 
         * @param {{}} model
         */
        function sfields(fields = [], model = {}) {
            let formComps = [];
            fields.forEach(v => {
                if (v[1].type == 'checkbox') {
                    formComps.push(
                        checkboxField(v[0], 'checked', model, {})
                    )
                }
                else if (v[1].type == 'number') {
                    formComps.push(
                        numberField(v[0], 'value', model, {})
                    )
                }
            })
            return html`${formComps.map(v => v)}`
        }

        return {
            seach,
            smap,
            checkboxField,
            sfields,
            numberField
        }
    }




    import('http://localhost:7001/public/sta/index/zui.js?v=' + Math.random())
        .then(({ createInstance }) => {

            let app = document.createElement('div');
            app.innerHTML = `
                <div id="app1"></div>
            `;
            document.body.appendChild(app)

            let ins = createInstance();
            let createEle = ins.createEle;
            let { view1, choose, dynEach, sel, stylesheet } = ins.useViews();
            let dom = ins.dom;



            let view2 = ins.defView(function (props) {
                let div = createEle('div');
                let dialogId = 'dialog__' + createUUID()
                let btn = createEle('div');
                btn.innerHTML = 'btn' + Math.random();



                let dialog = createEle('dialog')

                dialog.setAttribute('id', dialogId)
                dialog.addEventListener("close", (e) => {
                    // console.log(dialog.returnValue)
                    dialog.innerHTML = ''
                    if (props?.onclose) {
                        props.onclose(dialog)
                    }
                });



                div.innerHTML = /*html*/`
                ${props?.innerHTML ?? ''}
                `;

                div.appendChild(dialog)
                div.appendChild(btn);
                dom.on(btn, 'click', function (e) {
                    // console.log(this,  e.target.parentElement.querySelector)
                    // e.target._shadowRoot.getElementById(dialogId).showModal()
                    dialog.innerHTML = `
                        <div dialog_content>${props?.dialogHtml ? props.dialogHtml() : ''}</div>
                    <form method="dialog">
                   
                        <button value="returnval">close</button>
                    </form>
                `
                    dialog.showModal();
                    setTimeout(() => {
                        if (props?.onshow) {
                            props.onshow(dialog)
                        }
                    })
                })

                return div;
            });


            let { fetchLog, calcEma } = window.zStockUtils()

            let zchart = ins.defView(function (props = {}) {
                let div = createEle('div', props);


                div.style.width = '900px';
                div.style.height = '700px';

                let upColor = '#00da3c';
                let downColor = '#ec0000';
                let echart;

                let userconfig = props?.config ?? {}

                div.$update = function ({ symbol = userconfig.symbol } = {}) {
                    echart?.dispose()
                    echart = echarts.init(div);
                    fetchLog({
                        isEtf: false, searchModel: { symbol: symbol },
                        onDone({ allklineData = [], allWeekData = [] } = {}) {
                            let data = allWeekData;
                            let klinedata = data.map(v => {
                                return [v.open, v.close, v.low, v.high]
                            })
                            let dates = data.map(v => {
                                return dayjs(v.date).format('YYYY/MM/DD')
                            });

                            let macdData = window.calcMacd(data);
                            let kdjData = window.calcKdj(data);

                            let emaData = calcEma(data);

                            console.log(emaData)

                            let startVal = props?.startVal(dates) ?? 0;
                            let option = {
                                animation: false,
                                legend: {
                                    bottom: 10,
                                    left: 'center',
                                    data: ['Dow-Jones index', 'upper', 'mid', 'lower', 'macd', 'dif', 'dea', 'k', 'd', 'j', 'ema12', 'ema50']
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'cross'
                                    },
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    padding: 10,
                                    textStyle: {
                                        color: '#000'
                                    },
                                    position: function (pos, params, el, elRect, size) {
                                        const obj = {
                                            top: 10
                                        };
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                        return obj;
                                    },
                                    valueFormatter: (value) => `${value?.toFixed ? value.toFixed(3) : value}`,
                                    // extraCssText: 'width: 170px'
                                },
                                axisPointer: {
                                    link: [
                                        {
                                            xAxisIndex: 'all'
                                        }
                                    ],
                                    label: {
                                        backgroundColor: '#777'
                                    }
                                },
                                toolbox: {
                                    feature: {
                                        dataZoom: {
                                            yAxisIndex: false
                                        },
                                        brush: {
                                            type: ['lineX', 'clear']
                                        }
                                    }
                                },
                                brush: {
                                    xAxisIndex: 'all',
                                    brushLink: 'all',
                                    outOfBrush: {
                                        colorAlpha: 0.1
                                    }
                                },
                                visualMap: {
                                    show: false,
                                    seriesIndex: 5,
                                    dimension: 2,
                                    pieces: [
                                        {
                                            value: 1,
                                            color: downColor
                                        },
                                        {
                                            value: -1,
                                            color: upColor
                                        }
                                    ]
                                },
                                grid: [
                                    {
                                        left: '10%',
                                        right: '8%',
                                        height: '43%'
                                    },
                                    {
                                        left: '10%',
                                        right: '8%',
                                        top: '50%',
                                        height: '18%'
                                    },
                                    {
                                        left: '10%',
                                        right: '8%',
                                        top: '66%',
                                        height: '18%'
                                    }
                                ],
                                xAxis: [
                                    {
                                        type: 'category',
                                        data: dates,
                                        boundaryGap: false,
                                        axisLine: { onZero: false },
                                        splitLine: { show: false },
                                        min: 'dataMin',
                                        max: 'dataMax',
                                        axisPointer: {
                                            z: 100
                                        }
                                    },
                                    {
                                        type: 'category',
                                        gridIndex: 1,
                                        data: dates,
                                        boundaryGap: false,
                                        axisLine: { onZero: false },
                                        axisTick: { show: false },
                                        splitLine: { show: false },
                                        axisLabel: { show: false },
                                        min: 'dataMin',
                                        max: 'dataMax',
                                    },
                                    {
                                        type: 'category',
                                        gridIndex: 2,
                                        data: dates,
                                        boundaryGap: false,
                                        axisLine: { onZero: false },
                                        axisTick: { show: false },
                                        splitLine: { show: false },
                                        axisLabel: { show: false },
                                        min: 'dataMin',
                                        max: 'dataMax',
                                    }
                                ],
                                yAxis: [
                                    {
                                        scale: true,
                                        splitArea: {
                                            show: true
                                        }
                                    },
                                    {
                                        scale: true,
                                        gridIndex: 1,
                                        splitNumber: 2,
                                        axisLabel: { show: false },
                                        axisLine: { show: false },
                                        axisTick: { show: false },
                                        splitLine: { show: false },
                                    },
                                    {
                                        scale: true,
                                        gridIndex: 2,
                                        splitNumber: 2,
                                        axisLabel: { show: false },
                                        axisLine: { show: false },
                                        axisTick: { show: false },
                                        splitLine: { show: false },
                                    }
                                ],
                                dataZoom: [
                                    {
                                        type: 'inside',
                                        xAxisIndex: [0, 1, 2],
                                        start: startVal,
                                        end: 100
                                    },
                                    {
                                        show: true,
                                        xAxisIndex: [0, 1, 2],
                                        type: 'slider',
                                        top: '85%',
                                        start: startVal,
                                        end: 100
                                    },
                                ],
                                series: [
                                    {
                                        name: 'Dow-Jones index',
                                        type: 'candlestick',
                                        data: klinedata,
                                        itemStyle: {
                                            color: upColor,
                                            color0: downColor,
                                            borderColor: undefined,
                                            borderColor0: undefined
                                        }
                                    },
                                    {
                                        name: 'ema12',
                                        type: 'line',
                                        data: emaData.ema12,
                                        smooth: true,
                                        showSymbol: false,
                                        lineStyle: {
                                            opacity: 0.5
                                        }
                                    },
                                    {
                                        name: 'ema50',
                                        type: 'line',
                                        data: emaData.ema50,
                                        smooth: true,
                                        showSymbol: false,
                                        lineStyle: {
                                            opacity: 0.5
                                        }
                                    },
                                    {
                                        name: 'macd',
                                        type: 'bar',
                                        data: macdData.macd,
                                        xAxisIndex: 1,
                                        yAxisIndex: 1,
                                        itemStyle: {
                                            color(e) {
                                                // console.log(e)
                                                if (e.value < 0) {
                                                    return upColor
                                                }
                                                return downColor
                                            }
                                        }
                                    },
                                    {
                                        name: 'k',
                                        type: 'line',
                                        data: kdjData.k,
                                        showSymbol: false,
                                        xAxisIndex: 2,
                                        yAxisIndex: 2,
                                        itemStyle: {
                                            color: '#fd53b8'
                                        }
                                    },
                                    {
                                        name: 'd',
                                        type: 'line',
                                        data: kdjData.d,
                                        showSymbol: false,
                                        xAxisIndex: 2,
                                        yAxisIndex: 2,
                                        itemStyle: {
                                            color: '#fff000'
                                        }
                                    },
                                    {
                                        name: 'j',
                                        type: 'line',
                                        data: kdjData.j,
                                        showSymbol: false,
                                        xAxisIndex: 2,
                                        yAxisIndex: 2,
                                        itemStyle: {
                                            color: '#3366ff'
                                        }
                                    },
                                ]
                            }
                            echart.setOption(option, true);
                            // console.log(allklineData)
                        }
                    })
                }

                div.$destory = function () {
                    // console.log('destory')
                    echart?.dispose()
                }

                return div
            });

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
            // console.log(shourcutmap)

            ins.createCss({
                render() {
                    stylesheet({
                        handleProp(k = '', v, defStr) {
                            let key = k.trim();
                            let val = v;
                   
                            if (val && val.replace) {
                                console.log(val)
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
                            
                            return  `${key}: ${val}
                            `;
                        }
                    }, function () {
                        sel(['.cls', {
                            '$varname': 180,
                            'w': 'calc($varname * 2)',
                        }], function () {
                            sel(['&:hover', {
                                '$varname': 180,
                                width: '$varname',
                            }]);

                            sel(['.child', {
                            }])
                        });

                        sel(['@media (width > 600px)'], function () {
                            sel(['.cls', {
                                width: 180,
                            }], function () {

                                sel(['&:hover', {
                                    '$varname': 180
                                }]);

                                sel(['.child', {
                                }])
                            });
                        });
                    });
                },
                end(styles = [], cssArr = []) {
                    console.log(styles, cssArr)
                }
            })


            let mainComp = ins.createComp({
                setup() {
                    let str = 'hello';
                    let num = 1;
                    let arr = [1, 2, 3];
                    function somefun() {
                        console.log(this)
                    }
                    return {
                        str,
                        num,
                        arr,
                        somefun
                    }
                },
                render(state, { $set, element, ...funcs } = {}) {
                    // console.log(state, $set, funcs);


                    view1({
                        template: `div2 #{str} #{num}`,
                        onclick() {
                            $set('num', v => v + 1);
                            $set('arr', v => {
                                // console.log(v)
                                v[0] = Math.random()
                                return v
                            })
                        }
                    }, function () {
                    });

                    view1({}, function () {
                        choose({
                            cases: {
                                '#{num} > 1': function () {
                                    // console.log('ssss')
                                    view1({
                                        innerHTML: 'num > 1 ' + Math.random()
                                    })
                                },
                                '#{num} < 2': function () {
                                    view1({
                                        innerHTML: 'num < 2 ' + Math.random()
                                    })
                                }
                            }
                        });

                        dynEach({
                            valpath: 'arr',
                            create(item, index) {
                                view1({
                                    template() {
                                        return `${index} ` + Math.random()
                                    }
                                })
                            }
                        })

                    })

                    view2({
                        classList: ['test_sub1'],
                        dialogHtml() {
                            return '<div id="dialogapp"></div>'
                        },
                        onshow(dialog) {
                            console.log(dialog)
                            chartComp.mount(dialog.querySelector('#dialogapp'))
                        },
                        onclose(dialog) {
                        }
                    });


                }
            });

            let chartComp = ins.createComp({
                setup({ onMount, onUnMount, querySelector }) {
                    let chartID = 'chart' + createUUID()
                    onMount(function () {
                        //    console.dir(querySelector('#chart1') )
                        querySelector('#' + chartID)?.$update()
                    })

                    onUnMount(function () {
                        querySelector('#' + chartID)?.$destory();
                    })

                    return {
                        chartID
                    }
                },
                render(newState, { $set, $get } = {}) {
                    // console.log($get)
                    zchart({
                        id: newState.chartID,
                        config: {
                            symbol: '600010'
                        },
                        startVal(dates) {
                            // console.log(dates.length)
                            return 100 - 30000 / dates.length
                        }
                    }, function () {

                    })
                }
            });

            mainComp.mount(app.querySelector('#app1'))


        });



    // window.createCusData = function({jsonlib = JSON} = {}) {

    //     function isObj(v){
    //        return Object.prototype.toString.call(v) === '[object Object]' && v?.constructor === Object;
    //     }


    //     /**
    //      * 
    //      * @param {object} obj 
    //      */
    //     let ObjectDetect = function(obj, onchange) {
    //         let self = this;

    //         Object.getOwnPropertyNames(obj).forEach(function(name) {
    //             if (!(name in self)) {
    //                 Object.defineProperty(self, name, {

    //                     get() {
    //                         return obj[name]
    //                     },
    //                     set(v) {
    //                         // console.log('change')
    //                         if (onchange) {
    //                             onchange()
    //                         }
    //                         obj[name] = v
    //                     }
    //                 });
    //              }
    //         });

    //         Object.defineProperty(self, "valueOf", {
    //             configurable: false,
    //             enumerable: false,
    //             writable: false,
    //             value: function() {
    //                 return obj
    //             }
    //         })

    //         Object.defineProperty(self, Symbol.toStringTag, {
    //             get() {
    //                 return 'ObjectDetect'
    //             }
    //         })
    //     }


    //     function custom_json_parse(v, onchange) {
    //         // var _onchange = onchange(ret)
    //         var ret = jsonlib.parse(v, (key, value, context) => {
    //             if (Array.isArray(value)) {

    //                 let arr =  new ObservableArray(value);
    //                 arr.addEventListener('itemset',  function() {
    //                     onchange(ret)
    //                 });
    //                 arr.addEventListener('itemadded',  function() {
    //                     onchange(ret)
    //                 } );
    //                 arr.addEventListener('itemremoved',  function() {
    //                     onchange(ret)
    //                 });
    //                 return arr
    //             }
    //             else if (isObj(value)) {
    //                 if (key) {
    //                     // console.log(key)
    //                     let objdectect = new ObjectDetect(value, function() {
    //                         onchange(ret)
    //                     })

    //                     return objdectect
    //                 }
    //             }
    //             // console.log(key, value, context)
    //             return value
    //         });
    //         return ret;
    //     }

    //     function custom_json_stringify(v) {
    //         return jsonlib.stringify(v, (key, value) => {
    //             if (Object.prototype.toString.call(value) === '[object ObservableArray]') {
    //                 // console.log(key, value)
    //                 value.__destory();
    //                 return  value.valueOf()
    //             }
    //             else if(Object.prototype.toString.call(value) === '[object ObjectDetect]') {
    //                 return value.valueOf()
    //             }
    //             return value
    //         });
    //     }


    //     let CusData = (function(initVal) {
    //         let _value = '';
    //         function onchange(v) {
    //             console.log('change', v)
    //         }

    //         if (typeof initVal !== 'undefined') {
    //             _value = custom_json_parse(jsonlib.stringify(initVal), onchange)
    //         }

    //         return {
    //             get value() {
    //                 // return custom_json_parse(_value, onchange)
    //                 return _value
    //             },
    //             get raw() {
    //                 return jsonlib.parse(custom_json_stringify(_value))
    //             },
    //             // set value(v) {
    //             //     _value = custom_json_stringify(v)
    //             // }
    //         }
    //     });

    //     return CusData
    // }

    // let Cs = createCusData();

    // let c = Cs({a: [], b: {c: 1}});

    // c.value.a.push(1);
    // c.value.a.push(8);

    // c.value.b.c = 8
    // console.log(c.value)

    // console.log(c.raw)

    // document.addEventListener('simapp', async function (e) {

    //     let w = /** @type {import('../types/globa.t').ExtendedWindow} */ (window);

    //     w.appendStyle(/*css*/`
    //         base-simapp:state(app_ready) {
    //             border: solid #891281;
    //        }
    //         `);

    //     let { seach, sfields } = ElementLib(e.detail);

    //     let styleSys = w.createStyleSys();


    //     window.appendStyle(`
    //         .test_sub1 {
    //            margin-left: 10px;
    //         }
    //         `)



    //     let appcon = document.createElement('div');
    //     appcon.id = "test3";
    //     document.body.appendChild(appcon);

    //     await import("http://localhost:7001/public/sta/index/watch.js")


    //     function createLitApp() {
    //         const state = w.createState({
    //             a: 1,
    //             arr: [],
    //             form: {
    //                 from: 0,
    //                 print: true,
    //                 config: true,
    //             }
    //         }, {
    //             onchange(option) {
    //                 console.log('change state', option)
    //                 app.update([option])
    //             }
    //         });


    //         window.globalStyleMap.mixinStyleEle.innerHTML = `
    //         @defprops darkbase {
    //           color: white;
    //           __cssvarname: #999;
    //         }
    //          `

    //         /**
    //          * 
    //          * @param {{createBaseSimAppCtx: import('../types/globa.t').createBaseSimAppCtx}} option 
    //          * @returns import { JSON5 } from 'json5';

    //          */
    //         function appCtx({ createBaseSimAppCtx, lit }) {

    //             let { html } = lit;

    //             function handleSubmit() {
    //                 let { form } = state.raw
    //                 state.value.arr.push({
    //                     id: createUUID(),
    //                     ...form
    //                 })
    //             }

    //             function handleDel(item) {
    //                 return function (e) {
    //                     w.q.$(state.value, 'arr').zdelwhen(v => v.id === item.id)
    //                     // let index = state.value.arr.findIndex(v => v.id === item.id);
    //                     // if (index > -1) {
    //                     //     state.value.arr.splice(index, 1)
    //                     // }
    //                 }
    //             }


    //             var ret = createBaseSimAppCtx({
    //                 styleSys,
    //                 get cssimports() {
    //                     return [
    //                         'http://localhost:3010/element-plus.css'
    //                     ]
    //                 },
    //                 get css() {
    //                     return /*css*/`

    //                     .el-button {
    //                         border: 1px solid var(--el-color-primary);
    //                         padding:10px;
    //                     }


    //                     :host-context(.doc-darktheme) {
    //                         /*@useprops darkbase*/
    //                         background: #121212;
    //                     }

    //                     .row {
    //                         display: flex;
    //                         align-items: center;
    //                         gap: 10px;
    //                     }
    //                     `
    //                 },
    //                 onBeforeRender() {
    //                     // console.log('onBeforeRender')
    //                 },
    //                 /**
    //                  * 
    //                  * @param {*} newData 
    //                  * @param {Element} con 
    //                  * @returns 
    //                  */
    //                 render(newData, con) {
    //                     // console.log(con.closest(".doc-darktheme"))


    //                     let fields = [
    //                         ['from', {
    //                             type: 'number',
    //                         }],
    //                         ['print', {
    //                             type: 'checkbox'
    //                         }],
    //                         ['config', {
    //                             type: 'checkbox'
    //                         }]
    //                     ]

    //                     let form1 = html`${sfields(fields, state.value.form)}`

    //                     // console.log(newData)
    //                     return html`
    //                 ${JSON.stringify(newData)}
    //                 ${seach(state.value.arr, (item, index) => {
    //                         return html`<div class="row">
    //                         <div>${index}</div>
    //                         <div>${item?.from}</div>
    //                         <div>${item?.print + ''}</div>
    //                         <div>${item?.config + ''}</div>
    //                         <div class="el-button el-button--primary" @click=${handleDel(item, index)}>del</div>
    //                         </div>`
    //                     })}
    //                 <form>
    //                     ${form1}
    //                     <div @click="${handleSubmit}">提交</div>
    //                 </form>
    //                 `
    //                 }
    //             });

    //             return ret;
    //         }

    //         var app = window.simApp(appCtx, document.querySelector('#htmlapp'));
    //         app.update([
    //             state.raw
    //         ])
    //     }


    // })
}