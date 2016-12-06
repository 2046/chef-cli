import rc from './utils/rc'
import { dirname } from 'path'
import defs from './utils/defs'
import config from '../package'
import output from './utils/output'

let commands = [...Object.keys(defs.alias), ...Object.keys(defs.operators)].filter(key => key[0] !== '-')

export function* completion() {
    output([
        '',
        'Usage: chef-cli <command>',
        '',
        'where <command> is one of:',
        `    ${wrap(commands)}`,
        '',
        'Specify configs in the ini-formatted file:',
        `    ${(yield rc('chef')).path}`,
        '',
        `chef-cli@${config.version} ${dirname(__dirname)}`
    ])
}

function wrap(arr) {
    let out, l, line

    l = 0
    out = ['']
    line = process.stdout.columns

    if (!line) {
        line = 60
    } else {
        line = Math.min(60, Math.max(line - 16, 24))
    }

    arr = arr.sort((a, b) => a < b ? -1 : 1)

    arr.forEach((item) => {
        if (out[l].length + item.length + 2 < line) {
            out[l] += ', ' + item
        } else {
            out[l++] += ','
            out[l] = item
        }
    })

    return out.join('\n    ').substr(2)
}
