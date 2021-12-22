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
                    return res.ok ? res.json() : res.text()
                })
        }

        return { view: Placeholder, getContent: getTagContent }
    })

    router.addRoute('/feed/:username', ({ params }) => {
        var { username } = params

        // can set state in here, b/c this is just a static route matching
        // file. Don't need any browser APIs

        // that way we can automate tests by just doing
        // emit(evs.route.change, '/foo/bar')

        // it returns a view fn, and
        // fetches the data as a side effect

        // to test it, call router.match('/string').action()
        // then check the state, which is passed into the router

        function getFeed () {
            return fetch(PUB_URL + '/feed/' + username)
                .then(res => res.ok ? res.json() : res.text())
        }

        var shouldFetch = ((username != state().content.username) ||
            (params.tagName != state().content.hashtag))

        if (shouldFetch) {
            getFeed()
                .then(res => {
                    console.log('*res*', res)
                    state.content.set({
                        username: params.username,
                        data: res,
                        hashtag: params.tagName
                    })
                })
                .catch(err => {
                    console.log('errr', err)
                })
        }

        return { view: Feed, getContent: getFeed }
    })

    return router
}

module.exports = Router
