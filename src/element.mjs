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
     * @param {HTMLElement|string} target
     */
    constructor(target) {
        if (target instanceof HTMLElement) {
            this._element = target;
        } else {
            this._element = this._loadElement(target);
        }

        this._elements = this._loadElements();
        this._initializeElement();
    }

    /**
     * @returns {Object<string, Element>}
     */
    get elements () {
        return this._elements;
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
     *
     *
     * @param {keyof HTMLElementEventMap} event
     * @param {onCallback} callback
     */
    on (event, callback) {
        this._element.addEventListener(event, (event) => callback(event, this._element));
    }

    /**
     *
     *
     * @param {keyof HTMLElementEventMap} event
     * @param {onCallback} callback
     */
    off (event, callback) {
        this._element
            .removeEventListener(event, (event) => callback(event, this._element));
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
     * @private
     */
    _initializeElement() {
        this._initializeImports();
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
}