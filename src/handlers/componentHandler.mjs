import { Component } from "../component.mjs";

export const tag = 'component';
export const importance = 750;

/**
 * @param {Component} component
 * @param {HTMLElement} element
 */
export const handler = (component, element) => {
    if (component._mount !== element) {
        new Component(element, component._tagHandlers);
    }
};