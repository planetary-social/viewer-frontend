import { html } from 'htm/preact'
var HeadPart = require('../head-part')

function HomeView (props) {
    return html`
        <div class="flex-layout">
            <${HeadPart} />
            <main class="layout-wrapper home page-content">
                <p>ok wooo</p>
            </main>
        </div>
    `
}

module.exports = HomeView
