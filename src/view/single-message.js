import { html } from 'htm/preact'
const _ = {
    find: require('lodash.find')
}
const Post = require('./post')
var HeadPart = require('./head-part')
var Sidebar = require('./sidebar')

function SingleMessage (props) {
    const msgs = (props.message || {}).msgs

    if (!msgs) return null
    if (!props.profiles) return null

    return html`
        <${HeadPart} />

        <div class="feed-wrapper">
            <ul class="single-message">
                <${Post} ...${props} post=${msgs} />
            </ul>

            <${Sidebar} ...${props} />
        </div>
    `
}

module.exports = SingleMessage
