'use strict';

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

var _check = require('./utils/check');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _co2.default)(function* () {
    let args, operator;

    if (!(0, _check.checkEnv)()) {
        process.exit(1);
    }

    process.title = _package2.default.name;

    args = process.argv.slice(2);
    operator = args.shift();

    if (_defs2.default.alias[operator]) {
        operator = _defs2.default.alias[operator];
    }

    if (!_defs2.default.operators[operator]) {
        operator = 'help';
    }

    yield require(_defs2.default.operators[operator]).completion(...args);
}).catch(err => console.log.bind(console, err));