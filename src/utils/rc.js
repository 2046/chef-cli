import ini from 'ini'
import fs from 'co-fs'
import defs from './defs'

export default function *rc (name, data) {
    let path = `${defs.defaults.homePath}/.${name}rc`

    if(!(yield fs.exists(path))) {
        yield fs.writeFile(path, '', 'utf8')
    }

    if(data) {
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
