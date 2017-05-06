'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _rc = require('./utils/rc');

var _rc2 = _interopRequireDefault(_rc);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _table = require('./utils/table');

var _table2 = _interopRequireDefault(_table);

var _path = require('path');

var _output = require('./utils/output');

var _output2 = _interopRequireDefault(_output);

var _check = require('./utils/check');

var _tag = require('./utils/tag');

var _fs = require('./utils/fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spinner = (0, _ora2.default)('parsing...');

function* completion() {
    let vars, vers, currentVers, latestVers;

    spinner.start();
    latestVers = [];
    currentVers = [];
    vars = Object.assign({}, _defs2.default.defaults, (yield (0, _rc2.default)('chef')).data);

    if (yield (0, _fs.isEmpty)(_defs2.default.defaults.pkgPath)) {
        spinner.stop();
        process.exit(1);
    }

    for (let item of yield (0, _fs.readdir)(_defs2.default.defaults.pkgPath)) {
        spinner.text = `parsing ${item} template`;
        latestVers.push((yield (0, _tag.getLatest)(vars, item)));
        currentVers.push((yield (0, _tag.getLocal)(vars, item)));
    }

    [currentVers, latestVers] = yield Promise.all([currentVers, latestVers]);
    vers = currentVers.map((item, index) => [item.name, item.version, latestVers[index].version]);

    spinner.stop();
    (0, _output2.default)([(0, _table2.default)([['template', 'Current', 'Latest'], ...vers], { align: ['l', 'r', 'r'] }), '']);
}