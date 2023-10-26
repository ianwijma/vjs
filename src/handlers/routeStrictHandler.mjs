import { Component } from "../component.mjs";
import { router } from "../router.mjs";

export const tag = 'route-strict';
export const importance = 0;

/**
 * @param {Component} component
 * @param {HTMLElement} element
 */
export const handler = (component, element) => {
    const targetRoute = element.getAttribute('v-route-strict');
    if (!targetRoute) {
        console.error('Element with empty v-route-strict', targetRoute);
    }

    const matchRoute = () => router.route === targetRoute;
    const toggleRoute = () => element.style.display = matchRoute() ? '' : 'none';

    router.on('redirect', () => toggleRoute());
    toggleRoute();
};