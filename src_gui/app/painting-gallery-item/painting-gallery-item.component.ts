import { Component, OnInit, Input } from "@angular/core";
import { Title } from "@angular/platform-browser";

export interface GalleryItem {
  title: string;
  ImageSrc: string;
  GrabcutSrc: string;
  Grabcut2Src: string;
  imofaWRGB: number[][];
  imofa2WRGB: number[][];
  Painter: string;
  Year: string;
  Gender: string;
}

@Component({
  selector: "app-painting-gallery-item",
  templateUrl: "./painting-gallery-item.component.html",
  styleUrls: ["./painting-gallery-item.component.css"]
})
export class PaintingGalleryItemComponent implements OnInit {
  @Input() item: GalleryItem;
  constructor(private title: Title) {}

  ngOnInit() {
    this.title.setTitle("Painting gallery");
  }

  public toHex(d) {
    return ("0" + Number(d).toString(16)).slice(-2).toUpperCase();
  }
  public wrgbToHex(wrgb) {
    return `#${this.toHex(wrgb[1])}${this.toHex(wrgb[2])}${this.toHex(
      wrgb[3]
    )}`;
  }
  public weightToStr(w: number) {
    return (w * 100).toFixed(2);
  }
}
