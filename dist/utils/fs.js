'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exists = exists;
exports.rm = rm;
exports.mkdir = mkdir;
exports.readdir = readdir;
exports.rmdir = rmdir;
exports.unzip = unzip;
exports.cp = cp;
exports.readFile = readFile;
exports.isEmpty = isEmpty;
exports.confirm = confirm;

var _fs2 = require('fs');

var _fs3 = _interopRequireDefault(_fs2);

var _ncp = require('ncp');

var _ncp2 = _interopRequireDefault(_ncp);

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault(_coFs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _unzip = require('unzip');

var _unzip2 = _interopRequireDefault(_unzip);

var _path = require('path');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* exists(path) {
    return yield _coFs2.default.exists(path);
}

function* rm(path) {
    if (!(yield exists(path))) {
        return false;
    }

    yield _coFs2.default.unlink(path);
    return true;
}

function* mkdir(path) {
    if (yield exists(path)) {
        return false;
    }

    yield _coFs2.default.mkdir(path);
    return true;
}

function* readdir(path) {
    let result = [];

    for (let item of yield _coFs2.default.readdir(path)) {
        if (item[0] === '.') {
            continue;
        }

        result.push(item);
    }

    return result;
}

function* rmdir(path) {
    return new Promise((resolve, reject) => {
        (0, _rimraf2.default)(path, err => {
            if (err) {
                return reject(false);
            }

            resolve(true);
        });
    });
}

function* unzip(path, dest) {
    return new Promise((resolve, reject) => {
        _fs3.default.createReadStream(path).on('end', () => {
            setTimeout(() => {
                resolve(dest);
            }, 1000);
        }).pipe(_unzip2.default.Extract({ path: dest }));
    });
}

function* cp(path, dest) {
    return new Promise((resolve, reject) => {
        _ncp2.default.ncp(path, dest, function (err) {
            if (err) {
                reject(err);
            }

            resolve(true);
        });
    });
}

function* readFile(path) {
    return yield _coFs2.default.readFile(path);
}

function* isEmpty(path) {
    if (!(yield exists(path))) {
        return true;
    }

    if ((yield _coFs2.default.lstat(path)).isDirectory()) {
        let result = [];

        for (let item of yield readdir(path)) {
            if (item[0] === '.') {
                continue;
            }

            result.push(item);
        }

        return !result.length;
    } else {
        let data = yield readFile(path);

        return !data || !result.length;
    }
}

function* confirm(message) {
    return new Promise((resolve, reject) => {
        _inquirer2.default.prompt([{
            message,
            name: 'ok',
            type: 'confirm'
        }]).then(answers => {
            resolve(answers.ok);
        });
    });
}