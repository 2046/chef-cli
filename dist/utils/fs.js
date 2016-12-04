'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exists = exists;
exports.rm = rm;
exports.mkdir = mkdir;
exports.rmdir = rmdir;
exports.unzip = unzip;
exports.cp = cp;
exports.isEmpty = isEmpty;
exports.confirm = confirm;

var _fs2 = require('fs');

var _fs3 = _interopRequireDefault(_fs2);

var _ncp = require('ncp');

var _ncp2 = _interopRequireDefault(_ncp);

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault(_coFs);

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

function* rmdir(path) {
    if (yield exists(path)) {
        for (let item of yield _coFs2.default.readdir(path)) {
            let tmp = (0, _path.join)(path, item);

            if ((yield _coFs2.default.lstat(tmp)).isDirectory()) {
                yield rmdir(tmp);
            } else {
                yield _coFs2.default.unlink(tmp);
            }
        }

        yield _coFs2.default.rmdir(path);
    }

    return true;
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

function* isEmpty(path) {
    if (!(yield exists(path))) {
        return true;
    }

    if ((yield _coFs2.default.lstat(path)).isDirectory()) {
        let result = [];

        for (let item of yield _coFs2.default.readdir(path)) {
            if (item[0] === '.') {
                continue;
            }

            result.push(item);
        }

        return !result.length;
    } else {
        let data = yield _coFs2.default.readFile(path);

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