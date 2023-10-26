class Router {
    /** @var {string} */
    _route = '/';

    /** @type {Comment} */
    _event = new Comment();

    constructor() {
        this._route = this._initialRoute();
        this._redirect(this._route, true);
    }

    /**
     * @return {string}
     * @private
     */
    _initialRoute() {
        const route = this._currentUrl().hash.substring(1);
        if (route === '') {
            return '/';
        }

        return route;
    }

    get route () {
        return this._route
    }

    set route (newRoute) {
        this._route = newRoute;

        this._redirect(newRoute);
    }

    /**
     * @param {string} event
     * @param {function} callback
     */
    on(event, callback) {
        this._event.addEventListener(event, () => callback(this.route));
    }

    /**
     * @param {string} event
     * @param {function} callback
     */
    once(event, callback) {
        this._event.addEventListener(event, () => callback(this.route), {once: true});
    }

    /**
     * @param {string} event
     * @param {function} callback
     */
    off(event, callback) {
        this._event.addEventListener(event, () => callback(this.route));
    }

    /**
     * @param {string} event
     */
    trigger(event) {
        this._event.dispatchEvent(new Event(event));
    }

    _currentUrl() {
        return new URL(window.location.href);
    }

    /**
     * @param {string} newRoute
     * @param {boolean} replaceState
     * @private
     */
    _redirect(newRoute, replaceState = false) {
        const url = this._currentUrl();
        url.hash = `#${newRoute}`

        if (replaceState) {
            window.history.replaceState({}, '', url);
        } else {
            window.history.pushState({}, '', url);
        }

        this.trigger('redirect');
    }
}

export const router = new Router();