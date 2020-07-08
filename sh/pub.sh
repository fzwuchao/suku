#!bin/sh
# 清除上一次的构建目录、打包文件
rm -rf backend
rm -rf frontend
rm -rf backend.tar.gz
rm -rf frontend.tar.gz

curDir=`pwd`
weixinDir=${curDir}/../suku-mb
adminDir=${curDir}/../suku-view
backendDir=${curDir}/../suku-backend

# 构建项目
cd ${weixinDir} && npm run pub
cd ${adminDir} && npm run pub
cd ${backendDir} && npm run pub

# 回到当前目录
cd ${curDir}

# 打包
tar -zvcf backend.tar.gz backend
tar -zvcf frontend.tar.gz frontend

# 清除解压后目录
rm -rf backend
rm -rf frontend

# 上传到阿里云服务器上
host='ecs-hunan'
proj='/home/suku'
scp ./backend.tar.gz ${host}:${proj}/backend.tar.gz
scp ./frontend.tar.gz ${host}:${proj}/frontend.tar.gz
scp ./create-container.sh ${host}:${proj}/
scp ./clear.sh ${host}:${proj}/
scp ./backup.sh ${host}:${proj}/
scp ./deploy-backend.sh ${host}:${proj}/
scp ./deploy-frontend.sh ${host}:${proj}/

