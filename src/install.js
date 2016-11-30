import fs from 'fs'
import rc from './utils/rc'
import request from 'request'
import defs from './utils/defs'
import Progress from 'progress'
import output from './utils/output'
import { mkdir, exists } from './utils/fs'

export function completion (templateName) {
    let path, vars, url

    path = `${defs.defaults.pkgPath}${templateName}`
    vars = Object.assign({}, defs.defaults, rc('chef').data)
    url = `${vars.registry}${templateName}/archive/master.zip`

    if(!templateName) {
        output(['ERROR: install operator must be enter template parameters', ''], true)
    }

    if(!exists(path)) {
        mkdir(path)
    }

    request(url).on('response', (res) => {
        let total, progress

        total = parseInt(res.headers['content-length'], 10)

        if(isNaN(total)){
            output(['can not find the remote file', ''], true)
        }

        progress = new Progress('Downloading... [:bar] :percent :etas', {
            complete : '=',
            incomplete : ' ',
            total : total
        })

        res.on('data', function(chunk){
            progress.tick(chunk.length)
        }).pipe(fs.createWriteStream(`${path}/master.zip`))

        res.on('end', function(){
            progress.tick(progress.total - progress.curr)
        })
    }).on('error', (err) => console.log.bind(console, err))
}
