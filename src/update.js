import ora from 'ora'
import { sep } from 'path'
import rc from './utils/rc'
import request from 'request'
import defs from './utils/defs'
import tree from './utils/tree'
import output from './utils/output'
import download from './utils/download'
import generate from './utils/generate'
import { getLatest, getLocal } from './utils/tag'

export function* completion(repo) {
    let vars, currentVer, latestVer, spinner, path, zip

    if (!repo) {
        output(['ERROR: update repo must be enter template parameters', ''])
        process.exit(1)
    }
    
    vars = Object.assign({}, defs.defaults, (yield rc('chef')).data)
    path = `${defs.defaults.pkgPath}${sep}${repo}`
    currentVer = yield getLocal(vars, repo)

    if (currentVer.version == '0.0.0') {
        return
    }
        
    try {
        latestVer = yield getLatest(vars, repo)
        
        if(latestVer.version == currentVer.version) {
            return
        } 
        
        spinner = ora('updating...')
        zip = yield download(latestVer.zipUrl)
        yield generate(zip, path)
        output(yield tree(path))
        spinner.stop()
    } catch (err) {
        output([err, ''])
    }
}
