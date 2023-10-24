import Element from "./element.mjs";

export default class ElementComponent extends Element {
    /**
     * @param {string} componentName
     */
    constructor(componentName) {
        super(`[v-component=${componentName}]`);
    }
}