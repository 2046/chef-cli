import rc from './utils/rc'
import request from 'request'
import defs from './utils/defs'
import tree from './utils/tree'
import tag from './utils/tag'
import { sep } from 'path'
import output from './utils/output'
import download from './utils/download'
import generate from './utils/generate'

export function* completion(repo) {
    let path, vars, zipUrl, zip, version

    if (!repo) {
        output(['ERROR: install operator must be enter template parameters', ''])
        process.exit(1)
    }

    repo = repo.split('@')
    version = repo[1]
    repo = repo[0]
    vars = Object.assign({}, defs.defaults, (yield rc('chef')).data)
    path = `${defs.defaults.pkgPath}${sep}${repo}`
    
    try {
        zipUrl = (yield tag(vars, repo, version)).zipUrl
        zip = yield download(zipUrl)
        yield generate(zip, path)
        output(yield tree(path))
    } catch (err) {
        output([err, ''])
    }
}
