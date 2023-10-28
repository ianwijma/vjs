import {AbstractAttributeHandler} from "./abstractAttributeHandler.mjs";
import {router} from "../router.mjs";

export class RedirectAttributeHandler extends AbstractAttributeHandler {
    attributes = 'v-redirect';
    importance = 0;
    async handler(component, element) {
        const redirect = this._ensureAttribute(element, 'v-redirect');
        element.addEventListener('click', () => router.route = redirect);
    }
}