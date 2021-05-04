#!/bin/bash

docker-compose down;
docker volume rm services_intouch_company_db;
docker-compose up -d;
docker logs postgres-company-db -f;
