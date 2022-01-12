import { html } from 'htm/preact'
var HeadPart = require('../head-part')
var MsgList = require('../msg-list')
var Sidebar = require('../sidebar')

function HomeView (props) {
    console.log('props in home', props)

    if (!props.default.data) return null

    return html`
        <${HeadPart} />
        <div class="home page-content">
            <${Sidebar} />
            <${MsgList} msgs=${props.default.data} />
        </div>
    `
}

module.exports = HomeView
