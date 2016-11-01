FROM node:6.7-slim

RUN mkdir /plugins
COPY ./.babelrc /plugins
COPY ./package.json /plugins
COPY ./downloadHeader.js /plugins
COPY ./server.js /plugins
COPY ./app/ /plugins/app/
COPY ./public/ /plugins/public
COPY ./views/ /plugins/views
COPY ./webpack /plugins/webpack
WORKDIR /plugins

RUN npm install -q

CMD npm run server

EXPOSE 5000
