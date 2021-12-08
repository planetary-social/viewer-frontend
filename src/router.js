var _router = require('ruta3')
var Home = require('./view/home')
var PUB_URL = 'https://pub2.onrender.com'

function Router () {
    var router = _router()

    router.addRoute('/', () => {
        return { view: Home }
    })

    router.addRoute('/feed/:feedId', ({ params }) => {
        var { feedId } = params

        console.log('*feed id*', feedId)

        function getFeed () {
            return fetch(PUB_URL + '/feed/' + feedId)
                .then(res => res.text())
        }

        return { view: Home, getContent: getFeed }
    })

    return router
}

module.exports = Router
