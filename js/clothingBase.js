﻿
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
function queryPainting() {
    ws = new WebSocket("ws://" + location.host + ":8080/painting");
    ws.onmessage = function (evt) {
        console.log(evt);
        window.lastevent = JSON.parse(evt.data);
        var leftImg = document.getElementById('left');
        
        leftImg.setAttribute("src", window.lastevent.Grabcut);
        leftImg.onmouseout = function () {
            this.src = window.lastevent.Grabcut;
        };
        leftImg.onmouseover = function () {
            this.src = window.lastevent.Original;
        };

        var rightImg = document.getElementById('right');

        rightImg.setAttribute("src", window.lastevent.Grabcut);
        rightImg.onmouseout = function () {
            this.src = window.lastevent.Grabcut;
        };
        rightImg.onmouseover = function () {
            this.src = window.lastevent.Original;
        };


        var centerImg = document.getElementById('center');

        centerImg.setAttribute("src", window.lastevent.Grabcut);
        centerImg.onmouseout = function () {
            this.src = window.lastevent.Grabcut;
        };
        centerImg.onmouseover = function () {
            this.src = window.lastevent.Original;
        };


        document.title = window.lastevent.json.title;

        var table = document.createElement("table");
        document.body.appendChild(table);

        /*
                <th>Dominant Clothing Color</th>
        */
        {// Title
            var titleRow = document.createElement("TR");

            var titleText = document.createElement("TD");
            var titleTextNode = document.createTextNode("Title");
            titleText.appendChild(titleTextNode);
            titleRow.appendChild(titleText);

            var titleValue = document.createElement("TD");
            var titleValueNode = document.createTextNode(window.lastevent.json.title);
            titleValue.appendChild(titleValueNode);
            titleRow.appendChild(titleValue);

            table.appendChild(titleRow);
        }
        {// Painter
            var painterRow = document.createElement("TR");

            var painterText = document.createElement("TD");
            var painterTextNode = document.createTextNode("Painter");
            painterText.appendChild(painterTextNode);
            painterRow.appendChild(painterText);

            var painterValue = document.createElement("TD");
            var painterValueNode = document.createTextNode(window.lastevent.json.Painter);
            painterValue.appendChild(painterValueNode);
            painterRow.appendChild(painterValue);

            table.appendChild(painterRow);
        }
        {// Gender
            var genderRow = document.createElement("TR");

            var genderText = document.createElement("TD");
            var genderTextNode = document.createTextNode("Gender");
            genderText.appendChild(genderTextNode);
            genderRow.appendChild(genderText);

            var genderValue = document.createElement("TD");
            var genderValueNode = document.createTextNode(window.lastevent.json.Gender);
            genderValue.appendChild(genderValueNode);
            genderRow.appendChild(genderValue);

            table.appendChild(genderRow);
        }
        {// Year
            var yearRow = document.createElement("TR");

            var yearText = document.createElement("TD");
            var yearTextNode = document.createTextNode("Year");
            yearText.appendChild(yearTextNode);
            yearRow.appendChild(yearText);

            var yearValue = document.createElement("TD");
            var yearValueNode = document.createTextNode(window.lastevent.json.Year);
            yearValue.appendChild(yearValueNode);
            yearRow.appendChild(yearValue);

            table.appendChild(yearRow);
        }
        {// Dominant color
            var dominantColorRow = document.createElement("TR");

            var dominantColorText = document.createElement("TD");
            var dominantColorTextNode = document.createTextNode("Color");
            dominantColorText.appendChild(dominantColorTextNode);
            dominantColorRow.appendChild(dominantColorText);

            var dominantColorValue = document.createElement("TD");
            dominantColorValue.style.backgroundColor = "rgb(" + window.lastevent.json.DominantRed + "," + window.lastevent.json.DominantGreen + "," + window.lastevent.json.DominantBlue + ")";
            dominantColorValue.style.margin = "5px";
            dominantColorRow.appendChild(dominantColorValue);

            table.appendChild(dominantColorRow);
        }
        ws.close();
    };
    ws.onopen = function (evt) {
        var request = {};
        request.israndom = true;
        ws.send(JSON.stringify(request));
    }
}

if (document.readyState === "complete") {
    queryPainting();
} else {
    $(document).ready(queryPainting);
}
