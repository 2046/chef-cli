import defs from './utils/defs'
import tree from './utils/tree'
import output from './utils/output'
import { isEmpty } from './utils/fs'

export function *completion() {
    if(yield isEmpty(defs.defaults.pkgPath)) {
        output([
            `${defs.defaults.name}@${defs.defaults.version} ${defs.defaults.pkgPath}`,
            ...yield tree(defs.defaults.pkgPath)
        ], true)
    }
}
