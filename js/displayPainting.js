let bufferCanvas, bufferCtx;
async function prepareBuffer() {
    if (bufferCanvas == null) {
        const bufferCanvasJQ = $(`<canvas style="display:none" id="bufferCanvas"/>`)
        bufferCanvasJQ.appendTo("body");
        bufferCanvas = bufferCanvasJQ[0];
        bufferCtx = bufferCanvas.getContext("2d");
    }
}

async function getImage(imagePath) {
    return await new Promise((resolve, reject) => {
        const paintingData = new Image();

        paintingData.onload = async () => {
            resolve(paintingData);
        };
        paintingData.src = imagePath;
    });
}

async function getGrabcutImage(paintingData, grabcut, maskValue = 3) {
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
    const yamlStruct = fncParseCVYAML(grabcut);
    // load image from data url
    await prepareBuffer();
    bufferCanvas.width = paintingData.width;
    bufferCanvas.height = paintingData.height;
    bufferCtx.drawImage(paintingData, 0, 0);

    if (yamlStruct) {
        for (let i = 0; i < yamlStruct['rows']; ++i) {
            for (let j = 0; j < yamlStruct['cols']; ++j) {
                const maskVal = yamlStruct['data'][i * yamlStruct['cols'] + j];
                if (maskVal !== maskValue) {
                    bufferCtx.clearRect(j, i, 1, 1);
                }
            }
        }
    }
    bufferCtx.stroke();
    return bufferCanvas.toDataURL();
};
function hsi2rgb(resultHue, resultSaturation, resultIntensity) {
    while (resultHue > 360)
        resultHue -= 360;
    while (resultHue < 0)
        resultHue += 360;
    resultIntensity = resultIntensity * 255;
    const cos = (degree) => Math.cos(degree * (Math.PI / 180));
    let backR = 0;
    let backG = 0;
    let backB = 0;
    if (resultHue == 0) {
        backR = Math.floor((resultIntensity + (2 * resultIntensity * resultSaturation)));
        backG = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
        backB = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
    }
    else if ((0 < resultHue) && (resultHue < 120)) {
        backR = Math.floor((resultIntensity + (resultIntensity * resultSaturation) * cos(resultHue) / cos(60 - resultHue)));
        backG = Math.floor((resultIntensity + (resultIntensity * resultSaturation) * (1 - cos(resultHue) / cos(60 - resultHue))));
        backB = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
    }

    else if (resultHue == 120) {
        backR = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
        backG = Math.floor((resultIntensity + (2 * resultIntensity * resultSaturation)));
        backB = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
    }

    else if ((120 < resultHue) && (resultHue < 240)) {
        backR = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
        backG = Math.floor((resultIntensity + (resultIntensity * resultSaturation) * cos(resultHue - 120) / cos(180 - resultHue)));
        backB = Math.floor((resultIntensity + (resultIntensity * resultSaturation) * (1 - cos(resultHue - 120) / cos(180 - resultHue))));
    }

    else if (resultHue == 240) {
        backR = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
        backG = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
        backB = Math.floor((resultIntensity + (2 * resultIntensity * resultSaturation)));
    }

    else if ((240 < resultHue) && (resultHue < 360)) {
        backR = Math.floor((resultIntensity + (resultIntensity * resultSaturation) * (1 - cos(resultHue - 240) / cos(300 - resultHue))));
        backG = Math.floor((resultIntensity - (resultIntensity * resultSaturation)));
        backB = Math.floor((resultIntensity + (resultIntensity * resultSaturation) * cos(resultHue - 240) / cos(300 - resultHue)));
    }
    return [backR, backG, backB];
}
function parseImofa(imofaJson) {
    function imofaWHSIArray2WRGBArray(WHSIArray) {
        const wrgbArray = [];
        WHSIArray.forEach(whsi => {
            wrgbArray.push([whsi[0], ...hsi2rgb(whsi[1], whsi[2], whsi[3])]);
        })
        return wrgbArray;
    }
    const color1 = imofaJson[0];
    if ($.isArray(color1)) {
        // there are multiple colors
        return imofaWHSIArray2WRGBArray(imofaJson);
    }
    else {
        return imofaWHSIArray2WRGBArray([imofaJson]);
    }
}

