import {Component} from "./component.mjs";

export const TemplateVariableRegex = new RegExp(/{{\s*(\S+)\s*}}/, 'gm');

export class Template {
    /**
     * @type {HTMLTemplateElement}
     * @private
     */
    _element;

    /**
     * @var {string}
     * @private
     */
    _html= '';

    /**
     * @var {string[]}
     * @private
     */
    _variables = [];

    /**
     * @var {Component}
     * @private
     */
    _parentComponent;

    /**
     * @param {HTMLTemplateElement} templateElement
     * @param {Component} parentComponent
     */
    constructor(templateElement, parentComponent) {
        this._element = templateElement;
        this._parentComponent = parentComponent;
        this._html = this._normaliseTemplateHtml(templateElement.innerHTML);
        this._variables = this._extractTemplateVariables(this._html);
    }

    /**
     * @template {Object<string, TemplateData|string|number>} TemplateData
     */

    /**
     * @param {TemplateData} templateData
     * @return HTMLElement
     */
    render(templateData = {}) {
        const container = document.createElement('template');
        container.innerHTML = this._html;

        const data = this._objectToFlat(templateData);
        this._variables.forEach(variable => {
            let value = '';
            if (variable in data) {
                value = data[variable];
            }

            container.innerHTML = container.innerHTML.replaceAll(
                `{{${variable}}}`,
                value
            )
        });

        // clean up remaining template tags
        container.innerHTML = container.innerHTML.replaceAll(
            TemplateVariableRegex,
            ''
        );

        const element = container.content.firstElementChild;

        element.addEventListener('template:inserted', () => {
            new Component(element, this._parentComponent.context.clone());
        }, {once: true});

        return element;
    }

    /**
     * @param {TemplateData} object
     * @private
     */
    _objectToFlat(object) {
        let result = {};

        for (const key in object) {

            if ((typeof object[key]) === 'object' && !Array.isArray(object[key])) {
                const temp = this._objectToFlat(object[key]);
                for (const j in temp) {

                    result[key + '.' + j] = temp[j];
                }
            }

            else {
                result[key] = object[key];
            }
        }
        return result;
    }

    /**
     * @param {string} html
     * @returns {string}
     * @private
     */
    _normaliseTemplateHtml(html) {
        const regex = TemplateVariableRegex;

        let match;
        while ((match = regex.exec(this._html)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            const [found, replace] = match;

            html = html.replaceAll(found, `{{${replace}}}`)
        }

        return html;
    }

    /**
     * @param {string} html
     * @returns {string[]}
     * @private
     */
    _extractTemplateVariables(html) {
        /** @var {string[]} */
        const variables = [];
        const regex = TemplateVariableRegex;

        let match;
        while ((match = regex.exec(html)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            const [__, replace] = match;
            variables.push(replace);
        }

        // Remove duplicates
        return variables.filter((value, index, array) => array.indexOf(value) === index);
    }
}