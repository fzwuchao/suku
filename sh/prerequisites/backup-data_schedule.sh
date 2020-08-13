# linux上定时备份数据库
# crontab -l查看定时任务
# 每天晚间23:00备份数据
# crontab -e
# 0       23       *       *       *        /home/suku/prerequisites/backup-data_schedule.sh
sh ./backup-data.sh