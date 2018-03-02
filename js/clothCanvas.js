function preprocessJson(desc) {
    if (!window.years) {
        window.years = {
            femaleList: [],
            maleList: []
        }
    }
    if (desc.origin !== undefined) {
        desc = desc.origin;
    }
    const paintingYear = Number(desc.Year);
    if (paintingYear > 0) {
        const paintingIsFemale = desc.Gender === "Female";
        if (paintingIsFemale) {
            window.years.femaleList.push(paintingYear);
        }
        else {
            window.years.maleList.push(paintingYear);
        }
    }
}

function getVote(desc) {
    if (desc.origin !== undefined) {
        desc = desc.origin;
    }
    if (desc.decision === undefined) {
        return [0, 0, 0, 0];
    } else if (desc.decision[2] !== undefined) {
        return desc.decision;
    } else if (desc.decision[""] !== undefined) {
        return desc.decision[""];
    }
}

function rgb2hsi(r, g, b) {
    //remove spaces from input RGB values, convert to int
    var r = parseInt(('' + r).replace(/\s/g, ''), 10);
    var g = parseInt(('' + g).replace(/\s/g, ''), 10);
    var b = parseInt(('' + b).replace(/\s/g, ''), 10);

    if (r == null || g == null || b == null ||
        isNaN(r) || isNaN(g) || isNaN(b)) {
        alert('Please enter numeric RGB values!');
        return;
    }
    if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
        alert('RGB values must be in the range 0 to 255.');
        return;
    }
    r = r / 255; g = g / 255; b = b / 255;
    var minRGB = Math.min(r, Math.min(g, b));
    var maxRGB = Math.max(r, Math.max(g, b));

    // Black-gray-white
    if (minRGB == maxRGB) {
        computedV = minRGB;
        return [0, 0, computedV];
    }

    // Colors other than black-gray-white:
    var i = (r + g + b) / 3;
    var h = Math.acos((0.5 * ((r - g) + (r - b))) / Math.sqrt(((r - g) * (r - g) + (r - b) * (g - b)))) * (180 / Math.PI);
    if (b / i > g / i) {
        h = 360 - h;
    }
    var s = 1 - (3 / (r + g + b)) * minRGB;
    return [h, s, i];
}

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

function checkIfHue(hue, saturation, intensity) {
    if (saturation < window.settings.thSaturation || intensity < window.settings.thIntensityDark || intensity > window.settings.thIntensityBright) {
        return false;
    }
    else if (saturation < window.settings.thSaturationHigh) {
        if ((intensity < window.settings.thIntensityDarkHigh) || (intensity > window.settings.thIntensityBrightLow)) {
            return false;
        }
    }
    return true;
}

function yearToX(year, canvas) {
    const firstYear = 1400;
    const lastYear = 2000;
    return (year - firstYear) / (lastYear - firstYear) * canvas.width;
}

const axisMapping = [
    {
        hueList: [0, 360],
        hueYList: [0, 1],
        intList: [0, 1],
        intYList: [0, 1]
    },
    {
        hueList: [0, 60, 360],
        hueYList: [0, 0.6, 0.88],
        intList: [0, 0.2, 0.8, 1],
        intYList: [0, 0.4, 0.8, 1]
    }
];

function mapPair(list1, list2, list1Value) {
    for (let k = 0; k < list1.length; k += 1) {
        if (list1[k] > list1Value) {
            if (k == 0) {
                return list2[0];
            }
            else {
                const list1Before = list1[k - 1];
                const list1After = list1[k];
                const list1Dist = list1After - list1Before;
                const list2Before = list2[k - 1];
                const list2After = list2[k];
                const list2Dist = list2After - list2Before;

                const distBefore = list1Value - list1Before;
                if (distBefore == 0) {
                    return list2[k - 1];
                }
                const ratio = distBefore / list1Dist;
                return list2Dist * ratio + list2Before;
            }
        }
    }
    return list2[list2.length - 1];
}

