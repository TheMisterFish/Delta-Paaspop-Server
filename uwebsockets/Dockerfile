FROM node:current-slim

RUN apt-get update && apt-get install -y git

WORKDIR /usr/src/app
COPY package.json .
RUN npm install

CMD npm run deploy

COPY . .
