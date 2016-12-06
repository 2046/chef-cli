import co from 'co'
import defs from './utils/defs'
import config from '../package'
import { checkEnv } from './utils/check'

co(function* () {
    let args, operator

    if (!checkEnv()) {
        process.exit(1)
    }

    process.title = config.name

    args = process.argv.slice(2)
    operator = args.shift()

    if (defs.alias[operator]) {
        operator = defs.alias[operator]
    }

    if (!defs.operators[operator]) {
        operator = 'help'
    }

    yield require(defs.operators[operator]).completion(...args)

}).catch((err) => console.log.bind(console, err))