function yToHue(y) {
    return mapPair(axisMapping[window.settings.scaleYAxis].hueYList, axisMapping[window.settings.scaleYAxis].hueList, y);
}

function hueToY(hue, canvas) {
    while (hue > 360)
        hue -= 360;
    while (hue < 0)
        hue += 360;
    return mapPair(axisMapping[window.settings.scaleYAxis].hueList, axisMapping[window.settings.scaleYAxis].hueYList, hue) * canvas.height;
}

function yToInt(i) {
    return mapPair(axisMapping[window.settings.scaleYAxis].intYList, axisMapping[window.settings.scaleYAxis].intList, i);
}

function intToY(i, canvas) {
    return mapPair(axisMapping[window.settings.scaleYAxis].intList, axisMapping[window.settings.scaleYAxis].intYList, i) * canvas.height;
}

function rgbToHex(red, green, blue) {
    function cToHex(c) {
        const h = Math.floor(c).toString(16);
        if (h.length < 2) {
            return '0' + h;
        }
        else {
            return h;
        }
    };
    return '#' + cToHex(red) + cToHex(green) + cToHex(blue);
}

function showImage(desc, canvas, paintingIdx) {
    const [h, s, i] = desc.color;
    const [r, g, b] = hsi2rgb(h, s, i);
    const dialog = $.confirm({
        title: desc.title,
        publisher: desc.publisher,
        rights: desc.rights,
        content: `<table>
                <tr>
                <th>Painter</th> 
                <td>${desc.painter}</td> 
                </tr>
                <tr>
                <th>Publisher</th> 
                <td>${desc.publisher}</td>
                </tr>
                <tr>
                <th>Rights</th> 
                <td><a href="${desc.rights}">Creative Commons</a></td>
                </tr>
                <tr>
                <th>Color</th> 
                <td><form>HSI=(${h.toFixed(2)},${s.toFixed(2)},${i.toFixed(2)})<input type="color" style="width:50px; height:2em;" value="${rgbToHex(r, g, b)}"></form></td>
                </tr>
                </table>
                <image src='${desc.imageUrl}'></image>`,
        backgroundDismiss: true,
        escapeKey: 'cancel',
        buttons: {
            cancel: {
                text: 'Cancel'
            },
            goRandom: {
                text: 'Details in new window',
                btnClass: 'btn-primary',
                keys: ['enter'],
                action: () => {
                    window.open(`${window.location.origin}/voting.html?paintingIdx=${String(paintingIdx)}`);
                }
            },
        }
    });
}

