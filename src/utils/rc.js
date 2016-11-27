import fs from 'fs'
import ini from 'ini'

let win, home

win = process.platform === 'win32'
home = win ? process.env.USERPROFILE : process.env.HOME

export default function(name, data) {
    let rcPath = `${home}/.${name}rc`

    if(!fs.existsSync(rcPath)) {
        fs.writeFileSync(rcPath, '', 'utf8')
    }

    if(data) {
        fs.writeFileSync(rcPath, serialize(data), 'utf8')
    }

    return {
        path: rcPath,
        data: data ? {} : unserialize(fs.readFileSync(rcPath, 'utf8'))
    }
}

function serialize(data) {
    return ini.stringify(data)
}

function unserialize(data) {
    return ini.parse(data)
}
