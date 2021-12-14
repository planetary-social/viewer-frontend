import { html } from 'htm/preact'
import Markdown from 'preact-markdown';
const remark = require('remark');
import cidToUrl from 'remark-image-cid-to-url/browser'
import remarkParse from 'remark-parse'
const { PUB_URL } = require('../../CONSTANTS')
var HeadPart = require('../head-part')

function Feed (props) {
    if (!props.content.data) return null

    return html`
        <${HeadPart} />
        <div class="feed feed-content">
            <ul>
                ${props.content.data.map((post => {
                    return html`<li class="post">
                        <${Markdown} markdown=${
                            remark()
                                .use(cidToUrl(blobId => {
                                    return PUB_URL + '/blob/' +
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

function FeedHeader ({ username }) {
    return html`<div class="feed-header">

    </div>`
}

module.exports = Feed
