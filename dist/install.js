'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.completion = completion;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _rc = require('./utils/rc');

var _rc2 = _interopRequireDefault(_rc);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _defs = require('./utils/defs');

var _defs2 = _interopRequireDefault(_defs);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _tree = require('./utils/tree');

var _tree2 = _interopRequireDefault(_tree);

var _path = require('path');

var _output = require('./utils/output');

var _output2 = _interopRequireDefault(_output);

var _check = require('./utils/check');

var _fs3 = require('./utils/fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* completion(templateName) {
    let path, vars, url, zip;

    path = `${ _defs2.default.defaults.pkgPath }${ _path.sep }${ templateName }`;
    vars = Object.assign({}, _defs2.default.defaults, (yield (0, _rc2.default)('chef')).data);

    if ((0, _check.checkGithubUrl)(vars.registry)) {
        url = `${ vars.registry }${ templateName }/archive/master.zip`;
    } else {
        url = `${ vars.registry }${ templateName }.zip`;
    }

    if (!templateName) {
        (0, _output2.default)(['ERROR: install operator must be enter template parameters', '']);
    }

    try {
        zip = yield download(url);
        yield generate(zip, path);
        (0, _output2.default)((yield (0, _tree2.default)(path)));
    } catch (err) {
        (0, _output2.default)([err, '']);
    }
}

function* download(url, again) {
    let spinner = (0, _ora2.default)('Downloading...').start();

    return new Promise((resolve, reject) => {
        (0, _request2.default)(url).on('response', res => {
            let total, progress, dest;

            total = parseInt(res.headers['content-length'], 10);
            dest = `${ _os2.default.tmpdir() }${ _path.sep }${ Date.now() }${ (0, _path.parse)(url).ext }`;

            if (isNaN(total)) {
                spinner.stop();

                if (again) {
                    reject('can not find the remote file');
                } else {
                    (0, _co2.default)(function* () {
                        return yield download(url, true);
                    }).then(resolve, reject);
                }

                return;
            }

            spinner.stop();
            progress = new _progress2.default('Downloading... [:bar] :percent :etas', {
                incomplete: ' ',
                total: total,
                clear: true
            });

            res.on('data', function (chunk) {
                progress.tick(chunk.length);
            }).pipe(_fs2.default.createWriteStream(dest));

            res.on('end', function () {
                progress.tick(progress.total - progress.curr);
                resolve(dest);
            });
        }).on('error', err => {
            spinner.stop();
            reject(err.message);
        });
    });
}

function* generate(zip, dest) {
    let src, info;

    if (!(yield (0, _fs3.exists)(dest))) {
        yield (0, _fs3.mkdir)(dest);
    }

    info = (0, _path.parse)(zip);
    src = yield (0, _fs3.unzip)(zip, `${ info.dir }${ _path.sep }${ info.name }`);
    src = `${ src }${ _path.sep }${ (0, _path.parse)(dest).base }-master`;

    yield (0, _fs3.cp)(src, dest);
    yield (0, _fs3.rmdir)(src);
    yield (0, _fs3.rm)(zip);

    return dest;
}