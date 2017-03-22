FROM kkarczmarczyk/node-yarn:6.9

RUN mkdir /plugins
COPY ./.babelrc /plugins
COPY ./package.json /plugins
COPY ./server.js /plugins
COPY ./app/ /plugins/app/
COPY ./public/ /plugins/public
COPY ./views/ /plugins/views
COPY ./webpack /plugins/webpack
COPY ./yarn.lock /plugins
COPY ./postinstall.js /plugins
WORKDIR /plugins

RUN yarn

CMD yarn server

EXPOSE 5000
