function direct() {
    try {
        // Base stuff
        window.config = {};
        (function () {
            // Parse parameters
            const s = window.location.search;
            const reg = /([^?&=]*)=([^&]*)/g;
            let i = null;

            while (i = reg.exec(s)) {
                window.config[i[1]] = decodeURIComponent(i[2]);
            }
        }());
        if (window.location.pathname.indexOf('showPaintingsOnCanvas')!==-1 || window.config['showPaintingsOnCanvas']) {
            $(showPaintingsOnCanvas);
        }
        else {
            $(queryPainting);
        }
    }
    catch (ex) {
        $('#status').text('Something went wrong. Check console for errors.');
        console.error(ex);
    }
}

if (document.readyState === "complete") {
    direct();
} else {
    $(document).ready(direct);
}