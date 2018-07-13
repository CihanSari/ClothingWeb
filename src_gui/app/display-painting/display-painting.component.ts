import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from "@angular/core";
import * as $ from "jquery";
import { displayPainting } from "../scripts/displayPainting";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-display-painting",
  templateUrl: "./display-painting.component.html",
  styleUrls: ["./display-painting.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class DisplayPaintingComponent implements OnInit {
  @ViewChild("tab") public tabDiv: ElementRef;
  @ViewChild("tabcontent") public tabcontentDiv;
  constructor(private title: Title) {}

  ngOnInit() {
    this.title.setTitle("Display Painting");
    const init = async () => {
      const files = await $.getJSON("data/json/files_v2.json");
      $("#loading").html("Loading files...");
      let previousDivContainer = null;
      files.forEach((file, fileIndex) => {
        if (file != null && !Array.isArray(file)) {
          const tabId = `${fileIndex}`;
          const jButton = $(`<button class="tablinks">${tabId}</button>`);
          let currentDivContainer = null;
          jButton.click(async () => {
            if (currentDivContainer === null) {
              currentDivContainer = await displayPainting(file);
            }
            if (previousDivContainer !== currentDivContainer) {
              if (previousDivContainer !== null) {
                previousDivContainer.remove();
              }
              currentDivContainer.appendTo("body");
              previousDivContainer = currentDivContainer;
            }
          });
          jButton.appendTo(this.tabDiv.nativeElement);
        }
      });
      $("#loading").hide();
    };
    init();
  }
}
