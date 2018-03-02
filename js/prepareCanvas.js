function showPaintingsOnCanvas() {
  // get paintings
  window.clothing = window.clothing || {};

  window.clothing.defaultSettings = window.clothing.defaultSettings || {};
  window.clothing.defaultSettings = {
    graphMethod: window.clothing.defaultSettings.graphMethod || 'hue',
    clustering: window.clothing.defaultSettings.clustering || 'imofa2Color',
    scaleYAxis: window.clothing.defaultSettings.scaleYAxis || 1,//0 or 1
    thSaturation: window.clothing.defaultSettings.thSaturation || 0.05,
    thSaturationHigh: window.clothing.defaultSettings.thSaturationHigh || 0.15,
    thIntensityDark: window.clothing.defaultSettings.thIntensityDark || 0.1,
    thIntensityDarkHigh: window.clothing.defaultSettings.thIntensityDarkHigh || 0.15,
    thIntensityBright: window.clothing.defaultSettings.thIntensityBright || 0.85,
    thIntensityBrightLow: window.clothing.defaultSettings.thIntensityBrightLow || 0.75,
    minUpvote: window.clothing.defaultSettings.minUpvote || 0,
    maxDownvote: window.clothing.defaultSettings.maxDownvote || -1
  };
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
    window.clothing.progressBar.initProgress();
    clothFiles(files => displayFiles(files))
  };
  window.clothing.drawResults();
};