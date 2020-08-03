# 备份mysql数据
# 全量备份
backupFileName=`date '+%Y-%m-%d_%H%M'`
backupDir=/home/suku/backup
sukuUname=suku
sukuPwd=ZY1305@OULAN

mysqldump -u$sukuUname -p$sukuPwd --single-transaction --flush-logs --master-data=2 --delete-master-logs suku > $backupDir/full_$backupFileName.sql

# 按时间排序，最近的在后面
sqlFiles=`ls -R | grep -e '\.sql$'`

# 获取sql文件名数组
len=0
for sqlFile in $sqlFiles
do
  filelist[$len]=$sqlFile
  ((len++))
done

sqlFileTotal=7
# 保留最近备份的7个文件
# 备份文件小于等于7个，不清除
if [ $len -le $sqlFileTotal ];then
  echo '备份完成'
  exit
fi

# 获取要删除的文件名，只保留最近的3个
d=0
for((i=0;i<=len-sqlFileTotal-1;i++))
do
  delFileList[$d]=${filelist[$i]}
  ((d++))
done

leng=${#delFileList[*]}
for((j=0;j<=leng-1;j++))
do
 rm -f ${delFileList[j]}
done

echo '备份完成'