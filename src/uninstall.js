import fs from 'co-fs'
import { sep } from 'path'
import defs from './utils/defs'
import { exists, rmdir } from './utils/fs'

export function* completion(templateName) {
    [templateName] = templateName.split(defs.versionSep)
    yield rmdir(`${defs.defaults.pkgPath}${sep}${templateName}`)
}
