import { Component } from "./component.mjs";

/**
 * @param {HTMLElement} element
 * @param {import('component.mjs').TagHandler[]} tagHandlers
 */
export default function startVjs(element, tagHandlers) {
    return new Component(element, tagHandlers);
}