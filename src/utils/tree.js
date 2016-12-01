import npm from 'npm'
import treeify from 'treeify'

function deps(name, cb) {
    return npm.commands.view([name], true, (err, retval) => {
        if (err != null) {
            return cb(err)
        }

        let dependencies = Object.keys(retval[Object.keys(retval)[0]].dependencies)

        return async.parallel(_(dependencies).map(subdeps), function(err, results) {
            return cb(err, _(results).reduce(function(memo, obj) {
                return _(memo).extend(obj)
            }, {}))
        })
    })
}

function npmTree(path, cb) {
    return npm.load(function() {
        return deps(path, cb)
    })
}

export default function(path) {
    npmTree(path, (err, result) => {
        console.log(result)
    })

    console.log(treeify.asTree({
        oranges: {
            mandarin: {
                clementine: {},
                tangerine: {}
            }
        },
        apples: {
            gala: {},
            pink: {}
        }
    }))

    exit && process.exit(1)
}
