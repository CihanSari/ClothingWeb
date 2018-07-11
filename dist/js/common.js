// Base stuff
(function () {
    // Parse parameters
    window.config = window.config || {};
    const s = window.location.search;
    const reg = /([^?&=]*)=([^&]*)/g;
    let i = null;

    while (i = reg.exec(s)) {
        window.config[i[1]] = decodeURIComponent(i[2]);
    }
}());