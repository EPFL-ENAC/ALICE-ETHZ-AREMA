FROM node:lts-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./
COPY knexfile.ts ./
RUN npm ci

COPY config ./config
COPY helpers ./helpers
COPY migrations ./migrations
COPY public ./public
COPY src ./src
COPY test ./test

COPY tsconfig.json ./tsconfig.json

EXPOSE 3030
RUN npm run compile
CMD ["npm", "run",  "start"]
# CMD ["npm", "run", "start"]
# HEALTHCHECK --interval=90s --timeout=40s --start-period=10s --retries=4 CMD wget --no-verbose --tries=1 --spider http://localhost:3030/natural-resource || exit 1

# FROM node:lts-alpine as app-stage
# LABEL maintainer="<pierre.guilbert@epfl.ch>"
# LABEL description="FeatherJS api"

# ENV LC_ALL C.UTF-8
# ENV LANG C.UTF-8
# WORKDIR /usr/src/app

# COPY --from=build-stage /usr/src/app/lib /usr/src/app/lib
# COPY --from=build-stage /usr/src/app/config /usr/src/app/config
# COPY --from=build-stage /usr/src/app/src /usr/src/app/src
# COPY package*.json ./
# COPY knexfile.ts ./

# RUN npm ci --omit=dev

# EXPOSE 3030
# CMD ["npm", "run", "start"]
# HEALTHCHECK --interval=30s --timeout=10s --start-period=3s --retries=2 CMD wget --no-verbose --tries=1 --spider http://localhost:3030/natural-resource || exit 1