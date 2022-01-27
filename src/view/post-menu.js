import { html } from 'htm/preact'

function PostMenu ({ msg, onCloseModal }) {
    console.log('msg', msg)

    return html`<div class="modal-options">
        <div class="modal-head">
            <button class="icon-btn" onclick=${onCloseModal}>
                <i class="far fa-window-close"></i>
            </button>
        </div>
        <ul>
            <li>
                <button class="opt-btn">
                    <i class="fas fa-percent"></i>
                    Copy message ID
                </button>
            </li>
            <li>
                <button class="opt-btn">
                    <i class="fas fa-book"></i>
                    Copy message text
                </button>
            </li>
            <li>
                <button class="opt-btn">
                    <i class="fas fa-link"></i>
                    Copy link to message
                </button>
            </li>
        </ul>
    </div>`
}

module.exports = PostMenu
