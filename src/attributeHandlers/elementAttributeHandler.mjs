import {AbstractAttributeHandler} from "./abstractAttributeHandler.mjs";

export class ElementAttributeHandler extends AbstractAttributeHandler {
    attributes = 'v-element';
    importance = 500;
    async handler(component, element) {
        const name = this._ensureAttribute(element, 'v-element');

        const { elements = {} } = component.context.data;
        if (name in elements) {
            console.error(`Two elements with v-element value ${name} found!`);
        }

        const addInsertTrigger = (functionName) => {
            const originalFunction = element[functionName];
            element[functionName] = (node) => {
                originalFunction.call(element, node);

                node.dispatchEvent(new CustomEvent('template:inserted'));
            }
        }

        addInsertTrigger('prependChild');
        addInsertTrigger('prepend');
        addInsertTrigger('append');
        addInsertTrigger('appendChild');

        elements[name] = element;
        component.context.updateData({ elements });
    }
}