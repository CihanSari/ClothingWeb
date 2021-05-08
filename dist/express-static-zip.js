"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createAdmZip = require("adm-zip");
function expressServeZip(archivePath) {
    const zip = createAdmZip(archivePath);
    const router = express_1.Router();
    router.use((req, res, next) => {
        const compressedFileContentPromise = (filePath => {
            while (filePath.charAt(0) == '/') {
                filePath = filePath.substr(1);
            }
            return new Promise((resolve, reject) => {
                zip.readFileAsync(filePath, (data, err) => {
                    if (err != null) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        })(req.path);
        compressedFileContentPromise.then(buffer => { res.send(buffer); }).catch(ex => {
            console.error(ex);
            next();
        });
    });
    return router;
}
exports.expressServeZip = expressServeZip;
//# sourceMappingURL=express-static-zip.js.map