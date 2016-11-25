import semver from 'semver'
import config from '../../package'

let currentNode = process.version.replace(/-.*$/, '')

export function checkForUnsupportedNode() {
    if(checkVersion()) {
        console.error(`ERROR: chef-cli is known not to run on Node.js ${currentNode}`)
        console.error(`You'll need to upgrade to a newer version in order to use this`)
        console.error(`version of npm. You can find the latest version at https://nodejs.org/`)
        console.error()
        process.exit(1)
    }
}

function checkVersion(version) {
    return !semver.satisfies(currentNode, config.engines.node)
}
