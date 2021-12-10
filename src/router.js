var _router = require('ruta3')
var Home = require('./view/home')
var Feed = require('./view/feed')
var PUB_URL = 'https://pub2.onrender.com'

function Router () {
    var router = _router()

    router.addRoute('/', () => {
        return { view: Home }
    })

    router.addRoute('/feed/:username', ({ params }) => {
        var { username } = params

        // console.log('username', username)

        function getFeed () {
            return fetch(PUB_URL + '/feed/' + username)
                .then(res => res.ok ? res.json() : res.text())
        }

        return { view: Feed, getContent: getFeed }
    })

    return router
}

module.exports = Router
