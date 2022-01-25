import { html } from 'htm/preact'
var HeadPart = require('../head-part')
var MsgList = require('../msg-list')
var Sidebar = require('../sidebar')

function HomeView (props) {
    if (!props.default.data) return null

    return html`
        <${HeadPart} />

        <div class="feed-wrapper">
            <${MsgList} msgs=${props.default.data}
                users=${props.users} ...${props}
            />
            <${Sidebar} />
        </div>
    `
}

module.exports = HomeView
