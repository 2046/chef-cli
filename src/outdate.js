import ora from 'ora'
import rc from './utils/rc'
import request from 'request'
import defs from './utils/defs'
import table from './utils/table'
import { parse, sep } from 'path'
import output from './utils/output'
import { getLatest, getLocal } from './utils/tag'
import { exists, isEmpty, readdir } from './utils/fs'
import { checkGithubUrl } from './utils/check'

const spinner = ora('parsing...')

export function* completion() {
    let vars, vers, currentVers, latestVers

    spinner.start()
    latestVers = []
    currentVers = []
    vars = Object.assign({}, defs.defaults, (yield rc('chef')).data)

    if (yield isEmpty(defs.defaults.pkgPath)) {
        spinner.stop()
        process.exit(1)
    }

    for (let item of yield readdir(defs.defaults.pkgPath)) {
        spinner.text = `parsing ${item} template`
        latestVers.push(yield getLatest(vars, item))
        currentVers.push(yield getLocal(vars, item))
    }

    [currentVers, latestVers] = yield Promise.all([currentVers, latestVers])
    vers = currentVers.map((item, index) => [item.name, item.version, latestVers[index].version])

    spinner.stop()
    output([table(
        [['template', 'Current', 'Latest'], ...vers],
        { align: ['l', 'r', 'r'] }
    ), ''])
}
