import fs from 'fs'
import { readdir } from 'co-fs'
import os from 'os'
import co from 'co'
import ora from 'ora'
import rc from './utils/rc'
import request from 'request'
import defs from './utils/defs'
import Progress from 'progress'
import tree from './utils/tree'
import { parse, sep } from 'path'
import output from './utils/output'
import { checkGithubUrl } from './utils/check'
import { mkdir, exists, unzip, rmdir, rm, cp } from './utils/fs'

const NOT_FIND_FILE = 'can not find the remote file'

export function* completion(templateName) {
    let path, vars, url, zip, owner, version

    if (!templateName) {
        output(['ERROR: install operator must be enter template parameters', ''])
        process.exit(1)
    }

    path = `${defs.defaults.pkgPath}${sep}${templateName}`
    vars = Object.assign({}, defs.defaults, (yield rc('chef')).data)

    try {
        [templateName, version] = templateName.split(vars.versionSep)
        version = version || 'latest'
        
        url = yield getZipUrl(vars, templateName, version)
        zip = yield download(url)
        yield generate(zip, path)
        output(yield tree(path))
    } catch (err) {
        output([err, ''])
    }
}

function* download(url, again) {
    let spinner = ora('Downloading...').start()

    return new Promise((resolve, reject) => {
        request(url).on('response', (res) => {
            let total, progress, dest

            total = parseInt(res.headers['content-length'], 10)
            dest = `${os.tmpdir()}${sep}${Date.now()}${parse(url).ext}`

            if (isNaN(total)) {
                spinner.stop()

                if (again) {
                    reject(NOT_FIND_FILE)
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

function* generate(zip, dest) {
    let src, info

    if (yield exists(dest)) {
        yield rmdir(dest)
    }

    info = parse(zip)
    src = yield unzip(zip, `${info.dir}${sep}${info.name}`)
    src += `${sep}${(yield readdir(src))[0]}`

    yield mkdir(dest)
    yield cp(src, dest)
    yield rmdir(src)
    yield rm(zip)

    return dest
}

function* getZipUrl(vars, templateName, version = 'latest') {
    var tags, tag, owner, url, gitDownloadUrl

    owner = vars.registry.split('/').slice(-2, -1)[0]
    tags = yield get(`https://api.github.com/repos/${owner}/${templateName}/tags`)
    tag = getTag(tags, version)
    
    if (tag.zipball_url) {
        return `${vars.gitFile}${owner}/${templateName}/legacy.zip/${tag.name}`
    } else {
        return Promise.reject(NOT_FIND_FILE)
    }

}

function getTag(tags, v) {
    let tag

    if (v === 'latest') {
        return tags[0]
    }
    for (let i = 0, len = tags.length; i < len; i++) {
        tag = tags[i]
        if (tag.name == v) {
            return tag
        }
    }
    return {}
}

function* get(url) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            json: true,
            url: url,
            headers: {
                'User-Agent': 'chef-cli'
            }
        }, (err, response, body) => {
            if (err) {
                reject(NOT_FIND_FILE)

                return
            } else {
                if (response.statusCode == 200) {
                    resolve(body)
                } else {
                    reject(NOT_FIND_FILE)
                }
            }
        })
    })
}