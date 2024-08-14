/**
* @typedef {Object} Qnext
* @property {(arr: Array, when: (item) => boolean) => any} zdelwhen
*/


/**
* @typedef {Object} q
* @property {(obj:object, path: string) => Qnext} $ - The user's first name.
* @property {(obj:object, path: string, val: any) => any} set - set
*/
export let q = {}

/**
 * 
 * @param {string} css 
 * @param {{better: boolean}} option 
 */
export function appendStyle(css = '', {better} = {}) {
}


/**
* @typedef {Object} State
* @property {{}} value
* @property {{}} raw
*/

/**
 * @returns {State}
 */
export function createState() {
    
}


/**
 * 
 * @param {{styleSys: StyleSys, readonly css: string, states: Array<State>}} option
 * @returns {{}} 
 */
export function createBaseSimAppCtx({} = {}){
}


/**
* @typedef {Object} StyleSys
* @property {() => {}} getglobalmixins
* @property {() => void}  updatemixins          
*/


/**
 * 
 * @returns {StyleSys} 
 */
export function createStyleSys() {
}



/**
 * @typedef {Object} Globals
 * @prop {boolean} [__myFlag__]
 * @prop {q} [q]
 * @prop {appendStyle} [appendStyle]
 * @prop {createState} [createState]
 * @prop {createStyleSys} [createStyleSys]
 *
 * @typedef {Window & Globals} ExtendedWindow
 */

export let ExtendedWindow;