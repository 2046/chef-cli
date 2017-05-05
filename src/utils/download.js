import co from 'co'
import fs from 'fs'
import os from 'os'
import request from 'request'
import ora from 'ora'
import { sep, parse } from 'path'
import Progress from 'progress'
import defs from './defs'

export default function* download(url, again) {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject(defs.errors.noFile)
            return
        }
        
        let spinner = ora('Downloading...').start()
        
        request(url).on('response', (res) => {
            let total, progress, dest

            total = parseInt(res.headers['content-length'], 10)
            dest = `${os.tmpdir()}${sep}${Date.now()}${parse(url).ext}`

            if (isNaN(total)) {
                spinner.stop()

                if (again) {
                    reject(defs.errors.noFile)
                } else {
                    co(function* () {
                        return yield download(url, true)
                    }).then(resolve, reject)
                }

                return
            }

            spinner.stop()
            progress = new Progress('Downloading... [:bar] :percent :etas', {
                incomplete: ' ',
                total: total,
                clear: true
            })

            res.on('data', function (chunk) {
                progress.tick(chunk.length)
            }).pipe(fs.createWriteStream(dest))

            res.on('end', function () {
                progress.tick(progress.total - progress.curr)
                resolve(dest)
            })
        }).on('error', (err) => {
            spinner.stop()
            reject(err.message)
        })
    })
}
