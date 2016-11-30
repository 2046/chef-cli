import ini from 'ini'
import fs from 'co-fs'
import defs from './defs'

export default function *rc (name, data) {
    let rcPath = `${defs.defaults.homePath}/.${name}rc`

    if(!(yield fs.exists(rcPath))) {
        yield fs.writeFile(rcPath, '', 'utf8')
    }

    if(data) {
        yield fs.writeFile(rcPath, serialize(data), 'utf8')
    }

    return {
        path: rcPath,
        data: data ? {} : unserialize(yield fs.readFile(rcPath, 'utf8'))
    }
}

function serialize(data) {
    return ini.stringify(data)
}

function unserialize(data) {
    return ini.parse(data)
}
