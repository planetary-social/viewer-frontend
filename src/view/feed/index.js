import { html } from 'htm/preact'
var HeadPart = require('../head-part')
import Markdown from 'preact-markdown';
const remark = require('remark');
import cidToUrl from 'remark-image-cid-to-url/browser'
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

module.exports = Feed
