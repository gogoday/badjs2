
# 启动新的服务
echo 'start new serice ...'
forever start /data/badjs20/badjs/badjs-storage/app.js
forever start /data/badjs20/badjs/badjs-mq/app.js
forever start /data/badjs20/badjs/badjs-acceptor/app.js
forever start /data/badjs20/badjs/badjs-web/app.js
echo done.
