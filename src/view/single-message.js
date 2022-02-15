import { html } from 'htm/preact'
const _ = {
    find: require('lodash.find')
}
const Post = require('./post')
var HeadPart = require('./head-part')

function SingleMessage (props) {
    const msgs = (props.message || {}).msgs
    // const msg = _.find(msgs, { key: (props.message || {}).id })

    if (!msgs) return null
    if (!props.profiles) return null

    return html`
        <${HeadPart} />

        <ul class="single-message">
            <${Post} ...${props} post=${msgs} />
        </ul>
    `
}

module.exports = SingleMessage
