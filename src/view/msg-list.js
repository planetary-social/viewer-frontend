import { html } from 'htm/preact'
import Markdown from 'preact-markdown'
const remark = require('remark')
import cidToUrl from 'remark-image-cid-to-url/browser'
import remarkParse from 'remark-parse'
var { PUB_URL } = require('../CONSTANTS')
if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://0.0.0.0:8888'
}
var ref = require('ssb-ref')
var MockAvatar = require('./mock-avatar')
var linkifyRegex = require('@planetary-ssb/remark-linkify-regex')

function isThread (post) {
    return Array.isArray(post)
}

const linkifyHashtags = linkifyRegex(/#[\w-]+/g, node => {
    return '/tag/' + node.substring(1)
})

function MsgList (props) {
    var { msgs } = props

    return html`<ul class="feed feed-content">
        ${(msgs || []).map(_post => {
            // TODO -- handle threads
            var post = isThread(_post) ? _post[0] : _post
            post = post.root ? post.root : post
            var { mentions } = post.value.content
            var hasImages = !!((mentions || []).filter(m => {
                return ref.isBlob(m.link)
            })[0])

            // console.log('post', post.value.content.text)

            return html`<li class="post ${isThread(_post) ? 'is-thread' : ''}">
                <header class="post_head">
                    <div class="post_signature">
                        <a href="#" class="post_author has_stories">
                            <${MockAvatar} />
                        </a>
                        <div class="post_meta">
                            <a href="#" class="post_author_name pro_user">Pavel</a>
                            <span class="post_timestamp">Monday at 6:32pm</span>
                        </div>
                    </div>
                    <button class="post_options"></button>
                </header>

                ${mentions && mentions[0] && hasImages ?
                    html`<div class="image-carousel">
                        ${mentions.map(blob => {
                            return ref.isBlob(blob.link) ?
                                html`<img src=${PUB_URL + '/blob/' +
                                    encodeURIComponent(blob.link)}
                                />` :
                                null
                        })}
                    </div>` :
                    null
                }

                ${post.value.content.text ?
                    html`<${Markdown} markdown=${
                        remark()
                            .use(linkifyHashtags)
                            .use(cidToUrl(blobId => {
                                return (PUB_URL + '/blob/' +
                                    encodeURIComponent(blobId))
                            }))
                            .use(remarkParse, { commonmark: true })
                            .processSync(post.value.content.text).contents
                        }
                    />` :
                    null
                }

                <footer class="post_reactions">
                    <div class="post_actions">
                        <a href="#" class="view-replies_link">View all replies</a>
                        <ul class="action_buttons">
                            <li class="action_button action_button--share">
                                <a href="#">Share</a>
                            </li>
                        </ul>
                    </div>

                    <ul class="post_comments">
                        <li class="post_comment">
                            <header class="comment_author">
                                <a href="#" class="comment_author_name pro_user">Maven</a>
                            </header>
                            <main class="comment_body">
                                <p class="comment_text">Hey! That's me by the <a href="#" class="text_link">DJ booth</a> :P Can't believe we had such a fun night dancing our minds to the best industrial techno in Europe 🎆</p>
                            </main>
                            <footer class="comment_timestamp">Tuesday at 5:16pm</footer>
                        </li>
                    </ul>

                    <a href="#" class="comment_prompt">
                        <span class="comment_signup text_link">Sign up</span> to leave a comment
                    </a>
                </footer>
            </li>`
        })}
    </ul>`
}

module.exports = MsgList
