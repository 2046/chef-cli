import { readFile } from './fs'
import { writeFile } from 'co-fs'

export function* cleanTagScript(path) {
    let json = JSON.parse(yield readFile(path, 'utf8'))

    if (json && json.scripts && json.scripts.tag) {
        delete json.scripts.tag
    }

    if (json && json.scripts && json.scripts['tag:delete']) {
        delete json.scripts['tag:delete']
    }

    yield writeFile(path, JSON.stringify(json, null, 2), 'utf8')
}