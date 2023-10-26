export const tag = 'element';
export const importance = 500;

/**
 * @param {import('../component.mjs').Component} component
 * @param {HTMLElement} element
 */
export const handler = (component, element) => {
    if (!('elements' in component)) {
        /**
         * @type {Object<string, HTMLElement>}
         */
        component.elements = {};
    }

    const name = element.getAttribute('v-element');
    if (!name) {
        console.error('Missing v-element value', element)
    }

    const currentElement = component.elements[name];
    if (currentElement) {
        console.error(`Element with name ${name} already registered`, currentElement, element);
    }

    component.elements[name] = element;
};