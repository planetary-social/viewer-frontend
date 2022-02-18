import { html } from 'htm/preact'
import { render } from 'preact'
var Router = require('./router')
var Loop = require('./loop')
var ErrMsg = require('./view/err-msg')

var { bus, state, loop } = Loop()
var emit = bus.emit.bind(bus)
var router = Router(state)

state(function onChange (newState) {
    var match = router.match(newState.routePath)

    if (!match) {
        console.log('not match')
        return render(html`<${ErrMsg} err=${({
            statusCode: 404,
            error: 'Not Found',
            message: 'That path does not exist'
        })} />`, document.getElementById('content'))
    }

    var { params } = match
    var { view } = match.action(match)

    // re-render the app whenever the state changes
    render(html`<${loop} state=${newState}>
        <${view} ...${params} ...${newState} emit=${emit} />
    <//>`, document.getElementById('content'))
})
