async function getJSON(filepath) {
  const basepath = "../data/json/";
  try {
    return await loadJSON(`${basepath}${filepath}`);
  } catch (ex) {
    console.error("Failted to retrieve:", filepath);
    return;
  }
}

const filesPromise = getJSON("files_v2.json");

onmessage = async function (e) {
  await loadFiles(e.data);
};

async function loadFiles(fieldName) {
  fncOneArrived = sendWaitForOne();
  const files = await filesPromise;
  files.forEach((file, idx) => {
    if (file != null && file.length !== 0) {
      getFieldFromFilesIdx(fieldName, files, idx, sendWaitForOne);
    }
  });
  fncOneArrived();
}

async function getFieldFromFilesIdx(fieldName, clothFiles2, idx, genCallback) {
  const fileContent2Promise = getJSON(clothFiles2[idx].json2);
  const fieldContent = getJSON(clothFiles2[idx][fieldName]);
  const callbackForImofaColor = genCallback();
  const colors = await fieldContent;
  callbackForImofaColor();
  const color1 = colors[0];
  if (Array.isArray(color1)) {
    // there are multiple colors
    const promises = [];
    const callbacks = [];
    for (let i = 0; i < colors.length; i += 1) {
      callbacks.push(genCallback());
      promises.push(
        sendContentAsync(fileContent2Promise, idx, colors[i].slice(1, 4))
      );
    }
    await Promise.all(promises);
    callbacks.forEach((callback) => callback());
  } else {
    // There is only one dom color
    const callback = genCallback();
    await sendContentAsync(fileContent2Promise, idx, colors.slice(1, 4));
    callback();
  }
}

async function sendContentAsync(promise, idx, colors) {
  const json2 = await promise;
  postMessage({
    type: 10,
    json2,
    idx,
    colors,
  });
}

// https://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
async function loadJSON(path) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          console.error(path);
          reject(xhr);
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  });
}
