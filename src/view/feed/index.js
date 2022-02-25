import { html } from 'htm/preact'
import { generateFromString } from 'generate-avatar'
var Blob = require('../blob')
var { PUB_URL } = require('../../CONSTANTS')
if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://0.0.0.0:8888'
}
var HeadPart = require('../head-part')
var MsgList = require('../msg-list')
var Sidebar = require('../sidebar')

function Feed (props) {
    if (!props.feed.data) return null

    return html`
        <${HeadPart} />
        <${FeedHeader} ...${props} />

        <div class="feed-wrapper">
            <${MsgList} msgs=${props.feed.data} profiles=${props.profiles}
                username=${(props.feed || {}).username}
            />
            <${Sidebar} ...${props} />
        </div>
    `
}

module.exports = Feed


function FeedHeader (props) {
    var profile = props.profiles[props.feed.id]
    profile = profile || ({ counts: {} })
    const username = (profile || {}).name

    if (!profile) return null

    return html`<div class="feed-header">
        <div class="feed-header-banner"></div>
        <div class="feed-header-content">
            <div class="user-info">
                <div class="avatar">
                    <img src="${profile.image ?
                        html`<${Blob}
                            blob=${({ link: profile.image })}
                        />` :
                        ('data:image/svg+xml;utf8,' +
                            generateFromString(profile.id))
                    }" />
                </div>
                <div class="user-info-card">
                    <h2>${username}</h2>
                    <div class="user-id">${props.feed.id}</div>
                </div>
            </div>
            <dl class="user-stats">
                <div class="user-stats-unit">
                    <dd>${profile.counts.following}</dd>
                    <dt class="following">following</dt>
                </div>
                <div class="user-stats-unit">
                    <dd>${profile.counts.followers}</dd>
                    <dt class="followers">
                        ${profile.counts.followers === 1 ?
                            'follower' :
                            'followers'
                        }
                    </dt>
                </div>
                <div class="user-stats-unit">
                    <dd>${profile.counts.posts}</dd>
                    <dt class="posts-count">
                        ${profile.counts.posts === 1 ? 'post' : 'posts'}
                    </dt>
                </div>
            </dl>
        </div>
    </div>`
}

module.exports = Feed
