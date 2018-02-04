async function displayFiles(files) {
    const fncProgressGenCallback = () => window.clothing.progressBar.fncProgressGenCallback();
    const fncCallbackAfterFiles = fncProgressGenCallback();
    const files = await clothFiles2();
    fncCallbackAfterFiles();
    forEach((file, idx) => {
      if (file!=null) {
        getImofaFromFilesIdx(clothFiles, idx, fncProgressGenCallback());
      }
    })
  }

const basepath = 'data/json/';
async function clothFiles2() {
    return await $.getJSON(`${basepath}files_v2.json`);
}

function getJSON(filepath) {
  return $.getJSON(`${basepath}${filepath}`)
}

async function getImofaFromFilesIdx(clothFiles2, idx, callback) {
  const fileContent2Promise = getJSON(clothFiles2[idx].json2);
  const imofa2Promise = getJSON(clothFiles2[idx].imofa2Color);
  return drawPainting(await fileContent2Promise, idx, await imofa2Promise, callback);
}

async function displayClothFiles2(fileContent, idx) {
  drawPainting(fileContent, idx, domColor, callback);
}