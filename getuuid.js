"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWmicUUID = getWmicUUID;
var child_process_1 = require("child_process");
function getWmicUUID() {
    return new Promise(function (resolve, reject) {
        (0, child_process_1.exec)('wmic csproduct get UUID', function (error, stdout, stderr) {
            if (error) {
                reject("Error: ".concat(stderr));
                return;
            }
            var uuid = stdout.split('\n')[1].trim();
            resolve(uuid);
        });
    });
}
