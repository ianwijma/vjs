import App from "./app.js";

document.addEventListener('DOMContentLoaded', () => {
    document.vjs = new App('body');
    document.vjs.start();
})