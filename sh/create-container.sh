#!bin/sh
####创建前端、后端docker容器####
# 清除旧的应用目录
rm -rf backend
rm -rf frontend

#解压缩
tar -xzvf backend.tar.gz -C ./
tar -xzvf frontend.tar.gz -C ./

#停止容器
docker stop suku-backend
docker stop suku-frontend
#删除容器
docker rm suku-backend
docker rm suku-frontend
#删除镜像
docker rmi suku-backend
docker rmi suku-frontend

cd backend
# 创建后端image
docker build -t suku-backend ./
# 创始后端container,并启动
docker run -p 7001:7001 -d -v /home/suku/logs/:/usr/suku-backend/logs --name suku-backend suku-backend

cd ../frontend
docker build -t suku-frontend ./
docker run -p 80:80 -d --name suku-frontend suku-frontend
