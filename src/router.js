const _router = require('ruta3')
import { html } from 'htm/preact'
const Home = require('./view/home')
const Feed = require('./view/feed')
var { PUB_URL } = require('./CONSTANTS')
const xtend = require('xtend')
const SingleMessage = require('./view/single-message')
const isThread = require('./view/post/is-thread')
const qs = require('query-string')
// const struct = require('observ-struct')

if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://localhost:8888'
}

console.log('**node env**', process.env.NODE_ENV)

function Placeholder () {
    return html`<div>placeholding</div>`
}



function Router (state) {
    var router = _router()

    function getProfilesFromMsgs (msgs) {
        var getThese = msgs
            .map(msg => msg.value.author)
            // check if we already have it
            .filter(author => {
                return !((state.profiles() || {})[author])
            })
            // dedup
            .filter((id, i, arr) => arr.indexOf(id) === i)

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
    }


    var fetching = false

    function fetchDefault (page) {
        var posts
        fetching = true

        // return fetch(PUB_URL + '/default')
        return fetch(PUB_URL + '/default' + (page ? `?page=${page}` : ''))
            .then(res => res.json())
            // get the profiles for everyone in the response
            .then(res => {
                // console.log('res', res)
                posts = (res || []).map(thread => {
                    return thread.messages.length === 1 ?
                        thread.messages[0] :
                        thread.messages
                })

                // need a deduplicated list of user-IDs
                var getThese = res
                    // .map(msgs => msgs.length > 1 ? msgs : msgs[0])
                    .reduce((acc, thread) => {
                        return acc.concat(thread.messages)
                    }, [])
                    .map(msg => msg.value.author)
                    // check if we already have it
                    .filter(author => {
                        return !((state.profiles() || {})[author])
                    })
                    // dedup
                    .filter((id, i, arr) => arr.indexOf(id) === i)

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
                fetching = false
                return { profiles, posts }
            })
    }


    function defaultPathQuery ({ params }) {
        var query = params.query || '?page=0'
        const q = qs.parse(query)

        if (!q.page) return 

        const i = parseInt(q.page || 0)
        const pageOk = state.default.page() === i

        if ((!state.default.data() || !pageOk) && !fetching) {
            fetchDefault(i)
                .then(({ profiles, posts }) => {
                    state.profiles.set(
                        xtend((state.profiles() || {}), profiles)
                    )

                    state.default.set({
                        page: i,
                        data: posts
                    })
                })
        }

        return { view: Home }
    }

    // here -- need to be sure we have fetched all profiles of the *replies*
    // to user's messages
    router.addRoute('/@*', ({ splats }) => {
        var userId = splats.join('')
        var _userId = '@' + userId

        var shouldFetch = (_userId != state().feed.id)

        if (shouldFetch) {
            getProfileRoute(encodeURIComponent(_userId))
                .then(([feed, counts, profile]) => {
                    const username = profile.name
                    const userId = _userId
                    const profilesData = state().profiles

                    var newData = {}
                    newData[userId] = xtend(
                        ((profilesData || {})[userId]) || {},
                        profile,
                        { counts: counts }
                    )

                    state.profiles.set(xtend(profilesData || {}, newData))

                    state.feed.set({
                        username: username,
                        id: _userId,
                        data: feed,
                        // hashtag: params.tagName
                    })

                    // also fetch the profiles of replies
                    var replyAuthors = feed.map(msg => {
                        return isThread(msg) ? msg : null
                    })
                        .filter(Boolean)
                        // now there is an array of arrays
                        .flat()
                        // array of IDs
                        .map(msg => msg.value.author)
                    
                    // need to dedup with the existing state().profiles
                    var deduped = replyAuthors
                        .map(auth => state.profiles()[auth] ? null : auth)
                        .filter(Boolean)

                    fetch(PUB_URL + '/get-profiles', {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify({ ids: deduped })
                    })
                        .then(res => {
                            if (!res.ok) {
                                return res.text().then(t => {
                                    conosle.log('oh no', t)
                                })
                            }
                            return res.json()
                        })
                        .then(res => {
                            var byId = res.reduce((acc, profile) => {
                                acc[profile.id] = profile
                                return acc
                            }, {})
                            state.profiles.set(xtend(state.profiles(), byId))
                        })
                })
        }

        return { view: Feed }
    })

    // get the profile route if we're given a URL encoded profile
    router.addRoute('/%40*', ({ splats }) => {
        var encodedUserId = '%40' + splats.join('')
        var userId = decodeURIComponent(encodedUserId)

        var shouldFetch = (userId != state().feed.id)

        if (!shouldFetch) return { view: Feed }


        getProfileRoute(encodedUserId)
            .then(([feed, counts, profile]) => {
                const profilesData = state().profiles
                var newData = {}
                newData[userId] = xtend(
                    ((profilesData || {})[userId]) || {},
                    profile,
                    { counts: counts }
                )
                state.profiles.set(xtend(profilesData || {}, newData))
                const username = profile.name

                state.feed.set({
                    username: username,
                    id: userId,
                    data: feed,
                    // hashtag: params.tagName
                })
            })

        return { view: Feed }
    })

    router.addRoute('/', () => {
        return defaultPathQuery({ params: {} })
    })

    // get a url encoded message by ID
    router.addRoute('/%25*', ({ splats }) => {
        var encodedMsgId = '%25' + splats.join('')

        const msgUrl = (PUB_URL + '/msg/' + (encodedMsgId))
        const msgId = decodeURIComponent(encodedMsgId)

        if (msgId !== (state.message() || {}).id) {
            fetch(msgUrl)
                .then(res => {
                    console.log('response', res)
                    return res.ok ?
                        res.json() :
                        res.text()
                })
                .then(res => {
                    // is error?
                    if (typeof res === 'string') {
                        state.message.set({ err: JSON.parse(res), id: msgId })
                        return Promise.resolve(null)
                    }

                    state.message.set({
                        err: null,
                        id: msgId,
                        msgs: res.messages
                    })

                    return getProfilesFromMsgs(res.messages)
                })
                .then(newProfiles => {
                    if (!newProfiles) return
                    console.log('profiles', newProfiles)
                    state.profiles.set(xtend(state.profiles(), newProfiles))
                })
                .catch(err => {
                    console.log('errrrr', err)
                    state.message.set({
                        err: err
                    })
                })
        }

        return { view: SingleMessage }
    })




    router.addRoute('/\?:query', ({ params }) => {
        return defaultPathQuery({ params })
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


function getProfileRoute (encodedUserId) {
    const countsUrl = (PUB_URL + '/counts-by-id/' + encodedUserId)
    const profileUrl = (PUB_URL + '/profile-by-id/' + encodedUserId)
    const feedUrl = (PUB_URL + '/feed-by-id/' + encodedUserId)

    return Promise.all([
        fetch(feedUrl)
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
        fetch(countsUrl)
            .then(res => {
                return res.ok ? res.json() : res.text()
            }),

        fetch(profileUrl)
            .then(res => {
                return res.ok ? res.json() : res.text()
            })
        ])
}
