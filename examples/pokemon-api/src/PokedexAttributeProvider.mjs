import {AbstractAttributeHandler} from "../../../src/index.mjs";
import Pokedex from 'pokedex-promise-v2'

export class PokedexAttributeProvider extends AbstractAttributeHandler {
    attributes = '_';
    async handler(component, element) {
        const { pokedex = new Pokedex() } = component.context;
        component.context.updateData({ pokedex });
    }
}