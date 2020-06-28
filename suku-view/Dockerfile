FROM nginx
#FROM node:current-slim
ENV nginx_home /usr/share/nginx/html/suku
# 速库源代码目录
#ENV suku_home /home/app/suku
COPY ./suku $nginx_home
COPY nginx.conf /etc/nginx/nginx.conf
#RUN cd $suku_home
#    && npm install \
#    && npm run build
# COPY $suku_home/suku/ $nginx_home

EXPOSE 80