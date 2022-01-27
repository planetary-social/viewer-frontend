import { html } from 'htm/preact'
import { useState } from 'preact/hooks';
var { PUB_URL } = require('../CONSTANTS')
if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://0.0.0.0:8888'
}
const Post = require('./post')

function MsgList (props) {
    var { msgs, profiles, username } = props

    var [copied, setCopied] = useState(null)

    function copyListener (userId) {
        setCopied(userId)
        navigator.clipboard.writeText(userId)
    }

    return html`<ul class="feed feed-content">
        ${
            (msgs || []).map(post => {
                return html`<${Post} profiles=${profiles} post=${post}
                    username=${username} onCopy=${copyListener}
                    copied=${copied}
                />`
            })
        }
    </ul>`
}

module.exports = MsgList
