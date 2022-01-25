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
var Sidebar = require('../sidebar')

function Feed (props) {
    if (!props.feed.data) return null

    return html`
        <${HeadPart} />
        <${FeedHeader} ...${props} />

        <div class="feed-wrapper">
            <${MsgList} msgs=${props.feed.data} profiles=${props.profiles} />
            <${Sidebar} ...${props} />
        </div>
    `
}

module.exports = Feed


function FeedHeader (props) {
    var { username } = props.feed

    console.log('props', props)

    var profile = _.find(props.profiles, { username: props.username })
    if (!profile) return null

    return html`<div class="feed-header">
        <div class="feed-header-banner">
        </div>
        <div class="feed-header-content">
            <div class="user-info">
                <div class="avatar">
                    <img src="${PUB_URL + '/blob/' +
                        encodeURIComponent(profile.image)}"
                    />
                </div>
                <div class="user-info-card">
                    <h2>${username}</h2>
                    <div class="user-id">${profile.id}</div>
                </div>
            </div>
            <dl class="user-stats">
                <div class="user-stats-unit">
                    <dd>${profile.following}</dd>
                    <dt class="following">following</dt>
                </div>
                <div class="user-stats-unit">
                    <dd>${profile.followers}</dd>
                    <dt class="followers">
                        ${profile.followers === 1 ?  'follower' : 'followers'}
                    </dt>
                </div>
                <div class="user-stats-unit">
                    <dd>${profile.posts}</dd>
                    <dt class="posts-count">
                        ${profile.posts === 1 ? 'post' : 'posts'}
                    </dt>
                </div>
            </dl>
        </div>
    </div>`
}

module.exports = Feed
