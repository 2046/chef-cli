import defs from './defs'
import request from 'request'
import { parse, sep } from 'path'
import { exists, readFile } from './fs'

export function* getRemoteTag(vars, repo, version = 'latest') {
    var tags, tag, owner, url, gitDownloadUrl

    owner = parse(vars.registry).base
    tags = yield get(`https://api.github.com/repos/${owner}/${repo}/tags`)
    tag = getTag(tags, version)

    return tag ? Object.assign(tag, { zipUrl: `${vars.gitFile}${owner}/${repo}/legacy.zip/${tag.name}` }) : {
        zipUrl: `https://github.com/${owner}/${repo}/archive/${yield getDefaultBranch(vars, repo)}.zip`
    }
}

export function* getLocal(vars, name) {
    let path = `${vars.pkgPath}${sep}${name}${sep}package.json`

    if (yield exists(path)) {
        return { name, version: JSON.parse(yield readFile(path)).version }
    }

    return { name, version: '0.0.0' }
}

export function* getLatest(vars, name) {
    let tagInfo = yield getRemoteTag(vars, name)

    return tagInfo.zipUrl ? { name, version: tagInfo.name, zipUrl: tagInfo.zipUrl } : { name, version: '0.0.0' }
}

function getTag(tags, version) {
    if (version === 'latest') {
        return tags[0]
    }

    for (let tag of tags) {
        if (tag.name === version) {
            return tag
        }
    }

    return
}

function* getDefaultBranch(vars, repo) {
    var repoInfo = yield get(`https://api.github.com/repos/${parse(vars.registry).base}/${repo}`)
    return repoInfo.default_branch
}

function* get(url) {
    return new Promise((resolve, reject) => {
        let options = {
            url,
            json: true,
            method: 'GET',
            headers: {
                'User-Agent': 'chef-cli'
            }
        }

        request(options, (err, response, body) => {
            if (response.statusCode == 200) {
                return resolve(body)
            }

            reject(defs.errors.noFile)
        })
    })
}
