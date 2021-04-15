#!/bin/bash
set -e

export DATABASE_NAME="${DATABASE_NAME}"
export POSTGRES_USER="${POSTGRES_USER}"

echo "Importin schema and data"
dump="`cat /var/lib/postgresql/company.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DATABASE_NAME" <<HERE
    $dump
HERE

echo "Creating roles"
dump="`cat /var/lib/postgresql/roles.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DATABASE_NAME" <<HERE
    $dump
HERE

echo "Creating procedures"
dump="`cat /var/lib/postgresql/procedure.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DATABASE_NAME" <<HERE
    $dump
HERE

echo "Creating RLS"
dump="`cat /var/lib/postgresql/rls.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DATABASE_NAME" <<HERE
    $dump
HERE
