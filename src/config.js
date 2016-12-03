import rc from './utils/rc'
import output from './utils/output'

export function *completion(op, key, val) {
    let vars = (yield rc('chef')).data

    if(op === 'get' && key) {
        output([vars[key], ''])
    }

    if(op === 'set' && key && val) {
        if(key === 'registry' && val[val.length - 1] !== '/') {
            val += '/'
        }

        yield rc('chef', Object.assign({}, { [key]: val }, vars))
    }
}
