import fs from 'co-fs'
import rc from './utils/rc'
import { parse } from 'path'
import request from 'request'
import defs from './utils/defs'
import table from './utils/table'
import { exists } from './utils/fs'
import output from './utils/output'

export function *completion() {
    let vars, vers, currentVers, latestVers

    latestVers = []
    currentVers = []
    vars = Object.assign({}, defs.defaults, rc('chef').data)

    for(let item of yield fs.readdir(defs.defaults.pkgPath)) {
        let path, url

        path = `${defs.defaults.pkgPath}/${item}/package.json`
        url = `https://raw.githubusercontent.com/${parse(vars.registry).base}/${item}/master/package.json`

        latestVers.push(yield getLatestVersion(url, item))
        currentVers.push(yield getCurrentVersion(path, item))
    }

    [currentVers, latestVers] = yield Promise.all([currentVers, latestVers])
    vers = currentVers.map((item, index) => [item.name, item.version, latestVers[index].version])

    output([table([['template', 'Current', 'Latest'], ...vers], { align: ['l', 'r', 'r']}), ''])
}

function *getCurrentVersion(path, name) {
    if(yield exists(path)) {
        return { name, version: JSON.parse(yield fs.readFile(path)).version }
    }

    return { name, version: '0.0.0' }
}

function *getLatestVersion(url, name) {
    return new Promise((resolve, reject) => {
        request(url).on('response', (res) => {
            let data, total

            data = ''
            total = parseInt(res.headers['content-length'], 10)

            if(isNaN(total) || res.statusCode === 404){
                resolve({ name, version: '0.0.0' })
                return
            }

            res.on('data', function(chunk){
                data += chunk
            })

            res.on('end', function(){
                resolve({ name, version: JSON.parse(data).version })
            })
        }).on('error', (err) => {
            resolve({ name, version: '0.0.0' })
        })
    })
}
