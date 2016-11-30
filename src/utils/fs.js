import fs from 'fs'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'

export function mkdir(path) {
    return mkdirp.sync(path)
}

export function rmdir(path) {
    return rimraf.sync(path)
}

export function exists(path) {
    return fs.existsSync(path)
}
