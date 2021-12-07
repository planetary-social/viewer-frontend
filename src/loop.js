var Bus = require('@nichoth/events')
var observ = require('observ')
var struct = require('observ-struct')
// var evs = require('./EVENTS')
import { html } from 'htm/preact'
var route = require('route-event')()

module.exports = function Loop () {
    var state = State()
    var bus = Bus({ memo: true })
    Subscribe(bus, state)

    // this get called immediately
    route(function onChange (path) {
        state.routePath.set(path)
    })

    function loop ({ children, state }) {
        console.log('render', state)
        return html`<div class="planetary">
            ${children}
        </div>`
    }

    return { bus, state, loop, setRoute: route.setRoute }
}

function State () {
    return struct({
        routePath: observ(null)
    })
}

function Subscribe (bus, state) {
    bus.on('event example', function (ev) {
        // state.foo.set('bar')
    })
}
