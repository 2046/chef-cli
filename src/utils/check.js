import semver from 'semver'
import output from './output'
import config from '../../package'

let currentNode = process.version.replace(/-.*$/, '')

export function checkEnv() {
    if (checkVersion()) {
        output([
            `ERROR: chef-cli is known not to run on Node.js ${currentNode}`,
            `You'll need to upgrade to a newer version in order to use this`,
            'version of npm. You can find the latest version at https://nodejs.org/',
            ''
        ])

        return false
    }

    return true
}

export function checkGithubUrl(url) {
    return url.indexOf('github.com') !== -1
}

function checkVersion(version) {
    return !semver.satisfies(currentNode, config.engines.node)
}
