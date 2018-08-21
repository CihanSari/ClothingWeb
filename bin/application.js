"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webserver_1 = require("./webserver");
function main() {
    const lastArg = Number(process.argv[process.argv.length - 1]);
    if (isNaN(lastArg)) {
        const PORT = Number(process.env.PORT) || 80;
        new webserver_1.MyWebServer(PORT);
    }
    else {
        new webserver_1.MyWebServer(lastArg);
    }
}
exports.main = main;
//# sourceMappingURL=application.js.map