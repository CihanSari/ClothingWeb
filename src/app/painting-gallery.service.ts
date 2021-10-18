import { Injectable, OnInit } from "@angular/core";
import {
  parseImofa,
  getGrabcutImage,
  prepareBuffer
} from "./scripts/displayPainting";
import { GalleryItem } from "./painting-gallery-item/painting-gallery-item.component";
import { ReplaySubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PaintingGalleryService {
  private itemGenerators: (() => Promise<GalleryItem>)[] = [];
  private itemPromises: (Promise<GalleryItem> | undefined)[] = [];
  private absoluteIndices: number[] = [];
  private basepath = "/data/json/";
  // returns n items loaded
  private readySubject = new ReplaySubject<number>();
  public ready$ = this.readySubject.asObservable();
  constructor(private http: HttpClient) {
    this.init();
  }

  public getGalleryItem(idx: number) {
    if (this.itemGenerators[idx] != null) {
      if (this.itemPromises[idx] == null) {
        this.itemPromises[idx] = this.itemGenerators[idx]();
      }
      return this.itemPromises[idx];
    } else {
      console.error(idx, this.itemGenerators);
      return null;
    }
  }

  public getGalleryItemFromAbsoluteIndex(idx: number) {
    return this.getGalleryItem(this.absoluteIndices[idx]);
  }

  private async getItem(paintingConfig: any): Promise<GalleryItem> {
    try {
      const promises = {
        json2: paintingConfig.json2
          ? this.http.get<any>(this.basepath + paintingConfig.json2).toPromise()
          : null,
        grabcut2: paintingConfig.grabcut2
          ? this.http.get<any>(this.basepath + paintingConfig.grabcut2).toPromise()
          : null,
        grabcut: paintingConfig.grabcut
          ? this.http.get<any>(this.basepath + paintingConfig.grabcut).toPromise()
          : null,
        imofaColor: paintingConfig.imofaColor
          ? this.http.get<any>(this.basepath + paintingConfig.imofaColor).toPromise()
          : null,
        imofa2Color: paintingConfig.imofa2Color
          ? this.http.get<any>(this.basepath + paintingConfig.imofa2Color).toPromise()
          : null
      };
      const json2 = await promises.json2;

      const Filename = `${this.basepath}../jpg/${json2.Filename}`;

      const imofaWRGB = promises.imofaColor
        ? parseImofa(await promises.imofaColor)
        : null;
      const imofa2WRGB = promises.imofa2Color
        ? parseImofa(await promises.imofa2Color)
        : null;

      const image = await this.getImage(Filename);
      const grabcutJson = promises.grabcut
        ? (await promises.grabcut).GrabCutData
        : null;
      const GrabcutSrc = promises.grabcut
        ? await getGrabcutImage(image, grabcutJson, true)
        : `https://placeholdit.imgix.net/~text?txtsize=56&txt=Not%20Available&w=${image.width
        }&h=${image.height}&txttrack=0`;

      const grabcut2Json = promises.grabcut2
        ? (await promises.grabcut2).GrabCutDataV2
        : null;
      const Grabcut2Src = promises.grabcut2
        ? await getGrabcutImage(image, grabcut2Json, false)
        : `https://placeholdit.imgix.net/~text?txtsize=56&txt=Not%20Available&w=${image.width
        }&h=${image.height}&txttrack=0`;
      const ImageSrc = await (async () => {
        const { bufferCanvas, bufferCtx } = await prepareBuffer();
        bufferCanvas.width = image.width;
        bufferCanvas.height = image.height;
        bufferCtx.drawImage(image, 0, 0);
        return bufferCanvas.toDataURL();
      })();
      return {
        ImageSrc,
        imofaWRGB,
        imofa2WRGB,
        GrabcutSrc,
        Grabcut2Src,
        Gender: json2.Gender,
        Year: json2.Year,
        Painter: json2.Painter,
        title: json2.title
      };
    } catch (ex) {
      alert(
        "Something went wrong. Please report the incident to cihan.sari@boun.edu.tr if issue persists. Check console for details (F12 is the default key to open console.)."
      );
      console.error(ex);
    }
  }

  public getLength() {
    return this.itemPromises.length;
  }

  private async init() {
    const basepath = "/data/json/";
    const files: any[] = await $.getJSON(`${basepath}files_v2.json`);
    while (true) {
      const paintingConfig = files.shift();
      if (paintingConfig && paintingConfig.json2) {
        this.itemGenerators.push(() => this.getItem(paintingConfig));
        this.itemPromises.push(undefined);
        this.absoluteIndices.push(this.itemPromises.length - 1);
        break;
      } else {
        this.absoluteIndices.push(-1);
      }
    }
    for (let paintingConfig of files) {
      if (paintingConfig && paintingConfig.json2) {
        this.itemGenerators.push(() => this.getItem(paintingConfig));
        this.itemPromises.push(undefined);
        this.absoluteIndices.push(this.itemPromises.length - 1);
      } else {
        this.absoluteIndices.push(-1);
      }
    }
    this.readySubject.next(this.itemPromises.length);
    this.readySubject.complete();
  }

  private async getImage(imagePath) {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const paintingData = new Image();

      paintingData.onload = async () => {
        resolve(paintingData);
      };
      paintingData.src = imagePath;
    });
  }
}
