import { html } from 'htm/preact'

function Sidebar () {
    return html`<div class="feed-sidebar">
        <div class="join-today">
            <h3>Join Planetary today!</h3>
            <p>
                Planetary is a decentralized network for people who want to
                come together and connect even when the internet goes out.
                It's an app that doesn't keep your data in the cloud.
            </p>

            <a href="https://apps.apple.com/us/app/planetary-social/id1481617318"
                class="cool-btn"
            >
                Download the IOS app
            </a>
        </div>
    </div>`
}

module.exports = Sidebar
