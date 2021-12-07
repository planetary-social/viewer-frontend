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
    var routeView = route ? route.view : null

    // re-render the app whenever the state changes
    render(html`<${loop} state=${newState}>
        <${routeView} ...${params} ...${newState} emit=${emit} />
    <//>`, document.getElementById('content'))
})