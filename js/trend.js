async function displayFiles() {
    const fncProgressGenCallback = () => window.clothing.progressBar.fncProgressGenCallback();
    const fncCallbackAfterFiles = fncProgressGenCallback();
    const files = await clothFiles2();
    fncCallbackAfterFiles();
    files.forEach((file, idx) => {
      if (file!=null) {
        getImofaFromFilesIdx(files, idx, fncProgressGenCallback);
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

async function getImofaFromFilesIdx(clothFiles2, idx, genCallback) {
  const fileContent2Promise = getJSON(clothFiles2[idx].json2);
  const imofa2Promise = getJSON(clothFiles2[idx].imofa2Color);
  const callbackForImofaColor = genCallback();
  const imofa2Color = await imofa2Promise;
  callbackForImofaColor();
  const color1 = imofa2Color[0];
  if ($.isArray(color1)) {
    // there are multiple colors
    const promises = [];
    const callbacks = [];
    for (let i=0; i<imofa2Color.length; i+=1) {
      callbacks.push(genCallback());
      promises.push(drawPaintingAsync(fileContent2Promise, idx, imofa2Color[i].slice(1,4)));
    }
    await Promise.all(promises);
    callbacks.forEach(callback=>callback());
  }
  else {
    // There is only one dom color
    const callback = genCallback();
    await drawPaintingAsync(fileContent2Promise, idx, imofa2Color.slice(1,4));
    callback();
  }  
}