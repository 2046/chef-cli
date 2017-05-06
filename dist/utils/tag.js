'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRemoteTag = getRemoteTag;
exports.getLocal = getLocal;
exports.getLatest = getLatest;

var _defs = require('./defs');

var _defs2 = _interopRequireDefault(_defs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _path = require('path');

var _fs = require('./fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* getRemoteTag(vars, repo, version = 'latest') {
    var tags, tag, owner, url, gitDownloadUrl;

    owner = (0, _path.parse)(vars.registry).base;
    tags = yield get(`https://api.github.com/repos/${owner}/${repo}/tags`);
    tag = getTag(tags, version);

    return tag ? Object.assign(tag, { zipUrl: `${vars.gitFile}${owner}/${repo}/legacy.zip/${tag.name}` }) : {};
}

function* getLocal(vars, name) {
    let path = `${vars.pkgPath}${_path.sep}${name}${_path.sep}package.json`;

    if (yield (0, _fs.exists)(path)) {
        return { name, version: JSON.parse((yield (0, _fs.readFile)(path))).version };
    }

    return { name, version: '0.0.0' };
}

function* getLatest(vars, name) {
    let tagInfo = yield getRemoteTag(vars, name);

    return tagInfo.zipUrl ? { name, version: tagInfo.name, zipUrl: tagInfo.zipUrl } : { name, version: '0.0.0' };
}

function getTag(tags, version) {
    if (version === 'latest') {
        return tags[0];
    }

    for (let tag of tags) {
        if (tag.name === version) {
            return tag;
        }
    }

    return;
}

function* get(url) {
    return new Promise((resolve, reject) => {
        let options = {
            url,
            json: true,
            method: 'GET',
            headers: {
                'User-Agent': 'chef-cli'
            }
        };

        (0, _request2.default)(options, (err, response, body) => {
            if (response.statusCode == 200) {
                return resolve(body);
            }

            reject(_defs2.default.errors.noFile);
        });
    });
}