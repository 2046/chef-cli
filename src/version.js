import defs from './utils/defs'
import output from './utils/output'

export function *completion(template, dest) {
    output([defs.defaults.version, ''], true)
}
