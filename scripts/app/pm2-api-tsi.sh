#!/bin/sh

export NODE_ENV=development

pm2 start \
  --name API \
  --namespace tracecotton-api \
  --env development \
  --instances 1 \
  ts-node -- -r tsconfig-paths/register \
  ./src/server.ts

pm2 startup

pm2 save
