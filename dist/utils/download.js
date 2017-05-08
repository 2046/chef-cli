'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = download;

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _defs = require('./defs');

var _defs2 = _interopRequireDefault(_defs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* download(url, again) {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject(_defs2.default.errors.noFile);
            return;
        }

        let spinner = (0, _ora2.default)('Downloading...').start();

        (0, _request2.default)(url).on('response', res => {
            let total, progress, dest;

            total = parseInt(res.headers['content-length'], 10);
            dest = `${_os2.default.tmpdir()}${_path.sep}${Date.now()}${(0, _path.parse)(url).ext}`;

            if (isNaN(total)) {
                spinner.stop();

                if (again) {
                    reject(_defs2.default.errors.noFile);
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