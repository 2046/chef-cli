'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _package = require('../../package');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let alias, operators, defaults, win, home;

win = process.platform === 'win32';
home = win ? process.env.USERPROFILE : process.env.HOME;

alias = {
    'h': 'help',
    'ls': 'list',
    'c': 'config',
    'i': 'install',
    'v': 'version',
    '-v': 'version'
};

operators = {
    'list': './list',
    'init': './init',
    'help': './help',
    'clear': './clear',
    'config': './config',
    'version': './version',
    'install': './install',
    'outdate': './outdate',
    'uninstall': './uninstall'
};

defaults = {
    homePath: home,
    name: _package2.default.name,
    version: _package2.default.version,
    pkgPath: `${ home }${ _path.sep }.chef`,
    registry: 'https://github.com/chef-template/'
};

if (!_fs2.default.existsSync(defaults.pkgPath)) {
    _fs2.default.mkdirSync(defaults.pkgPath);
}

exports.default = {
    alias,
    defaults,
    operators
};