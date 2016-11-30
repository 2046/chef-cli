import fs from 'fs'
import os from 'os'
import rc from './utils/rc'
import { parse } from 'path'
import request from 'request'
import defs from './utils/defs'
import Progress from 'progress'
import output from './utils/output'
import { mkdir, exists } from './utils/fs'

export function *completion(templateName) {
    let path, vars, url

    path = `${defs.defaults.pkgPath}${templateName}`
    vars = Object.assign({}, defs.defaults, rc('chef').data)
    url = `${vars.registry}${templateName}/archive/master.zip`

    if(!templateName) {
        output(['ERROR: install operator must be enter template parameters', ''], true)
    }

    if(!(yield exists(path))) {
        yield mkdir(path)
    }

    try {
        yield download(url)
    }catch(err) {
        output([err, ''], true)
    }
}

function *download(url) {
    return new Promise((resolve, reject) => {
        request(url).on('response', (res) => {
            let total, progress, dest

            total = parseInt(res.headers['content-length'], 10)
            dest = `${os.tmpdir()}/${Date.now()}${parse(url).ext}`

            if(isNaN(total)){
                reject('can not find the remote file')
                return
            }

            progress = new Progress('Downloading... [:bar] :percent :etas', {
                complete : '=',
                incomplete : ' ',
                total : total
            })

            res.on('data', function(chunk){
                progress.tick(chunk.length)
            }).pipe(fs.createWriteStream(dest))

            res.on('end', function(){
                progress.tick(progress.total - progress.curr)
                resolve(dest)
            })
        }).on('error', (err) => {
            reject(err.message)
        })
    })
}
