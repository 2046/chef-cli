'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _rc = require('./utils/rc');

var _rc2 = _interopRequireDefault(_rc);

var _path = require('path');

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

var _output = require('./utils/output');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let commands = [...Object.keys(_defs2.default.alias), ...Object.keys(_defs2.default.operators)].filter(key => key[0] !== '-');

function* completion() {
    (0, _output2.default)(['', 'Usage: chef-cli <command>', '', 'where <command> is one of:', `    ${wrap(commands)}`, '', 'Specify configs in the ini-formatted file:', `    ${(yield (0, _rc2.default)('chef')).path}`, '', `chef-cli@${_package2.default.version} ${(0, _path.dirname)(__dirname)}`]);
}

function wrap(arr) {
    let out, l, line;

    l = 0;
    out = [''];
    line = process.stdout.columns;

    if (!line) {
        line = 60;
    } else {
        line = Math.min(60, Math.max(line - 16, 24));
    }

    arr = arr.sort((a, b) => a < b ? -1 : 1);

    arr.forEach(item => {
        if (out[l].length + item.length + 2 < line) {
            out[l] += ', ' + item;
        } else {
            out[l++] += ',';
            out[l] = item;
        }
    });

    return out.join('\n    ').substr(2);
}