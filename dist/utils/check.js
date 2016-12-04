'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkEnv = checkEnv;
exports.checkGithubUrl = checkGithubUrl;

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _output = require('./output');

var _output2 = _interopRequireDefault(_output);

var _package = require('../../package');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let currentNode = process.version.replace(/-.*$/, '');

function checkEnv() {
    if (checkVersion()) {
        (0, _output2.default)([`ERROR: chef-cli is known not to run on Node.js ${ currentNode }`, `You'll need to upgrade to a newer version in order to use this`, 'version of npm. You can find the latest version at https://nodejs.org/', '']);

        return false;
    }

    return true;
}

function checkGithubUrl(url) {
    return url.indexOf('github.com') !== -1;
}

function checkVersion(version) {
    return !_semver2.default.satisfies(currentNode, _package2.default.engines.node);
}