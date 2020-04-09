FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .
WORKDIR /app/clientapp
# RUN npm install
# RUN npm run build

WORKDIR /app
RUN ls -a

FROM nginx
RUN echo "soft nofile 1024000" >> /etc/security/limits.conf
RUN echo "hard nofile 1024000" >> /etc/security/limits.conf

# COPY --from=build-stage /app/clientapp/dist /var/www/html/clientapp
# COPY /app/gamerunner /var/www/html/gamerunner

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
# COPY .htpasswd /etc/nginx/.htpasswd