import * as  AdmZip from 'adm-zip';
import { Router } from "express";
const createAdmZip = require("adm-zip");

export function expressServeZip(archivePath: string) {
    const zip: AdmZip = createAdmZip(archivePath);

    const router = Router();
    router.use((req, res, next) => {
        const compressedFileContentPromise = (filePath => {
            while (filePath.charAt(0) == '/') {
                filePath = filePath.substr(1);
            }
            return new Promise<Buffer>((resolve, reject) => {
                zip.readFileAsync(filePath, (data: Buffer, err: string) => {
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
        })
    });
    return router;
}


