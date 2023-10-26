
/**
 * @typedef {Object} TagHandler
 * @property {string} tag
 * @property {number} importance
 * @property {function} handler
 */

export class Component {
    /**
     * @var {HTMLElement}
     * @private
     */
    _mount;

    /**
     * @var {Object<string, HTMLElement[]>}
     * @private
     */
    _tags;

    /**
     * @var {TagHandler[]}
     * @private
     */
    _tagHandlers;

    /**
     * @param {HTMLElement} mount
     * @param {TagHandler[]} tagHandlers
     */
    constructor(mount, tagHandlers) {
        this._mount = mount;
        this._tags = this._getTags();
        this._tagHandlers = tagHandlers;
        this._initialize();
        mount.component = this;
    }

    reloadTags() {
        this._tags = this._getTags();
    }

    /**
     * @private
     */
    _initialize() {
        this._triggerHandlers();
    }

    /**
     * @private
     */
    async _triggerHandlers() {
        const tagHandlers = this._tagHandlers.sort((a, b) => b.importance - a.importance);
        for (const tagHandler of tagHandlers) {
            const elements = this._tags[tagHandler.tag] ?? [];
            for (const element of elements) {
                await tagHandler.handler(this, element);
            }
        }
    }

    /**
     * @returns {Object<string, HTMLElement[]>}
     * @private
     */
    _getTags() {
        /** @var {HTMLElement[]} */
        const elements = Array.from(this._mount.querySelectorAll('*'));
        elements.unshift(this._mount);

        const tagMap = {
            '_': [this._mount]
        };

        for (const element of elements) {
            const attributes = Object.values(element.attributes);
            const attributeNames = attributes.map(attribute => attribute.name);
            const tags = attributeNames.filter(name => name.startsWith('v-'));
            const tagNames = tags.map(tag => tag.substring(2));
            for (const tagName of tagNames) {
                if (!(tagName in tagMap)) {
                    tagMap[tagName] = [];
                }

                tagMap[tagName].push(element);
            }
        }

        return tagMap;
    }
}