#!/bin/bash

export DATABASE_URL=postgres://postgres:postgrespass@localhost:5433/test

if [ "$1" != "ci" ]; then
  trap "docker compose down" EXIT
  docker compose up -d && sleep 1
else
  shift
fi
npx prisma db push

$@
