import { sep } from 'path'
import defs from './utils/defs'
import tree from './utils/tree'
import output from './utils/output'
import { isEmpty } from './utils/fs'

export function* completion(templateName) {
    let path = templateName ? `${defs.defaults.pkgPath}${sep}${templateName}` : defs.defaults.pkgPath

    if (!(yield isEmpty(path))) {
        output(yield tree(path))
    }
}
