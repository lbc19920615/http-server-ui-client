import {BaseEle, css} from "./core.js";

class ZInputPopup extends BaseEle {
    constructor() {
        super();
        this.isOpen = false;
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<div style="position: relative">
    <div id="my-anchor-positioning" class="anchor"><slot name="selectcontent"></slot></div>
    <div id="my-target-positioning" class="target">
    <slot></slot>
</div>
</div>`;
        this.setCSS(css`
            :host {
                --brand-blue: lch(38.953% 23.391 229.55deg);
                --brand-pink: lch(50.161% 77.603 3.8969deg);
            }
            .target {
                --element-color:  var(--brand-pink);
            }
            .anchor {
                --element-color: var( --brand-blue);
                text-align: center;
            }
            .anchor {
                //background: var(--element-color);
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 3px 10px;
            }
            

            #my-anchor-positioning {
                anchor-name: --my-anchor-positioning;
                width: var(--my-anchor-width, max-content);
            }

            #my-target-positioning {
                position: absolute;
                top: anchor(--my-anchor-positioning bottom);
                left: anchor(--my-anchor-positioning left);
                opacity: 0;
                pointer-events: none;
                z-index: -1;
            }
            
            :host(.is-open) #my-target-positioning {
                opacity: 1;
                pointer-events: auto;
                z-index: auto;
            }
        `);
        this.shadowRoot.querySelector('#my-anchor-positioning').addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            this.classList.toggle('is-open', this.isOpen);
        })
    }
}

ZInputPopup.defsel('z-inputpopup', {
    attrs: {
        value: '',
    }
});