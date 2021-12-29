const _router = require('ruta3')
import { html } from 'htm/preact'
const Home = require('./view/home')
const Feed = require('./view/feed')
var { PUB_URL } = require('./CONSTANTS')

if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://localhost:8888'
}

function Placeholder () {
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

        // to test it, call emit(evs.route.channge, '/string'), which calls
        // router.match('/string').action()
        // then check the state, which is passed into the router

        function getFeed () {
            return Promise.all([
                fetch(PUB_URL + '/feed/' + username)
                    .then(res => {
                        return res.ok ? res.json() : res.text()
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

        // console.log('in here', state())
        // console.log('params', params)

        if (shouldFetch) {
            getFeed()
                .then(([feed, counts, profile]) => {
                    console.log('here', arguments)
                    console.log('*feed*', feed)
                    // console.log('*counts*', counts)
                    // console.log('*profile*', profile)
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
                .catch(err => {
                    console.log('errr', err)
                })
        }

        return { view: Feed }
    })

    return router
}

module.exports = Router
