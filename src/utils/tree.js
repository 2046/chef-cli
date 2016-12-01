import fs from 'co-fs'
import { join } from 'path'
import treeify from 'treeify'

export default function *tree(path) {
    let config = require(`${path}/package.json`)

    return [
        `${config.name}@${config.version} ${path}`,
        treeify.asTree(yield treeObj(path)),
    ]
}

function *treeObj(path) {
    let result = {}

    for(let item of yield fs.readdir(path)) {
        let tmp = join(path, item)

        if((yield fs.lstat(tmp)).isDirectory()) {
            result[item] = yield treeObj(tmp)
        }else {
            result[item] = {}
        }
    }

    return result
}
