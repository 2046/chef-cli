import ncp from 'ncp'
import move from 'mv'
import fs from 'co-fs'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import extract from 'unzip'

export function *exists(path) {
    return yield fs.exists(path)
}

export function *mkdir(path) {
    return new Promise((resolve, reject) => {
        mkdirp(path, function (err) {
            if(err) {
                reject(err)
            }

            resolve(true)
        })
    })
}

export function *rmdir(path) {
    return new Promise((resolve, reject) => {
        rimraf(path, function (err) {
            if(err) {
                reject(err)
            }

            resolve(true)
        })
    })
}

export function *unzip(path, dest) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path).on('end', () => {
            setTimeout(() => {
                resolve(dest)
            }, 100)
        }).pipe(extract.Extract({ path: dest }))
    })
}

export function *mv(path, dest) {
    return new Promise((resolve, reject) => {
        move(path, dest, { mkdirp: false }, function (err) {
            if(err) {
                reject(err)
            }

            resolve(true)
        })
    })
}

export function *copy(path, dest) {
    ncp.ncp.limit = 16

    return new Promise((resolve, reject) => {
        ncp.ncp(path, dest, function (err) {
            if(err) {
                reject(err)
            }

            resolve(true)
        })
    })
}
