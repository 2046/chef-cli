'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _path = require('path');

var _rc = require('./utils/rc');

var _rc2 = _interopRequireDefault(_rc);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _tree = require('./utils/tree');

var _tree2 = _interopRequireDefault(_tree);

var _output = require('./utils/output');

var _output2 = _interopRequireDefault(_output);

var _download = require('./utils/download');

var _download2 = _interopRequireDefault(_download);

var _generate = require('./utils/generate');

var _generate2 = _interopRequireDefault(_generate);

var _tag = require('./utils/tag');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* completion(repo) {
    let vars, currentVer, latestVer, spinner, path, zip;

    if (!repo) {
        (0, _output2.default)(['ERROR: update repo must be enter template parameters', '']);
        process.exit(1);
    }

    vars = Object.assign({}, _defs2.default.defaults, (yield (0, _rc2.default)('chef')).data);
    path = `${_defs2.default.defaults.pkgPath}${_path.sep}${repo}`;
    currentVer = yield (0, _tag.getLocal)(vars, repo);

    if (currentVer.version == '0.0.0') {
        return;
    }

    try {
        latestVer = yield (0, _tag.getLatest)(vars, repo);

        if (latestVer.version == currentVer.version) {
            return;
        }

        spinner = (0, _ora2.default)('updating...');
        zip = yield (0, _download2.default)(latestVer.zipUrl);
        yield (0, _generate2.default)(zip, path);
        (0, _output2.default)((yield (0, _tree2.default)(path)));
        spinner.stop();
    } catch (err) {
        (0, _output2.default)([err, '']);
    }
}