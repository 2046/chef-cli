import fs from 'fs'
import config from '../../package'

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
    'config': true,
    'version': true,
    'list': './list',
    'init': './init',
    'help': './help',
    'outdated': true,
    'uninstall': true,
    'install': './install'
}

defaults = {
    homePath: home,
    name: config.name,
    version: config.version,
    pkgPath: `${home}/.chef`,
    registry: 'https://github.com/2046/',
    pkgConfigPath: `${home}/.chef/package.json`
}

if(!fs.existsSync(defaults.pkgPath)) {
    fs.mkdirSync(defaults.pkgPath)
}

export default {
    alias,
    defaults,
    operators
}
