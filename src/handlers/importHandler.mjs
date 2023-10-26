export const tag = 'import';
export const importance = 1000;


/**
 * @param {import('../component.mjs').Component} component
 * @param {HTMLElement} element
 */
export const handler = async (component, element) => {
    let importPath = element.getAttribute('v-import');
    if (!importPath) {
        console.error('Missing v-import value', element);
    }

    if (!importPath.endsWith('.html')) {
        importPath = `${importPath}.html`;
    }

    const response = await fetch(importPath);
    element.innerHTML = await response.text();

    component.reloadTags();
};