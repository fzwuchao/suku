#!bin/sh
# 部署前端
frontendContainer=suku-frontend
nginxHome=/usr/share/nginx/html

read -p "请输入要更新前端代码类型，0:全部，1: weixin端，2: admin端: " type

if [ -z $type ];then
  echo '没有输入任务类型, 不执行，退出交互'
  exit
fi

if [ $type -ne 0 ] && [ $type -ne 1 ] && [ $type -ne 2 ];then
  echo '输入的类型无效, 不执行，退出交互'
  exit
fi

rm -rf frontend
tar -xzvf frontend.tar.gz -C ./

if [ $type -ne 0 ];then
  docker cp ./frontend/weixin ${frontendContainer}:${nginxHome}/
  docker cp ./frontend/admin ${frontendContainer}:${nginxHome}/
elif [ $type -ne 1 ];then
  docker cp ./frontend/weixin ${frontendContainer}:${nginxHome}/
elif [ $type -ne 1 ];then
  docker cp ./frontend/admin ${frontendContainer}:${nginxHome}/
fi

docker restart ${frontendContainer}

echo '前端部署完成'
