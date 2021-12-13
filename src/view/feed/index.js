import { html } from 'htm/preact'
var HeadPart = require('../head-part')
import Markdown from 'preact-markdown';
// var evs = require('../../EVENTS')
const remark = require('remark');
const cidToUrl = require('remark-image-cid-to-url')
// const linkifyRegex = require('remark-linkify-regex');
const { PUB_URL } = require('../../CONSTANTS')
import remarkParse from 'remark-parse'

function Feed (props) {
    if (!props.content.data) return null

    return html`
        <${HeadPart} />
        <div class="feed feed-content">
            <ul>
                ${props.content.data.map((post => {
                    return html`<li>
                        <${Markdown} markdown=${
                            remark()
                                .use(cidToUrl(blobId => {
                                    return PUB_URL + '/' +
                                        encodeURIComponent(blobId)
                                }))
                                .use(remarkParse, { commonmark: true })
                                .processSync(post.value.content.text).contents
                            }
                        />
                    </li>`
                }))}
            </ul>
        </div>
    `
}

module.exports = Feed
