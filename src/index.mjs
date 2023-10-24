import Element from "./element.mjs";

const getCurrentUrl = () => new URL(window.location.href);

document.vjs = {
    initialiseComponent: (componentName) => new Element(`[v-component=${componentName}]`),
    route: {
        current: '',
        setRoute: function (route) {
            this.current = route;
            document.vjs.body.trigger('redirected');

            const url = getCurrentUrl();
            url.hash = route;
            window.history.pushState(
                {},
                '',
                url
            )
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const url = getCurrentUrl();
    if (url.hash === '') url.hash = '/';
    window.history.pushState(
        {},
        '',
        url
    )

    document.vjs.route.current = url.hash.substring(1);
    document.vjs.body = new Element(document.body);

    console.log(document.vjs)
})