import { PaintingCanvas } from "./paintingCanvas";
import { BehaviorSubject } from "rxjs";

export enum GraphMethod {
  Hue = "hue",
  Color = "color",
  Portrait = "portrait"
}

export interface ClothSettings {
  graphMethod: BehaviorSubject<GraphMethod>;
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
