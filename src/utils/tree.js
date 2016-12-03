import fs from 'co-fs'
import { join, sep } from 'path'

export default function *tree(path) {
    let output = []

    try {
        let config = require(`${path}${sep}package.json`)
        output.push(`${config.name}@${config.version} ${path}`)
    }catch(e) {
        output.push(`${path}`)
    }

    output.push(treeify(yield treeObj(path)))

    return output
}

function *treeObj(path) {
    let result = {}

    for(let item of yield fs.readdir(path)) {
        let tmp = join(path, item)

        if(item[0] === '.') {
            continue
        }

        if((yield fs.lstat(tmp)).isDirectory()) {
            result[item] = yield treeObj(tmp)
        }else {
            result[item] = ''
        }
    }

    return result
}

function treeify(obj) {
    let tree = ''

    growBranch('.', obj, false, [], (line) => {
        tree += `${line}\n`
    })

    return tree
}

function growBranch(key, root, last, lastStates, callback) {
    let line, lastStatesCopy

    line = ''
    lastStatesCopy = lastStates.slice(0)

    if(lastStatesCopy.push([root, last]) && lastStates.length > 0) {
        lastStates.forEach((lastState, index) => {
            if (index > 0) {
                line += (lastState[1] ? ' ' : '│') + ' '
            }
        })

        line += prefix(key, last, Object.keys(root).length !== 0) + key
        callback(line)
    }

    if(typeof root === 'object') {
        keys(root).forEach((item, index, array) => {
            growBranch(item, root[item], ++index === array.length, lastStatesCopy, callback)
        })
    }
}

function prefix(key, last, isDirectory) {
    return (isDirectory ? (last ? '└─┬' : '├─┬') : (last ? '└──' : '├──')) + ' '
}

function keys(obj) {
    return Object.keys(obj).filter((key) => obj.hasOwnProperty(key))
}
