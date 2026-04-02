#!/bin/bash

export DATABASE_URL=postgres://postgres:postgrespass@localhost:5433/test

trap "docker compose down" EXIT

docker compose up -d && sleep 1
npx prisma db push

$@
