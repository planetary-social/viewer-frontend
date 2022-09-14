module.exports = {
    PUB_URL: (process.env.NODE_ENV === 'test' ?
        'http://0.0.0.0:8888' :
        'https://planetary-link-pub.onrender.com')
}
