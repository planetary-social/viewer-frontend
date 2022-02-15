import { html } from 'htm/preact'
const _ = {
    find: require('lodash.find')
}
const Post = require('./post')

function SingleMessage (props) {
    console.log('props in single message', props)
    const msgs = (props.message || {}).msgs
    const msg = _.find(msgs, { key: (props.message || {}).id })

    return html`<div class="single-message">
        <${Post} post=${msg} />
    </div>`
}

module.exports = SingleMessage
