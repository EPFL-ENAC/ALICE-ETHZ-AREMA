FROM node:lts-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./
COPY knexfile.ts ./
RUN npm ci

COPY config ./config
COPY helpers ./helpers
COPY migrations ./migrations
COPY seeds ./seeds
COPY public ./public
COPY src ./src
COPY test ./test

COPY tsconfig.json ./tsconfig.json

EXPOSE 3030
RUN npm run compile
CMD ["npm", "run",  "start"]
HEALTHCHECK --interval=90s --timeout=40s --start-period=10s --retries=4 CMD wget --no-verbose --tries=1 --spider http://localhost:3030/natural-resource || exit 1