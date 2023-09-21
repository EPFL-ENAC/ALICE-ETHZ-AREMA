FROM node:lts-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY config ./config
COPY helpers ./helpers
COPY public ./public
COPY src ./src
COPY test ./test

COPY tsconfig.json ./tsconfig.json

RUN npm run compile 


FROM node:lts-alpine as app-stage
LABEL maintainer="<pierre.guilbert@epfl.ch>"
LABEL description="FeatherJS api"

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
WORKDIR /usr/src/app

COPY --from=build-stage /usr/src/app/lib /usr/src/app/lib
COPY --from=build-stage /usr/src/app/config /usr/src/app/config
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3030
CMD ["npm", "run", "start"]
HEALTHCHECK --interval=30s --timeout=10s --start-period=3s --retries=2 CMD wget --no-verbose --tries=1 --spider http://localhost:3030/natural-resource || exit 1