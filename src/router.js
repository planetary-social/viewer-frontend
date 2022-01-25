const _router = require('ruta3')
import { html } from 'htm/preact'
const Home = require('./view/home')
const Feed = require('./view/feed')
var { PUB_URL } = require('./CONSTANTS')
const xtend = require('xtend')

if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://localhost:8888'
}

console.log('**node env**', process.env.NODE_ENV)

function Placeholder () {
    return html`<div>placeholding</div>`
}

function Router (state) {
    var router = _router()

    var fetching = false
    router.addRoute('/', () => {
        function fetchDefault () {
            var posts
            fetching = true

            return fetch(PUB_URL + '/default')
                .then(res => res.json())
                // get the profiles for everyone in the response
                .then(res => {
                    posts = res
                    // need a deduplicated list of user-IDs
                    var getThese = res
                        .map(msg => msg.value.author)
                        // check if we already have it
                        .filter(author => {
                            return !((state.profiles() || {})[author])
                        })
                        // dedup
                        .filter((id, i, arr) => arr.indexOf(id) === i)

                    console.log('get these', getThese)

                    return fetch(PUB_URL + '/get-profiles', {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify({ ids: getThese })
                    })
                        .then(res => res.json())
                        .then(res => {
                            var byId = res.reduce((acc, val, i) => {
                                acc[getThese[i]] = val
                                return acc
                            }, {})
                            return byId
                        })
                })
                .then(profiles => {
                    return { profiles, posts }
                    fetching = false
                })
        }

        if (!state.default().data && !fetching) {
            fetchDefault()
                .then(({ profiles, posts }) => {
                    state.profiles.set(xtend((state.profiles() || {}),
                        profiles))
                    state.default.data.set(posts)
                })
        }

        return { view: Home }
    })

    router.addRoute('/tag/:tagName', ({ params }) => {
        var { tagName } = params

        function getTagContent () {
            return fetch(PUB_URL + '/tag/' + tagName)
                .then(res => {
                    return res.ok ? res.json() : res.text()
                })
                .then(res => {
                    console.log('tag response', res)
                    return res
                })
        }

        console.log('state.hashtag', state.hashtag().tag)
        console.log('tagname', tagName)

        if (state.hashtag().tag !== tagName) {
            getTagContent()
                .then(res => {
                    state.hashtag.set({
                        tag: tagName,
                        feed: res
                    })
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
