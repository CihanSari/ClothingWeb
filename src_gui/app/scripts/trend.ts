import * as $ from "jquery";
import { ClothCanvas } from "./clothCanvas";
import { ClothProgressBar } from "./clothProgressBar";
import { ClothSettings } from "../show-paintings/prepareCanvas";

export class DisplayFiles {
  private basepath = "/data/json/";
  constructor(
    private settings: ClothSettings,
    private progressBar: ClothProgressBar,
    private clothCanvas: ClothCanvas
  ) {
    this.init();
  }

  private async init() {
    const fncProgressGenCallback = () =>
      this.progressBar.fncProgressGenCallback();
    const fncCallbackAfterFiles = fncProgressGenCallback();
    const files = await this.clothFiles2();
    fncCallbackAfterFiles();
    files.forEach((file, idx) => {
      if (file != null && !Array.isArray(file)) {
        this.getFieldFromFilesIdx(files, idx, fncProgressGenCallback);
      }
    });
  }

  private async clothFiles2() {
    return await $.getJSON(`${this.basepath}files_v2.json`);
  }

  private getJSON(filepath) {
    const res = $.getJSON(`${this.basepath}${filepath}`);
    res.catch(ex => console.error(ex));
    return res;
  }

  private async getFieldFromFilesIdx(clothFiles2, idx, genCallback) {
    const clothFile2 = clothFiles2[idx];
    const fieldName = this.settings.clustering;
    if (!Object.hasOwnProperty.call(clothFile2, fieldName)) {
      return;
    }
    const fileContent2Promise = this.getJSON(clothFile2.json2);
    const fieldPromise = this.getJSON(clothFile2[fieldName]);
    const callbackForField = genCallback();
    const color = await fieldPromise;
    callbackForField();
    const color1 = color[0];
    if ($.isArray(color1)) {
      // there are multiple colors
      const promises = [];
      const callbacks = [];
      for (let i = 0; i < color.length; i += 1) {
        callbacks.push(genCallback());
        promises.push(
          this.clothCanvas.drawPaintingAsync(
            fileContent2Promise,
            idx,
            color[i].slice(1, 4)
          )
        );
      }
      await Promise.all(promises);
      callbacks.forEach(callback => callback());
    } else {
      // There is only one dom color
      const callback = genCallback();
      await this.clothCanvas.drawPaintingAsync(
        fileContent2Promise,
        idx,
        color.slice(1, 4)
      );
      callback();
    }
  }
}
