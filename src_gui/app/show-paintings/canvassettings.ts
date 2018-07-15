import { PaintingCanvas } from "./paintingCanvas";

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
