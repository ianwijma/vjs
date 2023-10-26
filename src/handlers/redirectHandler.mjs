import { Component } from "../component.mjs";
import { router } from "../router.mjs";

export const tag = 'redirect';
export const importance = 0;

/**
 * @param {Component} component
 * @param {HTMLElement} element
 */
export const handler = (component, element) => {
    const redirect = element.getAttribute('v-redirect');
    if (!redirect) {
        console.error('Element with empty v-redirect', element);
    }

    element.addEventListener('click', () => router.route = redirect);
};