function drawPainting(json, paintingIdx, domColor, callback) {
    function fncParseImofa(imofaStr) {
        if (imofaStr == null || imofaStr.length === 0) {
            let imofaQuantaArray = [];
            return imofaQuantaArray;
        }
        let imofaQuantaStrArray = imofaStr.slice(1, imofaStr.length - 1).split(';');
        const fncParseImofaQuanta = imofaQuantaStr => {
            const imofaQuantaStrPieces = imofaQuantaStr.split(' ');
            let imofaQuanta = {};
            imofaQuanta.perc = Math.min(Math.max(parseFloat(imofaQuantaStrPieces[0]), 0), 255);
            imofaQuanta.red = Math.min(Math.max(parseFloat(imofaQuantaStrPieces[1]), 0), 255);
            imofaQuanta.green = Math.min(Math.max(parseFloat(imofaQuantaStrPieces[2]), 0), 255);
            imofaQuanta.blue = Math.min(Math.max(parseFloat(imofaQuantaStrPieces[3]), 0), 255);
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
    function getData(jsonDescription, domColor) {
        let desc = jsonDescription;
        if (Object.prototype.hasOwnProperty.call(jsonDescription, 'origin')) {
            desc = jsonDescription.origin;
        }
        let color = null;
        if (domColor == null) {
            const imofaQuantaArray = fncParseImofa(desc.imofa);
            color = rgb2hsi(imofaQuantaArray[0].red, imofaQuantaArray[0].green, imofaQuantaArray[0].blue)
        }
        else {
            color = domColor;
        }
        return {
            color: color,
            year: desc.Year,
            gender: desc.Gender,
            title: desc.title,
            painter: desc.Painter,
            publisher: desc.publisher,
            rights: desc.rights,
            imageUrl: 'data/jpg/' + desc.Filename,
            drawUrl: 'data/jpg/' + desc.Filename
        }
    }

    function drawData(desc, paintingIdx, callback) {
        let canvasGender = null;
        let canvasGenderColor = null;
        if (desc.gender === "Male")
            canvasGender = window.clothing.canvas.male;
        else {
            canvasGender = window.clothing.canvas.female;
        }
        let hueCanvas = true;
        let [hue, saturation, intensity] = desc.color;
        let y = null;
        if (checkIfHue(hue, saturation, intensity)) {
            canvasGenderColor = canvasGender.color
            y = hueToY(hue, canvasGenderColor);
        }
        else {
            canvasGenderColor = canvasGender.mono
            y = intToY(intensity, canvasGenderColor);
            hueCanvas = false;
        }
        const x = yearToX(Number(desc.year), canvasGenderColor);

        function displayProperties() {
            const defaultProperties = {
                stroke: 'black',
                strokeWidth: 1,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            }
            function hueToColor(hue) {
                [red, green, blue] = hsi2rgb(hue, 0.5, 0.5);
                return `rgb(${red},${green},${blue})`
            }

            function hsiToColor(hue, saturation, intensity) {
                [red, green, blue] = hsi2rgb(hue, saturation, intensity);
                return `rgb(${red},${green},${blue})`
            }
            function properties(widthheight, options) {
                if (options == null) {
                    options = {};
                }
                options.left = x - widthheight / 2;
                options.top = y - widthheight / 2 + canvasGenderColor.yStart;
                options.width = widthheight;
                options.height = widthheight;
                return $.extend({}, defaultProperties, options);
            };
            if (window.settings.graphMethod == 'hue') {
                return properties(16, { fill: hueCanvas ? hueToColor(hue) : `rgb(${Math.round(intensity * 255)},${Math.round(intensity * 255)},${Math.round(intensity * 255)})` });
            }
            else if (window.settings.graphMethod == 'color') {
                return properties(16, { fill: hsiToColor(hue, saturation, intensity) });
            }
            else if (window.settings.graphMethod == 'portrait') {
                return properties(30);
            }
        }

        function addFabric(fabricObj, paintingIdx) {
            fabricObj.on('selected', () => {
                canvasGenderColor.deactivateAll().renderAll();
                showImage(desc, canvasGenderColor, paintingIdx);
            });
            canvasGenderColor.add(fabricObj);
        }

        if (window.settings.graphMethod == 'portrait') {
            fabric.Image.fromURL(desc.drawUrl, imgLoaded => {
                addFabric(imgLoaded.set(displayProperties()), paintingIdx);
                callback();
            })
        }
        else {
            addFabric(new fabric.Rect(displayProperties()), paintingIdx);
            callback();
        }
    }
    drawData(getData(json, domColor), paintingIdx, callback);
}


async function drawPaintingAsync(jsonPromise, paintingIdx, domColor) {
    async function getData() {
        const desc = await jsonPromise;
        return {
            color: domColor,
            year: desc.Year,
            gender: desc.Gender,
            title: desc.title,
            painter: desc.Painter,
            imageUrl: 'data/jpg/' + desc.Filename,
            drawUrl: 'data/jpg/' + desc.Filename
        }
    }

    async function drawData(descPromise) {
        let canvasGender = null;
        let canvasGenderColor = null;
        const desc = await getData();
        if (desc.gender === "Male")
            canvasGender = window.clothing.canvas.male;
        else {
            canvasGender = window.clothing.canvas.female;
        }
        let hueCanvas = true;
        let [hue, saturation, intensity] = desc.color;
        let y = null;
        if (checkIfHue(hue, saturation, intensity)) {
            canvasGenderColor = canvasGender.color
            y = hueToY(hue, canvasGenderColor);
        }
        else {
            canvasGenderColor = canvasGender.mono
            y = intToY(intensity, canvasGenderColor);
            hueCanvas = false;
        }
        const x = yearToX(Number(desc.year), canvasGenderColor);

        function displayProperties() {
            const defaultProperties = {
                stroke: 'black',
                strokeWidth: 1,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            }
            function hueToColor(hue) {
                [red, green, blue] = hsi2rgb(hue, 0.5, 0.5);
                return `rgb(${red},${green},${blue})`
            }

            function hsiToColor(hue, saturation, intensity) {
                [red, green, blue] = hsi2rgb(hue, saturation, intensity);
                return `rgb(${red},${green},${blue})`
            }
            function properties(widthheight, options) {
                if (options == null) {
                    options = {};
                }
                options.left = x - widthheight / 2;
                options.top = y - widthheight / 2 + canvasGenderColor.yStart;
                options.width = widthheight;
                options.height = widthheight;
                return $.extend({}, defaultProperties, options);
            };
            if (window.settings.graphMethod == 'hue') {
                return properties(16, { fill: hueCanvas ? hueToColor(hue) : `rgb(${Math.round(intensity * 255)},${Math.round(intensity * 255)},${Math.round(intensity * 255)})` });
            }
            else if (window.settings.graphMethod == 'color') {
                return properties(16, { fill: hsiToColor(hue, saturation, intensity) });
            }
            else if (window.settings.graphMethod == 'portrait') {
                return properties(30);
            }
        }

        function addFabric(fabricObj, paintingIdx) {
            fabricObj.on('selected', () => {
                canvasGenderColor.deactivateAll().renderAll();
                showImage(desc, canvasGenderColor, paintingIdx);
            });
            canvasGenderColor.add(fabricObj);
        }

        if (window.settings.graphMethod == 'portrait') {
            const imgLoaded = await fabric.Image.fromURL(desc.drawUrl);
            addFabric(imgLoaded.set(displayProperties()), paintingIdx);
        }
        else {
            addFabric(new fabric.Rect(displayProperties()), paintingIdx);
        }
    }
    drawData();
}

function filterFiles(desc) {
    const decision = getVote(desc);
    preprocessJson(desc);
    const upvote = decision[0] + decision[1];
    const downvote = decision[2];
    if (upvote < window.settings.minUpvote) {
        return false;
    }
    else if (window.settings.maxDownvote !== -1 && window.settings.maxDownvote < downvote) {
        return false;
    }
    return true;
}

function addYearMarkers(canvas) {
    const items = [];
    for (let year = 1425; year < 2000; year += 25) {
        if (year < 1450 || year > 1950) {
            //thisIsFirstLineToSkipForGenderIconsToDisplayProperly and cosmetic reasons;
            continue;
        }
        const left = yearToX(year, canvas);

        const rect = new fabric.Rect({
            top: canvas.yStart,
            left: left,
            width: 1,
            height: canvas.height - 3,
            fill: "rgba(127,127,127,0.4)"
        });

        rect.on('selected', () => {
            canvas.deactivateAll();
        });

        items.push(rect)
    }
    canvas.add(...items);
}
function addYearTextToCanvas(canvas) {
    const yearTextHeight = 25;
    const items = [];
    for (let year = 1425; year < 2000; year += 25) {
        if (year < 1450 || year > 1950) {
            //thisIsFirstLineToSkipForGenderIconsToDisplayProperly and cosmetic reasons;
            continue;
        }
        const left = yearToX(year, canvas);
        const text = new fabric.Text(String(year), {
            top: canvas.height - 20,
            left: left - 14,
            fontSize: 13,
            fill: "black"
        });

        text.on('selected', () => {
            canvas.deactivateAll();
        });

        items.push(text);
    }
    canvas.add(...items);
    canvas.height -= (yearTextHeight * 2);
}
function addGenderIconToCanvas(canvas, genderImageUrl) {
    fabric.Image.fromURL(genderImageUrl, imgLoaded => {
        const imFabricObj = imgLoaded.set({
            left: 0,
            top: canvas.height / 4 + canvas.yStart,
            width: canvas.height / 2,
            height: canvas.height / 2,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true
        })

        imFabricObj.on('selected', () => {
            canvas.deactivateAll();
        });

        canvas.add(imFabricObj)
    })
}
function addHSIBackgroundToCanvas(canvas) {
    const items = [];
    function hueToColor(hue) {
        [red, green, blue] = hsi2rgb(hue, 0.5, 0.5);
        return `rgb(${red},${green},${blue})`
    }

    const height = 10;
    for (let i = 0; i < canvas.height - height; i += height) {
        const hue = yToHue(i / canvas.height);

        const rect = new fabric.Rect({
            top: i + canvas.yStart,
            left: 90,
            width: 10,
            height: height + 1,
            fill: hueToColor(hue),
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true
        });

        rect.on('selected', () => {
            canvas.deactivateAll();
        });

        items.push(rect)
    }
    canvas.add(...items);

}
function addMonochromeBackgroundToCanvas(canvas) {
    const items = [];
    const height = 10;
    for (let i = 0; i < canvas.height - height; i += height) {
        const monoLight = Math.round(yToInt(i / canvas.height)*255);
        console.log(`(iPerc,int):(${i / canvas.height}/${monoLight})`);

        const rect = new fabric.Rect({
            top: i + canvas.yStart,
            left: 90,
            width: 10,
            height: height + 1,
            fill: `rgb(${monoLight},${monoLight},${monoLight})`,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true
        });

        rect.on('selected', () => {
            canvas.deactivateAll();
        });


        items.push(rect)
    }
    canvas.add(...items);
}


function applyParametersFromConfig(config) {
    $.each(window.clothing.defaultSettings, settingsKey => {
        if (window.settings == null) {
            window.settings = {};
        }
        if (config[settingsKey] != null) {
            if (isNaN(window.clothing.defaultSettings[settingsKey])) {
                window.settings[settingsKey] = config[settingsKey];
            }
            else {
                window.settings[settingsKey] = Number(config[settingsKey]);
            }
        }
        else {
            window.settings[settingsKey] = window.clothing.defaultSettings[settingsKey];
        }
    });
}


function getDominantColorFromH1H2SI(domColor) {
    hueDegree = Math.atan2(domColor[0], domColor[1]) / Math.PI * 180;
    while (hueDegree < 0)
        hueDegree += 360;
    while (hueDegree > 360)
        hueDegree -= 360;
    return [hueDegree, domColor[2], domColor[3]];
};


class PaintingCanvas {
    constructor(id) {
        this.canvas = new fabric.Canvas(id);
        this.yStart = 20;
        this.height = this.canvas.height;
        this.width = this.canvas.width;
    }
    add(...ev) {
        this.canvas.add(...ev);
    }
    deactivateAll() {
        return this.canvas.deactivateAll();
    }
}

function changeUrl(url) {
    if (window.clothing.drawOnce) {
        window.location = url;
    }
    else {
        window.clothing.drawOnce = true;
    }
    if (typeof (history.pushState) != "undefined") {
        var obj = { Title: window.title, Url: url };
        history.pushState(obj, obj.Title, obj.Url);
    } else {
        if (window.location.href != url) {
            window.location = url;
        }
        else {
            console.log('Already in destionation address.');
        }
    }
}

function settingsToUrl(settings) {
    let url = `${window.location.origin}${window.location.pathname}?`
    $.each(settings, key => {
        url = url.concat(`${key}=${window.settings[key]}&`);
    })
    return url.slice(0, -1);
}


function prepareDisplay() {
    addYearTextToCanvas(window.clothing.canvas.male.mono);
    addYearTextToCanvas(window.clothing.canvas.female.mono);
    addHSIBackgroundToCanvas(window.clothing.canvas.male.color);
    addHSIBackgroundToCanvas(window.clothing.canvas.female.color);
    addMonochromeBackgroundToCanvas(window.clothing.canvas.male.mono);
    addMonochromeBackgroundToCanvas(window.clothing.canvas.female.mono);
    addGenderIconToCanvas(window.clothing.canvas.male.color, 'resources/icons/maleDark.png')
    addGenderIconToCanvas(window.clothing.canvas.female.color, 'resources/icons/femaleDark.png')
    addYearMarkers(window.clothing.canvas.male.color);
    addYearMarkers(window.clothing.canvas.male.mono);
    addYearMarkers(window.clothing.canvas.female.color);
    addYearMarkers(window.clothing.canvas.female.mono);
}


function displayByIdx(filepath, idx, domColor, callback) {
    $.getJSON(filepath).then(json => {
        if (filterFiles(json))
            drawPainting(json, idx, domColor, callback);
    }).catch(err => {
        console.error('Error on painting', filepath, err);
        callback();
    });
}

function parseParameters() {
    applyParametersFromConfig(window.config);

    $('#editEditor').click(() => {
        const fncContent = () => {
            let content = '<form>'
            const fncAddNumericField = (key) => {
                content = content.concat(`<br>${key}:<br><input type="number" class="${key}" value="${window.settings[key]}" step="0.05">`);
            }
            const fncAddTextField = (key) => {
                content = content.concat(`<br>${key}:<br><input type="text" class="${key}" value="${window.settings[key]}">`);
            }
            $.each(window.settings, settingsKey => {
                if (isNaN(window.settings[settingsKey])) {
                    fncAddTextField(settingsKey);
                }
                else {
                    fncAddNumericField(settingsKey);
                }
            });
            content = content.concat('</form>');
            return content;
        };
        const dialog = $.confirm({
            title: `Advanced settings`,
            content: fncContent(),
            escapeKey: 'cancel',
            backgroundDismiss: true,
            buttons: {
                cancel: {
                    text: 'Cancel'
                },
                go: {
                    text: 'Apply changes',
                    btnClass: 'btn-primary',
                    keys: ['enter'],
                    action: function () {
                        $.each(window.settings, key => {
                            window.settings[key] = this.$content.find(`.${key}`).val();
                        });
                        window.clothing.drawResults();
                    }
                },
            }
        });
    });
};

function getImofaWithHighestWeight(imofaColors) {
    let domImofaColor = [0, 0, 0, 0];
    let domImofaWeight = 0;
    for (let c = 0; c < imofaColors.length; ++c) {
        const currentImofaColor = imofaColors[c];
        if (currentImofaColor[0] > domImofaWeight) {
            [domImofaWeight, domImofaColor[0], domImofaColor[1], domImofaColor[2], domImofaColor[3]] = currentImofaColor;
        }
    }
    return domImofaColor;
}

function getImofaWithThreshold(imofaColors, areaThreshold) {
    let domImofaColors = [];
    for (let c = 0; c < imofaColors.length; ++c) {
        const currentImofaColor = imofaColors[c];
        if (currentImofaColor[0] > areaThreshold) {
            currentImofaColor.splice(0,1);
            domImofaColors.push(currentImofaColor);
        }
    }
    return domImofaColors;
}

function updateCluster(c1, c2) {
    // c1 and c2 has first element weight, rest of the values will be scaled off the weights...
    const cOut = [c1[0] + c2[0]];

    const fncUpdateValueWithWeight = (x1, w1, x2, w2) => (x1 * w1 + x2 * w2) / (w1 + w2);

    for (let i = 1; i < c1.length; i += 1) {
        cOut[i] = fncUpdateValueWithWeight(c1[i], c1[0], c2[i], c2[0]);
    }
    return cOut;
}