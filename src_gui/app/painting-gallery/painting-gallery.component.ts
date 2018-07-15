import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import {
  parseImofa,
  getGrabcutImage,
  prepareBuffer
} from "../scripts/displayPainting";
import { GalleryItem } from "../painting-gallery-item/painting-gallery-item.component";

@Component({
  selector: "app-painting-gallery",
  templateUrl: "./painting-gallery.component.html",
  styleUrls: ["./painting-gallery.component.css"]
})
export class PaintingGalleryComponent implements OnInit {
  itemGenerators: (() => Promise<GalleryItem>)[] = [];
  itemPromises: (Promise<GalleryItem> | undefined)[] = [];
  public item: GalleryItem;
  public basepath = "/data/json/";
  // cars: any[];

  constructor() {
    // this.cars = [
    //   { vin: "r3278r2", year: 2010, brand: "Audi", color: "Black" },
    //   { vin: "jhto2g2", year: 2015, brand: "BMW", color: "White" },
    //   { vin: "h453w54", year: 2012, brand: "Honda", color: "Blue" },
    //   { vin: "g43gwwg", year: 1998, brand: "Renault", color: "White" },
    //   { vin: "gf45wg5", year: 2011, brand: "VW", color: "Red" },
    //   { vin: "bhv5y5w", year: 2015, brand: "Jaguar", color: "Blue" },
    //   { vin: "ybw5fsd", year: 2012, brand: "Ford", color: "Yellow" },
    //   { vin: "45665e5", year: 2011, brand: "Mercedes", color: "Brown" },
    //   { vin: "he6sb5v", year: 2015, brand: "Ford", color: "Black" }
    // ];
  }

  async getItem(paintingConfig: any): Promise<GalleryItem> {
    try {
      const promises = {
        json2: paintingConfig.json2
          ? $.getJSON(this.basepath + paintingConfig.json2)
          : null,
        grabcut2: paintingConfig.grabcut2
          ? $.getJSON(this.basepath + paintingConfig.grabcut2)
          : null,
        grabcut: paintingConfig.grabcut
          ? $.getJSON(this.basepath + paintingConfig.grabcut)
          : null,
        imofaColor: paintingConfig.imofaColor
          ? $.getJSON(this.basepath + paintingConfig.imofaColor)
          : null,
        imofa2Color: paintingConfig.imofa2Color
          ? $.getJSON(this.basepath + paintingConfig.imofa2Color)
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
        : `https://placeholdit.imgix.net/~text?txtsize=56&txt=Not%20Available&w=${
            image.width
          }&h=${image.height}&txttrack=0`;

      const grabcut2Json = promises.grabcut2
        ? (await promises.grabcut2).GrabCutDataV2
        : null;
      const Grabcut2Src = promises.grabcut2
        ? await getGrabcutImage(image, grabcut2Json, false)
        : `https://placeholdit.imgix.net/~text?txtsize=56&txt=Not%20Available&w=${
            image.width
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

  async loadData(event) {
    const idx = event.page;
    if (this.itemGenerators[idx] != null) {
      if (this.itemPromises[idx] == null) {
        this.itemPromises[idx] = this.itemGenerators[idx]();
      }
      this.item = await this.itemPromises[idx];
    } else {
      console.log(this.itemGenerators);
    }
  }

  async ngOnInit() {
    const basepath = "/data/json/";
    const files: any[] = await $.getJSON(`${basepath}files_v2.json`);
    while (true) {
      const paintingConfig = files.shift();
      if (paintingConfig && paintingConfig.json2) {
        this.itemGenerators.push(() => this.getItem(paintingConfig));
        this.itemPromises.push();
        break;
      }
    }
    for (let paintingConfig of files) {
      if (paintingConfig && paintingConfig.json2) {
        this.itemGenerators.push(() => this.getItem(paintingConfig));
        this.itemPromises.push();
      }
    }
    this.loadData({ page: 0 });
  }

  async getImage(imagePath) {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const paintingData = new Image();

      paintingData.onload = async () => {
        resolve(paintingData);
      };
      paintingData.src = imagePath;
    });
  }
}
