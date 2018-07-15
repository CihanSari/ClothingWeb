import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Title } from "@angular/platform-browser";
// import { ClothProgressBar } from "../scripts/clothProgressBar";
import { DisplayFiles } from "../scripts/trend";
import { PaintingCanvas } from "./paintingCanvas";
import { ClothCanvas } from "../scripts/clothCanvas";
import { ClothSettings, ClothingCanvasInterface } from "./canvassettings";
import { GalleryItem } from "../painting-gallery-item/painting-gallery-item.component";
import { PaintingGalleryService } from "../painting-gallery.service";

@Component({
  selector: "app-show-paintings",
  templateUrl: "./show-paintings.component.html",
  styleUrls: ["./show-paintings.component.css"]
})
export class ShowPaintingsComponent implements OnInit, OnDestroy {
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
  @ViewChild("canvas1") canvas1: ElementRef;
  @ViewChild("canvas2") canvas2: ElementRef;
  @ViewChild("canvas3") canvas3: ElementRef;
  @ViewChild("canvas4") canvas4: ElementRef;
  private canvas: ClothingCanvasInterface;
  private timeoutId: number;
  public item: GalleryItem;

  public async drawResults() {
    this.canvas.male.mono.canvas.clear();
    this.canvas.female.mono.canvas.clear();
    this.canvas.male.color.canvas.clear();
    this.canvas.female.color.canvas.clear();
    //
    const clothCanvas = new ClothCanvas(this.settings, this.canvas);
    //
    // this.progressBar.initProgress();
    const displayFiles = new DisplayFiles(this.settings, clothCanvas);
    displayFiles.clothCanvas.paintingClicked$.subscribe(async desc => {
      if (desc) {
        this.item = await this.galleryService.getGalleryItemFromAbsoluteIndex(
          desc.paintingIdx
        );
      } else {
        this.item = undefined;
      }
    });
    let showNext = await displayFiles.init();
    const setNextTimeout = () => {
      this.timeoutId = window.setTimeout(async () => {
        showNext = await showNext();
        showNext = await showNext();
        showNext = await showNext();
        showNext = await showNext();
        showNext = await showNext();
        showNext = await showNext();
        showNext = await showNext();
        showNext = await showNext();
        setNextTimeout();
      }, 0);
    };
    setNextTimeout();
  }

  constructor(
    private title: Title,
    private galleryService: PaintingGalleryService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    const self = this.el.nativeElement as HTMLElement;
    const width = self.clientWidth;
    (this.canvas1.nativeElement as HTMLCanvasElement).width = width;
    (this.canvas2.nativeElement as HTMLCanvasElement).width = width;
    (this.canvas3.nativeElement as HTMLCanvasElement).width = width;
    (this.canvas4.nativeElement as HTMLCanvasElement).width = width;
    console.log(self.clientWidth);
    this.title.setTitle("Clothing");
    this.canvas = {
      male: {
        color: new PaintingCanvas("maleCanvasHSI"),
        mono: new PaintingCanvas("maleCanvasMonochrome")
      },
      female: {
        color: new PaintingCanvas("femaleCanvasHSI"),
        mono: new PaintingCanvas("femaleCanvasMonochrome")
      }
    };
    this.drawResults();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }
}
