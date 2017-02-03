FROM mhart/alpine-node:6.9.5

RUN npm install --global yarn

RUN mkdir /plugins
COPY ./.babelrc /plugins
COPY ./package.json /plugins
COPY ./server.js /plugins
COPY ./app/ /plugins/app/
COPY ./public/ /plugins/public
COPY ./views/ /plugins/views
COPY ./webpack /plugins/webpack
COPY ./yarn.lock /plugins
WORKDIR /plugins

RUN yarn

CMD yarn server

EXPOSE 5000
