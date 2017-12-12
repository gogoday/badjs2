#!/bin/bash


# read nginx access log file

logs_path="/data/home/log/nginx/access/"

logs_file=${logs_path}access_$(date -d "yesterday" +"%Y%m%d").log

/data/home/server/nodejs/bin/node /data/badjs/badjs-installer/badjs-web/service/test/handle_pv.js ${logs_file} $(date -d "yesterday" +"%Y%m%d")
