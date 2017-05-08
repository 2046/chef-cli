'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault(_coFs);

var _path = require('path');

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _fs = require('./utils/fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* completion(templateName) {
    yield (0, _fs.rmdir)(`${_defs2.default.defaults.pkgPath}${_path.sep}${templateName}`);
}