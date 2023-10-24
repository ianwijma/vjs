import Component from "./component.mjs";
import Element from "./element.mjs";

document.vjs = {
    initialiseComponent: (componentName) => new Component(componentName)
}

document.addEventListener('DOMContentLoaded', () => {
    document.vjs.body = new Element(document.body);
})