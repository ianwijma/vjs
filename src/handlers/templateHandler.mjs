import { Template } from '../template.mjs'

export const tag = 'template';
export const importance = 500;

/**
 * @param {import('../component.mjs').Component} component
 * @param {HTMLTemplateElement} element
 */
export const handler = (component, element) => {
    if (!(element instanceof HTMLTemplateElement)) {
        console.error('Element with tag v-template is not a <template> element', element)
    }

    if (element.content.children.length > 1) {
        console.error('Template can not have more than 1 root element', element)
    }

    const name = element.getAttribute('v-template');
    if (!name) {
        console.error('Missing v-element value', element)
    }

    if (!('templates' in component)) {
        /**
         * @type {Object<string, HTMLElement>}
         */
        component.templates = {};
    }

    /**
     * @var {Template}
     */
    const currentTemplate = component.templates[name];
    if (currentTemplate) {
        console.error(`Element with name ${name} already registered`, currentTemplate._element, element);
    }

    component.templates[name] = new Template(element);
};