var test = require('tape')
var Post = require('../src/view/post')
const { html } = require('htm/preact')
import render from 'preact-render-to-string'

test('should not render the same image twice', t => {
    var testMsg = {
        "key": "%fake-key",
        "value": {
            "previous": null,
            "sequence": 1,
            "author": "@lV5MISER9oGaZJ7OLhlsUNVWHu982USYgMEWfIs6le0=.ed25519",
            "timestamp": 1643758418278,
            "hash": "sha256",
            "content": {
                "type": "post",
                text: 'a post with the same image inline and attached ' +
                    // eslint-disable-next-line
                    '![a blob](&Ho1XhW2dp4bNJLZrYkurZPxlUhqrknD/Uu/nDp+KnMg=.sha256)',
                mentions: [{
                    // eslint-disable-next-line
                    link: '&Ho1XhW2dp4bNJLZrYkurZPxlUhqrknD/Uu/nDp+KnMg=.sha256',
                    name: 'test.jpg', // optional, but recommended
                    size: 12,          // optional, but recommended
                    type: 'image/jpeg' // optional, but recommended
                }]
            },
            "signature": "123"
        },
        "timestamp": 1643758418286
    }

    var postEl = render(html`<${Post} post=${testMsg} />`)

    var splitted = postEl.split('Ho1XhW2')
    // length 2 means there was 1 instance
    t.equal(splitted.length, 2, 'should have 1 isntance of the blob')
    t.end()
})
