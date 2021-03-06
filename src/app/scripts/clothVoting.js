﻿function queryPainting() {

    function showPalette() {
        if (window.config.showImofa!=null) {
            document.getElementById("imofapalette").style="";
        }
    }

    function rgbToHex(red, green, blue) {
        function cToHex(c) {
            const h = Math.floor(c).toString(16);
            if (h.length<2) {
                return '0'+h;
            }
            else {
                return h;
            }
        };
        return '#'+cToHex(red)+cToHex(green)+cToHex(blue);
    }

    function getVotes() {
        if (window.lastevent.json.decision === undefined) {
            window.decision = [0, 0, 0, 0];
        } else if (window.lastevent.json.decision[2] !== undefined) {
            window.decision = window.lastevent.json.decision;
        } else if (window.lastevent.json.decision[""] !== undefined) {
            window.decision = window.lastevent.json.decision[""];
        }
    }

    function processPainting() {
        const originalImage = document.getElementById('original');

        originalImage.setAttribute("src", window.lastevent.Original);
        getVotes();
        const thumbsdownScore = document.getElementById('thumbsdown_text');
        thumbsdownScore.innerText = window.decision[2];
        const thumbsupScore = document.getElementById('thumbsup_text');
        thumbsupScore.innerText = window.decision[1] + window.decision[0];

        let grabcutImg = document.getElementById('grabcut');

        grabcutImg.setAttribute("src", window.lastevent.Grabcut);
        //grabcutImg.onmouseout = function () {
        //    this.src = window.lastevent.Grabcut;
        //};
        //grabcutImg.onmouseover = function () {
        //    this.src = window.lastevent.Original;
        //};

        grabcutImg.onclick = function () {
            let res = {};
            res.source = window.lastevent.paintingIdx;
            res.grabcutSelected = true;
            ws.send(JSON.stringify(res));
        };

        const fncVoteDecision = i => {
            try {
                const fncCastVote = () => {
                    const data = (() => {
                        if (window.lastevent.json.decision) {
                            const oldValue = window.lastevent.json.decision[i];
                            return encodeURIComponent(window.lastevent.jsonFile + ' ' + JSON.stringify([{ op: "replace", path: "/origin/decision/" + i, value: oldValue + 1 }]))
                        }
                        else {
                            const oldValue = [0, 0, 0, 0];
                            const newValue = oldValue;
                            newValue[i] = 1;
                            return encodeURIComponent(window.lastevent.jsonFile + ' ' + JSON.stringify([{ op: "add", path: "/origin/decision/", value: newValue }]))
                        }
                    })();
                    $.ajax({
                        type: 'get',
                        url: 'http://cihansari.com/cgi-bin/vote?' + data,
                        success: data => {
                            window.fncGoToNext();
                        }
                    });
                };
                const confirmThumbsDown = {
                    title: 'Thumbs down',
                    content: '"Color pallette is worse than original painting in representing the clothing colors."\nDo you want to submit this result and display a random painting ?',
                    type: 'darkred',
                    escapeKey: 'cancel',
                    backgroundDismiss: true,
                    buttons: {
                        ok: {
                            text: 'Submit',
                            btnClass: 'btn-danger',
                            keys: ['enter'],
                            action: fncCastVote
                        },
                        goRandom: {
                            text: 'Skip painting',
                            btnClass: 'btn-primary',
                            keys: ['space'],
                            action: window.fncGoToNext
                        },
                        cancel: {
                            text: 'Cancel',
                            btnClass: 'btn-warning'
                        }
                    }
                };

                const confirmThumbsUp = {
                    title: 'Thumbs up',
                    content: '"Color pallette is better than original painting in representing the clothing colors."\nDo you want to submit this result and display a random painting ?',
                    type: 'darkgreen',
                    escapeKey: 'cancel',
                    backgroundDismiss: true,
                    buttons: {
                        ok: {
                            text: 'Submit',
                            btnClass: 'btn-success',
                            keys: ['enter'],
                            action: fncCastVote
                        },
                        goRandom: {
                            text: 'Skip painting',
                            btnClass: 'btn-primary',
                            keys: ['space'],
                            action: window.fncGoToNext
                        },
                        cancel: {
                            text: 'Cancel',
                            btnClass: 'btn-warning'
                        }
                    }
                };

                if (i === 2) {
                    $.confirm(confirmThumbsDown);
                }
                else {
                    $.confirm(confirmThumbsUp);
                }
            }
            catch (ex) {
                if (confirm('Something went wrong. You will be redirected to another painting. Please report the painting incident.')) {
                    window.fncGoToNext();
                }
            }
        };

        document.getElementById('div_thumbsdown').onclick = () => {
            fncVoteDecision(2);
        };

        document.getElementById('div_thumbsup').onclick = () => {
            fncVoteDecision(1);
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

		/*
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
		*/


        // k-means grabcut
        {
            let img = new Image;
            img.onload = function () {
                var c = document.getElementById("myCanvas");
                var ctx = c.getContext("2d");
                ctx.drawImage(img, 0, 0);


                var imgData = ctx.getImageData(0, 0, img.width, img.height);
                // invert colors
                const colorPoints = [];
                for (var i = 0; i < imgData.data.length; i += 4) {
                    const color = [];
                    if (imgData.data[i + 3] > .5) {
                        color.push(imgData.data[i]);
                        color.push(imgData.data[i + 1]);
                        color.push(imgData.data[i + 2]);
                        colorPoints.push(color);
                    }
                }
                const setDomResult = (el, k) => {
                    const calcDomColor = (k) => {
                        const kRes = kmeans(colorPoints, { k: k, iterations: 5 });

                        const bestRes = {
                            centroid: null,
                            count: -1
                        };
                        kRes.centroids.forEach(centroid => {
                            const pointsWithThisCentroid = kRes.points.filter(function (point) { return point.label() == centroid.label() });
                            if (bestRes.count < pointsWithThisCentroid.length) {
                                bestRes.count = pointsWithThisCentroid.length;
                                bestRes.centroid = centroid;
                            }
                        });
                        bestRes.location = bestRes.centroid.location();
                        bestRes.label = bestRes.centroid.label();
                        return bestRes;
                    };
                    const res = calcDomColor(k);
                    const color = rgbToHex(res.location[0], res.location[1], res.location[2]);
                    el.value = color;
                    el.disabled=false;
                };
                setDomResult(document.getElementById('k02'), 2);
                setDomResult(document.getElementById('k05'), 5);
                setDomResult(document.getElementById('k08'), 8);
            };
            img.src = window.lastevent.Grabcut;
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
            
            const el = document.getElementById('imo');

            const color = rgbToHex(imofaQuantaArray[0].red, imofaQuantaArray[0].green, imofaQuantaArray[0].blue);
            el.value = color;
            el.disabled=false;

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
            showPalette();
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
    function run() {
        //window.colorthief = new ColorThief();
        let connectionResolved = false;
        const fncGoToNext = () => {
            const fncGoToPainting = idx => {
                window.location.href = window.location.origin + '/?paintingIdx=' + idx;
            };

            fncGoToPainting(Math.floor(Math.random() * 1257));
            return;
        };
        window.fncGoToNext = fncGoToNext;
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
            //$('#status').text('Connection failed. Loading read-only mode...');
            $('#status').text('Connection established. Loading...');
            window.lastevent = {};
            if (jQuery.isEmptyObject(window.config)) {
                fncGoToNext();
            } else {
                const idx = parseInt(window['config']['paintingIdx']);
                $.getJSON('data/json/files.json', fileList => {
                    window.lastevent.jsonFile = fileList[idx];
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
                            //grabcutImgDom.onmouseout = function () {
                            //    this.src = grabcutImgUrl;
                            //};
                            //grabcutImgDom.onmouseover = function () {
                            //    this.src = originalImageUrl;
                            //};
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
                            $('#instructionGrabcut').text('');
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
            //            if (window.config['loadoffline']) {
            fncLoadOffline();
            //            }
            //            else {
            //                ws = new WebSocket("ws://cihansari.com:8080/painting");
            //                setTimeout(() => {
            //                    if (!connectionResolved) {
            //                        delete ws;
            //                        fncLoadOffline();
            //                    }
            //                }, 1500);
            //                ws.onmessage = function (evt) {
            //                    const fail = function (err) {
            //                        if (err !== undefined) {
            //                            alert(err);
            //                        }
            //                        location.reload();
            //                    };
            //                    try {
            //                        let data = JSON.parse(evt.data);
            //                        if (data.hasOwnProperty('json') && data.hasOwnProperty('Original')) {
            //                            // painting event
            //                            window.lastevent = JSON.parse(evt.data);
            //                            processPainting(evt);
            //                        } else if (data.hasOwnProperty('paintingIdx')) {
            //                            // redirection request
            //                            window.location.href = window.location.origin + '/?paintingIdx=' + data['paintingIdx'];
            //                        } else {
            //                            fail('Unknown');
            //                        }
            //                    }
            //                    catch (err) {
            //                        fail();
            //                    }
            //
            //                };
            //                ws.onopen = fncLoadOnline;
            //                ws.onerror = fncLoadOffline;
            //                window.onclose = function () {
            //                    ws.close();
            //                };
            //            }
        }
        catch (ex) {
            fncException();
        }
    }
    if (document.readyState === "complete") {
        run();
    } else {
        $(document).ready(run);
    }
}