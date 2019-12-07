FROM node:13

RUN mkdir /plugins
COPY . /plugins
WORKDIR /plugins

RUN yarn

CMD yarn server

EXPOSE 5000
