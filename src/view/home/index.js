import { html } from 'htm/preact'
var HeadPart = require('../head-part')

function HomeView (props) {
    return html`
        <${HeadPart} />
        <div class="home page-content">
            <p>ok wooo</p>
        </div>
    `
}

module.exports = HomeView
