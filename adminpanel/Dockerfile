# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
 && npm install \
 && npm rebuild bcrypt --build-from-source \
 && apk del .build-deps
COPY . .
CMD npm run serve