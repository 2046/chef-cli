import defs from './utils/defs'
import output from './utils/output'
import { resolve, join, sep } from 'path'
import { exists, mkdir, cp, confirm, isEmpty } from './utils/fs'

export function* completion(template, dest = '.') {
    let path

    dest = resolve(join(process.cwd(), dest))
    path = `${defs.defaults.pkgPath}${sep}${template}`

    if (!(yield exists(path))) {
        output([`can not find the ${template} template`, ''])
        process.exit(1)
    }

    if ((yield exists(dest)) && !(yield isEmpty(dest))) {
        if (!(yield confirm('Target directory exists. Continue?'))) {
            process.exit(1)
        }
    } else {
        yield mkdir(dest)
    }

    yield cp(path, dest)
    output([`Generated ${dest}`, ''])
}
