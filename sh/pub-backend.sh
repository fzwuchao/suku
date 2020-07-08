#!bin/sh
curDir=`pwd`
backendDir=${curDir}/../suku-backend
host='ecs-hunan'
proj='/home/suku'

# 清除旧的目录和包
rm -rf backend
rm -rf backend.tar.gz

echo '--------- 开始 ----------' | tee pub-backend.log

echo '--------- 构建目录[开始] ----------' | tee -a ${curDir}/pub-backend.log
# 生成新的构建目录
cd ${backendDir} && npm run pub | tee -a ${curDir}/pub-backend.log
echo '--------- 构建目录[结束] ----------' | tee -a ${curDir}/pub-backend.log

cd ${curDir}

# 打包
tar -zvcf backend.tar.gz backend
# 清除
rm -rf backend

scp ./backend.tar.gz ${host}:${proj}/backend.tar.gz
echo '执行完成' | tee -a ${curDir}/pub-backend.log