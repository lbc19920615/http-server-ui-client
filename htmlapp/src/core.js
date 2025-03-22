let elementMeta = {}

function getMeta(ctx) {
    let name = ''
    if (ctx.constructor) {
        name = ctx.constructor.name
    }
    return  elementMeta[name]
}


export const css = (strings, ...values) => String.raw({ raw: strings }, ...values);

export function travelChildren(children = [], opt = {}) {
    [...children].forEach(child => {
        if (opt && opt.handle) {
            opt.handle(child);
        }
        if (child.children && child.children.length) {
            travelChildren(child.children, opt);
        }
    })
}


/**
 *
 * @param nodes
 * @param nodeDesc
 * @returns {{eventLists: *[]}}
 */
export function travelChildNodes(nodes, nodeDesc = {eventLists: []}) {


    [...nodes].forEach((node) => {
        // console.dir(node)
        if (node.nodeName === "#text") {
        //
        }
        else {
            if (node instanceof HTMLElement) {

                let isPushed = false;
                Object.keys(node.attributes).forEach(key => {
                    /**
                     * @type {Attr}
                     */
                    let attr = node.attributes[key];
                    let value = attr.nodeValue;
                    if (attr.name.startsWith("bind:")) {
                        let events = attr.name.split(":");
                        let eventName = events[events.length - 1];

                        nodeDesc.eventLists.push({
                            eventName: eventName,
                            methodName: value,
                            element: node
                        })
                    }

                    if (!isPushed && attr.name.startsWith(":")) {
                        isPushed = true;
                        nodeDesc.bindcLists.push({
                            element: node
                        })
                    }


                    // console.log(attr.name, value)
                });
                if (node.childNodes) {
                    travelChildNodes(node.childNodes, nodeDesc);
                }
            }
        }
    });

    return nodeDesc
}

/**
 *
 * @param shadowRoot {Element}
 * @param methods {{}}
 * @param ctx {{}}
 */
export function bindRootEle(shadowRoot,methods = {}, ctx) {

    let nodeDesc = {
        eventLists: [],
        bindcLists: []
    };


    travelChildNodes(shadowRoot.childNodes, nodeDesc);
    // console.log(nodeDesc)

    // console.log( nodeDesc.bindcLists)

    nodeDesc.bindcLists.forEach((e) => {
        let element = e.element;
        if (ctx._onBindRootEle) {
            ctx._onBindRootEle(element);
        }
    })

    nodeDesc.eventLists.forEach((e) => {
        let eventName = e.eventName;
        let methodName = e.methodName;
        let element = e.element;
        if (methods[methodName]) {
            if (!element.isAddListener) {
                console.log("isAddListener", element)
                element.addEventListener(eventName, function (e) {
                    let target = e.currentTarget || e.target;
                    methods[methodName].bind({
                        ...ctx?.exportCtx(),
                        get $target() {
                            return target
                        },
                    })(e)
                });
                element.isAddListener = true;

            }
        }
    });

}

export class BaseEle extends HTMLElement {
    constructor() {
        super();
        let self = this;
        const supportsDeclarative = HTMLElement.prototype.hasOwnProperty("attachInternals");
        const internals = supportsDeclarative ? this.attachInternals() : undefined;


        /**
         *
         * @type {{addState(string=): void, deleteState(string=): void}}
         */
        let extendState = {
            addState(name = '') {
                internals.states.add(name);
                updateState()
            },
            deleteState(name = '') {
                internals.states.delete(name);
                updateState()
            }
        }

        /**
         *
         * @type {ElementInternals & extendState}
         * @private
         */
        this._internals = Object.assign(internals,extendState);

        function updateState() {
            // console.log( internals.states);
            if (self.onStateUpdate) {
                self.onStateUpdate( internals.states)
            }
        }

        this.stylesheet = new CSSStyleSheet();
    }

    /**
     *
     * @param e {Event}
     */
    onclick(e) {
        console.log(e)
    }

    setCSS(css = '') {
        this.stylesheet.replaceSync(css);
        this.shadowRoot.adoptedStyleSheets = [this.stylesheet]
    }

    setTemplate(sel = '') {
        let self = this;
        let template = document.querySelector(sel);
        let templateContent = template.content;
        let content = templateContent.cloneNode(true);


        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(content);

        return shadowRoot
    }

    static defsel(name = '', options = {}) {
        elementMeta[this.name] = {
            options
        }

        this.defAttrs(options?.attrs)
        customElements.define(name, this)
        // console.log(this.name)
    }
    
    static defAttrs(def ={}) {
        this.observedAttributes =  Object.keys(def);    
    }

    _slotchange(e) {
        console.log('_slotchange', e, this.host);
        let slots = [...this.querySelectorAll('slot')];
        let slotnodes =  slots.map(v => {
            return v.assignedNodes()
        })
        let hasSloted = slots.some(v => {
            return v.assignedNodes()?.length > 0
        });
        // console.log(hasSloted);
        this.host.classList.toggle('_has-sloted', hasSloted);

        if (this.host.onSlotChange) {
            this.host.onSlotChange(e, {slotnodes: slotnodes})
        }
    }

    connectedCallback() {
        // console.log("Custom element added to page.");
        this.shadowRoot.addEventListener("slotchange",  this._slotchange);
        if (this.mounted) {
            this.mounted()
        }
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.", this);
        this.shadowRoot.removeEventListener("slotchange",  this._slotchange);
        if (this.unmounted) {
            this.unmounted()
        }
    }

    adoptedCallback() {
        // console.log("Custom element moved to new page.");
    }


    attributeChangedCallback(name, oldValue, newValue) {
        // console.log(this.constructor.name, getMeta(this))
        let b =  getMeta(this)
        if (b?.options?.attrs) {
            let initval = b?.options?.attrs[name]
            // console.log(name, initval);
            if (oldValue ===  null) {
                oldValue = initval
            }
            if(this.attrChanged) {
                this.attrChanged(name, oldValue, newValue)
            }
        }
        // console.log(`Attribute ${name} has changed.${newValue}`);
    }

    attrChanged(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed ${oldValue} ${newValue}`);
    }
}


function filterNone() {
    return NodeFilter.FILTER_ACCEPT;
}

/**
 *
 * @param rootElem {HTMLElement}
 * @returns {Node[]}
 */
function getAllComments(rootElem) {
    /**
     *
     * @type {Node[]}
     */
    let comments = [];
    // Fourth argument, which is actually obsolete according to the DOM4 standard, is required in IE 11
    let iterator = document.createNodeIterator(rootElem, NodeFilter.SHOW_COMMENT, filterNone, false);
    let curNode;
    while (curNode = iterator.nextNode()) {
        comments.push(curNode);
    }
    return comments;
}

/**
 *
 * @type {{getAllComments: (function(HTMLElement): Node[])}}
 */
export let utils = {
    getAllComments
}