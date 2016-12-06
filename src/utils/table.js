import table from 'text-table'

export default function (data, options) {
    options = Object.assign({}, {
        align: [],
        stringLength(s) { return trim(s).length }
    }, options)

    data[0] = data[0].map((item) => underline(item))

    return table(data, options)
}

function underline(s) {
    return `\u001b[4m${s}\u001b[24m`
}

function trim(str) {
    return str.replace(new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|' + '\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g'), '')
}
