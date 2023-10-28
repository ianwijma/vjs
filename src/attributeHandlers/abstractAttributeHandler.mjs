import {AbstractClass} from "../abstractClass.mjs";
import {Component} from "../component.mjs";

export class AbstractAttributeHandler extends AbstractClass {
    /** @var {string|string[]} */
    attributes;

    /** @var {number} */
    importance = 0;

    /**
     * @param {Component} component
     * @param {HTMLElement} element
     */
    async handler(component, element) {
        this.__undefinedAbstractMethod('handler');
    }

    /**
     * @param {HTMLElement} element
     * @param {string} attributeName
     * @return {string}
     * @protected
     */
    _ensureAttribute(element, attributeName) {
        const value = element.getAttribute(attributeName);

        if (!value) {
            console.error(`Missing ${attributeName} value`, element);
        }

        return value;
    }
}