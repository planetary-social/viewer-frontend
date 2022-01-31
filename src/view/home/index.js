import { html } from 'htm/preact'
var HeadPart = require('../head-part')
var MsgList = require('../msg-list')
var Sidebar = require('../sidebar')

function HomeView (props) {
    if (!props.default.data) return null

    console.log('props', props)

    return html`
        <${HeadPart} />
        <div class="header-wrapper">
            <div class="header-promo">
                <h1 class="promo-heading">Planetary is building a <br />social media commons</h1>
                <p class="promo-subheading">We make open source for a decentralized social web. <br />Come change social media with us.</p>
                <p class="promo-subheading">Learn more at <a href="https://planetary.social">planetary.social</a></p>
                <img class="feed-demo" src="/img/Feed-demo.jpg" />
                <img class="discover-demo" src="/img/Discover-demo.jpg" />
            </div>
        </div>

        <div class="feed-wrapper">
            <${MsgList} msgs=${props.default.data}
                users=${props.users} ...${props}
            />
            <${Sidebar} />
        </div>
    `
}

module.exports = HomeView
