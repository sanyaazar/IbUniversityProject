"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var electron_1 = require("electron");
var child_process_1 = require("child_process");
var axios_1 = require("axios");
var fs_1 = require("fs");
var serverProcess;
var currentUser;
function createWindow() {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    setTimeout(function () {
        win.loadURL('http://localhost:3000/auth');
    }, 5000);
    win.on('closed', function () {
        console.log('Window closed. Closing the server.');
        closeServer();
    });
}
function closeServer() {
    if (global.nestServerInstance) {
        global.nestServerInstance.close(function () {
            console.log('NestJS сервер закрыт.');
        });
    }
    (0, child_process_1.exec)('npx kill-port 3000', function (error, stdout, stderr) {
        if (error) {
            console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0441\u0432\u043E\u0431\u043E\u0436\u0434\u0435\u043D\u0438\u0438 \u043F\u043E\u0440\u0442\u0430 3000: ".concat(error.message));
            return;
        }
        if (stderr) {
            console.error("\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435: ".concat(stderr));
            return;
        }
        console.log("\u041F\u043E\u0440\u0442 3000 \u043E\u0441\u0432\u043E\u0431\u043E\u0436\u0434\u0435\u043D: ".concat(stdout));
    });
}
electron_1.ipcMain.handle('open-main-auth', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mainWindow;
    return __generator(this, function (_a) {
        mainWindow = electron_1.BrowserWindow.getAllWindows()[0];
        mainWindow.loadURL('http://localhost:3000/auth');
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.on('open-main-page', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mainWindow;
    return __generator(this, function (_a) {
        mainWindow = electron_1.BrowserWindow.getAllWindows()[0];
        try {
            mainWindow.loadURL('http://localhost:3000');
        }
        catch (error) {
            console.error('Ошибка при загрузке главной страницы:', error);
        }
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.on('open-sign-in', function () {
    var mainWindow = electron_1.BrowserWindow.getAllWindows()[0];
    mainWindow.loadURL('http://localhost:3000/auth/login');
});
electron_1.ipcMain.on('open-sign-up', function () {
    var mainWindow = electron_1.BrowserWindow.getAllWindows()[0];
    mainWindow.loadURL('http://localhost:3000/auth/signup');
});
electron_1.ipcMain.on('open-captcha-verification-page', function () {
    var mainWindow = electron_1.BrowserWindow.getAllWindows()[0];
    mainWindow.loadURL('http://localhost:3000/captcha/page');
});
electron_1.ipcMain.on('open-editor-window', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mainWindow;
    return __generator(this, function (_a) {
        mainWindow = electron_1.BrowserWindow.getAllWindows()[0];
        mainWindow.loadURL('http://localhost:3000/editor/page');
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.handle('get-user-rights-on-file', function (_event, fileName) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post('http://localhost:3000/editor/user-rights', {
                        username: currentUser.username,
                        filename: fileName,
                    })];
            case 1:
                response = _a.sent();
                console.log(response.data);
                return [2 /*return*/, response.data];
            case 2:
                error_1 = _a.sent();
                console.error('Ошибка при получении прав', error_1);
                return [2 /*return*/, 'NONE'];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('generate-captcha', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get('http://localhost:3000/captcha')];
            case 1:
                response = _a.sent();
                event.reply('captcha-generated', { image: response.data.image });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Ошибка при генерации CAPTCHA:', error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('get-file-with-rights', function (_event, fileName) { return __awaiter(void 0, void 0, void 0, function () {
    var response, _a, decryptedContent, rights, hashMismatch, error, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log('in get file get-file-with-rights');
                console.log('filePath: ' + fileName);
                return [4 /*yield*/, axios_1.default.post('http://localhost:3000/editor/file', {
                        username: currentUser.username,
                        filename: fileName,
                    })];
            case 1:
                response = _b.sent();
                _a = response.data, decryptedContent = _a.decryptedContent, rights = _a.rights, hashMismatch = _a.hashMismatch, error = _a.error;
                console.log('Decrypted File:', decryptedContent);
                console.log('Rights:', rights);
                return [2 /*return*/, {
                        content: decryptedContent,
                        rights: rights,
                        hashMismatch: hashMismatch,
                        error: error,
                    }];
            case 2:
                error_3 = _b.sent();
                console.error('Error retrieving file and rights:', error_3.message);
                throw new Error('Failed to load file and rights');
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('decrypt-file', function (_event, filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post('http://localhost:3000/files/decrypt', {
                        filePath: filePath,
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.decryptedContent];
            case 2:
                error_4 = _a.sent();
                console.error('Error during decryption:', error_4);
                throw new Error('Decryption failed');
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('verify-captcha', function (event_1, _a) { return __awaiter(void 0, [event_1, _a], void 0, function (event, _b) {
    var response, error_5;
    var text = _b.text;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post('http://localhost:3000/captcha/verify', {
                        userInput: text,
                    })];
            case 1:
                response = _c.sent();
                event.reply('captcha-verification', { isValid: response.data.isValid });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _c.sent();
                console.error('Ошибка при проверке CAPTCHA:', error_5);
                event.reply('captcha-verification', { error: error_5.response.data });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('sign-up', function (event, userData) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                currentUser = { username: userData.login };
                return [4 /*yield*/, axios_1.default.post('http://localhost:3000/auth/signup', userData)];
            case 1:
                response = _a.sent();
                event.reply('sign-up-response', response.data);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                if (typeof error_6.response.data.message === 'string') {
                    error_6.response.data.message = [error_6.response.data.message];
                }
                console.error(error_6.response);
                event.reply('sign-up-response', { error: error_6.response.data });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('encrypt-file', function (_event, content, fileName) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post('http://localhost:3000/editor/encrypt', {
                        content: content,
                        fileName: fileName,
                        username: currentUser.username,
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.encryptedContent];
            case 2:
                error_7 = _a.sent();
                console.error('Error during encryption:', error_7);
                throw new Error('Encryption failed');
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('login', function (event, userData) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_8, _a, status_1, data, failedAttempts, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                currentUser = { username: userData.username };
                return [4 /*yield*/, axios_1.default.post('http://localhost:3000/auth/login', userData)];
            case 1:
                response = _b.sent();
                event.reply('login-response', response.data);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                if (error_8.response) {
                    _a = error_8.response, status_1 = _a.status, data = _a.data;
                    if (status_1 === 401) {
                        failedAttempts = data.failedAttempts || 0;
                        message = data.message + ". There are ".concat(3 - failedAttempts, " attempts left");
                        event.reply('login-response', {
                            error: {
                                message: [message],
                            },
                        });
                    }
                    else if (status_1 === 429) {
                        event.reply('load-captcha');
                    }
                    else {
                        console.error(error_8.response);
                        event.reply('login-response', { error: data });
                    }
                }
                else {
                    console.error('Ошибка при выполнении запроса:', error_8.message);
                    event.reply('login-response', {
                        error: { message: 'Неизвестная ошибка' },
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('save-file', function (_event, filePath, content) { return __awaiter(void 0, void 0, void 0, function () {
    var error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fs_1.promises.writeFile(filePath, content, 'utf8')];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error saving the file:', error_9);
                throw new Error('File save failed');
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.app.whenReady().then(function () {
    serverProcess = (0, child_process_1.spawn)('npm', ['run', 'start'], { shell: true });
    serverProcess.stdout.on('data', function (data) {
        console.log("NestJS: ".concat(data));
    });
    serverProcess.stderr.on('data', function (data) {
        console.error("NestJS error: ".concat(data));
    });
    serverProcess.on('exit', function (code) {
        console.log("NestJS server exited with code ".concat(code));
        electron_1.app.quit();
    });
    setTimeout(function () {
        createWindow();
    }, 3000);
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', function () {
    closeServer();
});
