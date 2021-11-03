#!/bin/bash
set -e

export POSTGRES_DB="${POSTGRES_DB}"
export POSTGRES_USER="${POSTGRES_USER}"

echo "Importing schema: "
dump="`cat /var/lib/postgresql/company.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE

echo "Importing data: "
dump="`cat /var/lib/postgresql/company.data.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE

echo "Creating Views"
dump="`cat /var/lib/postgresql/views.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE

echo "Creating roles"
dump="`cat /var/lib/postgresql/roles.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE

echo "Creating procedures"
dump="`cat /var/lib/postgresql/procedure.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE

echo "Creating RLS"
dump="`cat /var/lib/postgresql/rls.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE

echo "Importing contraints"
dump="`cat /var/lib/postgresql/company.contraints.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE
