# 备份mysql数据
docker exec -t suku-mysql bash -c 'cd /home/suku/backup && chmod 777 /home/suku/backup/backup.sh && bash /home/suku/backup/backup.sh'