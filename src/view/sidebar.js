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
                Create your account
            </a>
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

module.exports = Sidebar
