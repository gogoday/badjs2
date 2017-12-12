# 开始升级
echo 'this version 2.0'
echo 'start upgrade badjs2.0....'
echo 'The upgrade process will not be available and the upgrade process will take about 5 minutes'
echo 'And sure mysql user and pass is `root`.'
echo 'Are you sure to upgrade? (y/n)'
read confirm

# 用户确认是否升级
if [ "$confirm" != "y" ]; then 
    echo 'upgrade cancel.'
    exit 128
fi


# 创建新版本的目录
echo 'create new dir fro new version...'
mkdir /data/badjs20
cd /data/badjs20
echo 'done.'

# 配置git拉取最新的代码
echo 'git clone new code ...'
git clone https://github.com/iv-web/track.git badjs
echo 'done.'
# 备份配置文件
echo 'backup config file ...'
cp /data/badjs/badjs-installer/badjs-web/project.json /data/badjs20/badjs/badjs-web/
cp /data/badjs/badjs-installer/badjs-storage/project.json /data/badjs20/badjs/badjs-storage/
cp /data/badjs/badjs-installer/badjs-acceptor/project.json /data/badjs20/badjs/badjs-acceptor/
cp /data/badjs/badjs-installer/badjs-mq/project.json /data/badjs20/badjs/badjs-mq/

cp /data/badjs/badjs-installer/badjs-acceptor/project.db /data/badjs20/badjs/badjs-acceptor/
cp /data/badjs/badjs-installer/badjs-mq/project.db /data/badjs20/badjs/badjs-mq/

echo 'done.'

# 读取旧的配置文件，生成新的配置文件
echo 'upgrade project.json file ...'
node /data/badjs20/badjs/upgrade/upgrade_config.js
echo  'done.'

# 安装npm包
echo 'npm install ...';
cd /data/badjs20/badjs/badjs-web; npm install;
cd /data/badjs20/badjs/badjs-storage; npm install;
cd /data/badjs20/badjs/badjs-acceptor; npm install;
cd /data/badjs20/badjs/badjs-mq; npm install;
cd /data/badjs20
echo 'done .'


# 更新mysql数据库
echo 'mysql upgrade ...'
mysql -uroot -proot < /data/badjs20/badjs/upgrade/sql.sql
echo 'done.'

# 停止旧的服务
echo 'kill old service ...'
pids=( $(pgrep -f badjs) )
for pid in "${pids[@]}"; do
  if [[ $pid != $$ ]]; then
     kill "$pid"
  fi
done
echo 'done.'

# 启动新的服务
echo 'start new serice ...'
forever start /data/badjs20/badjs/badjs-storage/app.js
forever start /data/badjs20/badjs/badjs-mq/app.js
forever start /data/badjs20/badjs/badjs-acceptor/app.js
forever start /data/badjs20/badjs/badjs-web/app.js
echo done.

# 升级完成
echo 'upgrade success.'

