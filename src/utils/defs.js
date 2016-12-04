import fs from 'fs'
import { sep } from 'path'
import config from '../../package'

let alias, operators, defaults, win, home

win = process.platform === 'win32'
home = win ? process.env.USERPROFILE : process.env.HOME

alias = {
    'h': 'help',
    'ls': 'list',
    'c': 'config',
    'i': 'install',
    'v': 'version',
    '-v': 'version'
}

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
}

defaults = {
    homePath: home,
    name: config.name,
    version: config.version,
    pkgPath: `${home}${sep}.chef`,
    registry: 'https://github.com/chef-template/'
}

if(!fs.existsSync(defaults.pkgPath)) {
    fs.mkdirSync(defaults.pkgPath)
}

export default {
    alias,
    defaults,
    operators
}
