import {BaseEle, css} from "./core.js"

class ZDatetimeLocalPicker extends BaseEle {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.setCSS(css`
        .datetimelocal-picker {
            display: flex;
            align-items: flex-start;
        }
            @media screen and (max-width: 600px){
                .datetimelocal-picker {
                    display: block;
                }
            }
        `)
        this.shadowRoot.innerHTML = `<div id="timepicker" class="datetimelocal-picker">
  <z-date-picker id="date" ></z-date-picker>
     <z-time-picker id="time" ></z-time-picker>
</div>`;
        this.arr = [];
        this.shadowRoot.querySelector('#date').addEventListener('change', (e) => {
            this.onChange(e);
        });
        this.shadowRoot.querySelector('#time').addEventListener('change', (e) => {
            this.onChange(e);
        })
    }
    get isoString() {
        return this.arr.join('T') + 'Z';
    }
    attrChanged(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
        this.arr = newValue.replace('Z', '').split('T');
        this.render()
    }
    onChange(e) {
        this.arr = [
            this.shadowRoot.querySelector('#date').value,
            this.shadowRoot.querySelector('#time').value,
        ];
        console.log(this.arr, this.isoString)
        this.value = this.isoString;
        this.dispatchEvent(new Event('change'));
    }
    render() {
        if (this.arr.length > 1) {
            this.shadowRoot.querySelector('#date').setAttribute('value', this.arr[0]);
            this.shadowRoot.querySelector('#time').setAttribute('value', this.arr[1]);
        }
    }
}

ZDatetimeLocalPicker.defsel('z-datetimelocal-picker',{
    attrs: {
        value: '',
    }
});