FROM node:6.9.4
MAINTAINER Ian Patton <ian.patton@agcocorp.com>

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app/

CMD [ "node", "index.js" ]
