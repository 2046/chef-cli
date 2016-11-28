import os from 'os'
import fs from 'fs'
import rimraf from 'rimraf'
import request from 'request'
import Progress from 'progress'
import output from './utils/output'
import { parse, resolve, relative } from 'path'

export function completion (templateName) {
    let url, templatePath

    templatePath = `${os.tmpdir()}/chef-template/${templateName}`
    url = `https://github.com/2046/${templateName}/archive/master.zip`

    if(!templateName) {
        output([
            'ERROR: install operator must be enter template parameters',
            ''
        ])

        process.exit(1)
    }

    if(!fs.existsSync(templatePath)) {
        request(url).on('response', (res) => {
            let total, progress, path

            path = parse(url).base
            total = parseInt(res.headers['content-length'], 10)

            if(isNaN(total)){
                console.log('can not find the remote file')
                return
            }

            process.on('exit', function () {
                rimraf.sync(templatePath)
            })

            progress = new Progress('Downloading... [:bar] :percent :etas', {
                complete : '=',
                incomplete : ' ',
                total : total
            })

            res.on('data', function(chunk){
                progress.tick(chunk.length)
            }).pipe(fs.createWriteStream(templatePath))

            res.on('end', function(){
                progress.tick(progress.total - progress.curr)
            })
        })
    }
}
