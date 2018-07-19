"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var default_1 = /** @class */ (function () {
    function default_1(options) {
        if (fs_1.fileExistsSync(options.bin))
            throw new Error(options.bin + " doesn't exist!");
    }
    return default_1;
}());
exports.default = default_1;
