#!/bin/sh
export NODE_ENV=production

pm2 start \
  --name API \
  --namespace tracecotton-api \
  --env production \
  --instances 1 \
  ts-node -- -r tsconfig-paths/register \
  ./src/server.ts

pm2 startup

pm2 save
