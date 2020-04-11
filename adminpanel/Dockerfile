# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY . .
RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
 && npm install \
 && npm rebuild bcrypt --build-from-source \
 && apk del .build-deps
CMD npm run serve