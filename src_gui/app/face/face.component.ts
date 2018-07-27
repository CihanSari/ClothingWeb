import { Component, OnInit } from "@angular/core";
import * as faceapi from "face-api.js";
import { test } from "../image";
import { resolve } from "../../../node_modules/@types/q";
@Component({
  selector: "app-face",
  templateUrl: "./face.component.html",
  styleUrls: ["./face.component.css"]
})
export class FaceComponent implements OnInit {
  constructor() {
    this.net = new Promise(async (resolve, _) => {
      const res = await fetch("/assets/models/face_landmark_68_model.weights");
      const weights = new Float32Array(await res.arrayBuffer());
      const net = new faceapi.FaceLandmarkNet();
      await net.load(weights);
      resolve(net);
    })
  }
  imgsrc = test;
  private net: Promise<faceapi.FaceLandmarkNet>;
  async ngOnInit() {
    const img =  new Image(); // HTML5 Constructor
    img.src = test;
    await new Promise(resolve => {
      img.onload = () => {
        resolve();
      }
    });
    const faceLandmarks = await (await this.net).detectLandmarks(img);
    // faceapi.drawLandmarks(canvas, faceLandmarks)
    console.log(faceLandmarks);
  }
}
