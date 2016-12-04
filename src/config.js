import rc from './utils/rc'
import output from './utils/output'

export function *completion(op, key, val) {
    let vars = (yield rc('chef')).data

    if(op === 'get' && key) {
        output([vars[key], ''])
    }

    if(op === 'delete' && key) {
        delete vars[key]
        yield rc('chef', vars)
    }

    if(op === 'list') {
        let list = []

        for(let key of Object.keys(vars)) {
            list.push(`${key} = ${vars[key]}`)
        }

        output([...list, ''])
    }

    if(op === 'set' && key && val) {
        if(key === 'registry' && val[val.length - 1] !== '/') {
            val += '/'
        }

        yield rc('chef', Object.assign({}, vars, { [key]: val }))
    }
}
