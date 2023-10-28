import {AbstractAttributeHandler} from "./abstractAttributeHandler.mjs";
import {Template} from "../template.mjs";

export class TemplateAttributeHandler extends AbstractAttributeHandler {
    attributes = 'v-template';
    importance = 500;
    async handler(component, element) {
        if (!(element instanceof HTMLTemplateElement)) {
            console.error('Element with tag v-template is not a <template> element', element)
        }

        if (element.content.children.length > 1) {
            console.error('Template can not have more than 1 root element', element)
        }

        const name = this._ensureAttribute(element, 'v-template');

        const { templates = {} } = component.context.data;
        if (name in templates) {
            console.error(`Two templates with v-template value ${name} found!`);
        }

        templates[name] = new Template(element, component);
        component.context.updateData({ templates });
    }
}