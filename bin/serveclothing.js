"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const path = __importStar(require("path"));
const staticZip = require("express-static-zip");
function serveClothing(clothingPath, dataPath) {
    const route = express.Router();
    route.use(express.static(clothingPath));
    route.use("/data", staticZip(path.join(dataPath)));
    route.use((req, res, next) => {
        if (req.accepts("html")) {
            res.sendFile(path.join(clothingPath, "index.html"));
        }
        else {
            next();
        }
    });
    return route;
}
exports.serveClothing = serveClothing;
//# sourceMappingURL=serveclothing.js.map