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
    console.log('**prev**', prev)

    function disabledClick (ev) {
        ev.preventDefault()
        console.log('disabled click')
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
                class="${prev ? '' : 'disabled'}"
                href="${prev ? '/?page=' + prev : ''}"
                onclick=${prev ? null : disabledClick}
            >
                ${'<- prev'}
            </a>

            <a href="/">${'next ->'}</a>
        </li>
    </ul>`
}

module.exports = MsgList
