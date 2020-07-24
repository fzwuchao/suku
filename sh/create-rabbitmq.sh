# 获取镜像
docker pull rabbitmq:3.8.5-management
# 创建容器并运行
docker run -d -p 5672:5672 -p 15672:15672 --hostname suku-rabbit-node --name suku-rabbit rabbitmq:3.8.5-management
# 访问rabbitmq控制台
# http://127.0.0.1:15672/
# 默认用户名/密码：guest / guest