
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

function processPainting() {
    const originalImage = document.getElementById('original');

    originalImage.setAttribute("src", window.lastevent.Original);
    
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
    };

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
    };
    processPaintingProperties();
}

function processPaintingProperties() {

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
        if (window.lastevent.json.Gender === 'Male') {
            document.body.style.background = '#2B2B3E';
        } else {
            document.body.style.background = '#533D4B';
        }
    }
    {// Year
        const painting_year = document.getElementById('painting_year');
        painting_year.innerText = window.lastevent.json.Year;
    }

    // Color Thief grabcut
    {
        let img = new Image;
        img.onload = function () {
            {
                // Dom color
                let domColor = window.colorthief.getColor(img);
                const c = document.getElementById("grabcutThiefDominantCanvas");
                const ctx = c.getContext("2d");
                let width = c.width;
                let height = c.height;
                ctx.fillStyle = "rgb(" + domColor.join(',') + ")";
                ctx.fillRect(0, 0, width, height);
                ctx.stroke();
            }
            {
                // Palette
                let palette = window.colorthief.getPalette(img);
                const c = document.getElementById("grabcutThiefPaletteCanvas");
                const ctx = c.getContext("2d");
                let width = c.width;
                let height = c.height;
                let lastWidth = 0;
                for (let i = 0; i < palette.length; ++i) {
                    let curWidth = width / palette.length;
                    ctx.fillStyle = "rgb(" + palette[i].join(',') + ")";
                    ctx.fillRect(lastWidth, 0, curWidth, height);
                    lastWidth += curWidth;
                    ctx.stroke();
                }
            }
        };
        img.src = window.lastevent.Grabcut;
    }

    // Color Thief painting
    {
        let img = new Image;
        img.onload = function () {
            {
                // Dom color
                let domColor = window.colorthief.getColor(img);
                const c = document.getElementById("paintingThiefDominantCanvas");
                const ctx = c.getContext("2d");
                let width = c.width;
                let height = c.height;
                ctx.fillStyle = "rgb(" + domColor.join(',') + ")";
                ctx.fillRect(0, 0, width, height);
                ctx.stroke();
            }
            {
                // Palette
                let palette = window.colorthief.getPalette(img);
                const c = document.getElementById("paintingThiefPaletteCanvas");
                const ctx = c.getContext("2d");
                let width = c.width;
                let height = c.height;
                let lastWidth = 0;
                for (let i = 0; i < palette.length; ++i) {
                    let curWidth = width / palette.length;
                    ctx.fillStyle = "rgb(" + palette[i].join(',') + ")";
                    ctx.fillRect(lastWidth, 0, curWidth, height);
                    lastWidth += curWidth;
                    ctx.stroke();
                }
            }
        };
        img.src = window.lastevent.Original;
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

    {// Imofa color
        let imofaQuantaArray = fncParseImofa(window.lastevent.json.imofa);

        const c = document.getElementById("grabcutImofaPaletteCanvas");
        const ctx = c.getContext("2d");
        let width = c.width;
        let height = c.height;
        let lastWidth = 0;
        for (let i = 0; i < imofaQuantaArray.length; ++i) {
            let cur = imofaQuantaArray[i];
            let curWidth = width * cur.perc;
            ctx.fillStyle = "rgb(" + Math.floor(cur.red) + "," + Math.floor(cur.green) + "," + Math.floor(cur.blue) + ")";
            ctx.fillRect(lastWidth, 0, curWidth, height);
            lastWidth += curWidth;
            ctx.stroke();
        }
    } // Dominant color in Grabcut

    { // Dominant color in painting
        let imofaQuantaArray = fncParseImofa(window.lastevent.json.imofaAll);

        const c = document.getElementById("paintingImofaPaletteCanvas");
        const ctx = c.getContext("2d");
        let width = c.width;
        let height = c.height;
        let lastWidth = 0;
        for (let i = 0; i < imofaQuantaArray.length; ++i) {
            let cur = imofaQuantaArray[i];
            let curWidth = width * cur.perc;
            ctx.fillStyle = "rgb(" + Math.floor(cur.red) + "," + Math.floor(cur.green) + "," + Math.floor(cur.blue) + ")";
            ctx.fillRect(lastWidth, 0, curWidth, height);
            lastWidth += curWidth;
            ctx.stroke();
        }
    }
}

