#!bin/sh
# 部署后端
rm -rf backend
tar -xzvf backend.tar.gz -C ./

backendContainer=suku-backend
# 重命名文件夹为suku-backend，与容器中的文件夹名称保持一致
mv backend suku-backend
docker cp ./suku-backend ${backendContainer}:/usr/
docker restart ${backendContainer}
# 文件夹名称改回之前的
mv suku-backend backend

echo '后端部署完成'
