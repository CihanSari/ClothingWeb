
// Base stuff

(function () {
    // Parse parameters
    var s = window.location.search;
    var reg = /([^?&=]*)=([^&]*)/g;
    this.config = {};
    var i = null;

    while (i = reg.exec(s)) {
        this.config[i[1]] = decodeURIComponent(i[2]);
    }

    if (jQuery.isEmptyObject(this.config)) {
        var rndNum = Math.random();
        this.config.paintingIdx = Math.floor(rndNum * 1400);
    }
})();


var ws;
window.onload = function () {
    ws = new WebSocket("ws://" + location.host + ":8080/painting");
    ws.onmessage = function (evt) {
        window.lastevent = JSON.parse(evt.data);
    };
    ws.onopen = function (evt) {
        var request = {};
        request.israndom = true;
        ws.send(JSON.stringify(request));
    }
}
window.onclose = function () {
    ws.close();
}