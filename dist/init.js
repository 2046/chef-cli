'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _output = require('./utils/output');

var _output2 = _interopRequireDefault(_output);

var _path = require('path');

var _fs = require('./utils/fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* completion(template, dest = '.') {
    let path = `${_defs2.default.defaults.pkgPath}${_path.sep}${template}`;

    dest = (0, _path.resolve)((0, _path.join)(process.cwd(), dest));

    if (!(yield (0, _fs.exists)(path))) {
        (0, _output2.default)([`can not find the ${template} template`, '']);
        process.exit(1);
    }

    if ((yield (0, _fs.exists)(dest)) && !(yield (0, _fs.isEmpty)(dest))) {
        if (!(yield (0, _fs.confirm)('Target directory exists. Continue?'))) {
            process.exit(1);
        }
    } else {
        yield (0, _fs.mkdir)(dest);
    }

    yield (0, _fs.cp)(path, dest);
    (0, _output2.default)([`Generated ${dest}`, '']);
}