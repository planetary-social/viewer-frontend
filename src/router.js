const _router = require('ruta3')
import { html } from 'htm/preact'
const Home = require('./view/home')
const Feed = require('./view/feed')
var { PUB_URL } = require('./CONSTANTS')
const xtend = require('xtend')
const SingleMessage = require('./view/single-message')
const isThread = require('./view/post/is-thread')
// const _ = {
//     find: require('lodash.find')
// }

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


    router.addRoute('/', () => {
        var fetching = false

        function fetchDefault () {
            var posts
            fetching = true

            return fetch(PUB_URL + '/default')
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

        if (!state.default().data && !fetching) {
            fetchDefault()
                .then(({ profiles, posts }) => {
                    state.profiles.set(
                        xtend((state.profiles() || {}), profiles)
                    )
                    state.default.data.set(posts)
                })
        }

        return { view: Home }
    })


    // this one doesn't work
    // router.addRoute('/%*', ({ splats }) => {
    //     // var { msgId } = params
    //     var msgId = '%' + splats.join('')
    //     console.log('msg id', msgId)
    //     return { view: SingleMessage }
    // })


    router.addRoute('/msg/*', ({ splats }) => {
        var msgId = splats.join('')

        const msgUrl = (PUB_URL + '/msg/' + encodeURIComponent(msgId))

        if (msgId !== (state.message() || {}).id) {
            fetch(msgUrl)
                .then(res => {
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
                })
        }

        return { view: SingleMessage }
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


    // here -- need to be sure we have fetched all profiles of the *replies*
    // to user's messages
    router.addRoute('/@*', ({ splats }) => {
        var userId = splats.join('')
        var _userId = '@' + userId

        const countsUrl = (PUB_URL + '/counts-by-id/' +
            encodeURIComponent(_userId))
        const profileUrl = (PUB_URL + '/profile-by-id/' +
            encodeURIComponent(_userId))

        function getFeed () {
            return Promise.all([
                fetch(PUB_URL + '/feed-by-id/' + encodeURIComponent(_userId))
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
                        console.log('profile res', res)
                        return res.ok ? res.json() : res.text()
                    })
            ])
        }

        var shouldFetch = (_userId != state().feed.id)

        if (shouldFetch) {
            getFeed()
                .then(([feed, counts, profile]) => {
                    const username = profile.name
                    const userId = _userId
                    const profilesData = state().profiles

                    console.log('**feed**', feed)

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
