class TimePicker24 {
    constructor(container) {
        this.container = container;
        this.currentTime = new Date();
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const columns = document.createElement('div');
        columns.className = 'time-columns';

        // 小时列 (00-23)
        const hourColumn = this.createTimeColumn('hour',
            Array.from({length: 24}, (_, i) => i)
        );

        // 分钟列 (00-55 每5分钟)
        const minuteColumn = this.createTimeColumn('minute',
            Array.from({length: 60}, (_, i) => i * 1)
        );

        // 秒钟列 (00-55 每5分钟)
        const secondColumn = this.createTimeColumn('second',
            Array.from({length: 60}, (_, i) => i * 1)
        );

        columns.appendChild(hourColumn);
        columns.appendChild(minuteColumn);
        columns.appendChild(secondColumn);

        this.container.innerHTML = '';
        this.container.appendChild(columns);
    }

    createTimeColumn(type, values) {
        const column = document.createElement('div');
        column.className = 'time-column';

        values.forEach(value => {
            const item = document.createElement('div');
            item.className = 'time-item';
            item.textContent = value.toString().padStart(2, '0');
            item.dataset[type] = value;

            // 设置选中状态
            // const currentValue = type === 'hour'
            //     ? this.currentTime.getHours()
            //     : this.currentTime.getMinutes();

            // if (Math.floor(currentValue/5)*5 === value) {
            //     item.classList.add('selected');
            // }

            item.addEventListener('click', () => this.selectTime(type, value));
            column.appendChild(item);
        });

        return column;
    }

    getValueArr() {
        return  [this.currentTime.getHours().toString().padStart(2, '0'),
            this.currentTime.getMinutes().toString().padStart(2, '0') ,
            this.currentTime.getSeconds().toString().padStart(2, '0')]
    }

    toString(){
        return this.getValueArr().join(':');
    }

    selectTime(type, value) {
        switch (type) {
            case 'hour':
                this.currentTime.setHours(value);
                break
            case 'minute':
                this.currentTime.setMinutes(value);
                break;
            case 'second':
                this.currentTime.setSeconds(value);
                break;
        }
        if (this.onSelected) {
            this.onSelected( this.getValueArr());
        }
        console.log('选择时间:', this.getValueArr());
    }

    setValue(arr) {
        this.currentTime.setHours(arr[0]);
        this.currentTime.setMinutes(arr[1]);
        this.currentTime.setSeconds(arr[2]);
    }
}

import {BaseEle, css} from "./core.js"

class ZTimePicker extends BaseEle {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._css= css`
            .timepicker {
                font-family: Arial, sans-serif;
                width: max-content;
                border: 1px solid #ccc;
                padding: 16px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                background: white;
                --select-color: #fff;
                --select-bg: #007bff;
            }

            .time-columns {
                display: flex;
                gap: 10px;
                justify-content: center;
            }

            .time-column {
                display: flex;
                flex-direction: column;
                align-items: center;
                max-height: 200px;
                overflow-y: auto;
                scrollbar-width: thin;
            }

            .time-item {
                padding: 5px 10px;
                margin: 2px;
                cursor: pointer;
                border-radius: 4px;
                width: 40px;
                text-align: center;
                transition: background 0.2s;
            }

            .time-item:hover {
                background: #f0f0f0;
            }
            
            
        //@selected
        `
        this.setCSS(this._css);
        let self = this;
        this.shadowRoot.innerHTML = '<div id="timepicker" class="timepicker"></div>';
        this.picker = new TimePicker24(this.shadowRoot.querySelector('#timepicker'))
        this.picker.onSelected = function (value = []) {
            // console.log(parseInt(value[0]))
            self.setSelectedStyle(value);
            self.dispatchEvent(new Event('change'));
        }
    }
    setScrollState(value = []) {
        let self = this;
        for (let i = 0, len = value.length; i < len; i++) {
            self.shadowRoot.querySelector(`.time-column:nth-child(${i + 1}) .time-item:nth-child(${parseInt(value[i]) + 1})`).scrollIntoView()
        }
    }
    setSelectedStyle(value = []) {
        console.log(value)
        let self = this;
        let cssstr = ''
        for (let i = 0, len = value.length; i < len; i++) {
            cssstr = cssstr +  css`
                    .time-column:nth-child(${i + 1}) .time-item:nth-child(${parseInt(value[i]) + 1}) {
                        background-color: var(--select-bg) !important;
                        color: var(--select-color);
                    }
                `
        }
        let newcss =    self._css.replace('//@selected',cssstr)
        console.log(value, newcss, self);
        self.shadowRoot.adoptedStyleSheets[0].replaceSync(
            newcss
        );
        self.value = value.join(':');
    }
    attrChanged(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
        let arr = newValue.split(':');
        this.picker.setValue(arr);
        requestAnimationFrame(() => {
            this.setSelectedStyle(arr);
            this.setScrollState(arr)
        })
    }
}

ZTimePicker.defsel('z-time-picker',{
    attrs: {
        value: '',
    }
});