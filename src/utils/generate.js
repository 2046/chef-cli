import { sep, parse } from 'path'
import { cleanTagScript } from './clean'
import { mkdir, exists, unzip, rmdir, rm, cp, readdir } from './fs'

export default function* generate(zip, dest) {
    let src, info

    if (yield exists(dest)) {
        yield rmdir(dest)
    }

    info = parse(zip)
    src = yield unzip(zip, `${info.dir}${sep}${info.name}`)
    src += `${sep}${(yield readdir(src))[0]}`

    yield rm(`${src}${sep}.tag.js`)
    yield cleanTagScript(`${src}${sep}package.json`)
    yield mkdir(dest)
    yield cp(src, dest)
    yield rmdir(src)
    yield rm(zip)

    return dest
}