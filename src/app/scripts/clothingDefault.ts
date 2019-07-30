import { ClothProgressBar } from "./clothProgressBar";

let clothingDefaultSettings: {
  graphMethod?: string;
  clustering?: string;
  scaleYAxis?: number;
  thSaturation?: number;
  thSaturationHigh?: number;
  thIntensityDark?: number;
  thIntensityDarkHigh?: number;
  thIntensityBright?: number;
  thIntensityBrightLow?: number;
  minUpvote?: number;
  maxDownvote?: number;
} = {};
clothingDefaultSettings = {
  graphMethod: clothingDefaultSettings.graphMethod || "hue",
  clustering: clothingDefaultSettings.clustering || "imofa2Color",
  scaleYAxis: clothingDefaultSettings.scaleYAxis || 1, //0 or 1
  thSaturation: clothingDefaultSettings.thSaturation || 0.05,
  thSaturationHigh: clothingDefaultSettings.thSaturationHigh || 0.15,
  thIntensityDark: clothingDefaultSettings.thIntensityDark || 0.1,
  thIntensityDarkHigh: clothingDefaultSettings.thIntensityDarkHigh || 0.15,
  thIntensityBright: clothingDefaultSettings.thIntensityBright || 0.85,
  thIntensityBrightLow: clothingDefaultSettings.thIntensityBrightLow || 0.75,
  minUpvote: clothingDefaultSettings.minUpvote || 0,
  maxDownvote: clothingDefaultSettings.maxDownvote || -1
};

type privateCanvas = any;
interface pCanvas {
  color?: privateCanvas;
  mono?: privateCanvas;
}
export const privateClothing: {
  defaultSettings?: {
    graphMethod?: string;
    clustering?: string;
    scaleYAxis?: number;
    thSaturation?: number;
    thSaturationHigh?: number;
    thIntensityDark?: number;
    thIntensityDarkHigh?: number;
    thIntensityBright?: number;
    thIntensityBrightLow?: number;
    minUpvote?: number;
    maxDownvote?: number;
  };
  canvas?: {
    male?: pCanvas;
    female?: pCanvas;
  };
  drawOnce?: boolean;
  progressBar?: ClothProgressBar;
  drawResults?: Function;
} = { defaultSettings: clothingDefaultSettings };
