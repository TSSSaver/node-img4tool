"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var shell_escape_1 = __importDefault(require("shell-escape"));
var default_1 = /** @class */ (function () {
    function default_1(options) {
        if (!fs_1.existsSync(options.bin))
            throw new Error(options.bin + " doesn't exist!");
        if (!fs_1.existsSync(options.bmPath))
            throw new Error(options.bmPath + " doesn't exist");
        this.bin = options.bin;
        this.bmPath = options.bmPath;
    }
    default_1.prototype.dumpAllInfo = function (filePath, iOSInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var printAllData, verifyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.printAll(filePath).catch(function (e) {
                            throw e;
                        })];
                    case 1:
                        printAllData = _a.sent();
                        return [4 /*yield*/, this.verify(filePath, iOSInfo).catch(function (e) {
                                throw e;
                            })];
                    case 2:
                        verifyData = _a.sent();
                        return [2 /*return*/, __assign({}, verifyData, { tags: printAllData })];
                }
            });
        });
    };
    default_1.prototype.printAll = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var args, result, input, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            '-a',
                            '-s',
                            filePath,
                        ];
                        return [4 /*yield*/, exec(this.bin, args)
                                .catch(function (e) {
                                throw e;
                            })];
                    case 1:
                        result = _a.sent();
                        if (result.stdout.match(/\[Error\] reading file failed/g) !== null) {
                            throw new Error("File either doesn't exist or is not an SHSH2 file.");
                        }
                        input = result.stdout.split('\n\n').slice(1).filter(Boolean);
                        obj = {};
                        input.forEach(function (data, i) {
                            var lines = data.split('\n');
                            lines = lines.filter(Boolean);
                            var tagName = /([\w]{4}): [\w]{4}: ------------------------------/g.exec(lines[0]);
                            if (tagName === null)
                                return;
                            obj[tagName[1]] = {};
                            lines.slice(1).forEach(function (line) {
                                var stuff = /^([\w]{4}): [\w]{4}: ([\w]+)$/gm.exec(line);
                                if (stuff === null)
                                    return;
                                obj[tagName[1]][stuff[1]] = stuff[2];
                            });
                        });
                        return [2 /*return*/, obj];
                }
            });
        });
    };
    default_1.prototype.verify = function (filePath, iOSInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var bm, args, result, stdout, nonce, snon, srvn, ecid, generator, buildNumber, buildTrain, boardConfig, restoreBehavior, variant, valid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bm = this.bmPath + "/" + iOSInfo.deviceId + "/" + iOSInfo.version + "/" + iOSInfo.buildId;
                        args = [
                            '-v',
                            bm + "/BuildManifest.plist",
                            '-s',
                            filePath,
                        ];
                        return [4 /*yield*/, exec(this.bin, args)
                                .catch(function (e) {
                                throw e;
                            })];
                    case 1:
                        result = _a.sent();
                        stdout = result.stdout;
                        if (stdout.match(/\[Error\] main: failed to read buildmanifest from/g) !== null) {
                            throw new Error("Build Manifest doesn't exist.");
                        }
                        if (stdout.match(/\[Error\] reading file failed/g) !== null) {
                            throw new Error("File either doesn't exist or is not an SHSH2 file.");
                        }
                        nonce = getMatch(/^BNCH: BNCH: ([a-f0-9]+)$/gm, stdout);
                        snon = getMatch(/^snon: snon: ([a-f0-9]+)$/gm, stdout);
                        srvn = getMatch(/^srvn: srvn: ([a-f0-9]+)$/gm, stdout);
                        ecid = getMatch(/^ECID: ECID: ([0-9]+)$/gm, stdout);
                        generator = getMatch(/\[OK\] verified generator "([0-9a-fx]+)"/gm, stdout);
                        buildNumber = getMatch(/^BuildNumber : ([0-9A-F]+)$/gm, stdout);
                        buildTrain = getMatch(/^BuildTrain : ([A-Za-z]+)$/gm, stdout);
                        boardConfig = getMatch(/^DeviceClass : ([A-Za-z0-9]+)$/gm, stdout);
                        restoreBehavior = getMatch(/^RestoreBehavior : ([A-Za-z]+)$/gm, stdout);
                        variant = getMatch(/^Variant : (.+)$/gm, stdout);
                        valid = stdout.match(/\[IMG4TOOL\] file is valid!/g) !== null;
                        return [2 /*return*/, {
                                nonce: nonce,
                                snon: snon,
                                srvn: srvn,
                                generator: generator,
                                buildNumber: buildNumber,
                                buildTrain: buildTrain,
                                boardConfig: boardConfig,
                                restoreBehavior: restoreBehavior,
                                variant: variant,
                                valid: valid,
                                ecidDec: ecid,
                                ecidHex: (+ecid).toString(16).toUpperCase(),
                            }];
                }
            });
        });
    };
    return default_1;
}());
exports.default = default_1;
function exec(bin, argument) {
    var args = shell_escape_1.default(argument);
    var command = bin + " " + args;
    return new Promise(function (resolve, reject) {
        child_process_1.exec(command, function (err, stdout, stderr) {
            if (err)
                reject(err);
            resolve({ stdout: stdout, stderr: stderr });
        });
    });
}
function getMatch(regexp, string) {
    var result = regexp.exec(string);
    return result !== null ? result[1] : '';
}
