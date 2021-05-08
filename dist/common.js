"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const PORT = process.env.PORT || 8080;
exports.PORT = PORT;
const DIST_FOLDER = path_1.join(__dirname, 'browser');
exports.DIST_FOLDER = DIST_FOLDER;
const ARCHIVE_PATH = path_1.join(__dirname, '..', 'data.zip');
exports.ARCHIVE_PATH = ARCHIVE_PATH;
//# sourceMappingURL=common.js.map