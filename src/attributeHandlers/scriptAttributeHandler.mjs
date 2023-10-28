import {AbstractAttributeHandler} from "./abstractAttributeHandler.mjs";
import {router} from "../router.mjs";

export class ScriptAttributeHandler extends AbstractAttributeHandler {
    attributes = 'v-script';
    importance = -1000;
    async handler(__COMPONENT__, __ELEMENT__) {
        // Setup vjs context
        const vjs = {
            ...__COMPONENT__.context.data,
            router: router,
            elements: __COMPONENT__.context.data.elements ?? {},
            templates: __COMPONENT__.context.data.templates ?? {},
        }

        // Execute the script
        eval(__ELEMENT__.innerText);
    }
}