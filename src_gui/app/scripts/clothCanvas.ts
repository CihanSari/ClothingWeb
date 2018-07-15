import * as $ from "jquery";
import { fabric } from "fabric";
import {
  ClothSettings,
  ClothingCanvasInterface
} from "../show-paintings/canvassettings";
import { PaintingCanvas } from "../show-paintings/paintingCanvas";
import { Subject } from "rxjs";

const myYears: { femaleList?: number[]; maleList?: number[] } = {
  femaleList: [],
  maleList: []
};
export interface PaintingDescription {
  color: number[]; //hue, saturation, intensity
  year: number;
  gender: string;
  title: string;
  painter: string;
  imageUrl: string;
  drawUrl: string;
  paintingIdx: number;
}

export class ClothCanvas {
  private paintingClickedSource = new Subject<PaintingDescription>();
  public paintingClicked$ = this.paintingClickedSource.asObservable();

  private axisMapping = [
    {
      hueList: [0, 360],
      hueYList: [0, 1],
      intList: [0, 1],
      intYList: [0, 1]
    },
    {
      hueList: [0, 60, 360],
      hueYList: [0, 0.6, 0.88],
      intList: [0, 0.2, 0.8, 1],
      intYList: [0, 0.4, 0.8, 1]
    }
  ];

  constructor(
    private mySettings: ClothSettings,
    private canvas: ClothingCanvasInterface
  ) {
    this.addYearTextToCanvas(canvas.male.mono);
    this.addYearTextToCanvas(canvas.female.mono);
    const yearTextHeight = 30;
    canvas.male.mono.height -= yearTextHeight * 2;
    canvas.female.mono.height -= yearTextHeight * 2;
    canvas.male.color.height -= yearTextHeight * 2;
    canvas.female.color.height -= yearTextHeight * 2;

    this.addHSIBackgroundToCanvas(canvas.male.color);
    this.addHSIBackgroundToCanvas(canvas.female.color);
    this.addMonochromeBackgroundToCanvas(canvas.male.mono);
    this.addMonochromeBackgroundToCanvas(canvas.female.mono);
    this.addGenderIconToCanvas(canvas.male.color, "/assets/icons/maleDark.png");
    this.addGenderIconToCanvas(
      canvas.female.color,
      "/assets/icons/femaleDark.png"
    );
    this.addYearMarkers(canvas.male.color);
    this.addYearMarkers(canvas.male.mono);
    this.addYearMarkers(canvas.female.color);
    this.addYearMarkers(canvas.female.mono);
  }

  private hsi2rgb(resultHue, resultSaturation, resultIntensity) {
    while (resultHue > 360) resultHue -= 360;
    while (resultHue < 0) resultHue += 360;
    resultIntensity = resultIntensity * 255;
    const cos = degree => Math.cos(degree * (Math.PI / 180));
    let backR = 0;
    let backG = 0;
    let backB = 0;
    if (resultHue == 0) {
      backR = Math.floor(
        resultIntensity + 2 * resultIntensity * resultSaturation
      );
      backG = Math.floor(resultIntensity - resultIntensity * resultSaturation);
      backB = Math.floor(resultIntensity - resultIntensity * resultSaturation);
    } else if (0 < resultHue && resultHue < 120) {
      backR = Math.floor(
        resultIntensity +
          (resultIntensity * resultSaturation * cos(resultHue)) /
            cos(60 - resultHue)
      );
      backG = Math.floor(
        resultIntensity +
          resultIntensity *
            resultSaturation *
            (1 - cos(resultHue) / cos(60 - resultHue))
      );
      backB = Math.floor(resultIntensity - resultIntensity * resultSaturation);
    } else if (resultHue == 120) {
      backR = Math.floor(resultIntensity - resultIntensity * resultSaturation);
      backG = Math.floor(
        resultIntensity + 2 * resultIntensity * resultSaturation
      );
      backB = Math.floor(resultIntensity - resultIntensity * resultSaturation);
    } else if (120 < resultHue && resultHue < 240) {
      backR = Math.floor(resultIntensity - resultIntensity * resultSaturation);
      backG = Math.floor(
        resultIntensity +
          (resultIntensity * resultSaturation * cos(resultHue - 120)) /
            cos(180 - resultHue)
      );
      backB = Math.floor(
        resultIntensity +
          resultIntensity *
            resultSaturation *
            (1 - cos(resultHue - 120) / cos(180 - resultHue))
      );
    } else if (resultHue == 240) {
      backR = Math.floor(resultIntensity - resultIntensity * resultSaturation);
      backG = Math.floor(resultIntensity - resultIntensity * resultSaturation);
      backB = Math.floor(
        resultIntensity + 2 * resultIntensity * resultSaturation
      );
    } else if (240 < resultHue && resultHue < 360) {
      backR = Math.floor(
        resultIntensity +
          resultIntensity *
            resultSaturation *
            (1 - cos(resultHue - 240) / cos(300 - resultHue))
      );
      backG = Math.floor(resultIntensity - resultIntensity * resultSaturation);
      backB = Math.floor(
        resultIntensity +
          (resultIntensity * resultSaturation * cos(resultHue - 240)) /
            cos(300 - resultHue)
      );
    }
    return [backR, backG, backB];
  }

