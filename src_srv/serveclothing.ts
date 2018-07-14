import * as express from "express";
import * as path from "path";
import { RequestHandler } from "express";
const staticZip = require("express-static-zip");

export interface handlerInterface {
  path?: string;
  handler: RequestHandler;
}

export function serveClothing(
  clothingPath: string,
  dataPath: string
): express.Router {
  const route = express.Router();
  route.use(express.static(clothingPath));
  route.use("/data", staticZip(path.join(dataPath)));
  route.use((req, res, next) => {
    if (req.accepts("html")) {
      res.sendFile(path.join(clothingPath, "index.html"));
    } else {
      next();
    }
  });
  return route;
}
