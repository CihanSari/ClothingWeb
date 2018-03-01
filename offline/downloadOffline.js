var http = require('http');
var fs = require('fs');
var path = require('path')
const download = require('image-downloader')

async function downloadFile(url) {
    return await new Promise((resolve, reject) => {
        http.get(url, function (res) {
            let body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(body);
            });
        }).on('error', function (e) {
            reject(e);
        });
    })
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    console.log(`Ensure directory: ${filePath} => ${dirname}`);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

async function downloadFileToDisk(relativePath, notLogDownload) {
    if (relativePath == null) {
        return null;
    }
    ensureDirectoryExistence(relativePath);
    try {
        const fileContent = await downloadFile(`http://cihansari.com/${relativePath}`);
        fs.writeFileSync(relativePath, fileContent);
        if (!notLogDownload) {
            console.log(`Downloaded file ${relativePath} successfully.`);
        }
        return fileContent;
    } catch (ex) {
        console.log(ex);
        process.abort();
    }
}

async function downloadImage(relativePath, notLogDownload) {
    if (relativePath == null) {
        return null;
    }
    ensureDirectoryExistence(relativePath);
    try {
        await new Promise((resolve, reject) => {
            http.get(`http://cihansari.com/${relativePath}`, function (response) {
                response.setEncoding('ascii');
                response.pipe(fs.createWriteStream(relativePath)).on('finish', () => {
                    resolve();
                });
            });
        });
        if (!notLogDownload) {
            console.log(`Downloaded file ${relativePath} successfully.`);
        }
    } catch (ex) {
        console.log(ex);
        process.abort();
    }
}

function downloadDataToDisk(relativePath, notLogDownload) {
    return downloadFileToDisk('data/json/' + relativePath, notLogDownload);
}

async function downloadOfflineClothingBrowser() {
    console.log('Started.');
    console.log('Downloading file list.');
    const filesV2 = JSON.parse(await downloadDataToDisk('files_v2.json', false));
    const filesCount = filesV2.length;
    const filesPromises = [];
    for (let idx = 0; idx < filesCount; idx += 1) {
        const content = filesV2[idx];
        if (content == null) {
            continue;
        }
        const filePromises = [];
        filePromises.push(downloadDataToDisk(content.grabcut2));
        filePromises.push(downloadDataToDisk(content.grabcut));
        filePromises.push(downloadDataToDisk(content.imofaColor));
        filePromises.push(downloadDataToDisk(content.imofa2Color));
        const json2Content = await downloadDataToDisk(content.json2);
        const json2 = JSON.parse(json2Content);
        const imagePath = `data/jpg/${json2.Filename}`;
        ensureDirectoryExistence(imagePath);
        filePromises.push(download.image({
            url: 'http://cihansari.com/' + imagePath,
            dest: imagePath
        }));
        try {
        await Promise.all(filePromises);
        }
        catch (ex) {
            console.error(ex);
            process.abort();
        }
    }
    downloadFileToDisk(`index.html`);
    downloadFileToDisk(`displayPainting.html`);
    downloadFileToDisk(`trend.html`);
    downloadFileToDisk(`resources/icons/clothingfork.ico`);
    downloadFileToDisk(`resources/css/clothing.css`);
    downloadFileToDisk(`js/displayPainting.js`);
    downloadFileToDisk(`js/common.js`);
    downloadFileToDisk(`js/clothProgressBar.js`);
    downloadFileToDisk(`js/prepareCanvas.js`);
    downloadFileToDisk(`js/clothCanvas.js`);
    downloadFileToDisk(`js/clothFiles.js`);
    downloadFileToDisk(`js/dominantImofaColor.js`);
    downloadFileToDisk(`js/trend.js`);
}

downloadOfflineClothingBrowser();