let ws;
function queryPainting() {
    loadScript('js/color-thief.min.js').done(() => {
        window.colorthief = new ColorThief();
        let connectionResolved = false;
        const fncGoToNext = () => {
            const idx = Math.floor(Math.random() * 1257);
            window.location.href = window.location.origin + '/?loadoffline=true&paintingIdx=' + idx;
        };
        const fncException = ex => {
            $('#status').text('Something went wrong. Click here to retry on a random painting.');
            $('#status').css({ 'color': 'rgb(237,67,55)' });
            $('#status').addClass('clickable');
            $('#status').click(() => {
                fncGoToNext();
            });
            console.error(ex);
        };
        const fncLoadOffline = () => {
            connectionResolved = true;
            window.isonline = false;
            $('#status').text('Connection failed. Loading read-only mode...');
            window.lastevent = {};
            if (jQuery.isEmptyObject(window.config)) {
                fncGoToNext();
            } else {
                const idx = parseInt(window['config']['paintingIdx']);
                $.getJSON('data/json/files.json', fileList => {
                    const file = fileList[idx];
                    $.getJSON('data/json/' + file, fullyaml => {
                        const origin = (() => {
                            if (fullyaml['origin'])
                                return fullyaml['origin'];
                            else
                                return fullyaml;
                        })();
                        window.lastevent.json = origin;
                        if (!origin['Filename']) {
                            origin['Filename'] = file.substring(0, file.length - 4) + 'jpg';
                        }
                        const fncParseCVYAML = yamlData => {
                            const dataWithoutHeader = yamlData.substring(35);
                            const dirtyPieces = dataWithoutHeader.split(': ');
                            const yamlStruct = {};
                            let key = dirtyPieces[0];
                            for (let i = 1; i < dirtyPieces.length; ++i) {
                                const dirtyPiece = dirtyPieces[i];
                                const splitIdx = dirtyPiece.lastIndexOf('\n');
                                const value = dirtyPiece.substring(0, splitIdx);
                                const fncTryParse = val => {
                                    try {
                                        return JSON.parse(val);
                                    }
                                    catch (e) {
                                        return val;
                                    }
                                };
                                yamlStruct[key] = fncTryParse(value);
                                key = dirtyPiece.substring(splitIdx + 1).replace(/ /g, '');
                            }
                            return yamlStruct;
                        };
                        const canvasOriginalImage = document.createElement('canvas');
                        canvasOriginalImage.style = 'display:none';
                        document.body.appendChild(canvasOriginalImage);
                        canvasOriginalImage.id = "canvasOriginal";

                        const canvasGrabcutImage = document.createElement('canvas');
                        canvasGrabcutImage.style = 'display:none';
                        document.body.appendChild(canvasGrabcutImage);
                        canvasGrabcutImage.id = "canvasGrabcut";

                        const ctxOriginalImage = canvasOriginalImage.getContext("2d");
                        const ctxGrabcutImage = canvasGrabcutImage.getContext("2d");

                        let yamlStruct = null;
                        if (origin['GrabCutData']) {
                            yamlStruct = fncParseCVYAML(origin['GrabCutData']);
                        }
                        // load image from data url
                        const paintingData = new Image();
                        paintingData.onload = () => {
                            canvasOriginalImage.width = paintingData.width;
                            canvasOriginalImage.height = paintingData.height;
                            canvasGrabcutImage.width = paintingData.width;
                            canvasGrabcutImage.height = paintingData.height;

                            ctxOriginalImage.drawImage(paintingData, 0, 0);
                            ctxOriginalImage.stroke();
                            const originalImageUrl = canvasOriginalImage.toDataURL();
                            window.lastevent.Original = originalImageUrl;
                            const originalImgDom = document.getElementById('original');
                            originalImgDom.src = originalImageUrl;

                            ctxGrabcutImage.drawImage(paintingData, 0, 0);

                            if (yamlStruct) {
                                for (let i = 0; i < yamlStruct['rows']; ++i) {
                                    for (let j = 0; j < yamlStruct['cols']; ++j) {
                                        const maskVal = yamlStruct['data'][i * yamlStruct['cols'] + j];
                                        if (maskVal !== 3) {
                                            ctxGrabcutImage.clearRect(j, i, 1, 1);
                                        }
                                    }
                                }
                            }
                            ctxGrabcutImage.stroke();
                            const grabcutImgUrl = canvasGrabcutImage.toDataURL();
                            window.lastevent.Grabcut = grabcutImgUrl;
                            const grabcutImgDom = document.getElementById('grabcut');
                            grabcutImgDom.src = grabcutImgUrl;
                            grabcutImgDom.onmouseout = function () {
                                this.src = grabcutImgUrl;
                            };
                            grabcutImgDom.onmouseover = function () {
                                this.src = originalImageUrl;
                            };
                            const sizeStyle = '"max-width":' + paintingData.width + '; "max-height": ' + paintingData.height + ';';
                            const fncSetStyleAndClick = dom => {
                                dom.style.maxWidth = paintingData.width + 'px';
                                dom.style.maxHeight = paintingData.height + 'px';
                                dom.onclick = fncGoToNext;
                            };
                            try {
                                processPainting();
                            }
                            catch (ex) {
                                fncException(ex);
                            }
                            fncSetStyleAndClick(grabcutImgDom);
                            fncSetStyleAndClick(originalImgDom);
                            $('#loadingcontent').css({ 'display': 'none' });
                            $('#content').css({ 'display': 'initial' });
                            $('.hand').css({ 'display': 'none' });
                            $('#instructionGrabcut').text('WARNING: You are browsing offline version. Please click on the image, to browse to a random image. Click on this text to check if server is back online.');
                            $('#instructionGrabcut').css({ 'color': 'rgb(237,67,55)' });
                            $('#instructionGrabcut').addClass('clickable');
                            $('#instructionGrabcut').click(() => {
                                document.location.href = window.location.origin;
                            });

                        };

                        paintingData.src = 'data/jpg/' + origin['Filename'];
                    });
                });
            }
        };
        const fncLoadOnline = () => {
            $('#status').text('Connection established. Loading...');
            connectionResolved = true;
            window.isonline = true;

            if (jQuery.isEmptyObject(window.config)) {
                let request = {};
                request.israndom = true;
                ws.send(JSON.stringify(request));
            } else {
                ws.send(JSON.stringify(window.config));
            }
            $('#loadingcontent').css({ 'display': 'none' });
            $('#content').css({ 'display': 'initial' });
        };
        try {
            if (window.config['loadoffline']) {
                fncLoadOffline();
            }
            else {
                ws = new WebSocket("ws://cihansari.com:8080/painting");
                setTimeout(() => {
                    if (!connectionResolved) {
                        delete ws;
                        fncLoadOffline();
                    }
                }, 1500);
                ws.onmessage = function (evt) {
                    const fail = function (err) {
                        if (err !== undefined) {
                            alert(err);
                        }
                        location.reload();
                    };
                    try {
                        let data = JSON.parse(evt.data);
                        if (data.hasOwnProperty('json') && data.hasOwnProperty('Original')) {
                            // painting event
                            window.lastevent = JSON.parse(evt.data);
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
                ws.onopen = fncLoadOnline;
                ws.onerror = fncLoadOffline;
                window.onclose = function () {
                    ws.close();
                };
            }
        }
        catch (ex)
        {
            fncException();
        }
    });
}

if (document.readyState === "complete") {
    queryPainting();
} else {
    $(document).ready(queryPainting);
}