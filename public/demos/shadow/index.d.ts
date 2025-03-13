export interface HTMLSerializationOptions {
    serializableShadowRoots?: boolean;
    shadowRoots?: ShadowRoot[];
}
export declare function findShadowRoots(root: Node): Generator<ShadowRoot>;
export declare function generateHTML(root: Node, { serializableShadowRoots, shadowRoots }?: HTMLSerializationOptions): Generator<string>;
/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getHTML}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/getHTML}
 */
export declare function getHTML(this: Element | ShadowRoot, options?: HTMLSerializationOptions): string;
export declare function attachDeclarativeShadowRoots(root: HTMLElement | ShadowRoot): void;
/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTMLUnsafe}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/setHTMLUnsafe}
 */
export declare function setHTMLUnsafe(this: Element | ShadowRoot, html: string): void;
/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/parseHTMLUnsafe_static}
 */
export declare function parseHTMLUnsafe(html: string): Document;
declare global {
    interface ShadowRootSerializable {
        getHTML: typeof getHTML;
    }
    interface Element extends ShadowRootSerializable {
    }
    interface ShadowRoot extends ShadowRootSerializable {
    }
}
