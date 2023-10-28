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
                if (attribute === '_') {
                    attributeHandler.handler(this, this._mount);
                } else {
                    this._mount.querySelectorAll(`[${attribute}]`)
                        .forEach(element => attributeHandler.handler(this, element))
                }

            }
        }
    }
}