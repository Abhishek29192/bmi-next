#!/bin/bash
set -e

docker-compose down;
docker volume rm services_dxb_company_db;
docker-compose up -d;
docker logs postres-copmany-db -f;
