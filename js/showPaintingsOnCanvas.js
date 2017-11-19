const showPaintingsOnCanvas = () => {

    function rgb2hsv(r, g, b) {
        var computedH = 0;
        var computedS = 0;
        var computedV = 0;

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
        var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
        var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
        computedH = 60 * (h - d / (maxRGB - minRGB));
        computedS = (maxRGB - minRGB) / maxRGB;
        computedV = maxRGB;
        return [computedH, computedS, computedV];
    }

    function hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function yearToX(year, canvas) {
        const firstYear = 1400;
        const lastYear = 2000;
        return (year - firstYear) / (lastYear - firstYear) * canvas.width;
    }

    function showImage(imageUrl, canvas) {
        const dialog = $.confirm({
            title: 'Image',
            content: '<image src=' + imageUrl + '/>',
            escapeKey: 'cancel',
            buttons: {
                cancel: {
                    text: 'Cancel',
                    action: () => { canvas.deactivateAll().renderAll(); }
                }
            }
        });
    }

    function drawPainting(json, canvas) {

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
        function getData(jsonDescription) {
            let desc = jsonDescription;
            if (Object.prototype.hasOwnProperty.call(jsonDescription, 'origin')) {
                desc = jsonDescription.origin;
            }
            return {
                color: fncParseImofa(desc.imofa),
                year: desc.Year,
                gender: desc.Gender,
                imageUrl: 'data/jpg/' + desc.Filename
            }
        }
        function drawData(desc, canvas) {
            let canvasGender = null;
            let canvasGenderColor = null;
            if (desc.gender === "Male")
                canvasGender = canvas.male;
            else {
                canvasGender = canvas.female;
            }
            if (desc.color != null && desc.color.length != null && desc.color.length > 0) {
                const imofaQuantaArray = desc.color;

                let [hue, saturation, value] = rgb2hsv(imofaQuantaArray[0].red, imofaQuantaArray[0].green, imofaQuantaArray[0].blue)
                let y = null;
                if (saturation < 0.05) {
                    canvasGenderColor = canvasGender.mono
                    y = value;
                }
                else {
                    canvasGenderColor = canvasGender.hsv
                    y = hue / 360;
                }
                const x = yearToX(Number(desc.year), canvasGenderColor);

                if (desc.imageUrl != null) {

                    fabric.Image.fromURL(desc.imageUrl, imgLoaded => {
                        const imFabricObj = imgLoaded.set({
                            left: x - 15,
                            top: y * canvasGenderColor.height - 15 + canvasGenderColor.yStart,
                            width: 30,
                            height: 30,
                            lockMovementX: true,
                            lockMovementY: true,
                            lockScalingX: true,
                            lockScalingY: true,
                            lockUniScaling: true,
                            lockRotation: true
                        });
                        imFabricObj.on('selected', function (options) {
                            showImage(desc.imageUrl, canvasGenderColor);
                        })
                        canvasGenderColor.add(imFabricObj);
                    })
                }


            }
        }
        drawData(getData(json), canvas);
    }

    // get paintings
    function run() {
        const filterFiles = (desc) => {
            return true;
        }

        function addYearMarkers(canvas) {
            const items = [];
            for (let year = 1425; year < 2000; year += 25) {
                const left = yearToX(year, canvas);
                items.push(new fabric.Rect({
                    top: canvas.yStart,
                    left: left,
                    width: 1,
                    height: canvas.height + 3,
                    fill: "white"
                }))
            }
            canvas.add(...items);
        }

        function addYearTextToCanvas(canvas) {
            const yearTextHeight = 75;
            const items = [];
            for (let year = 1425; year < 2000; year += 25) {
                const left = yearToX(year, canvas);
                items.push(new fabric.Text(String(year), {
                    top: canvas.height - yearTextHeight,
                    left: left + 7,
                    fontSize: 10,
                    fill: 'white',
                    angle: 90
                }));
            }
            canvas.add(...items);
            canvas.height -= yearTextHeight;
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
                canvas.add(imFabricObj)
            })
        }
        function addHSVBackgroundToCanvas(canvas) {
            const items = [];
            function hueToColor(hue) {
                [red, green, blue] = hslToRgb(hue / 360, 0.5, 0.5);
                return `rgb(${red},${green},${blue})`
            }

            const height = 10;
            for (let i = 0; i < canvas.height; i += height) {
                const hue = Math.floor(i / canvas.height * 360);
                items.push(new fabric.Rect({
                    top: i + canvas.yStart,
                    left: 0,
                    width: canvas.width,
                    height: height + 1,
                    fill: hueToColor(hue),
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockUniScaling: true,
                    lockRotation: true
                }))
            }
            canvas.add(...items);

        }
        function addMonochromeBackgroundToCanvas(canvas) {
            const items = [];
            const height = 10;
            for (let i = 0; i < canvas.height; i += height) {
                const monoLight = Math.floor(i / canvas.height * 256);
                items.push(new fabric.Rect({
                    top: i + canvas.yStart,
                    left: 0,
                    width: canvas.width,
                    height: height + 1,
                    fill: `rgb(${monoLight},${monoLight},${monoLight})`,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockUniScaling: true,
                    lockRotation: true
                }))
            }
            canvas.add(...items);

        }

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

        const canvas = {
            male: {
                hsv: new PaintingCanvas('maleCanvasHSV'),
                mono: new PaintingCanvas('maleCanvasMonochrome')
            },
            female: {
                hsv: new PaintingCanvas('femaleCanvasHSV'),
                mono: new PaintingCanvas('femaleCanvasMonochrome')
            }
        }
        addYearTextToCanvas(canvas.male.mono);
        addYearTextToCanvas(canvas.female.mono);
        addHSVBackgroundToCanvas(canvas.male.hsv);
        addHSVBackgroundToCanvas(canvas.female.hsv);
        addMonochromeBackgroundToCanvas(canvas.male.mono);
        addMonochromeBackgroundToCanvas(canvas.female.mono);
        addGenderIconToCanvas(canvas.male.hsv, 'resources/icons/male.png')
        addGenderIconToCanvas(canvas.female.hsv, 'resources/icons/female.png')
        addYearMarkers(canvas.male.hsv);
        addYearMarkers(canvas.male.mono);
        addYearMarkers(canvas.female.hsv);
        addYearMarkers(canvas.female.mono);


        //
        clothFiles(files => {
            Array.from(new Array(100), (val, index) => index).forEach(idx => {
                const filepath = 'data/json/' + files[idx];
                $.getJSON(filepath).then(json => {
                    if (filterFiles(json))
                        drawPainting(json, canvas);
                }).catch(err => {
                    console.error('Error on painting', filepath, err);
                });
            });
        })
    }
    $(run);
};