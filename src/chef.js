import defs from './utils/defs'
import config from '../package'
import output from './utils/output'
import { checkEnv } from './utils/check'

let args, operator

checkEnv()

process.title = config.name

args = process.argv.slice(2)
operator = args.shift()

if(defs.alias[operator]) {
    operator = defs.alias[operator]
}

if(!defs.operators[operator]) {
    operator = 'help'
}

require(defs.operators[operator]).completion(...args)
