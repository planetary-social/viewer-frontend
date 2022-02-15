import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
import Markdown from 'preact-markdown'
const moment = require('moment')
const remark = require('remark')
import cidToUrl from 'remark-image-cid-to-url/browser'
import remarkParse from 'remark-parse'
var ref = require('ssb-ref')
// var linkifyRegex = require('@planetary-ssb/remark-linkify-regex')
var Blob = require('../blob')
var PostMenu = require('./post-menu')
var { PUB_URL } = require('../../CONSTANTS')
const isThread = require('./is-thread')

// const linkifyHashtags = linkifyRegex(/#[\w-]+/g, node => {
//     return '/tag/' + node.substring(1)
// })

function CopyButton (props) {
    const { value, copied, onCopy } = props

    function copy (ev) {
        ev.preventDefault()
        console.log('copy', value)
        onCopy(value)
    }

    return html` <button title="copy user ID" onclick=${copy}
        class="icon-btn copy${copied === value ? ' has-copied' : ''}"
        aria-label="Copy to clipboard"
    >
        <i aria-hidden="true" class="far fa-copy"></i>
    </button>`
}


function Post (props) {
    const _post = props.post

    // here we convert between arrays and posts
    const post = isThread(_post) ? _post[0] : _post
    if (!post) return null

    var { mentions } = post.value.content
    var hasImages = !!((mentions || []).filter(m => {
        return ref.isBlob(m.link)
    })[0])

    var [options, setOptions] = useState(false)

    var { profiles, username, onCopy, copied } = props

    var profile = (profiles || {})[post.value.author]
    var authorName = (profile || {}).name || username
    // use the id if they don't have a name
    authorName = authorName || post.value.author

    function openOptions (ev) {
        ev.preventDefault()
        setOptions(true)
    }

    function closeModal (ev) {
        if (ev) ev.preventDefault()
        if (options) setOptions(false)
    }

    var mentionedBlobs = (mentions || []).map(blob => blob.link)

    return html`<li class="post ${isThread(_post) ? 'is-thread' : ''}">

        ${options ?
            html`<${PostMenu} onCloseModal=${closeModal} msg=${post} />` :
            null
        }

        <header class="post_head">
            <div class="post_signature">
                <a href="#" class="post_author has_stories">
                    <${Blob} blob=${({ link: ((profile || {}).image) })} />
                </a>

                <div class="post-signature-wrap">
                    <span class="post_author_name pro_user">
                        <a href="/${post.value.author}"
                            class="post_author_name pro_user"
                        >
                            ${authorName}
                        </a>

                        <${CopyButton} value=${post.value.author}
                            copied=${copied}
                            onCopy=${onCopy}
                        />

                        ${
                            post.value.author === copied ?
                                html`<span class="user-id-copied"><b>✓</b>
                                    user id copied!</span>
                                ` :
                                null
                        }
                    </span>

                    <div class="post_meta">
                        <span class="post_timestamp">
                            ${moment(post.value.timestamp)
                                .format('dddd, MMMM Do YYYY, h:mm:ss a')
                            }
                        </span>
                    </div>
                </div>
            </div>

            <button class="post_options" onclick=${openOptions}></button>
        </header>

        ${mentions && mentions[0] && hasImages ?
            // check if the blob is a duplicate with something
            // in the md
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
                    // .use(linkifyHashtags)
                    .use(cidToUrl(blobId => {
                        if (mentionedBlobs.includes(blobId)) {
                            return null
                        }

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
                <ul class="action_buttons">
                    <li class="action_button action_button--share">
                        <a href="#">Share</a>
                    </li>
                </ul>
            </div>

            ${isThread(_post) ?
                html`<${Reply} msgs=${_post} profiles=${profiles} />` :
                null
            }
        </footer>
    </li>`
}

            // <a href="https://apps.apple.com/us/app/planetary-app/id1481617318"
            //     class="comment_prompt"
            // >
            //     <span class="comment_signup text_link">Sign up</span>
            //     to leave a comment
            // </a>

function Reply (props) {
    var { msgs, profiles } = props
    const replies = msgs.slice(1)
    const post = msgs[0]

    var profile = (profiles || {})[post.value.author]
    var authorName = (profile || {}).name 
    // use the id if they don't have a name
    authorName = authorName || post.value.author

    // var authorName = authorName || post.value.author

    return html`<ul class="post_comments">
        ${replies.map(reply => {
            var { mentions } = reply.value.content
            var mentionedBlobs = (mentions || []).map(blob => blob.link)

            return html`<li class="post_comment">
                <header class="comment_author">
                    <a href="/${reply.value.author}">

                        ${(profiles[reply.value.author] || {}).name}
                    </a>
                </header>

                <main class="comment_body">
                    <p class="comment_text">
                        <${Markdown} markdown=${
                            remark()
                                // .use(linkifyHashtags)
                                .use(cidToUrl(blobId => {
                                    if (mentionedBlobs.includes(blobId)) {
                                        return null
                                    }

                                    return (PUB_URL + '/blob/' +
                                        encodeURIComponent(blobId))
                                }))
                                .use(remarkParse, { commonmark: true })
                                .processSync(reply.value.content.text).contents
                            }
                        />
                    </p>
                </main>
            </li>`
        })}

    </ul>`
}

module.exports = Post
