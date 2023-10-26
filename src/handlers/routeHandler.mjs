import { Component } from "../component.mjs";
import { router } from "../router.mjs";

export const tag = 'route';
export const importance = 0;

/**
 * @param {Component} component
 * @param {HTMLElement} element
 */
export const handler = (component, element) => {
    const targetRoute = element.getAttribute('v-route');
    if (!targetRoute) {
        console.error('Element with empty v-route', targetRoute);
    }

    const matchRoute = () => router.route.startsWith(targetRoute);
    const toggleRoute = () => element.style.display = matchRoute() ? '' : 'none';

    router.on('redirect', () => toggleRoute());
    toggleRoute();
};