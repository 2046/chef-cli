'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rc;

var _ini = require('ini');

var _ini2 = _interopRequireDefault(_ini);

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault(_coFs);

var _defs = require('./defs');

var _defs2 = _interopRequireDefault(_defs);

var _path = require('path');

var _fs = require('./fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* rc(name, data) {
    let path = `${ _defs2.default.defaults.homePath }${ _path.sep }.${ name }rc`;

    if (!(yield (0, _fs.exists)(path))) {
        yield _coFs2.default.writeFile(path, '', 'utf8');
    }

    if (data) {
        yield _coFs2.default.writeFile(path, serialize(data), 'utf8');
    }

    return {
        path,
        data: data ? {} : unserialize((yield _coFs2.default.readFile(path, 'utf8')))
    };
}

function serialize(data) {
    return _ini2.default.stringify(data);
}

function unserialize(data) {
    return _ini2.default.parse(data);
}