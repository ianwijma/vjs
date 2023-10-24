import Element from "./element.mjs";

document.vjs = {
    initialiseComponent: (componentName) => new Element(`[v-component=${componentName}]`),
    route: {
        current: '',
        setRoute: function (route) {
            this.current = route;
            document.vjs.body.trigger('redirected');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.vjs.route.current = '/page-1'; // set reinstate logic
    document.vjs.body = new Element(document.body);
})