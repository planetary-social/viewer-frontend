# viewer frontend

Frontend for an ssb viewer

[![Netlify Status](https://api.netlify.com/api/v1/badges/d6c1cb57-9f8b-4a3c-b92b-6a60a7fac7bc/deploy-status)](https://app.netlify.com/sites/viewer-frontend/deploys)

This is a front-end app that reads data from an API server. The API server is running an ssb "pub". We are using https://github.com/planetary-social/planetary-pub as the server.

---------------------------------------------------

## deploy
Any push to the `main` banch will automatically be deployed to netlify -- https://viewer-frontend.netlify.app/

## run locally
1. Clone this repo and make a `.env` file in the root directory.
```
cp .env.example .env
```
2. `npm start`

### test with local DB

```bash
npm start
```

### test with 'real' data, on a locally running pub

First start the `planetary-pub` in a terminal:
```bash
NODE_ENV=staging-local node --max-old-space-size=512 index.js
```

then start this app
```bash
npm run serve
```

## lint

```
$ npm run lint
```

--------------------------------------------------

In router.js
```
if (process.env.NODE_ENV === 'test') {
    PUB_URL = 'http://localhost:8888'
}
```
