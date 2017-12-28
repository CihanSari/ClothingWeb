const showPaintingsOnCanvas = () => {

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
    console.log([h, s, i]);
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
    if (saturation < window.thSaturation || intensity < window.thIntensityDark || intensity > window.thIntensityBright) {
      return false;
    }
    else if (saturation < window.thSaturationHigh) {
      if ((intensity < window.thIntensityDarkHigh) || (intensity > window.thIntensityBrightLow)) {
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

  function showImage(imageUrl, canvas, paintingIdx, h, s, i) {
    const [r, g, b] = hsi2rgb(h, s, i);
    const dialog = $.confirm({
      title: `Painting Index ${paintingIdx}`,
      content: '<image src=' + imageUrl + `/><form>Hue=${h.toFixed(2)}, Saturation=${s.toFixed(2)}, Intensity=${i.toFixed(2)}<br> <input type="color" style="width:50px; height:50px;" value="${rgbToHex(r, g, b)}"></form>`,
      backgroundDismiss: true,
      escapeKey: 'cancel',
      buttons: {
        cancel: {
          text: 'Cancel',
          action: () => {
            canvas.deactivateAll().renderAll();
          }
        },
        goRandom: {
          text: 'Details in new window',
          btnClass: 'btn-primary',
          keys: ['enter'],
          action: () => {
            canvas.deactivateAll().renderAll();
            window.open(`${window.location.origin}/?paintingIdx=${String(paintingIdx)}`);
          }
        },
      }
    });
  }

  function drawPainting(json, canvas, paintingIdx, domColor) {
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
      if (window.displayPaintings === 1) {
        return {
          color: color,
          year: desc.Year,
          gender: desc.Gender,
          imageUrl: 'data/jpg/' + desc.Filename,
          drawUrl: 'data/jpg/' + desc.Filename
        }
      }
      else {
        return {
          color: color,
          year: desc.Year,
          gender: desc.Gender,
          imageUrl: 'data/jpg/' + desc.Filename,
          drawUrl: 'resources/icons/dot.png'
        }
      }
    }

    function drawData(desc, canvas, paintingIdx) {
      let canvasGender = null;
      let canvasGenderColor = null;
      if (desc.gender === "Male")
        canvasGender = canvas.male;
      else {
        canvasGender = canvas.female;
      }
      let hueCanvas = true;
      if (desc.color != null && desc.color.length != null && desc.color.length > 0) {
        let [hue, saturation, intensity] = desc.color;
        let y = null;
        if (checkIfHue(hue, saturation, intensity)) {
          canvasGenderColor = canvasGender.hsv
          while (hue < 0)
            hue += 360;
          while (hue > 360)
            hue -= 360;
          y = hue / 360;
        }
        else {
          canvasGenderColor = canvasGender.mono
          y = intensity;
          hueCanvas = false;
        }
        const x = yearToX(Number(desc.year), canvasGenderColor);

        if (window.graphMethod == 'portrait') {
          if (desc.drawUrl != null) {
            fabric.Image.fromURL(desc.drawUrl, imgLoaded => {
              let widthheight = 30;
              if (!window.displayPaintings) {
                widthheight = 8;
              }
              const imFabricObj = imgLoaded.set({
                left: x - widthheight / 2,
                top: y * canvasGenderColor.height - widthheight / 2 + canvasGenderColor.yStart,
                width: widthheight,
                height: widthheight,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
              });
              imFabricObj.on('selected', function (options) {
                showImage(desc.imageUrl, canvasGenderColor, paintingIdx, hue, saturation, intensity);
              })
              canvasGenderColor.add(imFabricObj);
            })
          }
        }
        else if (window.graphMethod == 'hue') {
          let widthheight = 16;

          function hueToColor(hue) {
            [red, green, blue] = hsi2rgb(hue, 0.5, 0.5);
            return `rgb(${red},${green},${blue})`
          }

          const rect = new fabric.Rect({
            left: x - widthheight / 2,
            top: y * canvasGenderColor.height - widthheight / 2 + canvasGenderColor.yStart,
            width: widthheight,
            height: widthheight,
            fill: hueCanvas ? hueToColor(hue) : `rgb(${Math.round(intensity * 255)},${Math.round(intensity * 255)},${Math.round(intensity * 255)})`,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true
          });
          rect.on('selected', function (options) {
            showImage(desc.imageUrl, canvasGenderColor, paintingIdx, hue, saturation, intensity);
          })
          canvasGenderColor.add(rect);
        }
        else if (window.graphMethod == 'color') {
          let widthheight = 16;
          function hsiToColor(hue, saturation, intensity) {
            [red, green, blue] = hsi2rgb(hue, saturation, intensity);
            return `rgb(${red},${green},${blue})`
          }
          const rect = new fabric.Rect({
            left: x - widthheight / 2,
            top: y * canvasGenderColor.height - widthheight / 2 + canvasGenderColor.yStart,
            width: widthheight,
            height: widthheight,
            fill: hsiToColor(hue, saturation, intensity),
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true
          });


          rect.on('selected', function (options) {
            showImage(desc.imageUrl, canvasGenderColor, paintingIdx, hue, saturation, intensity);
          })
          canvasGenderColor.add(rect);
        }


      }
    }
    drawData(getData(json, domColor), canvas, paintingIdx);
  }

  // get paintings
  function run() {
    const filterFiles = (desc) => {
      const decision = getVote(desc);
      preprocessJson(desc);
      const upvote = decision[0] + decision[1];
      const downvote = decision[2];
      if (upvote < window.minUpvote) {
        return false;
      }
      else if (window.maxDownvote !== -1 && window.maxDownvote < downvote) {
        return false;
      }
      return true;
    }

    function addYearMarkers(canvas) {
      const items = [];
      for (let year = 1425; year < 2000; year += 25) {
        const left = yearToX(year, canvas);

        const rect = new fabric.Rect({
          top: canvas.yStart,
          left: left,
          width: 1,
          height: canvas.height - 3,
          fill: "white"
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
        const left = yearToX(year, canvas);


        const text = new fabric.Text(String(year), {
          top: canvas.height - 5,
          left: left - 3,
          fontSize: 10,
          fill: 'white',
          angle: -90
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
    function addHSVBackgroundToCanvas(canvas) {
      const items = [];
      function hueToColor(hue) {
        [red, green, blue] = hsi2rgb(hue, 0.5, 0.5);
        return `rgb(${red},${green},${blue})`
      }

      const height = 10;
      for (let i = 0; i < canvas.height - height; i += height) {
        const hue = Math.floor(i / canvas.height * 360);

        const rect = new fabric.Rect({
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
        const monoLight = Math.floor(i / canvas.height * 256);

        const rect = new fabric.Rect({
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
        });

        rect.on('selected', () => {
          canvas.deactivateAll();
        });


        items.push(rect)
      }
      canvas.add(...items);

    }

    function parseParameters() {
      window.graphMethod = 'portrait';
      if (window.config.graphMethod != null && window.graphMethod.length > 0) {
        window.graphMethod = window.config.graphMethod;
      }

      window.thSaturation = 0.05;
      if (window.config.thSaturation != null && Number(window.config.thSaturation) >= 0) {
        window.thSaturation = Number(window.config.thSaturation);
      }


      window.thSaturationHigh = 0.15;
      if (window.config.thSaturationHigh != null && Number(window.config.thSaturationHigh) >= 0) {
        window.thSaturationHigh = Number(window.config.thSaturationHigh);
      }

      window.thIntensityDark = 0.10;
      if (window.config.thIntensityDark != null && Number(window.config.thIntensityDark) >= 0) {
        window.thIntensityDark = Number(window.config.thIntensityDark);
      }

      window.thIntensityDarkHigh = 0.15;
      if (window.config.thIntensityDarkHigh != null && Number(window.config.thIntensityDarkHigh) >= 0) {
        window.thIntensityDarkHigh = Number(window.config.thIntensityDarkHigh);
      }

      window.thIntensityBright = 0.85;
      if (window.config.thIntensityBright != null && Number(window.config.thIntensityBright) >= 0) {
        window.thIntensityBright = Number(window.config.thIntensityBright);
      }

      window.thIntensityBrightLow = 0.75;
      if (window.config.thIntensityBrightLow != null && Number(window.config.thIntensityBrightLow) >= 0) {
        window.thIntensityBrightLow = Number(window.config.thIntensityBrightLow);
      }

      window.minUpvote = 0;
      if (window.config.minUpvote != null && Number(window.config.minUpvote) > 0) {
        window.minUpvote = Number(window.config.minUpvote);
      }

      window.maxDownvote = -1;
      if (window.config.maxDownvote != null && Number(window.config.maxDownvote) >= 0) {
        window.maxDownvote = Number(window.config.maxDownvote);
      }

      window.displayPaintings = 1;
      if (window.config.displayPaintings != null && Number(window.config.displayPaintings) >= 0) {
        window.displayPaintings = Number(window.config.displayPaintings);
      }

      window.clustering = "annotated";
      if (window.config.clustering != null && window.config.clustering.length > 0) {
        window.clustering = window.config.clustering;
      }


      $('#editEditor').click(() => {
        const dialog = $.confirm({
          title: `Graph settings`,
          content: `<form>
                      Number of paintings to display:<br>
                      Saturation Threshold:<br><input type="number" class="thSaturation" value="${window.thSaturation}" min="0" max="1" step="0.05"><br>
                      Intensity Threshold:<br><input type="number" class="thIntensityDark" value="${window.thIntensityDark}" min="0" max="1" step="0.05"><br>
                      Minimum upvote:<br><input type="number" class="minUpvote" value="${window.minUpvote}" min="0"><br>
                      Maximum downvote:<br><input type="number" class="maxDownvote" value="${window.maxDownvote}" min="-1"><br>
                      <small>-1 or very high number to disable!</small><br>
                      Display paintings:<br><input type="number" class="displayPaintings" value="${window.displayPaintings}" min="0" max="1"><br>
                      <small>1 to display thumbnails, 0 to show dots</small>
                      Color extraction method:<br><input type="text" class="clustering" value="${window.clustering}"><br>
                      <small>Valid values: imofa, annotated, k2, k5, k8, k11, k14, k17</small>
                      </form>`,
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
                const thSaturation = this.$content.find('.thSaturation').val()
                const thIntensityDark = this.$content.find('.thIntensityDark').val()
                const minUpvote = this.$content.find('.minUpvote').val()
                const maxDownvote = this.$content.find('.maxDownvote').val()
                const displayPaintings = this.$content.find('.displayPaintings').val()
                const clustering = this.$content.find('.clustering').val()
                window.location.href = `${window.location.origin}${window.location.pathname}?thSaturation=${thSaturation}&thIntensityDark=${thIntensityDark}&minUpvote=${minUpvote}&maxDownvote=${maxDownvote}&displayPaintings=${displayPaintings}&clustering=${clustering}`
              }
            },
          }
        });
      });
    };

    function prepareDisplay() {
      addYearTextToCanvas(canvas.male.mono);
      addYearTextToCanvas(canvas.female.mono);
      if (window.graphMethod == 'portrait') {
        addHSVBackgroundToCanvas(canvas.male.hsv);
        addHSVBackgroundToCanvas(canvas.female.hsv);
        addMonochromeBackgroundToCanvas(canvas.male.mono);
        addMonochromeBackgroundToCanvas(canvas.female.mono);
      }
      addGenderIconToCanvas(canvas.male.hsv, 'resources/icons/male.png')
      addGenderIconToCanvas(canvas.female.hsv, 'resources/icons/female.png')
      addYearMarkers(canvas.male.hsv);
      addYearMarkers(canvas.male.mono);
      addYearMarkers(canvas.female.hsv);
      addYearMarkers(canvas.female.mono);
    }

    function displayByIdx(filepath, canvas, idx, domColor) {
      $.getJSON(filepath).then(json => {
        if (filterFiles(json))
          drawPainting(json, canvas, idx, domColor);
      }).catch(err => {
        console.error('Error on painting', filepath, err);
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

    parseParameters();
    prepareDisplay();

    //

    //
    clothFiles(files => {
      if (window.clustering == "annotated") {
        $.getJSON('data/json/filesAnnotated.json', annotatedFileList => {
          for (let i = 0; i < annotatedFileList.length; i += 1) {
            const idxFiles = annotatedFileList[i].Index;
            displayByIdx('data/json/' + files[idxFiles], canvas, idxFiles, annotatedFileList[i].domColor);
          }
        });
      }
      else if (window.clustering == "imofa") {
        $.getJSON('data/json/filesImofa.json', annotatedFileList => {
          for (let i = 0; i < annotatedFileList.length; i += 1) {
            if (annotatedFileList[i] != null) {
              const idxFiles = annotatedFileList[i].Index;
              //console.log(annotatedFileList[i]);
              const imofaColors = annotatedFileList[i].imofaColor;
              let domImofaColor = [0, 0, 0, 0];
              let domImofaWeight = 0;
              for (let c = 0; c < imofaColors.length; ++c) {
                const currentImofaColor = imofaColors[c];
                if (currentImofaColor[0] > domImofaWeight) {
                  [domImofaWeight, domImofaColor[0], domImofaColor[1], domImofaColor[2], domImofaColor[3]] = currentImofaColor;
                }
              }
              displayByIdx('data/json/' + files[idxFiles], canvas, idxFiles, getDominantColorFromH1H2SI(domImofaColor));
            }
          }
        });
      }
      else if (window.clustering == "k2" || window.clustering == "k5" || window.clustering == "k8" || window.clustering == "k11" || window.clustering == "k14" || window.clustering == "k17") {
        $.getJSON('data/json/filesKMeans.json', annotatedFileList => {
          for (let i = 0; i < annotatedFileList.length; i += 1) {
            const idxFiles = annotatedFileList[i].Index;
            if (window.clustering == "k2") {
              displayByIdx('data/json/' + files[idxFiles], canvas, idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[0].domColor));
            }
            else if (window.clustering == "k5") {
              displayByIdx('data/json/' + files[idxFiles], canvas, idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[1].domColor));
            }
            else if (window.clustering == "k8") {
              displayByIdx('data/json/' + files[idxFiles], canvas, idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[2].domColor));
            }
            else if (window.clustering == "k11") {
              displayByIdx('data/json/' + files[idxFiles], canvas, idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[3].domColor));
            }
            else if (window.clustering == "k14") {
              displayByIdx('data/json/' + files[idxFiles], canvas, idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[4].domColor));
            }
            else if (window.clustering == "k17") {
              displayByIdx('data/json/' + files[idxFiles], canvas, idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[5].domColor));
            }
            else {
              alert(`Unknown option: clustering=${window.clustering}`);
            }
          }
        });
      }
      else {
        alert(`Unknown option: clustering=${window.clustering}`);
      }
    })
  }
  $(run);
};