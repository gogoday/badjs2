#nginx日志切割脚本
#author: http://www.nginx.cn

#!/bin/bash
#设置日志文件存放目录
logs_path="/data/home/log/nginx/access/"
#设置pid文件
pid_path="/data/home/server/nginx/logs/nginx.pid"

#重命名日志文件
mv ${logs_path}default.log ${logs_path}access_$(date -d "yesterday" +"%Y%m%d").log

#向nginx主进程发信号重新打开日志
kill -USR1 `cat ${pid_path}`

# 定期删除1天前的日志
find /data/home/log/nginx/access/ -mtime +0 -type f -name \*.log | xargs rm -f