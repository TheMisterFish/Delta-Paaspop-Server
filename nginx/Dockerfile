FROM node:lts-alpine as build-stage
WORKDIR /app
RUN ls -a
COPY . .
run ls -a

WORKDIR /app/clientapp
RUN npm install
RUN ls -a
RUN npm run build

FROM nginx
RUN echo "soft nofile 1024000" >> /etc/security/limits.conf
RUN echo "hard nofile 1024000" >> /etc/security/limits.conf

COPY --from=build-stage /app/clientapp/dist /usr/share/nginx/html

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
# COPY .htpasswd /etc/nginx/.htpasswd