import fs from 'co-fs'
import { sep } from 'path'
import defs from './utils/defs'
import { exists, rmdir } from './utils/fs'

export function *completion(templateName) {
    let path = `${defs.defaults.pkgPath}${sep}${templateName}`

    if(exists(path)) {
        yield rmdir(path)
    }
}
