import { html } from 'htm/preact'
var { PUB_URL } = require('../CONSTANTS')

function Blob ({ blob }) {
    // console.log('blob.link', blob.link)
    // console.log('aaaaa', PUB_URL + '/blob/' + encodeURIComponent(blob.link))
    return html`<img
        src=${(PUB_URL + '/blob/' + encodeURIComponent(blob.link))}
    />`
}

module.exports = Blob
