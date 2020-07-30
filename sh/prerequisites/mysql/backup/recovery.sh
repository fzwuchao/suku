# 备份mysql数据
# 全量恢复
sukuUname=suku
sukuPwd=ZY1305@OULAN

# 按时间排序，最近的在后面
sqlFiles=`ls -R | grep -e '\.sql$'`

# 获取sql文件名数组
len=0
for sqlFile in $sqlFiles
do
  filelist[$len]=$sqlFile
  ((len++))
done
echo $len
if [ $len == 0 ];then
  exit
fi
recoveryFile=${filelist[$len-1]}
mysqladmin -u$sukuUname -p$sukuPwd create suku
mysql -u$sukuUname -p$sukuPwd suku < $recoveryFile