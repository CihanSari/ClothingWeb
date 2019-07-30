import * as express from "express";
import * as path from "path";
import { DIST_FOLDER, PORT, DATA_FOLDER } from './common';
const createExpressApplication = require("express");

const app: express.Application = createExpressApplication();

// app.get('/api/**', (req, res) => { });

app.use('/data', express.static(DATA_FOLDER, {
  maxAge: '1y'
}));

app.use(express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes fall to angular
app.use((req, res) => {
  // respond with json
  if (req.accepts("html")) {
    res.sendFile(path.join(DIST_FOLDER, "index.html"));
  } else {
    res.status(404);
    if (req.accepts("json")) {
      res.send({ error: "Not found" });
    } else {
      // default to plain-text. send()
      res.type("txt").send("Not found");
    }
  }
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
