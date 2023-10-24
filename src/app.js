import Element from "./element.mjs";

export default class App {
    /**
     * @type {string}
     * @private
     */
    _route = '';

    /**
     * @type {HTMLElement}
     * @private
     */
    _targetElement;

    /**
     * @type {Element}
     * @private
     */
    _appElement;

    constructor(target) {
        this._route = this._getInitialRoute();
        this._targetElement = target;
    }

    start() {
        this._appElement = new Element(this._targetElement);
    }

    initialiseComponent (componentName) {
        return new Element(`[v-component=${componentName}]`)
    }

    get route () {
        return this._route
    }

    set route (newRoute) {
        this._route = newRoute;
        this._appElement.trigger('redirected');

        const url = this._currentUrl();
        url.hash = `#${newRoute};`
        window.history.pushState({}, '', url);
    }

    /**
     * @returns {URL}
     * @private
     */
    _currentUrl() {
        return new URL(window.location.href);
    }

    _getInitialRoute() {
        const url = this._currentUrl();
        return url.hash.substring(1);
    }
}