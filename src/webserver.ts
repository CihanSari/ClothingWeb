import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import { serveClothing } from "./serveclothing";
const createExpressApplication = require("express");

export class MyWebServer {
  private app = createExpressApplication() as express.Application;
  constructor(readonly port: number) {
    console.log(`Started at port: ${port}`);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // Point static path to dist
    serveClothing(this.app, path.join(__dirname, "../dist/"));
    this.app.use((req: express.Request, res: express.Response) => {
      res.status(404);
      // respond with json
      if (req.accepts("json")) {
        res.send({ error: "Not found" });
      } else {
        // default to plain-text. send()
        res.type("txt").send("Not found");
      }
    });
    this.app.listen(this.port);
  }
}
