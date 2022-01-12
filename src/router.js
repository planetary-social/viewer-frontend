const _router = require('ruta3')
import { html } from 'htm/preact'
const Home = require('./view/home')
const Feed = require('./view/feed')
var { PUB_URL } = require('./CONSTANTS')

if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://localhost:8888'
}

console.log('**node env**', process.env.NODE_ENV)

function Placeholder () {
    return html`<div>placeholding</div>`
}

function Router (state) {
    var router = _router()

    router.addRoute('/', () => {
        function fetchDefault () {
            return fetch(PUB_URL + '/default')
                .then(res => res.json())
        }

        if (!state.default().data) {
            fetchDefault()
                .then(res => {
                    console.log('fetched defualt', res)
                    state.default.data.set(res)
                })
        }

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

        // it returns a view fn, and
        // fetches the data as a side effect

        // to test it, call emit(evs.route.channge, '/string'), which calls
        // router.match('/string').action()
        // then check the state, which is passed into the router

        function getFeed () {
            return Promise.all([
                fetch(PUB_URL + '/feed/' + username)
                    .then(res => {
                        if (!res.ok) {
                            console.log('response not ok')
                            return res.text().then(text => {
                                console.log('not ok text', text)
                                return text
                            })
                        }

                        return res.json()
                    }),

                // TODO -- should check if we have this already, only
                // fetch if we don't
                fetch(PUB_URL + '/counts/' + username)
                    .then(res => {
                        return res.ok ? res.json() : res.text()
                    }),

                fetch(PUB_URL + '/profile/' + username)
                    .then(res => res.ok ? res.json() : res.text())
            ])
        }

        // we are using single '=' here so that undefined = null
        var shouldFetch = ((username != state().feed.username) ||
            (params.tagName != state().feed.hashtag))

        if (shouldFetch) {
            getFeed()
                .then(([feed, counts, profile]) => {
                    var profilesData = {}
                    profilesData[counts.id] = counts
                    profilesData[counts.id].image = profile.image
                    state.profiles.set(profilesData)

                    state.feed.set({
                        username: params.username,
                        id: counts.id,
                        data: feed,
                        hashtag: params.tagName
                    })
                })
        }

        return { view: Feed }
    })

    return router
}

module.exports = Router
