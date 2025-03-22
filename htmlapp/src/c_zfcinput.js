import {BaseEle} from "./core.js";

class ZfcInput extends BaseEle {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.type = this.getAttribute('type') ?? 'text';
        this.init()
    }
    init() {
         if (this.type === 'datetime-local') {
             this.shadowRoot.innerHTML = `
                  <z-inputpopup>
                    <div id="content" slot="selectcontent"></div>
                    <z-datetimelocal-picker id="input" ></z-datetimelocal-picker>
                </z-inputpopup>
             `;
             this.shadowRoot.querySelector('#input').addEventListener('change', (e) => {
                 this.value = e.target.value;
                 this.shadowRoot.querySelector('#content').textContent = this.value
                 this.dispatchEvent(new Event('change'))
             })
         }
         if (this.type === 'text') {
             this.shadowRoot.innerHTML = `<input id="input" />`;
         }
    }
    attrChanged(name, oldValue, newValue) {
        if (this.type === 'datetime-local') {
            this.shadowRoot.querySelector('#content').textContent = newValue
        }
        this.shadowRoot.querySelector('#input').setAttribute('value', newValue)
    }
}

ZfcInput.defsel('z-fcinput', {
    attrs: {
        value: ''
    }
})