#!bin/sh
# 部署后端
rm -rf backend
tar -xzvf backend.tar.gz -C ./

backendContainer=suku-backend
docker cp ./backend ${backendContainer}:/usr/
docker restart ${backendContainer}

echo '后端部署完成'
