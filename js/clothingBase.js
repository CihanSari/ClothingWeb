
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

    const fncParseImofa = imofaStr => {
        if (imofaStr === undefined) {
            let imofaQuanta = {};
            imofaQuanta.perc = 1;
            imofaQuanta.red = 255;
            imofaQuanta.green = 255;
            imofaQuanta.blue = 255;

            let imofaQuantaArray = [];
            imofaQuantaArray.push(imofaQuanta);
            return imofaQuantaArray;
        }
        let imofaQuantaStrArray = imofaStr.slice(1, imofaStr.length - 1).split(';');
        const fncParseImofaQuanta = imofaQuantaStr => {
            const imofaQuantaStrPieces = imofaQuantaStr.split(' ');
            let imofaQuanta = {};
            imofaQuanta.perc = parseFloat(imofaQuantaStrPieces[0]);
            imofaQuanta.red = parseFloat(imofaQuantaStrPieces[1]);
            imofaQuanta.green = parseFloat(imofaQuantaStrPieces[2]);
            imofaQuanta.blue = parseFloat(imofaQuantaStrPieces[3]);
            return imofaQuanta;
        };
        let imofaQuantaArray = [];
        for (let i = 0; i < imofaQuantaStrArray.length; ++i) {
            imofaQuanta = fncParseImofaQuanta(imofaQuantaStrArray[i]);
            let gotIn = false;
            for (let j = 0; j < i; ++j) {
                if (imofaQuantaArray[j].perc < imofaQuanta.perc) {
                    imofaQuantaArray.splice(j, 0, imofaQuanta);
                    gotIn = true;
                    break;
                }
            }
            if (gotIn === false) {
                imofaQuantaArray[i] = imofaQuanta;
            }
        }
        return imofaQuantaArray;
    };

    {// Dominant color
        let imofaQuantaArray = fncParseImofa(window.lastevent.json.imofa);

        const c = document.getElementById("grabcutCanvas");
        const ctx = c.getContext("2d");
        let width = c.width;
        let height = c.height;
        let lastWidth = 0;
        for (let i = 0; i < imofaQuantaArray.length; ++i) {
            let cur = imofaQuantaArray[i];
            let curWidth = width * cur.perc;
            ctx.fillStyle = "rgb(" + Math.floor(cur.red) + "," + Math.floor(cur.green) + "," + Math.floor(cur.blue) + ")";
            console.log(ctx.fillStyle);
            ctx.fillRect(lastWidth, 0, curWidth, height);
            lastWidth += curWidth;
            ctx.stroke();
        }
    } // Dominant color in Grabcut

    { // Dominant color in painting
        let imofaQuantaArray = fncParseImofa(window.lastevent.json.imofaAll);

        const c = document.getElementById("handCanvas");
        const ctx = c.getContext("2d");
        let width = c.width;
        let height = c.height;
        let lastWidth = 0;
        for (let i = 0; i < imofaQuantaArray.length; ++i) {
            let cur = imofaQuantaArray[i];
            let curWidth = width * cur.perc;
            ctx.fillStyle = "rgb(" + Math.floor(cur.red) + "," + Math.floor(cur.green) + "," + Math.floor(cur.blue) + ")";
            console.log(ctx.fillStyle);
            ctx.fillRect(lastWidth, 0, curWidth, height);
            lastWidth += curWidth;
            ctx.stroke();
        }
    }
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
