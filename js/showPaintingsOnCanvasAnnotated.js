const showPaintingsOnCanvas = () => {
  // get paintings
  function run() {
    window.clothing = {};

    window.clothing.defaultSettings = {
      graphMethod: 'hue',
      clustering: 'imofa',
      scaleYAxis: 1,//0 or 1
      thSaturation: 0.05,
      thSaturationHigh: 0.15,
      thIntensityDark: 0.1,
      thIntensityDarkHigh: 0.15,
      thIntensityBright: 0.85,
      thIntensityBrightLow: 0.75,
      minUpvote: 0,
      maxDownvote: -1
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
  }
  $(run);
};