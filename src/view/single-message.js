import { html } from 'htm/preact'
const _ = {
    find: require('lodash.find')
}
const Post = require('./post')
var HeadPart = require('./head-part')

function SingleMessage (props) {
    console.log('props in single message', props)
    const msgs = (props.message || {}).msgs
    const msg = _.find(msgs, { key: (props.message || {}).id })

    return html`
        <${HeadPart} />

        <ul class="single-message">
            <${Post} post=${msg} />
        </ul>
    `
}

module.exports = SingleMessage
