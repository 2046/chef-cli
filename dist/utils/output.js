'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (text) {
    text = text.map((item, index) => {
        return text.length - 1 === index ? item : `${ item }\n`;
    }).join('');

    console.log(text);
};