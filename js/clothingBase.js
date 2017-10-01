
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

function processPainting(evt) {
    console.log(evt);
    window.lastevent = JSON.parse(evt.data);
    const originalImage = document.getElementById('original');

    originalImage.setAttribute("src", window.lastevent.Original);

    if (window.lastevent.json.decision !== undefined) {
        const surrealScore = document.getElementById('surrealScore');
        surrealScore.innerText = window.lastevent.json.decision[0];
    } else {
        surrealScore.innerText = 0;
    }

    const surrealImg = document.getElementById('surreal');

    surrealImg.setAttribute("src", window.lastevent.Surreal);
    surrealImg.onmouseout = function () {
        this.src = window.lastevent.Surreal;
    };
    surrealImg.onmouseover = function () {
        this.src = window.lastevent.SurrealSeg;
    };

    surrealImg.onclick = function () {
        let res = {};
        res.source = window.lastevent.paintingIdx;
        res.surrealSelected = true;
        ws.send(JSON.stringify(res));
    }


    if (window.lastevent.json.decision !== undefined) {
        const grabcutScore = document.getElementById('grabcutScore');
        grabcutScore.innerText = window.lastevent.json.decision[1];
    } else {
        grabcutScore.innerText = 0;
    }

    let grabcutImg = document.getElementById('grabcut');

    grabcutImg.setAttribute("src", window.lastevent.Grabcut);
    grabcutImg.onmouseout = function () {
        this.src = window.lastevent.Grabcut;
    };
    grabcutImg.onmouseover = function () {
        this.src = window.lastevent.Original;
    };

    grabcutImg.onclick = function () {
        let res = {};
        res.source = window.lastevent.paintingIdx;
        res.grabcutSelected = true;
        ws.send(JSON.stringify(res));
    }

    if (window.lastevent.json.decision !== undefined) {
        const customScore = document.getElementById('customScore');
        customScore.innerText = window.lastevent.json.decision[2];
    } else {
        customScore.innerText = 0;
    }
    let customImg = document.getElementById('custom');
    customImg.setAttribute("src", window.lastevent.Original);

    customImg.onclick = function () {
        let res = {};
        res.source = window.lastevent.paintingIdx;
        res.customSelected = true;
        ws.send(JSON.stringify(res));
    }

    document.title = window.lastevent.json.title;

    //const painting_properties = document.getElementById('painting_properties');
    //painting_properties.innerHTML = '';
    //const table = document.createElement("table");
    //painting_properties.appendChild(table);

    {// Title
        const painting_title = document.getElementById('painting_title');
        painting_title.innerText = window.lastevent.json.title;
    }
    {// Painter
        const painting_painter = document.getElementById('painting_painter');
        painting_painter.innerText = window.lastevent.json.Painter;
    }
    {// Gender
        const painting_gender = document.getElementById('painting_gender');
        painting_gender.innerText = window.lastevent.json.Gender;
    }
    {// Year
        const painting_year = document.getElementById('painting_year');
        painting_year.innerText = window.lastevent.json.Year;
    }
    /*
    {// Dominant color
        const dominantColorRow = document.createElement("TR");

        const dominantColorText = document.createElement("TD");
        const dominantColorTextNode = document.createTextNode("Color");
        dominantColorText.appendChild(dominantColorTextNode);
        dominantColorRow.appendChild(dominantColorText);

        const dominantColorValue = document.createElement("TD");
        dominantColorValue.className = 'ellipsis';
        dominantColorValue.style.backgroundColor = "rgb(" + window.lastevent.json.DominantRed + "," + window.lastevent.json.DominantGreen + "," + window.lastevent.json.DominantBlue + ")";
        dominantColorValue.style.margin = "5px";
        dominantColorRow.appendChild(dominantColorValue);

        table.appendChild(dominantColorRow);
    }
    */
}

let ws;
function queryPainting() {
    ws = new WebSocket("ws://" + location.host + ":8080/painting");
    ws.onmessage = function (evt) {
        const fail = function (err) {
            if (err !== undefined)
            {
                alert(err);
            }
            location.reload();
        };
        try {
            let data = JSON.parse(evt.data);
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
            let request = {};
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
