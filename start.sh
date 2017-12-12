#!/bin/sh

rm -rf ./log.log;
touch ./log.log;
echo "generate log.log"
node ./start.js > ./log.log 2>1 &
echo 'start ....';
