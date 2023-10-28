import { ComponentContext } from './componentContext.js'

export class Component {
    /**
     * @var {HTMLElement}
     * @private
     */
    _mount;

    /**
     * @var {ComponentContext}
     * @private
     */
    _context;

    /**
     * @param {HTMLElement} mount
     * @param {ComponentContext} context
     */
    constructor(mount, context) {
        this._mount = mount;
        this._context = context;
        this._initialize();
    }

    reloadTags() {
        this._tags = this._getTags();
    }

    /**
     * @returns {ComponentContext}
     */
    get context() {
        return this._context;
    }

    /**
     * @private
     */
    _initialize() {
        this._runAttributeHandlers();
    }

    /**
     * @private
     */
    _runAttributeHandlers() {
        const attributeHandlers = this.context.attributeHandlers.sort((a, b) => b.importance - a.importance);
        for (const attributeHandler of attributeHandlers) {
            let { attributes } = attributeHandler;
            attributes = Array.isArray(attributes) ? attributes : [attributes];
            for (const attribute of attributes) {
                this._mount.querySelectorAll(`[${attribute}]`)
                    .forEach(element => attributeHandler.handler(this, element))
            }
        }
    }

    /**
     * @private
     */
    async _applyTagHandlers() {
        const { tagHandlers: handlers } = this._context;
        for (const handler of handlers) {
            const handlerTags = Array.isArray(handler.tags) ? handler.tags : [handler.tags];
            for (const handlerTag of handlerTags) {
                const elements = this._tags[handlerTag] ?? [];
                for (const element of elements) {
                    await handler.handler(this, element);
                }
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

        const tagMap = {};
        for (const element of elements) {
            const attributes = Object.values(element.attributes);
            const attributeNames = attributes.map(attribute => attribute.name);
            const tags = attributeNames.filter(name => name.startsWith('v-'));
            for (const tag of tags) {
                if (!(tag in tagMap)) {
                    tagMap[tag] = [];
                }

                tagMap[tag].push(element);
            }
        }

        return tagMap;
    }
}