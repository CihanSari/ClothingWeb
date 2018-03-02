async function displayFiles() {
  const fncProgressGenCallback = () => window.clothing.progressBar.fncProgressGenCallback();
  const fncCallbackAfterFiles = fncProgressGenCallback();
  const files = await clothFiles2();
  fncCallbackAfterFiles();
  files.forEach((file, idx) => {
    if (file != null && !Array.isArray(file)) {
      getFieldFromFilesIdx(files, idx, fncProgressGenCallback);
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

async function getFieldFromFilesIdx(clothFiles2, idx, genCallback) {
  const clothFile2 = clothFiles2[idx];
  const fieldName = window.settings.clustering;
  if (!Object.hasOwnProperty.call(clothFile2, fieldName)) {
    return;
  }
  const fileContent2Promise = getJSON(clothFile2.json2);
  const fieldPromise = getJSON(clothFile2[fieldName]);
  const callbackForField = genCallback();
  const color = await fieldPromise;
  callbackForField();
  const color1 = color[0];
  if ($.isArray(color1)) {
    // there are multiple colors
    const promises = [];
    const callbacks = [];
    for (let i = 0; i < color.length; i += 1) {
      callbacks.push(genCallback());
      promises.push(drawPaintingAsync(fileContent2Promise, idx, color[i].slice(1, 4)));
    }
    await Promise.all(promises);
    callbacks.forEach(callback => callback());
  } else {
    // There is only one dom color
    const callback = genCallback();
    await drawPaintingAsync(fileContent2Promise, idx, color.slice(1, 4));
    callback();
  }
}