# InTouch Api - Company service

## Install

Follow the instruction in the root of the repo

## Database

- Create and import the database using this file [pg schema](https://gitlab.com/bmi-digital/dxb/-/blob/master/applications/intouch/api/services/companies/src/data/company.sql)

- Create the roles using this file [pg roles](https://gitlab.com/bmi-digital/dxb/-/blob/master/applications/intouch/api/services/companies/src/data/roles.sql)

## GCP

It is important to grant a role to the postgres role in order to let postgraphile switch the role based on the user role

`GRANT my_role TO postgres`

For reference:

https://www.graphile.org/postgraphile/deploying-gcp/

https://cloud.google.com/sql/docs/postgres/users
