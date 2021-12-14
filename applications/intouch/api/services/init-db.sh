#!/bin/bash
set -e

echo "Creating the app dbs"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<HERE

  CREATE DATABASE "companies-db";
	GRANT ALL PRIVILEGES ON DATABASE "companies-db" TO "postgres";
  CREATE DATABASE "training-db";
	GRANT ALL PRIVILEGES ON DATABASE "training-db" TO "postgres";

HERE
