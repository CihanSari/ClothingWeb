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
const staticZip = require("express-static-zip");
function serveClothing(app, clothingPath) {
    app.use(express.static(clothingPath));
    app.use("/data", staticZip(path.join(clothingPath, "data.zip")));
}
exports.serveClothing = serveClothing;
