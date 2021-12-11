import { html } from 'htm/preact'
// import { useEffect } from 'preact/hooks'
var HeadPart = require('../head-part')
var md = require('ssb-markdown')
import Markdown from 'preact-markdown';
// var evs = require('../../EVENTS')

function Feed (props) {
    // var { emit, username } = props
    console.log('props here', props)

    // useEffect(() => {
    //     emit(evs.feed.fetch, { username })
    // }, [username])

    if (!props.content.data) return null

    return html`
        <${HeadPart} />
        <div class="feed feed-content">
            <ul>
                ${props.content.data.map((post => {
                    return html`<li>
                        <${Markdown} markdown=${post.value.content.text} />
                    </li>`
                }))}
            </ul>
        </div>
    `
}

module.exports = Feed
