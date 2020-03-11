"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRaw = function (method, url, data, contentType, responseType, progress) {
    return new Promise(function (res, rej) {
        var upProgress = 0;
        var downProgress = 0;
        var emitProgress = function () { return typeof progress === "function" && progress((upProgress + downProgress) * .5); };
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300)
                res(xhr);
            else
                rej(xhr);
        };
        if (typeof progress === "function") {
            if (xhr.upload)
                xhr.upload.onprogress = function (e) { upProgress = Math.ceil((e.loaded / e.total) * 100); emitProgress(); };
            xhr.onprogress = function (e) { downProgress = Math.ceil((e.loaded / e.total) * 100); emitProgress(); };
        }
        xhr.onerror = function () { return rej(xhr); };
        xhr.open(method, url, true);
        if (contentType)
            xhr.setRequestHeader('Content-Type', contentType);
        if (responseType)
            xhr.setRequestHeader('Response-Type', responseType);
        xhr.send(data);
    });
};
exports.request = function (method, url, data, contentType, responseType, progress) {
    return exports.requestRaw(method, url, data, contentType, responseType, progress)
        .then(function (xhr) { return xhr.response || xhr.responseText; })
        .catch(function (xhr) { return ({ status: xhr.status, statusText: xhr.statusText }); });
};
exports.get = function (url, options) {
    if (options === void 0) { options = {}; }
    return exports.request("GET", url, undefined, options.contentType, options.responseType, options.progress);
};
exports.post = function (url, data, options) {
    if (options === void 0) { options = {}; }
    return exports.request("POST", url, data, options.contentType, options.responseType, options.progress);
};
exports.getJSON = function (url, options) {
    if (options === void 0) { options = {}; }
    return exports.get(url, __assign(__assign({}, options), { contentType: "application/json;charset=UTF-8" })).then(function (x) { return JSON.parse(x); });
};
exports.postJSON = function (url, data, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.post(url, JSON.stringify(data), __assign(__assign({}, options), { contentType: "application/json;charset=UTF-8" }))];
                case 1:
                    r = _a.sent();
                    try {
                        return [2 /*return*/, JSON.parse(r)];
                    }
                    catch (err) {
                        return [2 /*return*/, r];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.postForm = function (url, data, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, exports.post(url, new FormData(data), options)];
    }); });
};
exports.poll = function (url, rate, check) {
    if (rate === void 0) { rate = 200; }
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var done, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    done = false;
                    _a.label = 1;
                case 1:
                    if (!(done === false)) return [3 /*break*/, 7];
                    return [4 /*yield*/, pause(rate)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, exports.getJSON(url)];
                case 4:
                    res = _a.sent();
                    done = check(res);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    reject(err_1);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 1];
                case 7:
                    resolve(res);
                    return [2 /*return*/];
            }
        });
    }); });
};
var pause = function (ms) {
    return new Promise(function (r) { return setTimeout(r, ms); });
};
