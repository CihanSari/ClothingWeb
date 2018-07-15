import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import {
  parseImofa,
  getGrabcutImage,
  prepareBuffer
} from "../scripts/displayPainting";
import { GalleryItem } from "../painting-gallery-item/painting-gallery-item.component";
import { PaintingGalleryService } from "../painting-gallery.service";

@Component({
  selector: "app-painting-gallery",
  templateUrl: "./painting-gallery.component.html",
  styleUrls: ["./painting-gallery.component.css"]
})
export class PaintingGalleryComponent implements OnInit {
  public item: GalleryItem;
  public nItems: number;
  constructor(private galleryService: PaintingGalleryService) {}

  async loadData(event) {
    this.item = await this.galleryService.getGalleryItem(event.page);
  }

  async ngOnInit() {
    this.nItems = await this.galleryService.ready$.toPromise();
    this.item = await this.galleryService.getGalleryItem(0);
  }
}
