import { html } from 'htm/preact'
var _ = {
    find: require('lodash.find')
}
var { PUB_URL } = require('../../CONSTANTS')
if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://0.0.0.0:8888'
}
var HeadPart = require('../head-part')
var MsgList = require('../msg-list')

console.log('envvvvv', process.env.NODE_ENV)

function Feed (props) {
    if (!props.feed.data) return null

    return html`
        <${HeadPart} />
        <${FeedHeader} ...${props} />

        <div class="feed-wrapper">
            <${Sidebar} ...${props} />
            <${MsgList} msgs=${props.feed.data} />
        </div>
    `
}

module.exports = Feed


function FeedHeader (props) {
    var { username } = props.feed

    var profile = _.find(props.profiles, { username: props.username })
    if (!profile) return null

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
            </div>
        </div>
    </div>`
}

function Sidebar (props) {
    var profile = _.find(props.profiles, { username: props.username })

    return html`<div class="feed-sidebar">
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

        <div class="join-today">
            <h3>Join Planetary today!</h3>
            <p>
                Planetary is a decentralized network for people who want to
                come together and connect even when the internet goes out.
                It's an app that doesn't keep your data in the cloud.
            </p>

            <button class="cool-btn">Create your account</button>
        </div>
    </div>`
}
