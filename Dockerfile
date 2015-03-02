FROM                ubuntu:14.04
MAINTAINER          Dmitry Orlov <me@mosquito.su>

RUN                 apt-get update && \
                    apt-get install -y nginx && \
                    apt-get clean

RUN                 mkdir -p /var/www/docker-registry-ui

ADD                 contrib/nginx.conf /etc/nginx/nginx.conf
ADD                 dist/ /var/www/docker-registry-ui/

CMD                 ["nginx", "-g", "daemon off;"]
