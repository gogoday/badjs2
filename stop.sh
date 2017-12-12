ps -ef|grep node | grep badjs | grep -v grep | cut -c 9-15 | xargs kill;
