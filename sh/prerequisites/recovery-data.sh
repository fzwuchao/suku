# 备份mysql数据
read -p "是否恢复最新的备份数据(y/n): " isRecovery
if [ $isRecovery != 'y' ];then
  echo '不执行，退出'
  exit
fi
docker exec -it suku-mysql bash -c 'cd /home/suku/backup && chmod 777 /home/suku/backup/recovery.sh && bash /home/suku/backup/recovery.sh'
echo '完成数据恢复'