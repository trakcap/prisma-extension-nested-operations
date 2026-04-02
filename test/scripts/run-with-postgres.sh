#!/bin/bash

export DATABASE_URL=postgres://postgres:postgrespass@localhost:5433/test

trap "docker compose down" EXIT

if [ "$1" != "ci" ]; then
  trap "docker compose down" EXIT
  docker compose up -d && sleep 1
fi
npx prisma db push

$@
