import { html } from 'htm/preact'
import Markdown from 'preact-markdown'
const remark = require('remark')
import cidToUrl from 'remark-image-cid-to-url/browser'
import remarkParse from 'remark-parse'
const { PUB_URL } = require('../../CONSTANTS')
var HeadPart = require('../head-part')
var linkifyRegex = require('@planetary-ssb/remark-linkify-regex')
var MockAvatar = require('./mock-avatar')
var _ = {
    find: require('lodash.find')
}


function Feed (props) {
    if (!props.feed.data) return null

    const linkifyHashtags = linkifyRegex(/#[\w-]+/g, node => {
        return '/tag/' + node.substring(1)
    })

    return html`
        <${HeadPart} />
        <${FeedHeader} ...${props} />
        <div class="feed feed-content">
            <ul>
                ${(props.feed.data || []).map(post => {

                    var { mentions } = post.value.content

                    return html`<li class="post">
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

                        ${mentions && mentions[0] ?
                            html`<div class="image-carousel">
                                ${mentions.map(blob => {
                                    return html`<img src=${PUB_URL +
                                        '/blob/' + blob.link} />`
                                })}
                            </div>` :
                            null
                        }

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

                        <footer class="post_reactions">
                            <div class="post_actions">
								<a href="#" class="view-replies_link">View all replies</a>
                                <ul class="action_buttons">
									<li class="action_button action_button--share"><a href="#">Share</a></li>
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
            </ul>
        </div>
    `
}

function FeedHeader (props) {
    var { username } = props.feed
    console.log('in feed head', props)

    var profile = _.find(props.profiles, { username: username })
    console.log('*profile in here*', profile)

    return html`<div class="feed-header">
        <div class="feed-header-2">
            <div class="header-content">
                <div class="avatar">
                    <img src="${PUB_URL + '/blob/' +
                        encodeURIComponent(profile.image)}"
                    />
                </div>
                <h2>${username}</h2>
            </div>
        </div>
    </div>`
}

module.exports = Feed
