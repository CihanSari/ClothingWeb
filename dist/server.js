"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const path = __importStar(require("path"));
const common_1 = require("./common");
const express_static_zip_1 = require("./express-static-zip");
const createExpressApplication = require("express");
const app = createExpressApplication();
// app.get('/api/**', (req, res) => { });
app.use('/data', express_static_zip_1.expressServeZip(common_1.ARCHIVE_PATH));
app.use(express.static(common_1.DIST_FOLDER, {
    maxAge: '1y'
}));
// All regular routes fall to angular
app.use((req, res) => {
    // respond with json
    if (req.accepts("html")) {
        res.sendFile(path.join(common_1.DIST_FOLDER, "index.html"));
    }
    else {
        res.status(404);
        if (req.accepts("json")) {
            res.send({ error: "Not found" });
        }
        else {
            // default to plain-text. send()
            res.type("txt").send("Not found");
        }
    }
});
// Start up the Node server
app.listen(common_1.PORT, () => {
    console.log(`Node Express server listening on http://localhost:${common_1.PORT}`);
});
//# sourceMappingURL=server.js.map