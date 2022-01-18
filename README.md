# viewer frontend

Frontend for an ssb viewer

[![Netlify Status](https://api.netlify.com/api/v1/badges/d6c1cb57-9f8b-4a3c-b92b-6a60a7fac7bc/deploy-status)](https://app.netlify.com/sites/viewer-frontend/deploys)

Any push to the `main` banch will automatically be deployed to netlify -- https://viewer-frontend.netlify.app/

## run locally
1. Clone this repo and make a `.env` file in the root directory.
```
cp .env.example .env
```
2. `npm start`

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