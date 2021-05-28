# InTouch Api - Training service

## Install

Follow the instruction in the root of the repo

## DB

If `PG_PASSWORD` and `PG_HOST` are set as env variable the app will pick these variables, if they are not set it will fetch them from GCP secrets (these can work only form GCP)

## Access Token

You can use JWT technology to get an access token to access Docebo APIs.

- Create a `.jwtRS256.key` file with the necessary private key(see the `.jwtRS256.key.example`). Ask the team
