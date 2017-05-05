import { parse } from 'path'
import request from 'request'

export default function* tag(vars, templateName, version = 'latest') {
    var tags, tag, owner, url, gitDownloadUrl

    owner = parse(vars.registry).base
    tags = yield get(`https://api.github.com/repos/${owner}/${templateName}/tags`)
    tag = getTag(tags, version)

    if (tag.zipball_url) {
        return Object.assign(
            tag,
            { zipUrl: `${vars.gitFile}${owner}/${templateName}/legacy.zip/${tag.name}` }
        )
    } else {
        return Promise.reject('can not find the remote file')
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