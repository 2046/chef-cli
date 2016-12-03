import fs from 'fs'
import os from 'os'
import co from 'co'
import rc from './utils/rc'
import { parse } from 'path'
import request from 'request'
import defs from './utils/defs'
import Progress from 'progress'
import tree from './utils/tree'
import output from './utils/output'
import { mkdir, exists, unzip, rmdir, rm, cp } from './utils/fs'

export function *completion(templateName) {
    let path, vars, url, zip

    path = `${defs.defaults.pkgPath}/${templateName}`
    vars = Object.assign({}, defs.defaults, rc('chef').data)
    url = `${vars.registry}${templateName}/archive/master.zip`

    if(!templateName) {
        output(['ERROR: install operator must be enter template parameters', ''])
    }

    try {
        zip = yield download(url)
    }catch(err) {
        output([err, ''])
    }

    yield generate(zip, path)
    output(yield tree(path))
}

function *download(url, again) {
    return new Promise((resolve, reject) => {
        request(url).on('response', (res) => {
            let total, progress, dest

            total = parseInt(res.headers['content-length'], 10)
            dest = `${os.tmpdir()}/${Date.now()}${parse(url).ext}`

            if(isNaN(total)){
                if(again) {
                    reject('can not find the remote file')
                }else {
                    co(function* (){
                        return yield download(url, true)
                    }).then(resolve, reject)
                }

                return
            }

            progress = new Progress('Downloading... [:bar] :percent :etas', {
                incomplete : ' ',
                total : total,
                clear: true
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

function *generate(zip, dest) {
    let src, info

    if(!(yield exists(dest))) {
        yield mkdir(dest)
    }

    info = parse(zip)
    src = yield unzip(zip, `${info.dir}/${info.name}`)
    src = `${src}/${parse(dest).base}-master`

    yield cp(src, dest)
    yield rmdir(src)
    yield rm(zip)

    return dest
}