  private checkIfHue(hue, saturation, intensity) {
    if (
      saturation < this.mySettings.thSaturation ||
      intensity < this.mySettings.thIntensityDark ||
      intensity > this.mySettings.thIntensityBright
    ) {
      return false;
    } else if (saturation < this.mySettings.thSaturationHigh) {
      if (
        intensity < this.mySettings.thIntensityDarkHigh ||
        intensity > this.mySettings.thIntensityBrightLow
      ) {
        return false;
      }
    }
    return true;
  }

  private yearToX(year: number, canvas: PaintingCanvas) {
    const firstYear = 1400;
    const lastYear = 1900;
    return ((year - firstYear) / (lastYear - firstYear)) * canvas.width;
  }
  private mapPair(list1, list2, list1Value) {
    for (let k = 0; k < list1.length; k += 1) {
      if (list1[k] > list1Value) {
        if (k == 0) {
          return list2[0];
        } else {
          const list1Before = list1[k - 1];
          const list1After = list1[k];
          const list1Dist = list1After - list1Before;
          const list2Before = list2[k - 1];
          const list2After = list2[k];
          const list2Dist = list2After - list2Before;

          const distBefore = list1Value - list1Before;
          if (distBefore == 0) {
            return list2[k - 1];
          }
          const ratio = distBefore / list1Dist;
          return list2Dist * ratio + list2Before;
        }
      }
    }
    return list2[list2.length - 1];
  }

  private yToHue(y) {
    return this.mapPair(
      this.axisMapping[this.mySettings.scaleYAxis].hueYList,
      this.axisMapping[this.mySettings.scaleYAxis].hueList,
      y
    );
  }

  private hueToY(hue, canvas) {
    while (hue > 360) hue -= 360;
    while (hue < 0) hue += 360;
    return (
      this.mapPair(
        this.axisMapping[this.mySettings.scaleYAxis].hueList,
        this.axisMapping[this.mySettings.scaleYAxis].hueYList,
        hue
      ) * canvas.height
    );
  }

  private yToInt(i) {
    return this.mapPair(
      this.axisMapping[this.mySettings.scaleYAxis].intYList,
      this.axisMapping[this.mySettings.scaleYAxis].intList,
      i
    );
  }

  private intToY(i, canvas) {
    return (
      this.mapPair(
        this.axisMapping[this.mySettings.scaleYAxis].intList,
        this.axisMapping[this.mySettings.scaleYAxis].intYList,
        i
      ) * canvas.height
    );
  }

  public async drawPaintingAsync(jsonPromise, paintingIdx, domColor) {
    const defaultProperties = {
      stroke: "black",
      strokeWidth: 1,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true,
      lockRotation: true
    };

    const descJSON = await jsonPromise;

    const desc: PaintingDescription = {
      color: domColor,
      year: descJSON.Year,
      gender: descJSON.Gender,
      title: descJSON.title,
      painter: descJSON.Painter,
      imageUrl: "/data/jpg/" + descJSON.Filename,
      drawUrl: "/data/jpg/" + descJSON.Filename,
      paintingIdx
    };

    let canvasGender = null;
    if (desc.gender === "Male") {
      canvasGender = this.canvas.male;
    } else {
      canvasGender = this.canvas.female;
    }
    let hueCanvas = true;
    let [hue, saturation, intensity] = desc.color;
    let y = null;
    let canvasGenderColor: PaintingCanvas = null;
    if (this.checkIfHue(hue, saturation, intensity)) {
      canvasGenderColor = canvasGender.color;
      y = this.hueToY(hue, canvasGenderColor);
    } else {
      canvasGenderColor = canvasGender.mono;
      y = this.intToY(intensity, canvasGenderColor);
      hueCanvas = false;
    }
    const x = this.yearToX(desc.year, canvasGenderColor);

    const displayProperties = () => {
      const hueToColor = hue => {
        const [red, green, blue] = this.hsi2rgb(hue, 0.5, 0.5);
        return `rgb(${red},${green},${blue})`;
      };

      const hsiToColor = (hue, saturation, intensity) => {
        const [red, green, blue] = this.hsi2rgb(hue, saturation, intensity);
        return `rgb(${red},${green},${blue})`;
      };

      const properties = (widthheight, options?) => {
        if (options == null) {
          options = {};
        }
        options.left = x - widthheight / 2;
        options.top = y - widthheight / 2 + canvasGenderColor.yStart;
        options.width = widthheight;
        options.height = widthheight;
        return $.extend({}, defaultProperties, options);
      };
      if (this.mySettings.graphMethod == "hue") {
        return properties(16, {
          fill: hueCanvas
            ? hueToColor(hue)
            : `rgb(${Math.round(intensity * 255)},${Math.round(
                intensity * 255
              )},${Math.round(intensity * 255)})`
        });
      } else if (this.mySettings.graphMethod == "color") {
        return properties(16, {
          fill: hsiToColor(hue, saturation, intensity)
        });
      } else if (this.mySettings.graphMethod == "portrait") {
        return properties(30);
      }
    };

    const addFabric = fabricObj => {
      fabricObj.on("selected", () => {
        canvasGenderColor.deactivateAll().renderAll();
        this.paintingClickedSource.next(desc);
      });
      canvasGenderColor.add(fabricObj);
    };

    if (this.mySettings.graphMethod == "portrait") {
      const getFabricImagePromise: any = new Promise((resolve, reject) => {
        fabric.Image.fromURL(desc.drawUrl, img => {
          resolve(img);
        });
      });
      const imgLoaded = await getFabricImagePromise;
      addFabric(imgLoaded.set(displayProperties()));
    } else {
      addFabric(new fabric.Rect(displayProperties()));
    }
  }

