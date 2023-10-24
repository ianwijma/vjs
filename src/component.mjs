import Element from "./element.mjs";

export default class Component extends Element {
    /**
     * @param {string} componentName
     */
    constructor(componentName) {
        super(`[v-component=${componentName}]`);
    }
}