import co from 'co'
import { exists, mkdir } from './fs'

let alias, operators, defaults, win, home

win = process.platform === 'win32'
home = win ? process.env.USERPROFILE : process.env.HOME

alias = {
    'h': 'help',
    'ls': 'list',
    'c': 'config',
    'i': 'install',
    'v': 'version'
}

operators = {
    'list': true,
    'config': true,
    'version': true,
    'init': './init',
    'help': './help',
    'outdated': true,
    'uninstall': true,
    'install': './install'
}

defaults = {
    homePath: home,
    pkgPath: `${home}/.chef/`,
    registry: 'https://github.com/2046/'
}

co(function *() {
    if(!(yield exists(defaults.pkgPath))) {
        yield mkdir(defaults.pkgPath)
    }
})

export default {
    alias,
    defaults,
    operators
}
