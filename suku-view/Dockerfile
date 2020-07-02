FROM nginx
#FROM node:current-slim
ENV nginx_home /usr/share/nginx/html
# 速库源代码目录
#ENV suku_home /home/app/suku

#复制admin包
COPY ./admin $nginx_home/admin
#复制weixin包
COPY ./weixin $nginx_home/weixin
COPY nginx.conf /etc/nginx/nginx.conf
#RUN cd $suku_home
#    && npm install \
#    && npm run build
# COPY $suku_home/suku/ $nginx_home

EXPOSE 80