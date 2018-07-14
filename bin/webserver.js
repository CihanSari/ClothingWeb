"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const path = __importStar(require("path"));
const serveclothing_1 = require("./serveclothing");
const createExpressApplication = require("express");
class MyWebServer {
    constructor(port) {
        this.port = port;
        this.app = createExpressApplication();
        console.log(`Started at port: ${port}`);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // Point static path to dist
        const clothRoute = serveclothing_1.serveClothing(path.join(__dirname, "../gui/"), path.join(__dirname, "../data.zip"));
        this.app.use(clothRoute);
        this.app.use((req, res) => {
            res.status(404);
            // respond with json
            if (req.accepts("json")) {
                res.send({ error: "Not found" });
            }
            else {
                // default to plain-text. send()
                res.type("txt").send("Not found");
            }
        });
        this.app.listen(this.port);
    }
}
exports.MyWebServer = MyWebServer;
//# sourceMappingURL=webserver.js.map