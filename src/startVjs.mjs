import { Component } from "./component.mjs";
import {ComponentContext} from "./componentContext.js";
import { AbstractAttributeHandler } from "./attributeHandlers/abstractAttributeHandler.mjs";



/**
 * @param {HTMLElement} element
 * @param {AbstractAttributeHandler[]} attributeHandlers
 */
export function startVjs(element, attributeHandlers) {
    attributeHandlers = Array.isArray(attributeHandlers) ? attributeHandlers : Object.values(attributeHandlers);

    return new Component(
        element,
        new ComponentContext({
            attributeHandlers: attributeHandlers
        })
    );
}