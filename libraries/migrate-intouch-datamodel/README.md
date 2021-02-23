# Google Sheets API

This package uses the [`googleapis`](https://github.com/googleapis/googleapis) lib to create SQL schema and feed it to PostgreSQL

## Install

`yarn`

## Setup

Create an `.env.*` file for your environment and enter the appropriate values.

### OAuth2 client

This module comes with an [OAuth2](https://developers.google.com/identity/protocols/OAuth2) client that allows you to retrieve an access token, refresh it, and retry the request seamlessly. The basics of Google's OAuth2 implementation is explained on [Google Authorization and Authentication documentation][authdocs].

In the following examples, you may need a `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `GOOGLE_REDIRECT_URL`. You can find these pieces of information by going to the [Developer Console][devconsole], clicking your project --> APIs & auth --> credentials.

- Navigate to the Cloud Console and [Create a new OAuth2 Client Id](https://console.cloud.google.com/apis/credentials/oauthclient)
- Select `Desktop App` for the application type

- Click `Create`, and `Ok` on the following screen
- Click the `Download` icon next to your newly created OAuth2 Client Id
- Update .env file

## Run

After following the quickstart setup instructions, run the sample:

`yarn start`

To update Database

`yarn migrate`
