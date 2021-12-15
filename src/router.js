var _router = require('ruta3')
var Home = require('./view/home')
var Feed = require('./view/feed')
var { PUB_URL } = require('./CONSTANTS')
import { html } from 'htm/preact'

function Placeholder (props) {
    return html`<div>placeholding</div>`
}

function Router (state) {
    var router = _router()

    router.addRoute('/', () => {
        return { view: Home }
    })

    router.addRoute('/tag/:tagName', ({ params }) => {
        var tagName = params

        function getTagContent () {
            return fetch(PUB_URL + '/tag/' + tagName)
                .then(res => {
                    // res.text().then(t => console.log('tttt', t))
                    return res.ok ? res.json() : res.text()
                })
        }

        return { view: Placeholder, getContent: getTagContent }
    })

    router.addRoute('/feed/:username', ({ params }) => {
        var { username } = params

        function getFeed () {
            return fetch(PUB_URL + '/feed/' + username)
                .then(res => res.ok ? res.json() : res.text())
        }

        return { view: Feed, getContent: getFeed }
    })

    return router
}

module.exports = Router
