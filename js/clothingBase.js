
// Base stuff

window.config = {};
(function () {
    // Parse parameters
    var s = window.location.search;
    var reg = /([^?&=]*)=([^&]*)/g;
    var i = null;

    while (i = reg.exec(s)) {
        window.config[i[1]] = decodeURIComponent(i[2]);
    }
}());

function processPainting(evt) {
    console.log(evt);
    window.lastevent = JSON.parse(evt.data);
    var originalImage = document.getElementById('original');

    originalImage.setAttribute("src", window.lastevent.Original);

    var surrealImg = document.getElementById('surreal');

    surrealImg.setAttribute("src", window.lastevent.Surreal);
    surrealImg.onmouseout = function () {
        this.src = window.lastevent.Surreal;
    };
    surrealImg.onmouseover = function () {
        this.src = window.lastevent.SurrealSeg;
    };

    surrealImg.onclick = function () {
        var res = {};
        res.source = window.lastevent.json.Filename;
        res.surrealSelected = true;
        ws.send(JSON.stringify(res));
    }

    var grabcutImg = document.getElementById('grabcut');

    grabcutImg.setAttribute("src", window.lastevent.Grabcut);
    grabcutImg.onmouseout = function () {
        this.src = window.lastevent.Grabcut;
    };
    grabcutImg.onmouseover = function () {
        this.src = window.lastevent.Original;
    };

    grabcutImg.onclick = function () {
        var res = {};
        res.source = window.lastevent.json.Filename;
        res.grabcutSelected = true;
        ws.send(JSON.stringify(res));
    }


    var customImg = document.getElementById('custom');
    customImg.setAttribute("src", window.lastevent.Original);


    document.title = window.lastevent.json.title;

    var painting_properties = document.getElementById('painting_properties');
    painting_properties.innerHTML = '';
    var table = document.createElement("table");
    painting_properties.appendChild(table);

    {// Title
        var titleRow = document.createElement("TR");

        var titleText = document.createElement("TD");
        var titleTextNode = document.createTextNode("Title");
        titleText.appendChild(titleTextNode);
        titleRow.appendChild(titleText);

        var titleValue = document.createElement("TD");
        titleValue.className = 'ellipsis';
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
        painterValue.className = 'ellipsis';
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
        genderValue.className = 'ellipsis';
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
        yearValue.className = 'ellipsis';
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
        dominantColorValue.className = 'ellipsis';
        dominantColorValue.style.backgroundColor = "rgb(" + window.lastevent.json.DominantRed + "," + window.lastevent.json.DominantGreen + "," + window.lastevent.json.DominantBlue + ")";
        dominantColorValue.style.margin = "5px";
        dominantColorRow.appendChild(dominantColorValue);

        table.appendChild(dominantColorRow);
    }
}

var ws;
function queryPainting() {
    ws = new WebSocket("ws://" + location.host + ":8080/painting");
    ws.onmessage = function (evt) {
        var fail = function (err) {
            if (err !== undefined)
            {
                alert(err);
            }
            location.reload();
        };
        try {
            var data = JSON.parse(evt.data);
            if (data.hasOwnProperty('json') && data.hasOwnProperty('Original')) {
                // painting event
                processPainting(evt);
            } else if (data.hasOwnProperty('paintingIdx')) {
                // redirection request
                window.location.href = window.location.origin + '/?paintingIdx=' + data['paintingIdx'];
            } else {
                fail('Unknown');
            }
        }
        catch (err) {
            fail();
        }

    };
    ws.onopen = function (evt) {
        if (jQuery.isEmptyObject(window.config)) {
            var request = {};
            request.israndom = true;
            ws.send(JSON.stringify(request));
        } else {
            ws.send(JSON.stringify(window.config));
        }
    }
    window.onclose = function () {
        ws.close();
    }
}

if (document.readyState === "complete") {
    queryPainting();
} else {
    $(document).ready(queryPainting);
}
