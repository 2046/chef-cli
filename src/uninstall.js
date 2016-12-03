import fs from 'co-fs'
import defs from './utils/defs'
import { exists, rmdir } from './utils/fs'

export function *completion(templateName) {
    let path = `${defs.defaults.pkgPath}/${templateName}`
    
    if(exists(path)) {
        yield rmdir(path)
    }
}
