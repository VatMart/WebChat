# Stage 1: serve app with nginx server
FROM nginx:latest
COPY /dist/WebChat  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80