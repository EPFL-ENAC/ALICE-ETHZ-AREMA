FROM node:20-alpine AS build-stage

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:stable-alpine AS production-stage
RUN mkdir /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/spa  /app
EXPOSE 80

RUN apk add --no-cache bash
COPY entrypoint.sh /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]