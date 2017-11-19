const showPaintingsOnCanvas = () => {
    const fncParseImofa = imofaStr => {
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

    const canvas = new fabric.Canvas('c');

    function makeCanvasBackground() {

        const items = [];
        function hueToColor(hue) {
            [red, green, blue] = hslToRgb(hue / 360, 0.5, 0.5);
            return `rgb(${red},${green},${blue})`
        }

        for (let hue = 0; hue <= 360; hue += 10) {
            items.push(new fabric.Rect({
                top: hue,
                left: 0,
                width: canvas.width,
                height: 11,
                fill: hueToColor(hue),
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            }))
            items.push(new fabric.Rect({
                top: hue + 400,
                left: 0,
                width: canvas.width,
                height: 11,
                fill: hueToColor(hue),
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            }))
        }

        fabric.Image.fromURL("resources/icons/male.png", imgLoaded => {
            const imFabricObj = imgLoaded.set({
                left: 0,
                top: 550,
                width: 50,
                height: 200,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            })
            canvas.add(imFabricObj)
        })
        fabric.Image.fromURL("resources/icons/female.png", imgLoaded => {
            const imFabricObj = imgLoaded.set({
                left: 0,
                top: 100,
                width: 50,
                height: 200,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            })
            canvas.add(imFabricObj)
        })


        for (let year = 1425; year < 2000; year += 25) {
            const left = yearToX(year);
            items.push(new fabric.Text(String(year), {
                top: canvas.height - 100,
                left: left + 7,
                fontSize: 10,
                fill: 'white',
                angle: 90
            }));
            items.push(new fabric.Rect({
                top: 0,
                left: left,
                width: 1,
                height: canvas.height - 105,
                fill: "white"
            }))
        }

        
        canvas.add(...items);
    }

    makeCanvasBackground();

    function yearToX(year) {
        const firstYear = 1400;
        const lastYear = 2000;
        return (year - firstYear) / (lastYear - firstYear) * canvas.width;
    }

    function showImage(imageUrl) {
        $.confirm({
            title: 'Prompt!',
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Enter something here</label>' +
            '<input type="text" placeholder="Your name" class="name form-control" required />' +
            '<image src=' + imageUrl + '/>' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Submit',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if (!name) {
                            $.alert('provide a valid name');
                            return false;
                        }
                        $.alert('Your name is ' + name);
                    }
                },
                cancel: function () {
                    //close
                },
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    }

    function drawData(desc) {
        const x = yearToX(Number(desc.year));
        const yImofa = 100;
        const yImage = 300;
        const width = 30;
        const height = 30;
        if (desc.color != null && desc.color.length != null && desc.color.length > 0) {
            const imofaQuantaArray = desc.color;

            let [hue] = rgb2hsv(imofaQuantaArray[0].red, imofaQuantaArray[0].green, imofaQuantaArray[0].blue)
            const items = [];
            //for (let i = 0; i < imofaQuantaArray.length; ++i) {
            //    const cur = imofaQuantaArray[i];
            //    const curLeft = width * cur.perc;
            //    items.push(new fabric.Rect({
            //        top: hue,
            //        left: x,
            //        width: width * cur.perc,
            //        height: height,
            //        fill: "rgb(" + Math.floor(cur.red) + "," + Math.floor(cur.green) + "," + Math.floor(cur.blue) + ")"
            //    }))
            //}
            canvas.add(...items);

            if (desc.imageUrl != null) {
                if (desc.gender === "Male")
                    hue += 400;
                fabric.Image.fromURL(desc.imageUrl, imgLoaded => {
                    const imFabricObj = imgLoaded.set({
                        left: x,
                        top: hue,
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
                        showImage(desc.imageUrl);
                    })
                    canvas.add(imFabricObj)
                })
            }


        }
    }

    // get paintings
    function getFileIndices() {
        const fileIndices = [];
        for (let i = 0; i < 20; ++i) {
            fileIndices.push(Math.floor(Math.random() * 1257));
        }
        return fileIndices;
    }

    function getFiles() {
        clothFiles(files => {
            const promises = []
            getFileIndices().forEach(idx => {
                promises.push($.getJSON('data/json/' + files[idx]))
            })
            Promise.all(promises).then(v => v.forEach(k => drawData(getData(k)))).catch(er => console.error(er));
        })
    }
    function run() {
        getFiles();
    }
    $(run);
};