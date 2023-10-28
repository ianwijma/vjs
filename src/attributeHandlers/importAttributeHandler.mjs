import {AbstractAttributeHandler} from "./abstractAttributeHandler.mjs";
import {Component} from "../component.mjs";

export class ImportAttributeHandler extends AbstractAttributeHandler {
    attributes = 'v-import';
    importance = 1000;
    async handler(component, element) {
        let importPath = this._ensureAttribute(element, 'v-import');
        if (!importPath.endsWith('.html')) {
            importPath = `${importPath}.html`;
        }

        let importData = element.getAttribute('v-import-data');
        if (importData) {
            importData = JSON.parse(importData.replaceAll("'", '"'));
        }

        const response = await fetch(importPath);
        element.innerHTML = await response.text();

        if (component._mount !== element) {
            const context = component.context.clone();
            context.updateData({ importData })
            new Component(element, context);
        }
    }
}