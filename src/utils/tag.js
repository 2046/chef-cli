import { parse } from 'path'
import request from 'request'
import defs from './defs'

export default function* tag(vars, repo, version) {
    var tags, tag, owner, url, gitDownloadUrl
    
    version = version || 'latest'
    owner = parse(vars.registry).base
    tags = yield get(`https://api.github.com/repos/${owner}/${repo}/tags`)
    tag = getTag(tags, version)

    return tag.zipball_url
        ? Object.assign(tag, { zipUrl: `${vars.gitFile}${owner}/${repo}/legacy.zip/${tag.name}` })
        : {}
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
                reject(defs.errors.noFile)
                return
            } else {
                response.statusCode == 200 ? resolve(body) : reject(defs.errors.noFile)
            }
        })
    })
}