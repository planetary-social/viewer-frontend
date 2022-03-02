import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
const Post = require('./post')
const qs = require('query-string')

function MsgList (props) {
    var { msgs, profiles, username } = props

    var [copied, setCopied] = useState(null)

    function copyListener (text) {
        setCopied(text)
        navigator.clipboard.writeText(text)
    }

    const params = qs.parse(window.location.search)
    const { page } = params
    var prev = page ? (parseInt(page) - 1) : false
    var hasPrev = (typeof prev === 'number' && prev >= 0)
    var next = (parseInt(page) + 1) || 1

    function disabledClick (ev) {
        ev.preventDefault()
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
            <a
                class="${hasPrev ? '' : 'disabled'}"
                href="${prev ? ('/?page=' + prev) : '/'}"
                onclick=${hasPrev ? null : disabledClick}
            >
                ${'<- prev'}
            </a>

            <a href="${'/?page=' + next}">
                ${'next ->'}
            </a>
        </li>
    </ul>`
}

module.exports = MsgList
