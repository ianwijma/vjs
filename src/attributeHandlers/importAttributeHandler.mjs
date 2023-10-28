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

        const response = await fetch(importPath);
        element.innerHTML = await response.text();

        if (component._mount !== element) {
            new Component(element, component.context.clone());
        }
    }
}