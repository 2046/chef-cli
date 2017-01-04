'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault(_coFs);

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

var _fs = require('./utils/fs');

var _check = require('./utils/check');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spinner = (0, _ora2.default)('parseing...');

function* completion() {
    let vars, vers, currentVers, latestVers, baseUrl;

    spinner.start();
    latestVers = [];
    currentVers = [];
    vars = Object.assign({}, _defs2.default.defaults, (yield (0, _rc2.default)('chef')).data);

    if (yield (0, _fs.isEmpty)(_defs2.default.defaults.pkgPath)) {
        spinner.stop();
        process.exit(1);
    }

    if ((0, _check.checkGithubUrl)(vars.registry)) {
        baseUrl = `https://raw.githubusercontent.com/${ (0, _path.parse)(vars.registry).base }/`;
    } else {
        baseUrl = `${ vars.registry }`;
    }

    for (let item of yield _coFs2.default.readdir(_defs2.default.defaults.pkgPath)) {
        let path, url;

        path = `${ _defs2.default.defaults.pkgPath }${ _path.sep }${ item }${ _path.sep }package.json`;
        url = (0, _check.checkGithubUrl)(vars.registry) ? `${ baseUrl }${ item }/master/package.json` : `${ baseUrl }${ item }/package.json`;
        latestVers.push((yield getLatestVersion(`${ url }?t=${ Date.now() }`, item)));
        currentVers.push((yield getCurrentVersion(path, item)));
    }

    [currentVers, latestVers] = yield Promise.all([currentVers, latestVers]);
    vers = currentVers.map((item, index) => [item.name, item.version, latestVers[index].version]);

    spinner.stop();
    (0, _output2.default)([(0, _table2.default)([['template', 'Current', 'Latest'], ...vers], { align: ['l', 'r', 'r'] }), '']);
}

function* getCurrentVersion(path, name) {
    if (yield (0, _fs.exists)(path)) {
        return { name, version: JSON.parse((yield _coFs2.default.readFile(path))).version };
    }

    return { name, version: '0.0.0' };
}

function* getLatestVersion(url, name) {
    return new Promise((resolve, reject) => {
        spinner.text = `parseing ${ name } template`;

        (0, _request2.default)(url).on('response', res => {
            let data, total;

            data = '';
            total = parseInt(res.headers['content-length'], 10);

            if (isNaN(total) || res.statusCode === 404) {
                resolve({ name, version: '0.0.0' });
                return;
            }

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                resolve({ name, version: JSON.parse(data).version });
            });
        }).on('error', err => {
            resolve({ name, version: '0.0.0' });
        });
    });
}