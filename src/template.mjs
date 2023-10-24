import Element from "./element.mjs";

export const TemplateVariableRegex = new RegExp(/{{\s*(\S+)\s*}}/, 'gm');

export default class Template {
    /**
     * @type {HTMLTemplateElement}
     * @private
     */
    _templateElement;

    /**
     * @var {string}
     * @private
     */
    _templateHtml= '';

    /**
     * @var {string[]}
     * @private
     */
    _templateVariables = [];


    /**
     * @param {HTMLTemplateElement} templateElement
     */
    constructor(templateElement) {
        if (templateElement.content.children.length > 1) {
            throw Error('Template can not have more than 1 root element');
        }

        this._templateElement = templateElement;
        this._templateHtml = this._normaliseTemplateHtml(templateElement.innerHTML);
        this._templateVariables = this._extractTemplateVariables(this._templateHtml);
    }

    /**
     * @template {Object<string, TemplateData|string|number>} TemplateData
     */

    /**
     * @param {TemplateData} templateData
     * @return Element
     */
    render(templateData) {
        const container = document.createElement('template');
        container.innerHTML = this._templateHtml;

        const data = this._objectToFlat(templateData);
        this._templateVariables.forEach(variable => {
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

        return new Element(container.content.firstElementChild);
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
        while ((match = regex.exec(this._templateHtml)) !== null) {
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