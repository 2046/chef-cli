import ora from 'ora'
import fs from 'co-fs'
import rc from './utils/rc'
import request from 'request'
import defs from './utils/defs'
import table from './utils/table'
import { parse, sep } from 'path'
import output from './utils/output'
import { exists, isEmpty } from './utils/fs'
import { checkGithubUrl } from './utils/check'

const spinner = ora('parseing...')

export function* completion() {
    let vars, vers, currentVers, latestVers, baseUrl

    spinner.start()
    latestVers = []
    currentVers = []
    vars = Object.assign({}, defs.defaults, (yield rc('chef')).data)

    if (yield isEmpty(defs.defaults.pkgPath)) {
        spinner.stop()
        process.exit(1)
    }

    if (checkGithubUrl(vars.registry)) {
        baseUrl = `https://raw.githubusercontent.com/${parse(vars.registry).base}/`
    } else {
        baseUrl = `${vars.registry}`
    }

    for (let item of yield fs.readdir(defs.defaults.pkgPath)) {
        let path, url

        path = `${defs.defaults.pkgPath}${sep}${item}${sep}package.json`
        url = checkGithubUrl(vars.registry) ? `${baseUrl}${item}/master/package.json` : `${baseUrl}${item}/package.json`
        latestVers.push(yield getLatestVersion(url, item))
        currentVers.push(yield getCurrentVersion(path, item))
    }

    [currentVers, latestVers] = yield Promise.all([currentVers, latestVers])
    vers = currentVers.map((item, index) => [item.name, item.version, latestVers[index].version])

    spinner.stop()
    output([table(
        [['template', 'Current', 'Latest'], ...vers],
        { align: ['l', 'r', 'r'] }
    ), ''])
}

function* getCurrentVersion(path, name) {
    if (yield exists(path)) {
        return { name, version: JSON.parse(yield fs.readFile(path)).version }
    }

    return { name, version: '0.0.0' }
}

function* getLatestVersion(url, name) {
    return new Promise((resolve, reject) => {
        spinner.text = `parseing ${name} template`

        request(url).on('response', (res) => {
            let data, total

            data = ''
            total = parseInt(res.headers['content-length'], 10)

            if (isNaN(total) || res.statusCode === 404) {
                resolve({ name, version: '0.0.0' })
                return
            }

            res.on('data', function (chunk) {
                data += chunk
            })

            res.on('end', function () {
                resolve({ name, version: JSON.parse(data).version })
            })
        }).on('error', (err) => {
            resolve({ name, version: '0.0.0' })
        })
    })
}
