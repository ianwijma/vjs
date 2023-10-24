import Template from './template.mjs'

export default class Element {
    /**
     * @type {HTMLElement}
     * @private
     */
    _element;

    /**
     * @type {Object<string, Element>}
     * @private
     */
    _elements;

    /**
     * @type {Object<string, Template>}
     * @private
     */
    _templates;

    /**
     * @param {HTMLElement|string} target
     */
    constructor(target) {
        if (target instanceof HTMLElement) {
            this._element = target;
        } else {
            this._element = this._loadElement(target);
            if (!this._element) throw Error(`Element with selector ${target} not found`);
        }

        this._elements = this._loadElements();
        this._templates = this._loadTemplates();
        this._initialize();
    }

    /**
     * @returns {Object<string, Element>}
     */
    get elements () {
        return this._elements;
    }

    /**
     * @returns {Object<string, Template>}
     */
    get templates () {
        return this._templates;
    }

    get text() {
        return this._element.innerText
    }

    set text(value) {
        this._element.innerText = value
    }

    /**
     * @callback onCallback
     * @param {Event} event
     * @param {Element} element
     */

    /**
     * @param {string|keyof HTMLElementEventMap} event
     * @param {onCallback} callback
     */
    on (event, callback) {
        this._element.addEventListener(
            event,
            (event) => callback(event, this._element)
        );
    }

    /**
     * @param {string|keyof HTMLElementEventMap} event
     * @param {onCallback} callback
     */
    once (event, callback) {
        this._element.addEventListener(
            event,
            (event) => callback(event, this._element),
            { once: true }
        );
    }

    /**
     *
     *
     * @param {string|keyof HTMLElementEventMap} event
     * @param {onCallback} callback
     */
    off (event, callback) {
        this._element.removeEventListener(
            event,
            (event) => callback(event, this._element)
        );
    }

    /**
     * @param {string|keyof HTMLElementEventMap} event
     */
    trigger (event) {
        this._element.dispatchEvent(
            new Event(event)
        );
    }

    /**
     * @param {Element} element
     */
    prependChild(element) {
        this._element.prependChild(element._element);
    }

    /**
     * @param {Element} element
     */
    appendChild(element) {
        this._element.appendChild(element._element);
    }

    /**
     * @returns {HTMLElement}
     * @private
     */
    _getElement () {
        return this._element;
    }

    /**
     * @param {string} selector
     * @returns {HTMLElement}
     * @private
     */
    _loadElement(selector) {
        if (document.querySelectorAll(selector).length > 1) {
            throw Error(`Found multiple elements with selector ${selector}`);
        }

        return document.querySelector(selector)
    }

    /**
     * @return {Object<string, Element>}
     * @private
     */
    _loadElements() {
        /** @var {Object<string, Element>} */
        const elements = {};

        this._element.querySelectorAll('[v-element]').forEach(element => {
            elements[element.getAttribute('v-element')] = new Element(element);
        });

        return elements;
    }

    /**
     * @returns {Object<string, Template>}
     * @private
     */
    _loadTemplates() {
        /** @var {Object<string, Template>} */
        const templates = {};

        this._element.querySelectorAll('template[v-template]').forEach(element => {
            templates[element.getAttribute('v-template')] = new Template(element);
        });

        return templates;
    }

    /**
     * @private
     */
    _initialize() {
        this._initializeRoutes();
        this._initializeImports();
        this._initializeRedirects();
        this._initializeListeners();
    }

    _initializeRoutes() {
        this._element.querySelectorAll('[v-route]')?.forEach(routeElement => {
            const route = routeElement.getAttribute('v-route');
            if (!route) {
                throw Error(`Empty route found`);
            }

            let showElement = document.vjs.route.startsWith(route);
            routeElement.style.display = showElement ? '' : 'none';
        })

        this._element.querySelectorAll('[v-route-strict]')?.forEach(routeElement => {
            const route = routeElement.getAttribute('v-route-strict');
            if (!route) {
                throw Error(`Empty route found`);
            }

            let showElement = document.vjs.route === route;
            routeElement.style.display = showElement ? '' : 'none';
        });
    }

    /**
     * @private
     */
    _initializeImports() {
        this._element.querySelectorAll('[v-import]')?.forEach(async importElement => {
            const pathName = importElement.getAttribute('v-import');
            if (!pathName) {
                throw Error(`Empty import found`);
            }

            const path = `${pathName}.html`;
            const response = await fetch(path);
            const html = await response.text();
            this._insertHtml(importElement, html);
        });
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {string} html
     * @private
     */
    _insertHtml(element, html) {
        element.innerHTML = html;

        element.querySelectorAll('script').forEach(scriptElement => {
            const newScriptElement = document.createElement('script');

            Array.from(scriptElement.attributes).forEach(attribute => {
                newScriptElement.setAttribute(attribute.name, attribute.value);
            });

            const scriptText = document.createTextNode(scriptElement.innerText);
            newScriptElement.appendChild(scriptText);

            scriptElement.parentNode.replaceChild(newScriptElement, scriptElement)
        })
    }

    /**
     * @private
     */
    _initializeRedirects() {
        this._element.querySelectorAll('[v-redirect]')?.forEach(redirectElement => {
            const redirect = redirectElement.getAttribute('v-redirect');
            if (!redirect) {
                throw Error(`Empty redirect found`);
            }

            redirectElement.addEventListener('click', () => document.vjs.route = redirect);
        });
    }

    /**
     * @private
     */
    _initializeListeners() {
        this.on('redirected', () => {
            this._initializeRoutes();
        })
    }
}