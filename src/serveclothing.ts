import * as express from "express";
import * as path from "path";
const staticZip = require("express-static-zip");

export function serveClothing(app: express.Application, clothingPath: string) {
  app.use(express.static(clothingPath));
  app.use("/data", staticZip(path.join(clothingPath, "data.zip")));
}
