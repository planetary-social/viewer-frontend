import { html } from 'htm/preact'
var _ = {
    find: require('lodash.find')
}

function Sidebar (props) {
    var profile = _.find(props.profiles, { username: props.username })

    return html`<div class="feed-sidebar">
        ${profile ?
            html`<dl class="counts">
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
            </dl>` :
            null
        }

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

module.exports = Sidebar
