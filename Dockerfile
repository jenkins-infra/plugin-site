FROM node:12 as builder

ARG DISABLE_SEARCH_ENGINE
ARG GET_CONTENT
ARG GATSBY_CONFIG_SITE_METADATA__URL
ARG GATSBY_CONFIG_SITE_METADATA__SITE_URL
WORKDIR /usr/src/app

ADD package.json yarn.lock ./
RUN yarn install
ADD . .
RUN yarn build
RUN test -e public/index.html || exit 1
RUN yarn lint
RUN yarn test

# FROM nginx:1.17.6
FROM gatsbyjs/gatsby
COPY --from=builder /usr/src/app/public/ /pub
