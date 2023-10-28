import { AbstractAttributeHandler } from './attributeHandlers/abstractAttributeHandler.mjs'

/**
 * @typedef {Object} ComponentContextConstructor
 * @property {AbstractAttributeHandler[]} attributeHandlers
 */

export class ComponentContext {
    /**
     * @var {AbstractAttributeHandler[]}
     * @private
     */
    _attributeHandlers = [];

    /**
     * @var {Object<string, any>}
     * @private
     */
    _data = {};

    /**
     * @param {ComponentContextConstructor} config
     */
    constructor(config) {
        const { attributeHandlers = [] } = config;

        this._attributeHandlers = attributeHandlers;
    }

    /** @returns {AbstractAttributeHandler[]} */
    get attributeHandlers() {
        return this._attributeHandlers.map(AttributeHandler => new AttributeHandler());
    }

    get data() {
        return this._data;
    }

    set data(newData) {
        this._data = newData;
    }

    updateData(updatedData) {
        this.data = {
            ...this.data,
            ...updatedData
        }
    }

    clone() {
        const newContext = Object.assign(Object.create(Object.getPrototypeOf(this)), this);

        newContext.data = {};

        return newContext;
    }
}