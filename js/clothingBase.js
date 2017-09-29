
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
        surrealScore.innerText = 'Current upvote count ' + window.lastevent.json.decision[0];
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
        grabcutScore.innerText = 'Current upvote count ' + window.lastevent.json.decision[1];
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
        customScore.innerText = 'Current upvote count ' + window.lastevent.json.decision[2];
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

    let painting_properties = document.getElementById('painting_properties');
    painting_properties.innerHTML = '';
    let table = document.createElement("table");
    painting_properties.appendChild(table);

    {// Title
        let titleRow = document.createElement("TR");

        let titleText = document.createElement("TD");
        let titleTextNode = document.createTextNode("Title");
        titleText.appendChild(titleTextNode);
        titleRow.appendChild(titleText);

        let titleValue = document.createElement("TD");
        titleValue.className = 'ellipsis';
        let titleValueNode = document.createTextNode(window.lastevent.json.title);
        titleValue.appendChild(titleValueNode);
        titleRow.appendChild(titleValue);

        table.appendChild(titleRow);
    }
    {// Painter
        let painterRow = document.createElement("TR");

        let painterText = document.createElement("TD");
        let painterTextNode = document.createTextNode("Painter");
        painterText.appendChild(painterTextNode);
        painterRow.appendChild(painterText);

        let painterValue = document.createElement("TD");
        painterValue.className = 'ellipsis';
        let painterValueNode = document.createTextNode(window.lastevent.json.Painter);
        painterValue.appendChild(painterValueNode);
        painterRow.appendChild(painterValue);

        table.appendChild(painterRow);
    }
    {// Gender
        let genderRow = document.createElement("TR");

        let genderText = document.createElement("TD");
        let genderTextNode = document.createTextNode("Gender");
        genderText.appendChild(genderTextNode);
        genderRow.appendChild(genderText);

        let genderValue = document.createElement("TD");
        genderValue.className = 'ellipsis';
        let genderValueNode = document.createTextNode(window.lastevent.json.Gender);
        genderValue.appendChild(genderValueNode);
        genderRow.appendChild(genderValue);

        table.appendChild(genderRow);
    }
    {// Year
        let yearRow = document.createElement("TR");

        let yearText = document.createElement("TD");
        let yearTextNode = document.createTextNode("Year");
        yearText.appendChild(yearTextNode);
        yearRow.appendChild(yearText);

        let yearValue = document.createElement("TD");
        yearValue.className = 'ellipsis';
        let yearValueNode = document.createTextNode(window.lastevent.json.Year);
        yearValue.appendChild(yearValueNode);
        yearRow.appendChild(yearValue);

        table.appendChild(yearRow);
    }
    {// Dominant color
        let dominantColorRow = document.createElement("TR");

        let dominantColorText = document.createElement("TD");
        let dominantColorTextNode = document.createTextNode("Color");
        dominantColorText.appendChild(dominantColorTextNode);
        dominantColorRow.appendChild(dominantColorText);

        let dominantColorValue = document.createElement("TD");
        dominantColorValue.className = 'ellipsis';
        dominantColorValue.style.backgroundColor = "rgb(" + window.lastevent.json.DominantRed + "," + window.lastevent.json.DominantGreen + "," + window.lastevent.json.DominantBlue + ")";
        dominantColorValue.style.margin = "5px";
        dominantColorRow.appendChild(dominantColorValue);

        table.appendChild(dominantColorRow);
    }
}

let ws;
function queryPainting() {
    ws = new WebSocket("ws://" + location.host + ":8080/painting");
    ws.onmessage = function (evt) {
        let fail = function (err) {
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
