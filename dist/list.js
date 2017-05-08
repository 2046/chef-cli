'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _path = require('path');

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _tree = require('./utils/tree');

var _tree2 = _interopRequireDefault(_tree);

var _output = require('./utils/output');

var _output2 = _interopRequireDefault(_output);

var _fs = require('./utils/fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* completion(templateName) {
    let path = templateName ? `${_defs2.default.defaults.pkgPath}${_path.sep}${templateName}` : _defs2.default.defaults.pkgPath;

    if (!(yield (0, _fs.isEmpty)(path))) {
        (0, _output2.default)((yield (0, _tree2.default)(path)));
    }
}