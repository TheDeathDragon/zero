#!/bin/bash
. /root/.nvm/nvm.sh
git clean -df ./
git checkout ./
git pull
npm run build
npm run start
