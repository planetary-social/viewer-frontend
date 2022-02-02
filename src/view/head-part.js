import { html } from 'htm/preact'
var Logo = require('./logo')
var AppStore = require('./app-store')

function HeadPart () {
    return html`
        <nav class="layout-nav">
            <div class="center-wrapper">
                <a href="/"><${Logo} /></a>
                <a href="https://apps.apple.com/us/app/planetary-app/id1481617318">
                    <${AppStore} />
                </a>
            </div>
        </nav>
    `
}

module.exports = HeadPart
