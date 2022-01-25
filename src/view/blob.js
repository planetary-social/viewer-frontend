import { html } from 'htm/preact'
var { PUB_URL } = require('../CONSTANTS')

function Blob ({ blob }) {
    return html`<img
        src=${PUB_URL + '/blob/' + encodeURIComponent(blob.link)}
    />`
}

module.exports = Blob
