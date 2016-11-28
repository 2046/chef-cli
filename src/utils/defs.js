let alias, operators

alias = {
    'h': 'help',
    'ls': 'list',
    'c': 'config',
    'i': 'install',
    'v': 'version'
}

operators = {
    'list': true,
    'init': true,
    'config': true,
    'version': true,
    'help': './help',
    'outdated': true,
    'uninstall': true,
    'install': './install'
}

export default {
    alias,
    operators
}
