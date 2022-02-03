import { html } from 'htm/preact'
import { render } from 'preact'
var Router = require('./router')
var Loop = require('./loop')

var { bus, state, loop } = Loop()
var emit = bus.emit.bind(bus)
var router = Router(state)

state(function onChange (newState) {
    var match = router.match(newState.routePath)

    console.log('route', newState.routePath)

    if (!match) {
        console.log('not match')
        // @TODO -- should show 404
        return null
    }

    var { params } = match
    var { view } = match.action(match)

    // re-render the app whenever the state changes
    render(html`<${loop} state=${newState}>
        <${view} ...${params} ...${newState} emit=${emit} />
    <//>`, document.getElementById('content'))
})
