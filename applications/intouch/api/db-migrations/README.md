# Migration service

AS the bmi db are in a private network we are not able to access them directly, we created this service to be able to update the db if necessary.

The service use a library called [db-migrate](https://db-migrate.readthedocs.io/) and it provide 2 endpoints:

- /migrate-companies-db
- /migrate-training-db

and accepct 2 params:

- migrate (true|false)
- direction (up|down)

The service is integrated in the pipeline, when there are changes to the migration scripts folder we run some unit test, if passed it will build and deploy the new service in the right bmi environment, after this there is a manual action to trigger a request to the above urls in order to run the migration against the real db.

- direction up means that we apply the changes `./migration/folder/sql/up.sql` file
- direction down means that we revert the changes using the `./migration/folder/sql/down.sql` file

There is one service per environemnt.

The migrations are wrapped in a transaction by default, pay attention to the migraiton script you want to run.

If you need to trigger a down you have to do that manually from you local machine.

## Create a new migration script

db-migrate create migration-script-name -e (local:training/local:companies) --migrations-dir (migration-training/migration-companies) --sql-file
