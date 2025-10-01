FROM nginx:alpine

RUN apk add --no-cache openssl

COPY . /usr/share/nginx/html/

COPY docker_config/nginx/nginx-ssl.conf /etc/nginx/conf.d/nginx.conf
COPY docker_config/nginx/nginx.conf /etc/nginx/nginx.conf

COPY docker_config/ssl/generate-ssl.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/generate-ssl.sh
RUN /usr/local/bin/generate-ssl.sh

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]