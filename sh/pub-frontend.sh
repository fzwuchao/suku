#!bin/sh
curDir=`pwd`
weixinDir=${curDir}/../suku-mb
adminDir=${curDir}/../suku-view
host='ecs-hunan'
proj='/home/suku'

read -p "请输入要部署的前端类型，0:全部，1: weixin端，2: admin端: " type
# 判断是否有输入
if [ -z $type ];then
  echo '没有输入任务类型, 退出交互' | tee pub-frontend.log
  exit
else
  # 判断输入的值是否是0, 1, 2
  if [ $type -ne 0 ] && [ $type -ne 1 ] && [ $type -ne 2 ];then
    echo '输入的类型无效, 退出交互' | tee pub-frontend.log
    exit
  fi

  echo '--------- 开始 ----------' | tee pub-frontend.log
  # 删除旧的目录和包
  rm -rf frontend
  rm -rf frontend.tar.gz

  echo '--------- 构建目录[开始] ----------' | tee -a ${curDir}/pub-frontend.log
  if [ $type -eq 0 ];then
    cd ${weixinDir} && npm run pub | tee -a ${curDir}/pub-frontend.log
    cd ${adminDir} && npm run pub  | tee -a ${curDir}/pub-frontend.log
  elif [ $type -eq 1 ];then
    cd ${weixinDir} && npm run pub | tee -a ${curDir}/pub-frontend.log
  elif [ $type -eq 2 ];then
    cd ${adminDir} && npm run pub | tee -a ${curDir}/pub-frontend.log
  fi
  echo '--------- 构建目录[结束] ----------' | tee -a ${curDir}/pub-frontend.log

  cd ${curDir}

  echo '--------- 打包[开始] ----------' | tee -a ${curDir}/pub-frontend.log
  # 打包
  tar -zvcf frontend.tar.gz frontend | tee -a ${curDir}/pub-frontend.log
  echo '--------- 打包[结束] ----------' | tee -a ${curDir}/pub-frontend.log
  # 清除
  rm -rf frontend

  echo '--------- 上传[开始] ----------' | tee -a ${curDir}/pub-frontend.log
  # 上传
  scp ./frontend.tar.gz ${host}:${proj}/frontend.tar.gz | tee -a ${curDir}/pub-frontend.log
  echo '--------- 上传[结束] ----------' | tee -a ${curDir}/pub-frontend.log
fi
echo '执行完成' | tee -a ${curDir}/pub-frontend.log