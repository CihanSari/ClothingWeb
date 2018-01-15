const showPaintingsOnCanvas = () => {
  function displayFiles(files) {
    const fncProgressGenCallback = () => window.clothing.progressBar.fncProgressGenCallback();
    if (window.settings.clustering == "annotated") {
      $.getJSON('data/json/filesAnnotated.json', annotatedFileList => {
        for (let i = 0; i < annotatedFileList.length; i += 1) {
          const idxFiles = annotatedFileList[i].Index;
          displayByIdx('data/json/' + files[idxFiles], idxFiles, annotatedFileList[i].domColor, fncProgressGenCallback());
        }
      });
    }
    else if (window.settings.clustering == "imofa") {
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
            displayByIdx('data/json/' + files[idxFiles], idxFiles, getDominantColorFromH1H2SI(domImofaColor), fncProgressGenCallback());
          }
        }
      });
    }
    else if (window.settings.clustering == "k2" || window.settings.clustering == "k5" || window.settings.clustering == "k8" || window.settings.clustering == "k11" || window.settings.clustering == "k14" || window.settings.clustering == "k17") {
      $.getJSON('data/json/filesKMeans.json', annotatedFileList => {
        for (let i = 0; i < annotatedFileList.length; i += 1) {
          const idxFiles = annotatedFileList[i].Index;
          if (window.settings.clustering == "k2") {
            displayByIdx('data/json/' + files[idxFiles], idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[0].domColor), fncProgressGenCallback());
          }
          else if (window.settings.clustering == "k5") {
            displayByIdx('data/json/' + files[idxFiles], idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[1].domColor), fncProgressGenCallback());
          }
          else if (window.settings.clustering == "k8") {
            displayByIdx('data/json/' + files[idxFiles], idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[2].domColor), fncProgressGenCallback());
          }
          else if (window.settings.clustering == "k11") {
            displayByIdx('data/json/' + files[idxFiles], idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[3].domColor), fncProgressGenCallback());
          }
          else if (window.settings.clustering == "k14") {
            displayByIdx('data/json/' + files[idxFiles], idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[4].domColor), fncProgressGenCallback());
          }
          else if (window.settings.clustering == "k17") {
            displayByIdx('data/json/' + files[idxFiles], idxFiles, getDominantColorFromH1H2SI(annotatedFileList[i].kMeans[5].domColor), fncProgressGenCallback());
          }
          else {
            alert(`Unknown option: clustering=${window.settings.clustering}`);
          }
        }
      });
    }
    else {
      alert(`Unknown option: clustering=${window.settings.clustering}`);
    }
  };


  window.defaultSettings = {
    graphMethod: 'hue',
    clustering: 'imofa',
    scaleYAxis: 1,
    thSaturation: 0.05,
    thSaturationHigh: 0.15,
    thIntensityDark: 0.1,
    thIntensityDarkHigh: 0.15,
    thIntensityBright: 0.85,
    thIntensityBrightLow: 0.75,
    minUpvote: 0,
    maxDownvote: -1
  };

  // get paintings
  function run() {
    window.clothing = {};
    window.clothing.canvas = {
      male: {
        color: new PaintingCanvas('maleCanvasHSI'),
        mono: new PaintingCanvas('maleCanvasMonochrome')
      },
      female: {
        color: new PaintingCanvas('femaleCanvasHSI'),
        mono: new PaintingCanvas('femaleCanvasMonochrome')
      }
    }
    parseParameters();
    window.clothing.drawOnce = false;
    window.clothing.progressBar = new ClothProgressBar();
    window.clothing.drawResults = () => {
      changeUrl(settingsToUrl(window.settings));
      window.clothing.canvas.male.mono.canvas.clear();
      window.clothing.canvas.female.mono.canvas.clear();
      window.clothing.canvas.male.color.canvas.clear();
      window.clothing.canvas.female.color.canvas.clear();
      //
      prepareDisplay();
      //

      //

      window.clothing.progressBar.initProgress();
      clothFiles(files => displayFiles(files))
    };
    window.clothing.drawResults();
  }
  $(run);
};