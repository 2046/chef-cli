'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cleanTagScript = cleanTagScript;

var _fs = require('./fs');

var _coFs = require('co-fs');

function* cleanTagScript(path) {
    let json = JSON.parse((yield (0, _fs.readFile)(path, 'utf8')));

    if (json && json.scripts && json.scripts.tag) {
        delete json.scripts.tag;
    }

    if (json && json.scripts && json.scripts['tag:delete']) {
        delete json.scripts['tag:delete'];
    }

    yield (0, _coFs.writeFile)(path, JSON.stringify(json, null, 2), 'utf8');
}