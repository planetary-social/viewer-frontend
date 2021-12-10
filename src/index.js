import { html } from 'htm/preact'
import { render } from 'preact'
var Router = require('./router')
var Loop = require('./loop')

var router = Router()

var { bus, state, loop } = Loop()
var emit = bus.emit.bind(bus)

state(function onChange (newState) {
    var match = router.match(newState.routePath)
    if (!match) {
        console.log('not match')
        // @TODO -- should show 404
        return null
    }

    var { params } = match
    var route = match.action(match)
    console.log('route', route)
    var { view, getContent } = route

    var shouldFetch = params.username !== state().content.username
    // console.log('should', shouldFetch, state().content.username)

    if (getContent && shouldFetch) {
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
