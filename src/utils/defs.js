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
    'install': true,
    'version': true,
    'help': './help',
    'outdated': true,
    'uninstall': true
}

export default {
    alias,
    operators
}
