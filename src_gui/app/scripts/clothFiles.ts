import * as $ from "jquery";
let privateClothFiles: {
  fileListProcess?: any;
  callbackList?: any;
  fileListCache?: any;
};
export const clothFiles = callback => {
  // get paintings
  if (privateClothFiles == null) {
    privateClothFiles = {};
  }
  if (privateClothFiles.fileListProcess == null) {
    privateClothFiles.fileListProcess = 0;
    privateClothFiles.callbackList = [];
    privateClothFiles.callbackList.push(callback);
    $.getJSON("data/json/files.json", fileList => {
      privateClothFiles.fileListCache = fileList;
      privateClothFiles.fileListProcess = -1;
      const callbackListBackup = privateClothFiles.callbackList;
      privateClothFiles.callbackList = [];
      callbackListBackup.forEach(fnc => {
        fnc(fileList);
      });
    });
  } else if (privateClothFiles.fileListProcess === 0) {
    privateClothFiles.callbackList.push(callback);
  } else if (privateClothFiles.fileListProcess === 1) {
    callback(privateClothFiles.fileListCache);
  } else {
    console.error("ClothFile unknown state", privateClothFiles);
  }
};
