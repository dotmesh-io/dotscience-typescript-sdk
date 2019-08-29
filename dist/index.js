"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
/**
* @Method: Runs a Dotscience command task.
* @Param {string}
* @Return {string}
*/
function dsRun(str) {
    var child = child_process_1.spawn('ls');
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    return "";
}
exports.dsRun = dsRun;
