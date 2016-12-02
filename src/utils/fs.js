import _fs from 'fs'
import ncp from 'ncp'
import fs from 'co-fs'
import extract from 'unzip'
import { join } from 'path'

export function *exists(path) {
    return yield fs.exists(path)
}

export function *rm(path) {
    if(!(yield exists(path))) {
        return false
    }

    yield fs.unlink(path)
    return true
}

export function *mkdir(path) {
    if(yield exists(path)) {
        return false
    }

    yield fs.mkdir(path)
    return true
}

export function *rmdir(path) {
    if(yield fs.exists(path)) {
        for(let item of yield fs.readdir(path)) {
            let tmp = join(path, item)

            if((yield fs.lstat(tmp)).isDirectory()) {
                yield rmdir(tmp)
            }else {
                yield fs.unlink(tmp)
            }
        }

        yield fs.rmdir(path)
    }

    return true
}

export function *unzip(path, dest) {
    return new Promise((resolve, reject) => {
        _fs.createReadStream(path).on('end', () => {
            setTimeout(() => {
                resolve(dest)
            }, 1000)
        }).pipe(extract.Extract({ path: dest }))
    })
}

export function *cp(path, dest) {
    return new Promise((resolve, reject) => {
        ncp.ncp(path, dest, function (err) {
            if(err) {
                reject(err)
            }

            resolve(true)
        })
    })
}

export function *isEmpty(path) {
    if(!exists(path)) {
        return false
    }

    if((yield fs.lstat(path)).isDirectory()) {
        let result = []

        for(let item of yield fs.readdir(path)) {
            if(item[0] === '.') {
                continue
            }

            result.push(item)
        }

        return Boolean(result.length)
    }else {
        let data = yield fs.readFile(path)

        return Boolean(data) || Boolean(data.length)
    }
}
