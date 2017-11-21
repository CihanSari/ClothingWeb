const clothFiles = (callback) => {
    // get paintings
    if (window.clothFiles == null) {
        window.clothFiles = {};
    }
    if (window.clothFiles.fileListProcess == null) {
        window.clothFiles.fileListProcess = 0;
        window.clothFiles.callbackList = [];
        window.clothFiles.callbackList.push(callback);
        $.getJSON('data/json/files.json', fileList => {
            window.clothFiles.fileListCache = fileList;
            window.clothFiles.fileListProcess = -1;
            const callbackListBackup = window.clothFiles.callbackList;
            window.clothFiles.callbackList = [];
            callbackListBackup.forEach(fnc => {
                fnc(fileList);
            });
        });
    }
    else if (window.clothFiles.fileListProcess === 0) {
        window.clothFiles.callbackList.push(callback);
    }
    else if (window.clothFiles.filesListProcess === 1) {
        callback(window.clothFiles.fileListCache);
    }
    else {
        console.error('ClothFile unknown state', window.clothFiles);
    }
};