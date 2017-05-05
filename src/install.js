import fs from 'fs'
import os from 'os'
import co from 'co'
import ora from 'ora'
import rc from './utils/rc'
import request from 'request'
import defs from './utils/defs'
import Progress from 'progress'
import tree from './utils/tree'
import { readdir } from 'co-fs'
import { parse, sep } from 'path'
import output from './utils/output'
import { checkGithubUrl } from './utils/check'
import { mkdir, exists, unzip, rmdir, rm, cp } from './utils/fs'

const NOT_FIND_FILE = 'can not find the remote file'

export function* completion(templateName) {
    let path, vars, url, zip, version

    if (!templateName) {
        output(['ERROR: install operator must be enter template parameters', ''])
        process.exit(1)
    }

    path = `${defs.defaults.pkgPath}${sep}${templateName}`
    vars = Object.assign({}, defs.defaults, (yield rc('chef')).data)

    try {
        url = yield getDownloadUrl(vars, ...templateName.split('@'))
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

function* getDownloadUrl(vars, repo, version = 'latest') {
    var tags, tag, owner, url

    owner = vars.registry.split('/').slice(-2, -1)[0]
    tags = yield get(`https://api.github.com/repos/${owner}/${repo}/tags`)
    tag = getTag(tags, version)

    tag ? `${vars.gitFile}${owner}/${repo}/legacy.zip/${tag.name}` : ''
}

function getTag(tags, version) {
    if (version === 'latest') {
        return tags[0]
    }

    for (let tag of tags) {
        if (tag.name == version) {
            return tag
        }
    }

    return null
}

function* get(url) {
    return new Promise((resolve, reject) => {
        let options = {
            json: true,
            headers: { 'User-Agent': 'chef-cli' }
        }
        
        request.get(url, options, (err, response, body) => {
            if (err) {
                return reject(NOT_FIND_FILE)
            }
            
            response.statusCode === 200 ? resolve(body) : reject(NOT_FIND_FILE)
        })
    })
}