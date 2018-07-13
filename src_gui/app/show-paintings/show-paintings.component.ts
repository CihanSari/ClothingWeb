import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ShowPaintingOnCanvas } from "./prepareCanvas";
// import { runShowPaintingsOnCanvas } from "../scripts/showPaintingsOnCanvas";
// <script src="js/clothFiles.js"></script>
// <script src="js/clothingBase.js"></script>
// <script src="js/showPaintingsOnCanvas.js"></script>

@Component({
  selector: "app-show-paintings",
  templateUrl: "./show-paintings.component.html",
  styleUrls: ["./show-paintings.component.css"]
})
export class ShowPaintingsComponent implements OnInit {
  public showPaintings: ShowPaintingOnCanvas;
  constructor(private title: Title) {}

  ngOnInit() {
    this.title.setTitle("Clothing");
    this.showPaintings = new ShowPaintingOnCanvas();
  }
}
