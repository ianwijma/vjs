import {AbstractAttributeHandler} from "./abstractAttributeHandler.mjs";
import {router} from "../router.mjs";

export class RouteAttributeHandler extends AbstractAttributeHandler {
    attributes = ['v-route', 'v-route-exact'];
    importance = 0;
    async handler(component, element) {
        const route = element.getAttribute('v-route');
        const routeExact = element.getAttribute('v-route-exact');
        if (!route && !routeExact) {
            console.error('Element with empty v-route or v-route-exact', element);
        }

        if (route && routeExact) {
            console.error('Element with both v-route and v-route-exact', element);
        }

        // Unify the variables
        const isExact = !!routeExact;
        const targetRoute = route ?? routeExact;

        // Setup matching logic
        const matchRouteFuzzy = () => router.route.startsWith(targetRoute);
        const matchRouteExact = () => router.route === targetRoute;
        const matchRoute = () => isExact ? matchRouteExact() : matchRouteFuzzy();

        // Create toggle method
        const toggleRoute = () => element.style.display = matchRoute() ? '' : 'none';

        // handle change
        router.on('redirect', () => toggleRoute());
        toggleRoute();
    }
}