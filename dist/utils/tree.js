'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = tree;

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault(_coFs);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* tree(path) {
    let output = [];

    try {
        let config = require(`${ path }${ _path.sep }package.json`);
        output.push(`${ config.name || (0, _path.parse)(path).base }@${ config.version || '0.0.0' } ${ path }`);
    } catch (e) {
        output.push(`${ path }`);
    }

    output.push(treeify((yield treeObj(path))));

    return output;
}

function* treeObj(path) {
    let result = {};

    for (let item of yield _coFs2.default.readdir(path)) {
        let tmp = (0, _path.join)(path, item);

        if (item[0] === '.') {
            continue;
        }

        if ((yield _coFs2.default.lstat(tmp)).isDirectory()) {
            result[item] = yield treeObj(tmp);
        } else {
            result[item] = '';
        }
    }

    return result;
}

function treeify(obj) {
    let tree = '';

    growBranch('.', obj, false, [], line => {
        tree += `${ line }\n`;
    });

    return tree;
}

function growBranch(key, root, last, lastStates, callback) {
    let line, lastStatesCopy;

    line = '';
    lastStatesCopy = lastStates.slice(0);

    if (lastStatesCopy.push([root, last]) && lastStates.length > 0) {
        lastStates.forEach((lastState, index) => {
            if (index > 0) {
                line += (lastState[1] ? ' ' : '│') + ' ';
            }
        });

        line += prefix(key, last, Object.keys(root).length !== 0) + key;
        callback(line);
    }

    if (typeof root === 'object') {
        keys(root).forEach((item, index, array) => {
            growBranch(item, root[item], ++index === array.length, lastStatesCopy, callback);
        });
    }
}

function prefix(key, last, isDirectory) {
    return (isDirectory ? last ? '└─┬' : '├─┬' : last ? '└──' : '├──') + ' ';
}

function keys(obj) {
    return Object.keys(obj).filter(key => obj.hasOwnProperty(key));
}