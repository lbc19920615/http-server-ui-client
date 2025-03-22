import {BaseEle, css} from "./core.js";

class ZNotification extends BaseEle {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = ``;
    }
}

ZNotification.defsel('z-notification', {
    attrs: {
        value: '',
    }
});