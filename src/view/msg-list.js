import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
const Post = require('./post')

function MsgList (props) {
    var { msgs, profiles, username } = props

    var [copied, setCopied] = useState(null)

    function copyListener (text) {
        setCopied(text)
        navigator.clipboard.writeText(text)
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

        <li class="pagination">
            <a href="/">${'<- prev'}</a>
            <a href="/">${'next ->'}</a>
        </li>
    </ul>`
}

module.exports = MsgList
