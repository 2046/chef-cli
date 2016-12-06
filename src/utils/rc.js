import ini from 'ini'
import fs from 'co-fs'
import defs from './defs'
import { sep } from 'path'
import { exists } from './fs'

export default function* rc(name, data) {
    let path = `${defs.defaults.homePath}${sep}.${name}rc`

    if (!(yield exists(path))) {
        yield fs.writeFile(path, '', 'utf8')
    }

    if (data) {
        yield fs.writeFile(path, serialize(data), 'utf8')
    }

    return {
        path,
        data: data ? {} : unserialize(yield fs.readFile(path, 'utf8'))
    }
}

function serialize(data) {
    return ini.stringify(data)
}

function unserialize(data) {
    return ini.parse(data)
}
