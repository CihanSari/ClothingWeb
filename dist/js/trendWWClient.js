const fieldName = 'imofa2Color';
const webWorkerMessageTypes = new Map;
async function webWorkerMessage(e) {
  const result = e.data;
  const type = result.type;
  const handler = webWorkerMessageTypes.get(type);
  if (handler) {
    handler(e.data);
  }
  else {
    console.error('Unknown message type: ', e.data);
  }
}

webWorkerMessageTypes.set(10, async (result) => {
  const fileContent2Promise = async () => {
    return result.json2;
  }
  const idx = result.idx;
  const colors = result.colors;
  drawPaintingAsync(fileContent2Promise, idx, colors)
});

async function displayFiles() {
  const fncProgressGenCallback = () => window.clothing.progressBar.fncProgressGenCallback();
  const fncCallbackAfterFiles = fncProgressGenCallback();
}

if (window.Worker) { // Check if Browser supports the Worker api.
  // Requires script name as input
  var myWorker = new Worker("js/trendWW.js");
  myWorker.onmessage=webWorkerMessage;
  myWorker.postMessage(fieldName);
}




// async function displayFiles() {
//     const fncProgressGenCallback = () => window.clothing.progressBar.fncProgressGenCallback();
//     const fncCallbackAfterFiles = fncProgressGenCallback();
//     const files = await clothFiles2();
//     fncCallbackAfterFiles();
//     files.forEach((file, idx) => {
//       if (file!=null) {
//         getImofaFromFilesIdx(files, idx, fncProgressGenCallback);
//       }
//     })
//   }

// const basepath = 'data/json/';
// async function clothFiles2() {
//     return await $.getJSON(`${basepath}files_v2.json`);
// }

// function getJSON(filepath) {
//   return $.getJSON(`${basepath}${filepath}`)
// }

// async function getImofaFromFilesIdx(clothFiles2, idx, genCallback) {
//   const fileContent2Promise = getJSON(clothFiles2[idx].json2);
//   const imofa2Promise = getJSON(clothFiles2[idx].imofa2tfidf);
//   const callbackForImofaColor = genCallback();
//   const colors = await imofa2Promise;
//   callbackForImofaColor();
//   const color1 = colors[0];
//   if ($.isArray(color1)) {
//     // there are multiple colors
//     const promises = [];
//     const callbacks = [];
//     for (let i=0; i<colors.length; i+=1) {
//       callbacks.push(genCallback());
//       promises.push(drawPaintingAsync(fileContent2Promise, idx, colors[i].slice(1,4)));
//     }
//     await Promise.all(promises);
//     callbacks.forEach(callback=>callback());
//   }
//   else {
//     // There is only one dom color
//     const callback = genCallback();
//     await drawPaintingAsync(fileContent2Promise, idx, colors.slice(1,4));
//     callback();
//   }  
// }