  private addYearMarkers(canvas: PaintingCanvas) {
    const items = [];
    for (let year = 1450; year < 1875; year += 25) {
      const left = this.yearToX(year, canvas);

      const rect = new fabric.Rect({
        top: canvas.yStart,
        left,
        width: 1,
        height: canvas.height - 3,
        fill: "rgba(127,127,127,0.4)"
      });

      rect.on("selected", () => {
        canvas.deactivateAll();
        this.paintingClickedSource.next();
      });

      items.push(rect);
    }
    canvas.add(...items);
  }

  private addYearTextToCanvas(canvas: PaintingCanvas) {
    for (let year = 1450; year < 1875; year += 25) {
      const left = this.yearToX(year, canvas);
      const text = new fabric.Text(year.toString(), {
        top: canvas.height - 20,
        left: left - 14,
        fontSize: 13,
        fill: "black"
      });
      text.on("selected", () => {
        canvas.deactivateAll();
        this.paintingClickedSource.next();
      });
      canvas.add(text);
    }
  }

  private addGenderIconToCanvas(
    canvas: PaintingCanvas,
    genderImageUrl: string
  ) {
    fabric.Image.fromURL(genderImageUrl, imgLoaded => {
      const top = canvas.height / 4 + canvas.yStart;
      const left = this.yearToX(1420, canvas);
      const width = canvas.height / 2;
      const imFabricObj = imgLoaded.scaleToWidth(width).set({
        left,
        top,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        lockRotation: true
      });
      imFabricObj.on("selected", () => {
        canvas.deactivateAll();
        this.paintingClickedSource.next();
      });
      canvas.canvas.add(imFabricObj);
    });
  }

  private addHSIBackgroundToCanvas(canvas) {
    const items = [];

    const hueToColor = hue => {
      const [red, green, blue] = this.hsi2rgb(hue, 0.5, 0.5);
      return `rgb(${red},${green},${blue})`;
    };

    const height = 10;
    for (let i = 0; i < canvas.height - height; i += height) {
      const hue = this.yToHue(i / canvas.height);

      const rect = new fabric.Rect({
        top: i + canvas.yStart,
        left: this.yearToX(1420, canvas),
        width: 10,
        height: height + 1,
        fill: hueToColor(hue),
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        lockRotation: true
      });

      rect.on("selected", () => {
        canvas.deactivateAll();
        this.paintingClickedSource.next();
      });

      items.push(rect);
    }
    canvas.add(...items);
  }

  private addMonochromeBackgroundToCanvas(canvas) {
    const items = [];
    const height = 10;
    for (let i = 0; i < canvas.height - height; i += height) {
      const monoLight = Math.round(this.yToInt(i / canvas.height) * 255);
      const rect = new fabric.Rect({
        top: i + canvas.yStart,
        left: this.yearToX(1420, canvas),
        width: 10,
        height: height + 1,
        fill: `rgb(${monoLight},${monoLight},${monoLight})`,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        lockRotation: true
      });

      rect.on("selected", () => {
        canvas.deactivateAll();
        this.paintingClickedSource.next();
      });

      items.push(rect);
    }
    canvas.add(...items);
  }
}
