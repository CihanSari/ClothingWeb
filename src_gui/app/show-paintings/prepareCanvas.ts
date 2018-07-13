import { ClothProgressBar } from "../scripts/clothProgressBar";
import { DisplayFiles } from "../scripts/trend";
import { PaintingCanvas } from "./paintingCanvas";
import { ClothCanvas } from "../scripts/clothCanvas";

export interface ClothSettings {
  graphMethod: string;
  clustering: string;
  scaleYAxis: number;
  thSaturation: number;
  thSaturationHigh: number;
  thIntensityDark: number;
  thIntensityDarkHigh: number;
  thIntensityBright: number;
  thIntensityBrightLow: number;
  minUpvote: number;
  maxDownvote: number;
}

export interface ClothingCanvasInterface {
  male: {
    color: PaintingCanvas;
    mono: PaintingCanvas;
  };
  female: {
    color: PaintingCanvas;
    mono: PaintingCanvas;
  };
}

export class ShowPaintingOnCanvas {
  readonly settings: ClothSettings = {
    graphMethod: "hue",
    clustering: "imofa2Color",
    scaleYAxis: 1,
    thSaturation: 0.05,
    thSaturationHigh: 0.15,
    thIntensityDark: 0.1,
    thIntensityDarkHigh: 0.15,
    thIntensityBright: 0.85,
    thIntensityBrightLow: 0.7,
    minUpvote: 0,
    maxDownvote: -1
  };
  readonly canvas = {
    male: {
      color: new PaintingCanvas("maleCanvasHSI"),
      mono: new PaintingCanvas("maleCanvasMonochrome")
    },
    female: {
      color: new PaintingCanvas("femaleCanvasHSI"),
      mono: new PaintingCanvas("femaleCanvasMonochrome")
    }
  };
  drawOnce = false;
  private progressBar = new ClothProgressBar();
  constructor() {
    // parseParameters();
    this.drawResults();
  }
  public drawResults() {
    // changeUrl(settingsToUrl(mySettings));
    this.canvas.male.mono.canvas.clear();
    this.canvas.female.mono.canvas.clear();
    this.canvas.male.color.canvas.clear();
    this.canvas.female.color.canvas.clear();
    //
    const clothCanvas = new ClothCanvas(this.settings, this.canvas);
    //
    this.progressBar.initProgress();
    const b = new DisplayFiles(this.settings, this.progressBar, clothCanvas);
    // displayFiles(this.progressBar, );
  }
}
