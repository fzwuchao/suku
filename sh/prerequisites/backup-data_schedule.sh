# linux上定时备份数据库
# crontab -l查看定时任务
# 每天晚间23:00备份数据
# crontab -e
# 0 23 * * * /bin/sh /home/suku/prerequisites/backup-data_schedule.sh > /home/suku/prerequisites/backup-data_schedule.log 2>&1
sh /home/suku/prerequisites/backup-data.sh