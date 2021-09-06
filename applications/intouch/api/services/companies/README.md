# InTouch Api - Company service

## Install

Follow the instruction in the root of the repo

## Database

To create the db run `docker-compose up -d` from the service folder.

There is also an helper script `start-docker.sh` useful to recreate the database, you can run it in this way `./start-docker.sh` from the services folder.
This file is just a wrapper for few docker commands:

```
docker-compose down;                            // remove the container
docker volume rm services_intouch_company_db;       // delete the pg volume
docker-compose up -d;                           // spin up the container
docker logs postgres-company-db -f;             // log the container to check if everything is ok
```

To update the db on dev (until we get the migrations script working) you can use `npm run migrate-db` with the right envs.

### Databse in GCP (reminder)

It is important to grant a role to the postgres role in order to let postgraphile switch the role based on the user role

`GRANT my_role TO postgres`

For reference:

https://www.graphile.org/postgraphile/deploying-gcp/

https://cloud.google.com/sql/docs/postgres/users

If `PG_PASSWORD` and `PG_HOST` are set as env variable the app will pick these variables, if they are not set it will fetch them from GCP secrets (these can work only form GCP)

## GCP Pub/Sub

In order to publish any event to pub/sub you need to doenload the account_service key from gcp.
