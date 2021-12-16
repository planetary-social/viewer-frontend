import { html } from 'htm/preact'
import Markdown from 'preact-markdown'
const remark = require('remark')
import cidToUrl from 'remark-image-cid-to-url/browser'
import remarkParse from 'remark-parse'
const { PUB_URL } = require('../../CONSTANTS')
var HeadPart = require('../head-part')
var linkifyRegex = require('@planetary-ssb/remark-linkify-regex')


function Feed (props) {
    if (!props.content.data) return null

    const linkifyHashtags = linkifyRegex(/#[\w-]+/g, node => {
        return '/tag/' + node.substring(1)
    })

    return html`
        <${HeadPart} />
        <div class="feed feed-content">
            <ul>
                ${(props.content.data || []).map((post => {
                    return html`<li class="post">
                        <header class="post_head">
                            <div class="post_signature>
                                <a href="#" class="post_author has_stories">
                                    <img src="" class="post_author_avatar">
                                </a>
                                <div class="post_meta">
                                    <a href="#" class="post_author_name pro_user">Pavel</a>
                                    <span class="post_timestamp">Monday at 6:32pm</span>
                                </div>
                            </div>
                            <button class="post_options">...</button>
                        </header>
                        <${Markdown} markdown=${
                            remark()
                                .use(linkifyHashtags)
                                .use(cidToUrl(blobId => {
                                    return PUB_URL + '/blob/' +
                                        encodeURIComponent(blobId)
                                }))
                                .use(remarkParse, { commonmark: true })
                                .processSync(post.value.content.text).contents
                            }
                        />
                        <div class="post_reactions">
                            <div class="post_comments_by"></div>
                            <div class="post_actions">
                                <ul class="action_buttons">
                                    <li class="action_button"><img src="" class="action_button_image"></li>
                                    <li class="action_button"><img src="" class="action_button_image"></li>
                                    <li class="action_button"><img src="" class="action_button_image"></li>
                                </ul>
                            </div>
                            <ul class="post_comments">
                                <li class="post_comment">
                                    <header class="comment_author">
                                        <a href="#" class="post_author_name pro_user">Maven</a>
                                    </header>
                                    <main class="comment_body">Hey! That's me by the DJ booth :P Can't believe we had such a fun night dancing our minds to the best industrial techno in Europe 🎆</main>
                                    <footer class="comment_timestamp">Tuesday at 5:16pm</footer>
                                </li>
                            </ul>
                            <a href="#" class="comment_prompt">
                                <span class="comment_signup">Sign up</span>&nbsp;to leave a comment</span>
                            </a>
                        </div>
                    </li>`
                }))}
            </ul>
        </div>
    `
}

// function FeedHeader ({ username }) {
//     return html`<div class="feed-header">

//     </div>`
// }

module.exports = Feed
