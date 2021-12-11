var Bus = require('@nichoth/events')
var observ = require('observ')
var struct = require('observ-struct')
import { html } from 'htm/preact'
var route = require('route-event')()
var evs = require('./EVENTS')

module.exports = function Loop () {
    var state = State()
    var bus = Bus({ memo: true })
    Subscribe(bus, state)

    // this gets called immediately
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
        routePath: observ(null),
        content: struct({
            username: observ(null),
            data: observ(null)
        })
    })
}

function Subscribe (bus, state) {
    // bus.on(evs.feed.fetch, ev => {
    //     console.log('*ev*', ev)
    //     var { username } = ev
    //     state.content.set({
    //         username: null,
    //         data: null
    //     })
    // })
}
