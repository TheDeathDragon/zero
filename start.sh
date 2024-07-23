#!/bin/bash
. /root/.nvm/nvm.sh
git checkout
git pull
npm run build
npm run start
