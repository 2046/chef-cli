'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _output = require('./utils/output');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* completion(template, dest) {
    (0, _output2.default)([_defs2.default.defaults.version, '']);
}