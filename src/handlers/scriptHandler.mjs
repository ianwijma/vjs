export const tag = '_';
export const importance = -1000;

/**
 * @param {import('../component.mjs').Component} component
 * @param {HTMLElement} element
 */
export const handler = (component, element) => {
    element.querySelectorAll('script')
        .forEach(scriptElement => {
            eval(scriptElement.innerText)
        });
};