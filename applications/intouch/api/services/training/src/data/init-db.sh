#!/bin/bash
set -e

export POSTGRES_DB="${POSTGRES_DB}"
export POSTGRES_USER="${POSTGRES_USER}"

echo "Importing schema and data:"
dump="`cat /var/lib/postgresql/training.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE

echo "Creating procedures:"
dump="`cat /var/lib/postgresql/procedure.sql`"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE
    $dump
HERE

