# 创建mysql
# 进入容器：docker exec -it suku-mysql bash
# [修改前]sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION 
# [修改后]sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
curDir=`pwd`
dataDir=${curDir}/mysql/datadir
confDir=${curDir}/mysql/config
backupDir=${curDir}/mysql/backup
mkdir ${dataDir}
mkdir ${backupDir}
docker run --name suku-mysql -v ${curDir}/mysql/backup:/home/suku/backup -v ${confDir}:/etc/mysql/conf.d -v ${dataDir}:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=ZY1305@OULAN -e TZ=Asia/Shanghai -p 3306:3306 -d mysql:8.0.21

# 创建redis
# 进入容器：docker exec -it suku-redis /bin/bash
redisConf=${curDir}/redis/config/redis.conf
redisData=${curDir}/redis/datadir
mkdir ${redisData}
docker run -v ${redisConf}:/usr/local/etc/redis/redis.conf -v ${redisData}:/data -p 6379:6379 -e TZ=Asia/Shanghai -d --name suku-redis redis:6.0.6 redis-server /usr/local/etc/redis/redis.conf