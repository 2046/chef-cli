'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (data, options) {
    options = Object.assign({}, {
        align: [],
        stringLength(s) {
            return trim(s).length;
        }
    }, options);

    data[0] = data[0].map(item => underline(item));

    return (0, _textTable2.default)(data, options);
};

var _textTable = require('text-table');

var _textTable2 = _interopRequireDefault(_textTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function underline(s) {
    return `\u001b[4m${ s }\u001b[24m`;
}

function trim(str) {
    return str.replace(new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|' + '\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g'), '');
}