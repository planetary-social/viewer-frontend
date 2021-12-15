import { html } from 'htm/preact'
import { render } from 'preact'
var Router = require('./router')
var Loop = require('./loop')

var { bus, state, loop } = Loop()
var emit = bus.emit.bind(bus)
var router = Router(state)

state(function onChange (newState) {
    var match = router.match(newState.routePath)
    if (!match) {
        console.log('not match')
        // @TODO -- should show 404
        return null
    }

    console.log('new state', newState)
    console.log('old state', state())

    var { params } = match
    var route = match.action(match)
    var { view, getContent } = route

    // var shouldFetch = state().routePath !== newState.routePath
    var shouldFetch = getContent &&
        ((params.username !== state().content.username) ||
        // must use single equal sign so that undefined = null here
        (getContent && params.tagName != state().hashtag))

    console.log('should', shouldFetch)
    console.log('get content', getContent)

    if (shouldFetch) {
        getContent()
            .then(res => {
                console.log('*res*', res)
                state.content.set({
                    username: params.username,
                    data: res
                })
            })
            .catch(err => {
                console.log('errr', err)
            })
    }

    // re-render the app whenever the state changes
    render(html`<${loop} state=${newState}>
        <${view} ...${params} ...${newState} emit=${emit} />
    <//>`, document.getElementById('content'))
})
