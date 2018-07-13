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
): handlerInterface[] {
  return [
    {
      path: undefined,
      handler: express.static(clothingPath) as express.Handler
    },
    {
      path: "/data",
      handler: staticZip(path.join(dataPath)) as express.Handler
    },
    {
      handler(req, res, next) {
        if (req.accepts("html")) {
          res.sendFile(path.join(clothingPath, "index.html"));
        } else {
          next();
        }
      }
    }
  ];
}
