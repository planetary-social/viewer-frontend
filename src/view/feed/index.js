import { html } from 'htm/preact'
import Markdown from 'preact-markdown'
const remark = require('remark')
import cidToUrl from 'remark-image-cid-to-url/browser'
import remarkParse from 'remark-parse'
var { PUB_URL } = require('../../CONSTANTS')
console.log('envvvvv', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://0.0.0.0:8888'
}
var HeadPart = require('../head-part')
var linkifyRegex = require('@planetary-ssb/remark-linkify-regex')
var MockAvatar = require('./mock-avatar')
var _ = {
    find: require('lodash.find')
}

function isThread (post) {
    return Array.isArray(post)
}

function Feed (props) {
    if (!props.feed.data) return null

    const linkifyHashtags = linkifyRegex(/#[\w-]+/g, node => {
        return '/tag/' + node.substring(1)
    })

    return html`
        <${HeadPart} />
        <${FeedHeader} ...${props} />

        <div class="feed-wrapper">
            <ul class="feed feed-content">
                ${(props.feed.data || []).map(_post => {

                    // TODO -- handle threads
                    var post = isThread(_post) ? _post[0] : _post
                    var { mentions } = post.value.content

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

                        ${mentions && mentions[0] ?
                            html`<div class="image-carousel">
                                ${mentions.map(blob => {
                                    return html`<img src=${PUB_URL +
                                        '/blob/' + blob.link} />`
                                })}
                            </div>` :
                            null
                        }

                        <div class="markdown_block">
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
                        </div>

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
                        <a href="#" class="replies-stack_link"></a>
                    </li>`
                })}
            </ul>
            <${Sidebar} ...${props} />
        </div>
    `
}

function FeedHeader (props) {
    var { username } = props.feed

    var profile = _.find(props.profiles, { username: props.username })

    return html`<div class="feed-header">
        <div class="feed-header-2">
            <div class="header-content">
                <div class="avatar">
                    <img src="${PUB_URL + '/blob/' +
                        encodeURIComponent(profile.image)}"
                    />
                </div>

                <div class="user-info">
                    <h2>${username}</h2>
                    <div class="user-id">${profile.id}</div>
                </div>
                <dl class="counts">
                    <div>
                        <dd>${profile.following}</dd>
                        <dt class="following">following</dt>
                    </div>
                    <div>
                        <dd>${profile.followers}</dd>
                        <dt class="followers">
                            ${profile.followers === 1 ?  'follower' : 'followers'}
                        </dt>
                    </div>
                    <div>
                        <dd>${profile.posts}</dd>
                        <dt class="posts-count">
                            ${profile.posts === 1 ? 'post' : 'posts'}
                        </dt>
                    </div>
                </dl>
            </div>
        </div>
    </div>`
}

function Sidebar (props) {
    var profile = _.find(props.profiles, { username: props.username })
    console.log('*sidebar*', profile)

    return html`<div class="feed-sidebar">
        <div class="join-today">
            <h3>Join Planetary today!</h3>
            <p>Planetary is a decentralized network for people who want to come together and connect even when the internet goes out.</p>
            <p>It's an app that doesn't keep your data in the cloud.</p>

            <button class="cool-btn">Create your account</button>
        </div>
        <div class="whats-hot">
            <h3>What's hot on Planetary</h3>
            <ul>
                <li><a href="#">#CyberPunkRevolution <span class="counter-highlight">(1768)</span></a></li>
                <li><a href="#">#BlackLivesMatter <span class="counter-highlight">(745)</span></a></li>
                <li><a href="#">#FreeBritneyNow <span class="counter-highlight">(692)</span></a></li>
                <li><a href="#">#LaserEyesTill100K <span class="counter-highlight">(581)</span></a></li>
                <li><a href="#">#KeepHongKongFree <span class="counter-highlight">(437)</span></a></li>
            </ul>
        </div>
    </div>`
}

module.exports = Feed