async function displayPainting(paintingConfig) {
    const basepath = 'data/json/';
    try {
        const promises = {
            json2: paintingConfig.json2 ? $.getJSON(basepath + paintingConfig.json2) : null,
            grabcut2: paintingConfig.grabcut2 ? $.getJSON(basepath + paintingConfig.grabcut2) : null,
            grabcut: paintingConfig.grabcut ? $.getJSON(basepath + paintingConfig.grabcut) : null,
            imofaColor: paintingConfig.imofaColor ? $.getJSON(basepath + paintingConfig.imofaColor) : null,
            imofa2Color: paintingConfig.imofa2Color ? $.getJSON(basepath + paintingConfig.imofa2Color) : null
        }
        const json2 = await promises.json2;
        const imagePath = `data/jpg/${json2.Filename}`;

        const image = await getImage(imagePath);
        const imofaWRGB = promises.imofaColor ? parseImofa(await promises.imofaColor) : null;
        const imofa2WRGB = promises.imofa2Color ? parseImofa(await promises.imofa2Color) : null;

        const grabcutJson = promises.grabcut ? (await promises.grabcut).GrabCutData : null;
        const grabcutSrc = promises.grabcut ? await getGrabcutImage(image, grabcutJson, 3) : `https://placeholdit.imgix.net/~text?txtsize=56&txt=Not%20Available&w=${image.width}&h=${image.height}&txttrack=0`;

        const grabcut2Json = promises.grabcut2 ? (await promises.grabcut2).GrabCutDataV2 : null;
        const grabcut2Src = promises.grabcut2 ? await getGrabcutImage(image, grabcut2Json, 1) : `https://placeholdit.imgix.net/~text?txtsize=56&txt=Not%20Available&w=${image.width}&h=${image.height}&txttrack=0`;


        function toHex(d) {
            return ("0" + (Number(d).toString(16))).slice(-2).toUpperCase()
        }

        function imofaToJQ(imofaJson) {
            if (imofaJson == null) {
                return `<h4>No color extracted</h4>`;
            }
            else {
                let imofaHTML = '<table>';
                imofaJson.sort((a, b) => {
                    return a[0] < b[0];
                }).forEach(wrgb => {
                    imofaHTML += `<tr><td>${(wrgb[0] * 100).toFixed(2)}%</td><td><input type="color" value="#${toHex(wrgb[1])}${toHex(wrgb[2])}${toHex(wrgb[3])}"></input></td>`;
                });
                return imofaHTML + '</table>';
            }
        }

        const jDispContent = $(`<div class="tabcontent"><h2>${json2.title}</h2><canvas id="myCanvas" width="1200" height="1200" style="display:none"/>
    <table style="margin-left:auto; margin-right:auto;border-spacing: 10px; border-collapse: separate;">
        <tr style="margin:1em">
            <td colspan="2" style="width:24%";background-color:rgba(0,0,0,0.4);><h4>Original Painting</h4></td>
            <td colspan="2" style="width:24%";background-color:rgba(0,0,0,0.4);><h4>Legacy Grabcut Segmentation</h4></td>
            <td colspan="2" style="width:24%";background-color:rgba(0,0,0,0.4);><h4>Fine-tuned Grabcut Segmentation</h4></td>
        </tr>
        <tr>
            <td colspan="2" style="width:24%"><img style="padding=2em" id="original" src="data/jpg/${json2.Filename}"></img></td>
            <td colspan="2" style="width:24%"><img style="padding=2em" id="grabcut" src="${grabcutSrc}"></img></td>
            <td colspan="2" style="width:24%"><img style="padding=2em" id="grabcut2" src="${grabcut2Src}"></img></td>
        </tr>
        <tr>
            <td colspan="2" style="width:24%">No color extracted</td>
            <td colspan="2" style="width:24%">${imofaToJQ(imofaWRGB)}</td>
            <td colspan="2" style="width:24%">${imofaToJQ(imofa2WRGB)}</td>
        </tr>
        </table>
        <table style="margin-left:auto; margin-right:auto;border-spacing: 10px; border-collapse: separate;">
        <tr>
            <td>Artist</td>
            <td>${json2.Painter}</td>
        </tr>
        <tr>
            <td>Year</td>
            <td>${json2.Year}</td>
        </tr>
        <tr>
            <td>Perceived sex</td>
            <td>${json2.Gender}</td>
        </tr>
    </table></div>`);
        return jDispContent;
    }
    catch (ex) {
        alert('Something went wrong. Please report the incident to cihan.sari@boun.edu.tr if issue persists. Check console for details (F12 is the default key to open console.).');
        console.error(ex);
        return $(`<div/>`)
    }
}