import fs from 'co-fs'
import { sep } from 'path'
import defs from './utils/defs'
import { rmdir } from './utils/fs'

export function* completion() {
    for (let item of yield fs.readdir(defs.defaults.pkgPath)) {
        yield rmdir(`${defs.defaults.pkgPath}${sep}${item}`)
    }
}
