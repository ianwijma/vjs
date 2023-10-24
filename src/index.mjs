import ElementComponent from "./elementComponent.mjs";
import Element from "./element.mjs";

document.vjs = {
    initialiseComponent: (componentName) => new ElementComponent(componentName)
}

document.addEventListener('DOMContentLoaded', () => {
    document.vjs.body = new Element(document.body);
})