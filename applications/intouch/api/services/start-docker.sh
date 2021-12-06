#!/bin/bash

docker-compose down;
docker volume rm services_intouch_db;
docker-compose up -d;
docker logs intouch-db;
