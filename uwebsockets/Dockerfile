FROM node:current-slim

RUN apt-get update && apt-get install -y git

WORKDIR /usr/src/app
COPY package.json .
RUN npm install uNetworking/uWebSockets.js#v17.3.0 

EXPOSE 9000
CMD npm run deploy

COPY . .
