import { html } from 'htm/preact'
var HeadPart = require('./head-part')

module.exports = function ErrMsg (props) {
    return html`<div>
        <${HeadPart} />
        <div class="err-message">
            ${'' + props.err.statusCode}
            <div>${props.err.error}</div>
            <div>${props.err.message}</div>
        </div>
    </div>`
}
