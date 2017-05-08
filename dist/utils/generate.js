'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = generate;

var _path = require('path');

var _fs = require('./fs');

function* generate(zip, dest) {
    let src, info;

    if (yield (0, _fs.exists)(dest)) {
        yield (0, _fs.rmdir)(dest);
    }

    info = (0, _path.parse)(zip);
    src = yield (0, _fs.unzip)(zip, `${info.dir}${_path.sep}${info.name}`);
    src += `${_path.sep}${(yield (0, _fs.readdir)(src))[0]}`;

    yield (0, _fs.mkdir)(dest);
    yield (0, _fs.cp)(src, dest);
    yield (0, _fs.rmdir)(src);
    yield (0, _fs.rm)(zip);

    return dest;
}