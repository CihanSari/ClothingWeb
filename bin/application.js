"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webserver_1 = require("./webserver");
function main() {
    const lastArg = Number(process.argv[process.argv.length - 1]);
    if (isNaN(lastArg)) {
        new webserver_1.MyWebServer(80);
    }
    else {
        new webserver_1.MyWebServer(lastArg);
    }
}
exports.main = main;
